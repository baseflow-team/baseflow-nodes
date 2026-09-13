(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.monaco = {}));
})(this, function(exports) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region src/editor.ts
	var style = document.createElement("style");
	style.textContent = `
  .monaco-hover .hover-row.status-bar {
    display: none !important;
  }
`;
	document.head.appendChild(style);
	function initEditor(monaco, url) {
		const div = document.createElement("div");
		div.style = "width: 100%; height: 100%; ";
		document.body.appendChild(div);
		return monaco.editor.create(div, {
			model: monaco.editor.getModel(monaco.Uri.parse(url)),
			theme: "vs-dark",
			wordWrap: "on",
			minimap: { enabled: false },
			contextmenu: false,
			accessibilitySupport: "off",
			codeLens: false,
			quickSuggestions: false
		});
	}
	//#endregion
	//#region src/utils.ts
	var SyncStack = class {
		_curCmd = {};
		_cmdStack = {};
		_cmdList;
		_uid = 0;
		_timeout = 1e4;
		constructor(_cmdList) {
			this._cmdList = _cmdList;
			Object.keys(_cmdList).forEach((cmd) => {
				this._cmdStack[cmd] = [];
			});
		}
		_addTask(_cmd, args, timeout = this._timeout) {
			return new Promise((onSuccess, onError) => {
				const cmd = _cmd;
				this._uid++;
				this._cmdStack[cmd].push({
					uid: this._uid,
					cmd,
					args,
					onSuccess,
					onError,
					timeout
				});
				if (!this._curCmd[cmd]) this._nextCmd(cmd);
			});
		}
		_nextCmd(cmd) {
			const item = this._cmdStack[cmd].shift();
			this._curCmd[cmd] = item;
			if (item) {
				const fun = this._cmdList[cmd];
				const callback = this._resultCmd.bind(this);
				setTimeout(() => {
					const { cmd, args, uid, timeout } = item;
					fun(uid, ...args);
					item.timer = setTimeout(() => callback(uid, cmd, "error", void 0), timeout);
				});
			}
		}
		_resultCmd(uid, _cmd, state, data) {
			const cmd = _cmd;
			const curItem = this._curCmd[cmd];
			if (curItem && curItem.uid === uid) {
				if (curItem.timer) clearTimeout(curItem.timer);
				if (state === "success") curItem.onSuccess(data);
				else curItem.onError(data);
				this._nextCmd(cmd);
			}
		}
	};
	function inJsTpl(lines, position) {
		const tpls = lines.join("\n").replace(/\\`/g, "\\\"").matchAll(/`[^`]*`/g);
		const tplRanges = [];
		for (const tpl of tpls) tplRanges.push([tpl.index, tpl.index + tpl[0].length]);
		const cursorLines = lines.slice(0, position.lineNumber - 1);
		cursorLines.push(lines[position.lineNumber - 1].slice(0, position.column - 1));
		const cursorPoint = cursorLines.join("\n").length;
		for (const range of tplRanges) if (range[0] < cursorPoint && range[1] > cursorPoint) return true;
		return false;
	}
	var errorTpl = { "Type (.+) is missing the following properties from type 'any\\[\\]'.+$": "Is not an array: $1" };
	function replaceErrorMessage(err) {
		if (err) for (const exp in errorTpl) {
			const reg = new RegExp(exp);
			if (reg.test(err)) return err.replace(reg, errorTpl[exp]);
		}
		return err;
	}
	function getErrorFlag(contents, lineNumber, message, flag) {
		let num = lineNumber - 1;
		const errorSource = contents[num];
		while (num > -1) {
			const str = contents[num];
			if (str.startsWith(flag)) {
				const err = replaceErrorMessage(message).substring(0, 200);
				return {
					id: str.substring(flag.length),
					message: err || errorSource.substring(0, 200)
				};
			}
			num--;
		}
	}
	//#endregion
	//#region src/index.ts
	var TSServer = class extends SyncStack {
		_systemFiles;
		_tsWorker;
		_curEditor;
		_onLinkCallback;
		constructor(monaco, _systemFiles, _tsWorker, _curEditor) {
			super({
				checkDoc: (uid, dts, ts, flag) => {
					this.setTypCode(dts);
					this.setDocCode(ts);
					this._getDiagnostics(uid, "checkDoc", _systemFiles.doc, flag);
				},
				checkExp: (uid, ts, flag) => {
					this.setExpCode(ts);
					this._getDiagnostics(uid, "checkExp", _systemFiles.exp, flag);
				}
			});
			this._systemFiles = _systemFiles;
			this._tsWorker = _tsWorker;
			this._curEditor = _curEditor;
			monaco.editor.registerLinkOpener({ open: this._openLink });
		}
		_openLink = (resource) => {
			if (resource.scheme === "file" && resource.path.startsWith("/@/")) {
				const simplePath = [resource.path.substring(3), resource.query].filter(Boolean).join("?");
				this._onLinkCallback?.(simplePath);
			}
			return true;
		};
		format = () => {
			return this._curEditor.getAction("editor.action.formatDocument")?.run() || Promise.resolve();
		};
		onLink = (callback) => {
			this._onLinkCallback = callback;
		};
		insertVariable = (text) => {
			const editor = this._curEditor;
			const selection = editor.getSelection();
			if (selection) {
				if (inJsTpl(editor.getModel().getLinesContent(), selection.getStartPosition())) text = `\${${text}}`;
				const op = {
					range: selection,
					text
				};
				editor.executeEdits("", [op]);
			}
		};
		_getDiagnostics(uid, action, file, flag) {
			const tsWorker = this._tsWorker;
			Promise.all([tsWorker.getSyntacticDiagnostics(file.url), tsWorker.getSemanticDiagnostics(file.url)]).then(([syntacticResult, semanticResult]) => {
				const markers = [...syntacticResult, ...semanticResult];
				if (markers.length) {
					const contents = file.model.getLinesContent() || [];
					const errors = markers.map((marker) => {
						const { lineNumber = 1 } = file.model.getPositionAt(marker.start || 0);
						return getErrorFlag(contents, lineNumber, typeof marker.messageText === "string" ? marker.messageText : marker.messageText?.messageText || "", flag);
					}).reduce((obj, item) => {
						if (item) obj[item.id] = item.message;
						return obj;
					}, {});
					this._resultCmd(uid, action, "success", errors);
				} else this._resultCmd(uid, action, "success", {});
			}).catch((e) => {
				this._resultCmd(uid, action, "error", e);
			});
		}
		setSysCode = (ts) => {
			const SystemFiles = this._systemFiles;
			if (SystemFiles.sys.value !== ts) {
				SystemFiles.sys.value = ts;
				SystemFiles.sys.model.setValue(ts);
				console.log(`${SystemFiles.sys.url}\n`, ts);
				return true;
			}
			return false;
		};
		setUtlCode = (ts) => {
			const SystemFiles = this._systemFiles;
			if (SystemFiles.utl.value !== ts) {
				SystemFiles.utl.value = ts;
				SystemFiles.utl.model.setValue(ts);
				console.log(`${SystemFiles.utl.url}\n`, ts);
				return true;
			}
			return false;
		};
		setVarCode = (ts) => {
			const SystemFiles = this._systemFiles;
			if (SystemFiles.var.value !== ts) {
				SystemFiles.var.value = ts;
				SystemFiles.var.model.setValue(ts);
				console.log(`${SystemFiles.var.url}\n`, ts);
				return true;
			}
			return false;
		};
		setTypCode = (ts) => {
			const SystemFiles = this._systemFiles;
			if (SystemFiles.typ.value !== ts) {
				SystemFiles.typ.value = ts;
				SystemFiles.typ.model.setValue(ts);
				console.log(`${SystemFiles.typ.url}\n`, ts);
				return true;
			}
			return false;
		};
		setDocCode = (ts) => {
			const SystemFiles = this._systemFiles;
			if (SystemFiles.doc.value !== ts) {
				SystemFiles.doc.value = ts;
				SystemFiles.doc.model.setValue(`${ts}\nexport {};`);
				console.log(`${SystemFiles.doc.url}\n`, `${ts}\nexport {};`);
				return true;
			}
			return false;
		};
		setExpCode = (ts) => {
			const SystemFiles = this._systemFiles;
			if (SystemFiles.exp.value !== ts) {
				SystemFiles.exp.value = ts;
				SystemFiles.exp.model.setValue(`${ts}\nexport {};`);
				console.log(`${SystemFiles.exp.url}\n`, `${ts}\nexport {};`);
				return true;
			}
			return false;
		};
		setCurCode = (ts, context = "", runtime = "expression") => {
			const SystemFiles = this._systemFiles;
			if (SystemFiles.ctx.value !== context) {
				SystemFiles.ctx.value = context;
				SystemFiles.ctx.model.setValue(context);
				console.log(`${SystemFiles.ctx.url}\n`, context);
			}
			SystemFiles.cur.value = ts;
			SystemFiles.cur.model.setValue(ts);
			console.log(`${SystemFiles.cur.url}\n`, ts);
			return true;
		};
		getCurCode = () => {
			return this._systemFiles.cur.model.getValue();
		};
		checkDoc = (dts, ts, flag) => {
			return this._addTask("checkDoc", [
				dts,
				ts,
				flag
			]);
		};
		checkExp = (ts, flag) => {
			return this._addTask("checkExp", [ts, flag]);
		};
	};
	async function initMonaco(monaco) {
		const tsOptions = monaco.typescript.typescriptDefaults.getCompilerOptions();
		tsOptions.lib = ["es5"];
		tsOptions.isolatedModules = true;
		tsOptions.checkJs = false;
		tsOptions.skipLibCheck = true;
		tsOptions.strict = true;
		monaco.typescript.typescriptDefaults.setCompilerOptions(tsOptions);
		monaco.typescript.typescriptDefaults.setDiagnosticsOptions({ noSuggestionDiagnostics: true });
		monaco.languages.registerDefinitionProvider("typescript", { provideDefinition() {
			return [];
		} });
		const files = [
			"exp",
			"ctx",
			"cur",
			"doc",
			"sys.d",
			"typ.d",
			"var.d",
			"utl.d"
		].reduce((obj, cur) => {
			const key = cur.split(".")[0];
			obj[key] = {
				url: `ts://lib/${cur}.ts`,
				value: ""
			};
			obj[key].model = monaco.editor.createModel("", "typescript", monaco.Uri.parse(obj[key].url));
			return obj;
		}, {});
		const tsServer = new TSServer(monaco, files, await (await monaco.typescript.getTypeScriptWorker())(files.sys.model.uri, files.doc.model.uri, files.exp.model.uri), initEditor(monaco, files.cur.url));
		const tsServerApi = {
			checkDoc: tsServer.checkDoc,
			checkExp: tsServer.checkExp,
			setSysCode: tsServer.setSysCode,
			setUtlCode: tsServer.setUtlCode,
			setVarCode: tsServer.setVarCode,
			setTypCode: tsServer.setTypCode,
			setCurCode: tsServer.setCurCode,
			getCurCode: tsServer.getCurCode,
			insertVariable: tsServer.insertVariable,
			format: tsServer.format,
			onLink: tsServer.onLink
		};
		window.parent.__initBaseflowTsServer__(tsServerApi);
	}
	//#endregion
	exports.initMonaco = initMonaco;
});

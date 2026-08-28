import { n as __toESM } from "./chunks/rolldown-runtime-BPOCksWG.js";
import { t as require_react } from "./chunks/react-QzYZYktg.js";
import { t as require_jsx_runtime } from "./chunks/jsx-runtime-BGwyNsYy.js";
//#region ../node_modules/@baseflow/render-react/out/index.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var g = Object.create;
var _ = Object.defineProperty;
var v = Object.getOwnPropertyDescriptor;
var y = Object.getOwnPropertyNames;
var b = Object.getPrototypeOf;
var x = Object.prototype.hasOwnProperty;
var S = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports);
var C = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = y(t), a = 0, o = i.length, s; a < o; a++) s = i[a], !x.call(e, s) && s !== n && _(e, s, {
		get: ((e) => t[e]).bind(null, s),
		enumerable: !(r = v(t, s)) || r.enumerable
	});
	return e;
};
var w = (e, t, n) => (n = e == null ? {} : g(b(e)), C(t || !e || !e.__esModule || !x.call(e, "default") ? _(n, "default", {
	value: e,
	enumerable: !0
}) : n, e));
var ee = "@baseflow/schema";
var T = {
	String: "ͼSTRINGͼ",
	Number: "ͼNUMBERͼ",
	Bool: "ͼBOOLͼ",
	Date: "ͼDATEͼ",
	Time: "ͼTIMEͼ",
	DateTime: "ͼDATETIMEͼ",
	Object: "ͼOBJECTͼ",
	Array: "ͼARRAYͼ",
	Map: "ͼMAPͼ",
	File: "ͼFILEͼ",
	Any: "ͼANYͼ"
};
var E = Object.keys(T).reduce((e, t) => (e[T[t]] = t, e), {});
var te = Object.keys(T).map((e) => ({
	value: T[e],
	label: e
}));
var D = {
	Variable: "ͼVARIABLEͼ",
	Template: "ͼTEMPLATEͼ",
	Expression: "ͼEXPRESSIONͼ"
};
var ne = Object.keys(D).reduce((e, t) => (e[D[t]] = t, e), {});
var O = {
	requiredPrompt: "请输入...",
	iteratorSource: "迭代源",
	systemVariables: "系统变量",
	nameIsRequired: "名称必填",
	nameIsRepeat: "${name}名称重复",
	typeRestricted: "${type}类型受到限制",
	typeMismatch: "类型不匹配",
	nameMismatch: "名称不匹配",
	optionalMismatch: "必填设置不匹配",
	structureMismatch: "结构不匹配",
	emptyStringTips: "空字符串",
	envVariable: "环境变量",
	envVariableTips: "环境变量取值可为：development | production | test",
	selectPrompt: "请选择...",
	loopContextPrompt: "请输入迭代源(Array/Map/Number)",
	name: "变量名",
	label: "展示名",
	tips: "备注",
	optional: "可为空",
	type: "类型",
	subType: "子元素",
	useEnum: "值枚举",
	nameRestricted: "${name}名称受到限制",
	hasExist: "(${item})已经存在...",
	jsonValueTips: "必须是有效的JSON",
	schemaValueTips: "必须是有效的Schema结构...",
	alreadyToClipboard: "已放入剪贴板",
	jsonValue: "Json样例",
	schemaModel: "Schema结构",
	noOutputs: "无输出",
	paste: "粘贴",
	invalidTips: "检测到Value与Schema不匹配",
	infer: "推断",
	fix: "修复",
	format: "格式化",
	ButtonOk: "确定",
	ButtonCancel: "取消",
	ButtonSubmit: "提交",
	generate: "生成",
	simpleValue: "简单值",
	complexValue: "表达式",
	export: "导出",
	import: "导入",
	copy: "复制",
	create: "新建",
	edit: "编辑",
	update: "修改",
	delete: "删除",
	insertNext: "插入后续",
	insertChild: "插入子级",
	createdFromManual: "手动创建",
	createdFromDSL: "Schema导入",
	clipboardIsEmpty: "剪贴板数据无效",
	copied: "已复制",
	mapping: "迭代",
	assign: "赋值",
	deconstruct: "解构",
	nullAssert: "非空断言",
	setPath: "设置路径参数",
	convertTo: "强转为",
	equalTo: "等于",
	notEqualTo: "不等于",
	startsWith: "开头是",
	endsWith: "结尾是",
	containsString: "包含",
	notContainsString: "不包含",
	containsItem: "包含元素",
	notContainsItem: "不包含元素",
	containedIn: "被包含",
	notContainedIn: "不被包含",
	hasKey: "包含Key",
	notHasKey: "不包含Key",
	in: "在其中",
	notIn: "不在其中",
	greaterThan: "大于",
	lessThan: "小于",
	greaterOrEqual: "大于等于",
	lessOrEqual: "小于等于",
	earlierThan: "早于",
	laterThan: "晚于",
	earlierOrEqual: "早于等于",
	laterOrEqual: "晚于等于",
	condition: "条件判断",
	scriptsMode: "脚本模式",
	conditionScripts: "使用(JS)表达式返回(Boolean)值",
	createCondition: "增加条件",
	addGroup: "增加分组",
	delGroup: "删除分组",
	exportSchemaTips: "* 右边的输入为当前的Schema结构，左边的Json样例仅作为参考...",
	importSchemaTips: "* 可以在左边输入Json样例值，点击推断在右边生成其Schema结构... 也可以直接粘贴或编辑右边的Schema结构...\n* 最终提交将以右边的Schema结构为准..."
};
function re(e, t = {}) {
	return e.replace(/\$\{([^}]*)\}/g, (e, n) => t[n]);
}
var ie = "//⫻Expression⫻=";
var ae = "//⫻Node⫻=";
function oe(e, t, n, r) {
	let i, a;
	return r ? (i = /\D/.test(e) ? /^[\w$]+$/.test(e) ? e : `["${e.replace(/"/g, "\\\"")}"]` : `[${e}]`, a = i.charAt(0) === "[" && !n.endsWith("?") ? "" : ".", t && (i = `${i}?`)) : (i = `${t ? "?" : "!"}${e}`, a = "⫻"), n ? n + a + i : i;
}
var se = class {
	constructor(e, t = {}, n) {
		this.pattern = e, this.separator = t.separator || ".", this.segments = this._parse(e), this.data = n, this._hasDeepWildcard = this.segments.some((e) => e.type === "deep-wildcard"), this._hasAttributeCondition = this.segments.some((e) => e.attrName !== void 0), this._hasPositionSelector = this.segments.some((e) => e.position !== void 0);
	}
	_parse(e) {
		let t = [], n = 0, r = "";
		for (; n < e.length;) e[n] === this.separator ? n + 1 < e.length && e[n + 1] === this.separator ? (r.trim() && (t.push(this._parseSegment(r.trim())), r = ""), t.push({ type: "deep-wildcard" }), n += 2) : (r.trim() && t.push(this._parseSegment(r.trim())), r = "", n++) : (r += e[n], n++);
		return r.trim() && t.push(this._parseSegment(r.trim())), t;
	}
	_parseSegment(e) {
		let t = { type: "tag" }, n = null, r = e, i = e.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
		if (i && (r = i[1] + i[3], i[2])) {
			let e = i[2].slice(1, -1);
			e && (n = e);
		}
		let a, o = r;
		if (r.includes("::")) {
			let t = r.indexOf("::");
			if (a = r.substring(0, t).trim(), o = r.substring(t + 2).trim(), !a) throw Error(`Invalid namespace in pattern: ${e}`);
		}
		let s, c = null;
		if (o.includes(":")) {
			let e = o.lastIndexOf(":"), t = o.substring(0, e).trim(), n = o.substring(e + 1).trim();
			[
				"first",
				"last",
				"odd",
				"even"
			].includes(n) || /^nth\(\d+\)$/.test(n) ? (s = t, c = n) : s = o;
		} else s = o;
		if (!s) throw Error(`Invalid segment pattern: ${e}`);
		if (t.tag = s, a && (t.namespace = a), n) {
			if (n.includes("=")) {
				let e = n.indexOf("=");
				t.attrName = n.substring(0, e).trim(), t.attrValue = n.substring(e + 1).trim();
			} else t.attrName = n.trim();
		}
		if (c) {
			let e = c.match(/^nth\((\d+)\)$/);
			e ? (t.position = "nth", t.positionValue = parseInt(e[1], 10)) : t.position = c;
		}
		return t;
	}
	get length() {
		return this.segments.length;
	}
	hasDeepWildcard() {
		return this._hasDeepWildcard;
	}
	hasAttributeCondition() {
		return this._hasAttributeCondition;
	}
	hasPositionSelector() {
		return this._hasPositionSelector;
	}
	toString() {
		return this.pattern;
	}
};
var k = class {
	constructor() {
		this._byDepthAndTag = /* @__PURE__ */ new Map(), this._wildcardByDepth = /* @__PURE__ */ new Map(), this._deepWildcards = [], this._deepByTerminalTag = /* @__PURE__ */ new Map(), this._patterns = /* @__PURE__ */ new Set(), this._sealed = !1;
	}
	add(e) {
		if (this._sealed) throw TypeError("ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.");
		if (this._patterns.has(e.pattern)) return this;
		if (this._patterns.add(e.pattern), e.hasDeepWildcard()) {
			let t = e.segments[e.segments.length - 1];
			if (t && t.type !== "deep-wildcard" && t.tag !== "*") {
				let n = t.tag;
				this._deepByTerminalTag.has(n) || this._deepByTerminalTag.set(n, []), this._deepByTerminalTag.get(n).push(e);
			} else this._deepWildcards.push(e);
			return this;
		}
		let t = e.length, n = e.segments[e.segments.length - 1]?.tag;
		if (!n || n === "*") this._wildcardByDepth.has(t) || this._wildcardByDepth.set(t, []), this._wildcardByDepth.get(t).push(e);
		else {
			let r = `${t}:${n}`;
			this._byDepthAndTag.has(r) || this._byDepthAndTag.set(r, []), this._byDepthAndTag.get(r).push(e);
		}
		return this;
	}
	addAll(e) {
		for (let t of e) this.add(t);
		return this;
	}
	has(e) {
		return this._patterns.has(e.pattern);
	}
	get size() {
		return this._patterns.size;
	}
	seal() {
		return this._sealed = !0, this;
	}
	get isSealed() {
		return this._sealed;
	}
	matchesAny(e) {
		return this.findMatch(e) !== null;
	}
	findMatch(e) {
		let t = e.getDepth(), n = e.getCurrentTag(), r = `${t}:${n}`, i = this._byDepthAndTag.get(r);
		if (i) {
			for (let t = 0; t < i.length; t++) if (e.matches(i[t])) return i[t];
		}
		let a = this._wildcardByDepth.get(t);
		if (a) {
			for (let t = 0; t < a.length; t++) if (e.matches(a[t])) return a[t];
		}
		let o = this._deepByTerminalTag.get(n);
		if (o) {
			for (let t = 0; t < o.length; t++) if (e.matches(o[t])) return o[t];
		}
		for (let t = 0; t < this._deepWildcards.length; t++) if (e.matches(this._deepWildcards[t])) return this._deepWildcards[t];
		return null;
	}
};
var A = class {
	constructor(e) {
		this._matcher = e;
	}
	get separator() {
		return this._matcher.separator;
	}
	getCurrentTag() {
		let e = this._matcher.path;
		return e.length > 0 ? e[e.length - 1].tag : void 0;
	}
	getCurrentNamespace() {
		let e = this._matcher.path;
		return e.length > 0 ? e[e.length - 1].namespace : void 0;
	}
	getAttrValue(e) {
		let t = this._matcher.path;
		if (t.length !== 0) return t[t.length - 1].values?.[e];
	}
	hasAttr(e) {
		let t = this._matcher.path;
		if (t.length === 0) return !1;
		let n = t[t.length - 1];
		return n.values !== void 0 && e in n.values;
	}
	getAnyParentAttr(e) {
		return this._matcher.getAnyParentAttr(e);
	}
	hasAnyParentAttr(e) {
		return this._matcher.hasAnyParentAttr(e);
	}
	getPosition() {
		let e = this._matcher.path;
		return e.length === 0 ? -1 : e[e.length - 1].position ?? 0;
	}
	getCounter() {
		let e = this._matcher.path;
		return e.length === 0 ? -1 : e[e.length - 1].counter ?? 0;
	}
	getIndex() {
		return this.getPosition();
	}
	getDepth() {
		return this._matcher.path.length;
	}
	toString(e, t = !0) {
		return this._matcher.toString(e, t);
	}
	toArray() {
		return this._matcher.path.map((e) => e.tag);
	}
	matches(e) {
		return this._matcher.matches(e);
	}
	matchesAny(e) {
		return e.matchesAny(this._matcher);
	}
};
var ce = class {
	constructor(e = {}) {
		this.separator = e.separator || ".", this.path = [], this.siblingStacks = [], this._pathStringCache = null, this._view = new A(this), this._keptAttrs = [];
	}
	push(e, t = null, n = null, r = null) {
		this._pathStringCache = null, this.path.length > 0 && (this.path[this.path.length - 1].values = void 0);
		let i = this.path.length, a = this.siblingStacks[i];
		a || (a = {
			counts: /* @__PURE__ */ new Map(),
			total: 0
		}, this.siblingStacks[i] = a);
		let o = n ? `${n}:${e}` : e, s = a.counts.get(o) || 0, c = a.total;
		a.counts.set(o, s + 1), a.total++;
		let l = {
			tag: e,
			position: c,
			counter: s
		};
		n != null && (l.namespace = n), t != null && (l.values = t), this.path.push(l);
		let u = this.path.length, d = r === null ? null : r.keep;
		if (d != null && d.length > 0 && t) for (let e = 0; e < d.length; e++) {
			let n = d[e];
			t[n] !== void 0 && this._keptAttrs.push({
				depth: u,
				name: n,
				value: t[n]
			});
		}
	}
	pop() {
		if (this.path.length === 0) return;
		this._pathStringCache = null;
		let e = this.path.pop();
		this.siblingStacks.length > this.path.length + 1 && (this.siblingStacks.length = this.path.length + 1);
		let t = this.path.length + 1;
		for (; this._keptAttrs.length > 0 && this._keptAttrs[this._keptAttrs.length - 1].depth >= t;) this._keptAttrs.pop();
		return e;
	}
	updateCurrent(e) {
		if (this.path.length > 0) {
			let t = this.path[this.path.length - 1];
			e != null && (t.values = e);
		}
	}
	getCurrentTag() {
		return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
	}
	getCurrentNamespace() {
		return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
	}
	getAttrValue(e) {
		if (this.path.length !== 0) return this.path[this.path.length - 1].values?.[e];
	}
	hasAttr(e) {
		if (this.path.length === 0) return !1;
		let t = this.path[this.path.length - 1];
		return t.values !== void 0 && e in t.values;
	}
	getAnyParentAttr(e) {
		let t = this._keptAttrs;
		for (let n = t.length - 1; n >= 0; n--) if (t[n].name === e) return t[n].value;
	}
	hasAnyParentAttr(e) {
		let t = this._keptAttrs;
		for (let n = t.length - 1; n >= 0; n--) if (t[n].name === e) return !0;
		return !1;
	}
	getPosition() {
		return this.path.length === 0 ? -1 : this.path[this.path.length - 1].position ?? 0;
	}
	getCounter() {
		return this.path.length === 0 ? -1 : this.path[this.path.length - 1].counter ?? 0;
	}
	getIndex() {
		return this.getPosition();
	}
	getDepth() {
		return this.path.length;
	}
	toString(e, t = !0) {
		let n = e || this.separator;
		if (n === this.separator && t === !0) {
			if (this._pathStringCache !== null) return this._pathStringCache;
			let e = this.path.map((e) => e.namespace ? `${e.namespace}:${e.tag}` : e.tag).join(n);
			return this._pathStringCache = e, e;
		}
		return this.path.map((e) => t && e.namespace ? `${e.namespace}:${e.tag}` : e.tag).join(n);
	}
	toArray() {
		return this.path.map((e) => e.tag);
	}
	reset() {
		this._pathStringCache = null, this.path = [], this.siblingStacks = [], this._keptAttrs = [];
	}
	matches(e) {
		let t = e.segments;
		return t.length === 0 ? !1 : e.hasDeepWildcard() ? this._matchWithDeepWildcard(t) : this._matchSimple(t);
	}
	_matchSimple(e) {
		if (this.path.length !== e.length) return !1;
		for (let t = 0; t < e.length; t++) if (!this._matchSegment(e[t], this.path[t], t === this.path.length - 1)) return !1;
		return !0;
	}
	_matchWithDeepWildcard(e) {
		let t = this.path.length - 1, n = e.length - 1;
		for (; n >= 0 && t >= 0;) {
			let r = e[n];
			if (r.type === "deep-wildcard") {
				if (n--, n < 0) return !0;
				let r = e[n], i = !1;
				for (let e = t; e >= 0; e--) if (this._matchSegment(r, this.path[e], e === this.path.length - 1)) {
					t = e - 1, n--, i = !0;
					break;
				}
				if (!i) return !1;
			} else {
				if (!this._matchSegment(r, this.path[t], t === this.path.length - 1)) return !1;
				t--, n--;
			}
		}
		return n < 0;
	}
	_matchSegment(e, t, n) {
		if (e.tag !== "*" && e.tag !== t.tag || e.namespace !== void 0 && e.namespace !== "*" && e.namespace !== t.namespace || e.attrName !== void 0 && (!n || !t.values || !(e.attrName in t.values) || e.attrValue !== void 0 && String(t.values[e.attrName]) !== String(e.attrValue))) return !1;
		if (e.position !== void 0) {
			if (!n) return !1;
			let r = t.counter ?? 0;
			if (e.position === "first" && r !== 0 || e.position === "odd" && r % 2 != 1 || e.position === "even" && r % 2 != 0 || e.position === "nth" && r !== e.positionValue) return !1;
		}
		return !0;
	}
	matchesAny(e) {
		return e.matchesAny(this);
	}
	snapshot() {
		return {
			path: this.path.map((e) => ({ ...e })),
			siblingStacks: this.siblingStacks.map((e) => e && {
				counts: new Map(e.counts),
				total: e.total
			}),
			keptAttrs: this._keptAttrs.map((e) => ({ ...e }))
		};
	}
	restore(e) {
		this._pathStringCache = null, this.path = e.path.map((e) => ({ ...e })), this.siblingStacks = e.siblingStacks.map((e) => e && {
			counts: new Map(e.counts),
			total: e.total
		}), this._keptAttrs = (e.keptAttrs || []).map((e) => ({ ...e }));
	}
	readOnly() {
		return this._view;
	}
};
function j(e) {
	return typeof e == "number" && Object.is(e, -0) ? "-0" : String(e);
}
function le(e) {
	return j(e).replace(/--/g, "- -").replace(/--/g, "- -").replace(/-$/, "- ");
}
function ue(e) {
	return j(e).replace(/\]\]>/g, "]]]]><![CDATA[>");
}
function de(e) {
	return j(e).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
var M = ":A-Za-z_À-ÖØ-öø-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�";
var fe = M + "\\-\\.\\d·̀-ͯ‿-⁀";
var pe = ":A-Za-z_À-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�𐀀-󯿿";
var me = pe + "\\-\\.\\d·̀-ͯ҇‿-⁀";
var he = (e, t, n = "") => {
	let r = `[${e.replace(":", "")}][${t.replace(":", "")}]*`;
	return {
		name: RegExp(`^[${e}][${t}]*$`, n),
		ncName: RegExp(`^${r}$`, n),
		qName: RegExp(`^${r}(?::${r})?$`, n),
		nmToken: RegExp(`^[${t}]+$`, n),
		nmTokens: RegExp(`^[${t}]+(?:\\s+[${t}]+)*$`, n)
	};
};
var ge = he(M, fe);
var _e = he(pe, me, "u");
var ve = he(":A-Za-z_", ":A-Za-z_\\-\\.\\d");
var ye = (e = "1.0", t = !1) => t ? ve : e === "1.1" ? _e : ge;
var be = (e, { xmlVersion: t = "1.0", asciiOnly: n = !1 } = {}) => ye(t, n).qName.test(e);
var xe = [
	"name",
	"ncName",
	"qName",
	"nmToken",
	"nmTokens"
];
var Se = (e, { xmlVersion: t = "1.0", asciiOnly: n = !1, maxCacheSize: r = 2048 } = {}) => {
	if (!xe.includes(e)) throw TypeError(`Unknown production "${e}". Must be one of: ${xe.join(", ")}`);
	let i = ye(t, n)[e], a = /* @__PURE__ */ new Map(), o = (e) => {
		let t = a.get(e);
		if (t !== void 0) return t;
		let n = i.test(e);
		return a.size < r && a.set(e, n), n;
	};
	return o.reset = () => {
		a = /* @__PURE__ */ new Map();
	}, o;
};
var Ce = "\n";
function we(e, t) {
	if (!Array.isArray(e) || e.length === 0) return "1.0";
	let n = e[0];
	if (je(n) === "?xml") {
		let e = n[":@"];
		if (e) {
			let n = t.attributeNamePrefix + "version";
			if (e[n]) return e[n];
		}
	}
	return "1.0";
}
function Te(e, t, n, r, i) {
	return !n.sanitizeName || i(e) ? e : n.sanitizeName(e, {
		isAttribute: t,
		matcher: r.readOnly()
	});
}
function Ee(e, t) {
	let n = "";
	t.format && (n = Ce);
	let r = [];
	if (t.stopNodes && Array.isArray(t.stopNodes)) for (let e = 0; e < t.stopNodes.length; e++) {
		let n = t.stopNodes[e];
		typeof n == "string" ? r.push(new se(n)) : n instanceof se && r.push(n);
	}
	let i = Se("qName", { xmlVersion: we(e, t) }), a = new ce();
	return De(e, t, n, a, r, i);
}
function De(e, t, n, r, i, a) {
	let o = "", s = !1;
	if (t.maxNestedTags && r.getDepth() > t.maxNestedTags) throw Error("Maximum nested tags exceeded");
	if (!Array.isArray(e)) {
		if (e != null) {
			let n = j(e);
			return n = Pe(n, t), n;
		}
		return "";
	}
	for (let c = 0; c < e.length; c++) {
		let l = e[c], u = je(l);
		if (u === void 0) continue;
		let d = u === t.textNodeName || u === t.cdataPropName || u === t.commentPropName || u[0] === "?" ? u : Te(u, !1, t, r, a), f = Oe(l[":@"], t);
		r.push(d, f);
		let p = Ne(r, i);
		if (d === t.textNodeName) {
			let e = l[u];
			p || (e = t.tagValueProcessor(d, e), e = Pe(e, t)), e = j(e), s && (o += n), o += e, s = !1, r.pop();
			continue;
		}
		if (d === t.cdataPropName) {
			s && (o += n);
			let e = l[u][0][t.textNodeName], i = ue(e);
			o += `<![CDATA[${i}]]>`, s = !1, r.pop();
			continue;
		}
		if (d === t.commentPropName) {
			let e = l[u][0][t.textNodeName], i = le(e);
			o += n + `<!--${i}-->`, s = !0, r.pop();
			continue;
		}
		if (d[0] === "?") {
			let e = Me(l[":@"], t, p, r, a);
			o += (d === "?xml" ? "" : n) + `<${d}${e}?>`, s = !0, r.pop();
			continue;
		}
		let m = n;
		m !== "" && (m += t.indentBy);
		let h = n + `<${d}${Me(l[":@"], t, p, r, a)}`, g;
		g = p ? ke(l[u], t) : De(l[u], t, m, r, i, a), t.unpairedTags.indexOf(d) === -1 ? (!g || g.length === 0) && t.suppressEmptyNode ? o += h + "/>" : g && g.endsWith(">") ? o += h + `>${g}${n}</${d}>` : (o += h + ">", g && n !== "" && (g.includes("/>") || g.includes("</")) ? o += n + t.indentBy + g + n : o += g, o += `</${d}>`) : t.suppressUnpairedNode ? o += h + ">" : o += h + "/>", s = !0, r.pop();
	}
	return o;
}
function Oe(e, t) {
	if (!e || t.ignoreAttributes) return null;
	let n = {}, r = !1;
	for (let i in e) {
		if (!Object.prototype.hasOwnProperty.call(e, i)) continue;
		let a = i.startsWith(t.attributeNamePrefix) ? i.substr(t.attributeNamePrefix.length) : i;
		n[a] = de(e[i]), r = !0;
	}
	return r ? n : null;
}
function ke(e, t) {
	if (!Array.isArray(e)) return e == null ? "" : j(e);
	let n = "";
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = je(i);
		if (a === t.textNodeName) n += j(i[a]);
		else if (a === t.cdataPropName) n += i[a][0][t.textNodeName];
		else if (a === t.commentPropName) n += i[a][0][t.textNodeName];
		else if (a && a[0] === "?") continue;
		else if (a) {
			let e = Ae(i[":@"], t), r = ke(i[a], t);
			!r || r.length === 0 ? n += `<${a}${e}/>` : n += `<${a}${e}>${r}</${a}>`;
		}
	}
	return n;
}
function Ae(e, t) {
	let n = "";
	if (e && !t.ignoreAttributes) for (let r in e) {
		if (!Object.prototype.hasOwnProperty.call(e, r)) continue;
		let i = e[r];
		i === !0 && t.suppressBooleanAttributes ? n += ` ${r.substr(t.attributeNamePrefix.length)}` : n += ` ${r.substr(t.attributeNamePrefix.length)}="${de(i)}"`;
	}
	return n;
}
function je(e) {
	let t = Object.keys(e);
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (Object.prototype.hasOwnProperty.call(e, r) && r !== ":@") return r;
	}
}
function Me(e, t, n, r, i) {
	let a = "";
	if (e && !t.ignoreAttributes) for (let o in e) {
		if (!Object.prototype.hasOwnProperty.call(e, o)) continue;
		let s = o.substr(t.attributeNamePrefix.length), c = n ? s : Te(s, !0, t, r, i), l;
		n ? l = e[o] : (l = t.attributeValueProcessor(o, e[o]), l = Pe(l, t)), l === !0 && t.suppressBooleanAttributes ? a += ` ${c}` : a += ` ${c}="${de(l)}"`;
	}
	return a;
}
function Ne(e, t) {
	if (!t || t.length === 0) return !1;
	for (let n = 0; n < t.length; n++) if (e.matches(t[n])) return !0;
	return !1;
}
function Pe(e, t) {
	if (e && e.length > 0 && t.processEntities) for (let n = 0; n < t.entities.length; n++) {
		let r = t.entities[n];
		e = e.replace(r.regex, r.val);
	}
	return e;
}
function Fe(e) {
	return typeof e == "function" ? e : Array.isArray(e) ? (t) => {
		for (let n of e) if (typeof n == "string" && t === n || n instanceof RegExp && n.test(t)) return !0;
	} : () => !1;
}
var Ie = {
	attributeNamePrefix: "@_",
	attributesGroupName: !1,
	textNodeName: "#text",
	ignoreAttributes: !0,
	cdataPropName: !1,
	format: !1,
	indentBy: "  ",
	suppressEmptyNode: !1,
	suppressUnpairedNode: !0,
	suppressBooleanAttributes: !0,
	tagValueProcessor: function(e, t) {
		return t;
	},
	attributeValueProcessor: function(e, t) {
		return t;
	},
	preserveOrder: !1,
	commentPropName: !1,
	unpairedTags: [],
	entities: [
		{
			regex: /* @__PURE__ */ RegExp("&", "g"),
			val: "&amp;"
		},
		{
			regex: /* @__PURE__ */ RegExp(">", "g"),
			val: "&gt;"
		},
		{
			regex: /* @__PURE__ */ RegExp("<", "g"),
			val: "&lt;"
		},
		{
			regex: /* @__PURE__ */ RegExp("'", "g"),
			val: "&apos;"
		},
		{
			regex: /* @__PURE__ */ RegExp("\"", "g"),
			val: "&quot;"
		}
	],
	processEntities: !0,
	stopNodes: [],
	oneListGroup: !1,
	maxNestedTags: 100,
	jPath: !0,
	sanitizeName: !1
};
function Le(e) {
	if (this.options = Object.assign({}, Ie, e), this.options.stopNodes && Array.isArray(this.options.stopNodes) && (this.options.stopNodes = this.options.stopNodes.map((e) => typeof e == "string" && e.startsWith("*.") ? ".." + e.substring(2) : e)), this.stopNodeExpressions = [], this.options.stopNodes && Array.isArray(this.options.stopNodes)) for (let e = 0; e < this.options.stopNodes.length; e++) {
		let t = this.options.stopNodes[e];
		typeof t == "string" ? this.stopNodeExpressions.push(new se(t)) : t instanceof se && this.stopNodeExpressions.push(t);
	}
	this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
		return !1;
	} : (this.ignoreAttributesFn = Fe(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = He), this.processTextOrObjNode = Be, this.options.format ? (this.indentate = Ve, this.tagEndChar = ">\n", this.newLine = "\n") : (this.indentate = function() {
		return "";
	}, this.tagEndChar = ">", this.newLine = "");
}
function Re(e, t) {
	let n = e["?xml"];
	if (n && typeof n == "object") {
		if (t.attributesGroupName && n[t.attributesGroupName]) {
			let e = n[t.attributesGroupName][t.attributeNamePrefix + "version"];
			if (e) return e;
		}
		let e = n[t.attributeNamePrefix + "version"];
		if (e) return e;
	}
	return "1.0";
}
function ze(e, t, n, r, i) {
	return !n.sanitizeName || i(e) ? e : n.sanitizeName(e, {
		isAttribute: t,
		matcher: r.readOnly()
	});
}
Le.prototype.build = function(e) {
	if (this.options.preserveOrder) return Ee(e, this.options);
	{
		Array.isArray(e) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (e = { [this.options.arrayNodeName]: e });
		let t = new ce(), n = Se("qName", { xmlVersion: Re(e, this.options) });
		return this.j2x(e, 0, t, n).val;
	}
}, Le.prototype.j2x = function(e, t, n, r) {
	let i = "", a = "";
	if (this.options.maxNestedTags && n.getDepth() >= this.options.maxNestedTags) throw Error("Maximum nested tags exceeded");
	let o = this.options.jPath ? n.toString() : n, s = this.checkStopNode(n);
	for (let c in e) {
		if (!Object.prototype.hasOwnProperty.call(e, c)) continue;
		let l = c === this.options.textNodeName || c === this.options.cdataPropName || c === this.options.commentPropName || this.options.attributesGroupName && c === this.options.attributesGroupName || this.isAttribute(c) || c[0] === "?" ? c : ze(c, !1, this.options, n, r);
		if (e[c] === void 0) this.isAttribute(c) && (a += "");
		else if (e[c] === null) this.isAttribute(c) || l === this.options.cdataPropName || l === this.options.commentPropName ? a += "" : l[0] === "?" ? a += this.indentate(t) + "<" + l + "?" + this.tagEndChar : a += this.indentate(t) + "<" + l + "/" + this.tagEndChar;
		else if (e[c] instanceof Date) a += this.buildTextValNode(e[c], l, "", t, n);
		else if (typeof e[c] != "object") {
			let u = this.isAttribute(c);
			if (u && !this.ignoreAttributesFn(u, o)) {
				let t = ze(u, !0, this.options, n, r);
				i += this.buildAttrPairStr(t, j(e[c]), s);
			} else if (!u) {
				if (c === this.options.textNodeName) {
					let t = this.options.tagValueProcessor(c, j(e[c]));
					a += this.replaceEntitiesValue(t);
				} else {
					n.push(l);
					let r = this.checkStopNode(n);
					if (n.pop(), r) {
						let n = j(e[c]);
						a += n === "" ? this.indentate(t) + "<" + l + this.closeTag(l) + this.tagEndChar : this.indentate(t) + "<" + l + ">" + n + "</" + l + this.tagEndChar;
					} else a += this.buildTextValNode(e[c], l, "", t, n);
				}
			}
		} else if (Array.isArray(e[c])) {
			let i = e[c].length, o = "", s = "";
			for (let u = 0; u < i; u++) {
				let i = e[c][u];
				if (i !== void 0) {
					if (i === null) l[0] === "?" ? a += this.indentate(t) + "<" + l + "?" + this.tagEndChar : a += this.indentate(t) + "<" + l + "/" + this.tagEndChar;
					else if (typeof i == "object") {
						if (this.options.oneListGroup) {
							n.push(l);
							let e = this.j2x(i, t + 1, n, r);
							n.pop(), o += e.val, this.options.attributesGroupName && i.hasOwnProperty(this.options.attributesGroupName) && (s += e.attrStr);
						} else o += this.processTextOrObjNode(i, l, t, n, r);
					} else if (this.options.oneListGroup) {
						let e = this.options.tagValueProcessor(l, i);
						e = this.replaceEntitiesValue(e), e = j(e), o += e;
					} else {
						n.push(l);
						let e = this.checkStopNode(n);
						if (n.pop(), e) {
							let e = j(i);
							o += e === "" ? this.indentate(t) + "<" + l + this.closeTag(l) + this.tagEndChar : this.indentate(t) + "<" + l + ">" + e + "</" + l + this.tagEndChar;
						} else o += this.buildTextValNode(i, l, "", t, n);
					}
				}
			}
			this.options.oneListGroup && (o = this.buildObjectNode(o, l, s, t)), a += o;
		} else if (this.options.attributesGroupName && c === this.options.attributesGroupName) {
			let t = Object.keys(e[c]), a = t.length;
			for (let o = 0; o < a; o++) {
				let a = ze(t[o], !0, this.options, n, r);
				i += this.buildAttrPairStr(a, j(e[c][t[o]]), s);
			}
		} else a += this.processTextOrObjNode(e[c], l, t, n, r);
	}
	return {
		attrStr: i,
		val: a
	};
}, Le.prototype.buildAttrPairStr = function(e, t, n) {
	return n || (t = this.options.attributeValueProcessor(e, j(t)), t = this.replaceEntitiesValue(t)), this.options.suppressBooleanAttributes && t === "true" ? " " + e : " " + e + "=\"" + de(t) + "\"";
};
function Be(e, t, n, r, i) {
	let a = this.extractAttributes(e);
	if (r.push(t, a), this.checkStopNode(r)) {
		let i = this.buildRawContent(e), a = this.buildAttributesForStopNode(e);
		return r.pop(), this.buildObjectNode(i, t, a, n);
	}
	let o = this.j2x(e, n + 1, r, i);
	return r.pop(), t[0] === "?" ? this.buildTextValNode("", t, o.attrStr, n, r) : e[this.options.textNodeName] !== void 0 && Object.keys(e).length === 1 ? this.buildTextValNode(e[this.options.textNodeName], t, o.attrStr, n, r) : this.buildObjectNode(o.val, t, o.attrStr, n);
}
Le.prototype.extractAttributes = function(e) {
	if (!e || typeof e != "object") return null;
	let t = {}, n = !1;
	if (this.options.attributesGroupName && e[this.options.attributesGroupName]) {
		let r = e[this.options.attributesGroupName];
		for (let e in r) {
			if (!Object.prototype.hasOwnProperty.call(r, e)) continue;
			let i = e.startsWith(this.options.attributeNamePrefix) ? e.substring(this.options.attributeNamePrefix.length) : e;
			t[i] = de(r[e]), n = !0;
		}
	} else for (let r in e) {
		if (!Object.prototype.hasOwnProperty.call(e, r)) continue;
		let i = this.isAttribute(r);
		i && (t[i] = de(e[r]), n = !0);
	}
	return n ? t : null;
}, Le.prototype.buildRawContent = function(e) {
	if (typeof e == "string") return e;
	if (typeof e != "object" || !e) return String(e);
	if (e[this.options.textNodeName] !== void 0) return e[this.options.textNodeName];
	let t = "";
	for (let n in e) {
		if (!Object.prototype.hasOwnProperty.call(e, n) || this.isAttribute(n) || this.options.attributesGroupName && n === this.options.attributesGroupName) continue;
		let r = e[n];
		if (n === this.options.textNodeName) t += r;
		else if (Array.isArray(r)) {
			for (let e of r) if (typeof e == "string" || typeof e == "number") t += `<${n}>${e}</${n}>`;
			else if (typeof e == "object" && e) {
				let r = this.buildRawContent(e), i = this.buildAttributesForStopNode(e);
				t += r === "" ? `<${n}${i}/>` : `<${n}${i}>${r}</${n}>`;
			}
		} else if (typeof r == "object" && r) {
			let e = this.buildRawContent(r), i = this.buildAttributesForStopNode(r);
			t += e === "" ? `<${n}${i}/>` : `<${n}${i}>${e}</${n}>`;
		} else t += `<${n}>${r}</${n}>`;
	}
	return t;
}, Le.prototype.buildAttributesForStopNode = function(e) {
	if (!e || typeof e != "object") return "";
	let t = "";
	if (this.options.attributesGroupName && e[this.options.attributesGroupName]) {
		let n = e[this.options.attributesGroupName];
		for (let e in n) {
			if (!Object.prototype.hasOwnProperty.call(n, e)) continue;
			let r = e.startsWith(this.options.attributeNamePrefix) ? e.substring(this.options.attributeNamePrefix.length) : e, i = n[e];
			i === !0 && this.options.suppressBooleanAttributes ? t += " " + r : t += " " + r + "=\"" + de(i) + "\"";
		}
	} else for (let n in e) {
		if (!Object.prototype.hasOwnProperty.call(e, n)) continue;
		let r = this.isAttribute(n);
		if (r) {
			let i = e[n];
			i === !0 && this.options.suppressBooleanAttributes ? t += " " + r : t += " " + r + "=\"" + de(i) + "\"";
		}
	}
	return t;
}, Le.prototype.buildObjectNode = function(e, t, n, r) {
	if (e === "") return t[0] === "?" ? this.indentate(r) + "<" + t + n + "?" + this.tagEndChar : this.indentate(r) + "<" + t + n + this.closeTag(t) + this.tagEndChar;
	if (t[0] === "?") return this.indentate(r) + "<" + t + n + "?" + this.tagEndChar;
	{
		let i = "</" + t + this.tagEndChar, a = "";
		return t[0] === "?" && (a = "?", i = ""), (n || n === "") && e.indexOf("<") === -1 ? this.indentate(r) + "<" + t + n + a + ">" + e + i : this.options.commentPropName !== !1 && t === this.options.commentPropName && a.length === 0 ? this.indentate(r) + `<!--${le(e)}-->` + this.newLine : this.indentate(r) + "<" + t + n + a + this.tagEndChar + e + this.indentate(r) + i;
	}
}, Le.prototype.closeTag = function(e) {
	let t = "";
	return this.options.unpairedTags.indexOf(e) === -1 ? t = this.options.suppressEmptyNode ? "/" : `></${e}` : this.options.suppressUnpairedNode || (t = "/"), t;
}, Le.prototype.checkStopNode = function(e) {
	if (!this.stopNodeExpressions || this.stopNodeExpressions.length === 0) return !1;
	for (let t = 0; t < this.stopNodeExpressions.length; t++) if (e.matches(this.stopNodeExpressions[t])) return !0;
	return !1;
}, Le.prototype.buildTextValNode = function(e, t, n, r, i) {
	if (this.options.cdataPropName !== !1 && t === this.options.cdataPropName) {
		let t = ue(e);
		return this.indentate(r) + `<![CDATA[${t}]]>` + this.newLine;
	}
	if (this.options.commentPropName !== !1 && t === this.options.commentPropName) {
		let t = le(e);
		return this.indentate(r) + `<!--${t}-->` + this.newLine;
	}
	if (t[0] === "?") return this.indentate(r) + "<" + t + n + "?" + this.tagEndChar;
	{
		let i = this.options.tagValueProcessor(t, e);
		return i = this.replaceEntitiesValue(i), i = j(i), i === "" ? this.indentate(r) + "<" + t + n + this.closeTag(t) + this.tagEndChar : this.indentate(r) + "<" + t + n + ">" + i + "</" + t + this.tagEndChar;
	}
}, Le.prototype.replaceEntitiesValue = function(e) {
	if (e && e.length > 0 && this.options.processEntities) for (let t = 0; t < this.options.entities.length; t++) {
		let n = this.options.entities[t];
		e = e.replace(n.regex, n.val);
	}
	return e;
};
function Ve(e) {
	return this.options.indentBy.repeat(e);
}
function He(e) {
	return e.startsWith(this.options.attributeNamePrefix) && e !== this.options.textNodeName ? e.substr(this.attrPrefixLen) : !1;
}
var Ue = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
var We = Ue + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
"" + Ue + We;
var Ge = /* @__PURE__ */ RegExp("^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
function Ke(e, t) {
	let n = [], r = t.exec(e);
	for (; r;) {
		let i = [];
		i.startIndex = t.lastIndex - r[0].length;
		let a = r.length;
		for (let e = 0; e < a; e++) i.push(r[e]);
		n.push(i), r = t.exec(e);
	}
	return n;
}
var qe = function(e) {
	return Ge.exec(e) != null;
};
function Je(e) {
	return e !== void 0;
}
var Ye = [
	"hasOwnProperty",
	"toString",
	"valueOf",
	"__defineGetter__",
	"__defineSetter__",
	"__lookupGetter__",
	"__lookupSetter__"
];
var Xe = [
	"__proto__",
	"constructor",
	"prototype"
];
var Ze = {
	allowBooleanAttributes: !1,
	unpairedTags: []
};
function Qe(e, t) {
	t = Object.assign({}, Ze, t);
	let n = [], r = !1, i = !1;
	e[0] === "﻿" && (e = e.substr(1));
	for (let a = 0; a < e.length; a++) if (e[a] === "<" && e[a + 1] === "?") {
		if (a += 2, a = et(e, a), a.err) return a;
	} else if (e[a] === "<") {
		let o = a;
		if (a++, e[a] === "!") {
			a = tt(e, a);
			continue;
		}
		{
			let s = !1;
			e[a] === "/" && (s = !0, a++);
			let c = "";
			for (; a < e.length && e[a] !== ">" && e[a] !== " " && e[a] !== "	" && e[a] !== "\n" && e[a] !== "\r"; a++) c += e[a];
			if (c = c.trim(), c[c.length - 1] === "/" && (c = c.substring(0, c.length - 1), a--), !ut(c)) {
				let t;
				return t = c.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + c + "' is an invalid name.", N("InvalidTag", t, P(e, a));
			}
			let l = it(e, a);
			if (l === !1) return N("InvalidAttr", "Attributes for '" + c + "' have open quote.", P(e, a));
			let u = l.value;
			if (a = l.index, u[u.length - 1] === "/") {
				let n = a - u.length;
				u = u.substring(0, u.length - 1);
				let i = ot(u, t);
				if (i === !0) r = !0;
				else return N(i.err.code, i.err.msg, P(e, n + i.err.line));
			} else if (s) {
				if (!l.tagClosed) return N("InvalidTag", "Closing tag '" + c + "' doesn't have proper closing.", P(e, a));
				if (u.trim().length > 0) return N("InvalidTag", "Closing tag '" + c + "' can't have attributes or invalid starting.", P(e, o));
				if (n.length === 0) return N("InvalidTag", "Closing tag '" + c + "' has not been opened.", P(e, o));
				{
					let t = n.pop();
					if (c !== t.tagName) {
						let n = P(e, t.tagStartPos);
						return N("InvalidTag", "Expected closing tag '" + t.tagName + "' (opened in line " + n.line + ", col " + n.col + ") instead of closing tag '" + c + "'.", P(e, o));
					}
					n.length == 0 && (i = !0);
				}
			} else {
				let s = ot(u, t);
				if (s !== !0) return N(s.err.code, s.err.msg, P(e, a - u.length + s.err.line));
				if (i === !0) return N("InvalidXml", "Multiple possible root nodes found.", P(e, a));
				t.unpairedTags.indexOf(c) !== -1 || n.push({
					tagName: c,
					tagStartPos: o
				}), r = !0;
			}
			for (a++; a < e.length; a++) if (e[a] === "<") {
				if (e[a + 1] === "!") {
					a++, a = tt(e, a);
					continue;
				}
				if (e[a + 1] === "?") {
					if (a = et(e, ++a), a.err) return a;
				} else break;
			} else if (e[a] === "&") {
				let t = ct(e, a);
				if (t == -1) return N("InvalidChar", "char '&' is not expected.", P(e, a));
				a = t;
			} else if (i === !0 && !$e(e[a])) return N("InvalidXml", "Extra text at the end", P(e, a));
			e[a] === "<" && a--;
		}
	} else {
		if ($e(e[a])) continue;
		return N("InvalidChar", "char '" + e[a] + "' is not expected.", P(e, a));
	}
	return r ? n.length == 1 ? N("InvalidTag", "Unclosed tag '" + n[0].tagName + "'.", P(e, n[0].tagStartPos)) : n.length > 0 ? N("InvalidXml", "Invalid '" + JSON.stringify(n.map((e) => e.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
		line: 1,
		col: 1
	}) : !0 : N("InvalidXml", "Start tag expected.", 1);
}
function $e(e) {
	return e === " " || e === "	" || e === "\n" || e === "\r";
}
function et(e, t) {
	let n = t;
	for (; t < e.length; t++) if (e[t] == "?" || e[t] == " ") {
		let r = e.substr(n, t - n);
		if (t > 5 && r === "xml") return N("InvalidXml", "XML declaration allowed only at the start of the document.", P(e, t));
		if (e[t] == "?" && e[t + 1] == ">") {
			t++;
			break;
		}
		continue;
	}
	return t;
}
function tt(e, t) {
	if (e.length > t + 5 && e[t + 1] === "-" && e[t + 2] === "-") {
		for (t += 3; t < e.length; t++) if (e[t] === "-" && e[t + 1] === "-" && e[t + 2] === ">") {
			t += 2;
			break;
		}
	} else if (e.length > t + 8 && e[t + 1] === "D" && e[t + 2] === "O" && e[t + 3] === "C" && e[t + 4] === "T" && e[t + 5] === "Y" && e[t + 6] === "P" && e[t + 7] === "E") {
		let n = 1;
		for (t += 8; t < e.length; t++) if (e[t] === "<") n++;
		else if (e[t] === ">" && (n--, n === 0)) break;
	} else if (e.length > t + 9 && e[t + 1] === "[" && e[t + 2] === "C" && e[t + 3] === "D" && e[t + 4] === "A" && e[t + 5] === "T" && e[t + 6] === "A" && e[t + 7] === "[") {
		for (t += 8; t < e.length; t++) if (e[t] === "]" && e[t + 1] === "]" && e[t + 2] === ">") {
			t += 2;
			break;
		}
	}
	return t;
}
var nt = "\"";
var rt = "'";
function it(e, t) {
	let n = "", r = "", i = !1;
	for (; t < e.length; t++) {
		if (e[t] === nt || e[t] === rt) r === "" ? r = e[t] : r !== e[t] || (r = "");
		else if (e[t] === ">" && r === "") {
			i = !0;
			break;
		}
		n += e[t];
	}
	return r === "" && {
		value: n,
		index: t,
		tagClosed: i
	};
}
var at = /* @__PURE__ */ RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");
function ot(e, t) {
	let n = Ke(e, at), r = {};
	for (let e = 0; e < n.length; e++) {
		if (n[e][1].length === 0) return N("InvalidAttr", "Attribute '" + n[e][2] + "' has no space in starting.", dt(n[e]));
		if (n[e][3] !== void 0 && n[e][4] === void 0) return N("InvalidAttr", "Attribute '" + n[e][2] + "' is without value.", dt(n[e]));
		if (n[e][3] === void 0 && !t.allowBooleanAttributes) return N("InvalidAttr", "boolean attribute '" + n[e][2] + "' is not allowed.", dt(n[e]));
		let i = n[e][2];
		if (!lt(i)) return N("InvalidAttr", "Attribute '" + i + "' is an invalid name.", dt(n[e]));
		if (!Object.prototype.hasOwnProperty.call(r, i)) r[i] = 1;
		else return N("InvalidAttr", "Attribute '" + i + "' is repeated.", dt(n[e]));
	}
	return !0;
}
function st(e, t) {
	let n = /\d/;
	for (e[t] === "x" && (t++, n = /[\da-fA-F]/); t < e.length; t++) {
		if (e[t] === ";") return t;
		if (!e[t].match(n)) break;
	}
	return -1;
}
function ct(e, t) {
	if (t++, e[t] === ";") return -1;
	if (e[t] === "#") return t++, st(e, t);
	let n = 0;
	for (; t < e.length; t++, n++) if (!(e[t].match(/\w/) && n < 20)) {
		if (e[t] === ";") break;
		return -1;
	}
	return t;
}
function N(e, t, n) {
	return { err: {
		code: e,
		msg: t,
		line: n.line || n,
		col: n.col
	} };
}
function lt(e) {
	return qe(e);
}
function ut(e) {
	return qe(e);
}
function P(e, t) {
	let n = e.substring(0, t).split(/\r?\n/);
	return {
		line: n.length,
		col: n[n.length - 1].length + 1
	};
}
function dt(e) {
	return e.startIndex + e[1].length;
}
var ft = {
	cent: "¢",
	pound: "£",
	curren: "¤",
	yen: "¥",
	euro: "€",
	dollar: "$",
	fnof: "ƒ",
	inr: "₹",
	af: "؋",
	birr: "ብር",
	peso: "₱",
	rub: "₽",
	won: "₩",
	yuan: "¥",
	cedil: "¸"
};
var pt = {
	amp: "&",
	apos: "'",
	gt: ">",
	lt: "<",
	quot: "\""
};
var mt = {
	nbsp: "\xA0",
	copy: "©",
	reg: "®",
	trade: "™",
	mdash: "—",
	ndash: "–",
	hellip: "…",
	laquo: "«",
	raquo: "»",
	lsquo: "‘",
	rsquo: "’",
	ldquo: "“",
	rdquo: "”",
	bull: "•",
	para: "¶",
	sect: "§",
	deg: "°",
	frac12: "½",
	frac14: "¼",
	frac34: "¾"
};
var ht = Object.freeze({
	ALLOW: "allow",
	BLOCK: "block",
	THROW: "throw"
});
var gt = /* @__PURE__ */ new Set("!?\\\\/[]$%{}^&*()<>|+");
function _t(e) {
	if (e[0] === "#") throw Error(`[EntityReplacer] Invalid character '#' in entity name: "${e}"`);
	for (let t of e) if (gt.has(t)) throw Error(`[EntityReplacer] Invalid character '${t}' in entity name: "${e}"`);
	return e;
}
function vt(...e) {
	let t = Object.create(null);
	for (let n of e) if (n) for (let e of Object.keys(n)) {
		let r = n[e];
		if (typeof r == "string") t[e] = r;
		else if (r && typeof r == "object" && r.val !== void 0) {
			let n = r.val;
			typeof n == "string" && (t[e] = n);
		}
	}
	return t;
}
var yt = "external";
var bt = "base";
var xt = "all";
function St(e) {
	return !e || e === yt ? /* @__PURE__ */ new Set([yt]) : e === xt ? /* @__PURE__ */ new Set([xt]) : e === bt ? /* @__PURE__ */ new Set([bt]) : Array.isArray(e) ? new Set(e) : /* @__PURE__ */ new Set([yt]);
}
var Ct = Object.freeze({
	allow: 0,
	leave: 1,
	remove: 2,
	throw: 3
});
var wt = /* @__PURE__ */ new Set([
	9,
	10,
	13
]);
function Tt(e) {
	if (!e) return {
		xmlVersion: 1,
		onLevel: Ct.allow,
		nullLevel: Ct.remove
	};
	let t = e.xmlVersion === 1.1 ? 1.1 : 1, n = Ct[e.onNCR] ?? Ct.allow, r = Ct[e.nullNCR] ?? Ct.remove;
	return {
		xmlVersion: t,
		onLevel: n,
		nullLevel: Math.max(r, Ct.remove)
	};
}
var Et = class {
	constructor(e = {}) {
		this._limit = e.limit || {}, this._maxTotalExpansions = this._limit.maxTotalExpansions || 0, this._maxExpandedLength = this._limit.maxExpandedLength || 0, this._postCheck = typeof e.postCheck == "function" ? e.postCheck : (e) => e, this._limitTiers = St(this._limit.applyLimitsTo ?? yt), this._numericAllowed = e.numericAllowed ?? !0, this._baseMap = vt(pt, e.namedEntities || null), this._externalMap = Object.create(null), this._inputMap = Object.create(null), this._totalExpansions = 0, this._expandedLength = 0, this._removeSet = new Set(e.remove && Array.isArray(e.remove) ? e.remove : []), this._leaveSet = new Set(e.leave && Array.isArray(e.leave) ? e.leave : []);
		let t = Tt(e.ncr);
		this._ncrXmlVersion = t.xmlVersion, this._ncrOnLevel = t.onLevel, this._ncrNullLevel = t.nullLevel, this._onExternalEntity = typeof e.onExternalEntity == "function" ? e.onExternalEntity : null, this._onInputEntity = typeof e.onInputEntity == "function" ? e.onInputEntity : null;
	}
	_applyRegistrationHook(e, t, n, r) {
		if (!e) return !0;
		let i = e(t, n);
		if (i === ht.BLOCK) return !1;
		if (i === ht.THROW) throw Error(`[EntityDecoder] Registration of ${r} entity "&${t};" was rejected by hook`);
		return !0;
	}
	setExternalEntities(e) {
		if (e) for (let t of Object.keys(e)) _t(t);
		if (!this._onExternalEntity) {
			this._externalMap = vt(e);
			return;
		}
		let t = vt(e), n = Object.create(null);
		for (let [e, r] of Object.entries(t)) this._applyRegistrationHook(this._onExternalEntity, e, r, "external") && (n[e] = r);
		this._externalMap = n;
	}
	addExternalEntity(e, t) {
		_t(e), typeof t == "string" && t.indexOf("&") === -1 && this._applyRegistrationHook(this._onExternalEntity, e, t, "external") && (this._externalMap[e] = t);
	}
	addInputEntities(e) {
		if (this._totalExpansions = 0, this._expandedLength = 0, !this._onInputEntity) {
			this._inputMap = vt(e);
			return;
		}
		let t = vt(e), n = Object.create(null);
		for (let [e, r] of Object.entries(t)) this._applyRegistrationHook(this._onInputEntity, e, r, "input") && (n[e] = r);
		this._inputMap = n;
	}
	reset() {
		return this._inputMap = Object.create(null), this._totalExpansions = 0, this._expandedLength = 0, this;
	}
	setXmlVersion(e) {
		this._ncrXmlVersion = e === 1.1 ? 1.1 : 1;
	}
	decode(e) {
		if (typeof e != "string" || e.length === 0 || e.indexOf("&") === -1) return e;
		let t = e, n = [], r = e.length, i = 0, a = 0, o = this._maxTotalExpansions > 0, s = this._maxExpandedLength > 0, c = o || s;
		for (; a < r;) {
			if (e.charCodeAt(a) !== 38) {
				a++;
				continue;
			}
			let t = a + 1;
			for (; t < r && e.charCodeAt(t) !== 59 && t - a <= 32;) t++;
			if (t >= r || e.charCodeAt(t) !== 59) {
				a++;
				continue;
			}
			let l = e.slice(a + 1, t);
			if (l.length === 0) {
				a++;
				continue;
			}
			let u, d;
			if (this._removeSet.has(l)) u = "", d === void 0 && (d = yt);
			else if (this._leaveSet.has(l)) {
				a++;
				continue;
			} else if (l.charCodeAt(0) === 35) {
				let e = this._resolveNCR(l);
				if (e === void 0) {
					a++;
					continue;
				}
				u = e, d = bt;
			} else {
				let e = this._resolveName(l);
				u = e?.value, d = e?.tier;
			}
			if (u === void 0) {
				a++;
				continue;
			}
			if (a > i && n.push(e.slice(i, a)), n.push(u), i = t + 1, a = i, c && this._tierCounts(d)) {
				if (o && (this._totalExpansions++, this._totalExpansions > this._maxTotalExpansions)) throw Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);
				if (s) {
					let e = u.length - (l.length + 2);
					if (e > 0 && (this._expandedLength += e, this._expandedLength > this._maxExpandedLength)) throw Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`);
				}
			}
		}
		i < r && n.push(e.slice(i));
		let l = n.length === 0 ? e : n.join("");
		return this._postCheck(l, t);
	}
	_tierCounts(e) {
		return this._limitTiers.has(xt) ? !0 : this._limitTiers.has(e);
	}
	_resolveName(e) {
		if (e in this._inputMap) return {
			value: this._inputMap[e],
			tier: yt
		};
		if (e in this._externalMap) return {
			value: this._externalMap[e],
			tier: yt
		};
		if (e in this._baseMap) return {
			value: this._baseMap[e],
			tier: bt
		};
	}
	_classifyNCR(e) {
		return e === 0 ? this._ncrNullLevel : e >= 55296 && e <= 57343 || this._ncrXmlVersion === 1 && e >= 1 && e <= 31 && !wt.has(e) ? Ct.remove : -1;
	}
	_applyNCRAction(e, t, n) {
		switch (e) {
			case Ct.allow: return String.fromCodePoint(n);
			case Ct.remove: return "";
			case Ct.leave: return;
			case Ct.throw: throw Error(`[EntityDecoder] Prohibited numeric character reference &${t}; (U+${n.toString(16).toUpperCase().padStart(4, "0")})`);
			default: return String.fromCodePoint(n);
		}
	}
	_resolveNCR(e) {
		let t = e.charCodeAt(1), n;
		if (n = t === 120 || t === 88 ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10), Number.isNaN(n) || n < 0 || n > 1114111) return;
		let r = this._classifyNCR(n);
		if (!this._numericAllowed && r < Ct.remove) return;
		let i = r === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, r);
		return this._applyNCRAction(i, e, n);
	}
};
var Dt = (e) => Ye.includes(e) ? "__" + e : e;
var Ot = {
	preserveOrder: !1,
	attributeNamePrefix: "@_",
	attributesGroupName: !1,
	textNodeName: "#text",
	ignoreAttributes: !0,
	removeNSPrefix: !1,
	allowBooleanAttributes: !1,
	parseTagValue: !0,
	parseAttributeValue: !1,
	trimValues: !0,
	cdataPropName: !1,
	numberParseOptions: {
		hex: !0,
		leadingZeros: !0,
		eNotation: !0,
		unicode: !1
	},
	tagValueProcessor: function(e, t) {
		return t;
	},
	attributeValueProcessor: function(e, t) {
		return t;
	},
	stopNodes: [],
	alwaysCreateTextNode: !1,
	isArray: () => !1,
	commentPropName: !1,
	unpairedTags: [],
	processEntities: !0,
	htmlEntities: !1,
	entityDecoder: null,
	ignoreDeclaration: !1,
	ignorePiTags: !1,
	transformTagName: !1,
	transformAttributeName: !1,
	updateTag: function(e, t, n) {
		return e;
	},
	captureMetaData: !1,
	maxNestedTags: 100,
	strictReservedNames: !0,
	jPath: !0,
	onDangerousProperty: Dt
};
function kt(e, t) {
	if (typeof e != "string") return;
	let n = e.toLowerCase();
	if (Ye.some((e) => n === e.toLowerCase()) || Xe.some((e) => n === e.toLowerCase())) throw Error(`[SECURITY] Invalid ${t}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`);
}
function At(e, t) {
	return typeof e == "boolean" ? {
		enabled: e,
		maxEntitySize: 1e4,
		maxExpansionDepth: 1e4,
		maxTotalExpansions: Infinity,
		maxExpandedLength: 1e5,
		maxEntityCount: 1e3,
		allowedTags: null,
		tagFilter: null,
		appliesTo: "all"
	} : typeof e == "object" && e ? {
		enabled: e.enabled !== !1,
		maxEntitySize: Math.max(1, e.maxEntitySize ?? 1e4),
		maxExpansionDepth: Math.max(1, e.maxExpansionDepth ?? 1e4),
		maxTotalExpansions: Math.max(1, e.maxTotalExpansions ?? Infinity),
		maxExpandedLength: Math.max(1, e.maxExpandedLength ?? 1e5),
		maxEntityCount: Math.max(1, e.maxEntityCount ?? 1e3),
		allowedTags: e.allowedTags ?? null,
		tagFilter: e.tagFilter ?? null,
		appliesTo: e.appliesTo ?? "all"
	} : At(!0);
}
var jt = function(e) {
	let t = Object.assign({}, Ot, e), n = [
		{
			value: t.attributeNamePrefix,
			name: "attributeNamePrefix"
		},
		{
			value: t.attributesGroupName,
			name: "attributesGroupName"
		},
		{
			value: t.textNodeName,
			name: "textNodeName"
		},
		{
			value: t.cdataPropName,
			name: "cdataPropName"
		},
		{
			value: t.commentPropName,
			name: "commentPropName"
		}
	];
	for (let { value: e, name: t } of n) e && kt(e, t);
	return t.onDangerousProperty === null && (t.onDangerousProperty = Dt), t.processEntities = At(t.processEntities, t.htmlEntities), t.unpairedTagsSet = new Set(t.unpairedTags), t.stopNodes && Array.isArray(t.stopNodes) && (t.stopNodes = t.stopNodes.map((e) => typeof e == "string" && e.startsWith("*.") ? ".." + e.substring(2) : e)), t;
};
var Mt = typeof Symbol == "function" ? Symbol("XML Node Metadata") : "@@xmlMetadata";
var Nt = class {
	constructor(e) {
		this.tagname = e, this.child = [], this[":@"] = Object.create(null);
	}
	add(e, t) {
		e === "__proto__" && (e = "#__proto__"), this.child.push({ [e]: t });
	}
	addChild(e, t) {
		e.tagname === "__proto__" && (e.tagname = "#__proto__"), e[":@"] && Object.keys(e[":@"]).length > 0 ? this.child.push({
			[e.tagname]: e.child,
			":@": e[":@"]
		}) : this.child.push({ [e.tagname]: e.child }), this.addStartIndex(t);
	}
	addStartIndex(e) {
		e !== void 0 && (this.child[this.child.length - 1][Mt] = { startIndex: e });
	}
	addEndIndex(e) {
		let t = this.child[this.child.length - 1];
		t !== void 0 && t[Mt] !== void 0 && t[Mt].endIndex === void 0 && (t[Mt].endIndex = e);
	}
	static getMetaDataSymbol() {
		return Mt;
	}
};
var Pt = class {
	constructor(e, t) {
		this.suppressValidationErr = !e, this.options = e, this.xmlVersion = t || 1;
	}
	setXmlVersion(e = 1) {
		this.xmlVersion = e;
	}
	readDocType(e, t) {
		let n = Object.create(null), r = 0;
		if (e[t + 3] === "O" && e[t + 4] === "C" && e[t + 5] === "T" && e[t + 6] === "Y" && e[t + 7] === "P" && e[t + 8] === "E") {
			t += 9;
			let i = 1, a = !1, o = !1, s = null, c = "";
			for (; t < e.length; t++) {
				if (s !== null) {
					e[t] === s && (s = null), c += e[t];
					continue;
				}
				if (!a && !o && (e[t] === "\"" || e[t] === "'")) {
					s = e[t], c += e[t];
					continue;
				}
				if (e[t] === "<" && !o) {
					if (a && It(e, "!ENTITY", t)) {
						t += 7;
						let i, a;
						if ([i, a, t] = this.readEntityExp(e, t + 1, this.suppressValidationErr), a.indexOf("&") === -1) {
							if (this.options.enabled !== !1 && this.options.maxEntityCount != null && r >= this.options.maxEntityCount) throw Error(`Entity count (${r + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
							n[i] = a, r++;
						}
					} else if (a && It(e, "!ELEMENT", t)) {
						t += 8;
						let { index: n } = this.readElementExp(e, t + 1);
						t = n;
					} else if (a && It(e, "!ATTLIST", t)) t += 8;
					else if (a && It(e, "!NOTATION", t)) {
						t += 9;
						let { index: n } = this.readNotationExp(e, t + 1, this.suppressValidationErr);
						t = n;
					} else if (It(e, "!--", t)) o = !0;
					else throw Error("Invalid DOCTYPE");
					i++, c = "";
				} else if (e[t] === ">") {
					if (o ? e[t - 1] === "-" && e[t - 2] === "-" && (o = !1, i--) : i--, i === 0) break;
				} else e[t] === "[" ? a = !0 : c += e[t];
			}
			if (s !== null || i !== 0) throw Error("Unclosed DOCTYPE");
		} else throw Error("Invalid Tag instead of DOCTYPE");
		return {
			entities: n,
			i: t
		};
	}
	readEntityExp(e, t) {
		t = Ft(e, t);
		let n = t;
		for (; t < e.length && !/\s/.test(e[t]) && e[t] !== "\"" && e[t] !== "'";) t++;
		let r = e.substring(n, t);
		if (Lt(r, { xmlVersion: this.xmlVersion }), t = Ft(e, t), !this.suppressValidationErr) {
			if (e.substring(t, t + 6).toUpperCase() === "SYSTEM") throw Error("External entities are not supported");
			if (e[t] === "%") throw Error("Parameter entities are not supported");
		}
		let i = "";
		if ([t, i] = this.readIdentifierVal(e, t, "entity"), this.options.enabled !== !1 && this.options.maxEntitySize != null && i.length > this.options.maxEntitySize) throw Error(`Entity "${r}" size (${i.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
		return t--, [
			r,
			i,
			t
		];
	}
	readNotationExp(e, t) {
		t = Ft(e, t);
		let n = t;
		for (; t < e.length && !/\s/.test(e[t]);) t++;
		let r = e.substring(n, t);
		!this.suppressValidationErr && Lt(r, { xmlVersion: this.xmlVersion }), t = Ft(e, t);
		let i = e.substring(t, t + 6).toUpperCase();
		if (!this.suppressValidationErr && i !== "SYSTEM" && i !== "PUBLIC") throw Error(`Expected SYSTEM or PUBLIC, found "${i}"`);
		t += i.length, t = Ft(e, t);
		let a = null, o = null;
		if (i === "PUBLIC") [t, a] = this.readIdentifierVal(e, t, "publicIdentifier"), t = Ft(e, t), (e[t] === "\"" || e[t] === "'") && ([t, o] = this.readIdentifierVal(e, t, "systemIdentifier"));
		else if (i === "SYSTEM" && ([t, o] = this.readIdentifierVal(e, t, "systemIdentifier"), !this.suppressValidationErr && !o)) throw Error("Missing mandatory system identifier for SYSTEM notation");
		return {
			notationName: r,
			publicIdentifier: a,
			systemIdentifier: o,
			index: --t
		};
	}
	readIdentifierVal(e, t, n) {
		let r = "", i = e[t];
		if (i !== "\"" && i !== "'") throw Error(`Expected quoted string, found "${i}"`);
		t++;
		let a = t;
		for (; t < e.length && e[t] !== i;) t++;
		if (r = e.substring(a, t), e[t] !== i) throw Error(`Unterminated ${n} value`);
		return t++, [t, r];
	}
	readElementExp(e, t) {
		t = Ft(e, t);
		let n = t;
		for (; t < e.length && !/\s/.test(e[t]);) t++;
		let r = e.substring(n, t);
		if (!this.suppressValidationErr && !be(r, { xmlVersion: this.xmlVersion })) throw Error(`Invalid element name: "${r}"`);
		t = Ft(e, t);
		let i = "";
		if (e[t] === "E" && It(e, "MPTY", t)) t += 4;
		else if (e[t] === "A" && It(e, "NY", t)) t += 2;
		else if (e[t] === "(") {
			t++;
			let n = t;
			for (; t < e.length && e[t] !== ")";) t++;
			if (i = e.substring(n, t), e[t] !== ")") throw Error("Unterminated content model");
		} else if (!this.suppressValidationErr) throw Error(`Invalid Element Expression, found "${e[t]}"`);
		return {
			elementName: r,
			contentModel: i.trim(),
			index: t
		};
	}
	readAttlistExp(e, t) {
		t = Ft(e, t);
		let n = t;
		for (; t < e.length && !/\s/.test(e[t]);) t++;
		let r = e.substring(n, t);
		for (Lt(r, { xmlVersion: this.xmlVersion }), t = Ft(e, t), n = t; t < e.length && !/\s/.test(e[t]);) t++;
		let i = e.substring(n, t);
		if (!Lt(i, { xmlVersion: this.xmlVersion })) throw Error(`Invalid attribute name: "${i}"`);
		t = Ft(e, t);
		let a = "";
		if (e.substring(t, t + 8).toUpperCase() === "NOTATION") {
			if (a = "NOTATION", t += 8, t = Ft(e, t), e[t] !== "(") throw Error(`Expected '(', found "${e[t]}"`);
			t++;
			let n = [];
			for (; t < e.length && e[t] !== ")";) {
				let r = t;
				for (; t < e.length && e[t] !== "|" && e[t] !== ")";) t++;
				let i = e.substring(r, t);
				if (i = i.trim(), !Lt(i, { xmlVersion: this.xmlVersion })) throw Error(`Invalid notation name: "${i}"`);
				n.push(i), e[t] === "|" && (t++, t = Ft(e, t));
			}
			if (e[t] !== ")") throw Error("Unterminated list of notations");
			t++, a += " (" + n.join("|") + ")";
		} else {
			let n = t;
			for (; t < e.length && !/\s/.test(e[t]);) t++;
			if (a += e.substring(n, t), !this.suppressValidationErr && ![
				"CDATA",
				"ID",
				"IDREF",
				"IDREFS",
				"ENTITY",
				"ENTITIES",
				"NMTOKEN",
				"NMTOKENS"
			].includes(a.toUpperCase())) throw Error(`Invalid attribute type: "${a}"`);
		}
		t = Ft(e, t);
		let o = "";
		return e.substring(t, t + 8).toUpperCase() === "#REQUIRED" ? (o = "#REQUIRED", t += 8) : e.substring(t, t + 7).toUpperCase() === "#IMPLIED" ? (o = "#IMPLIED", t += 7) : [t, o] = this.readIdentifierVal(e, t, "ATTLIST"), {
			elementName: r,
			attributeName: i,
			attributeType: a,
			defaultValue: o,
			index: t
		};
	}
};
var Ft = (e, t) => {
	for (; t < e.length && /\s/.test(e[t]);) t++;
	return t;
};
function It(e, t, n) {
	for (let r = 0; r < t.length; r++) if (t[r] !== e[n + r + 1]) return !1;
	return !0;
}
function Lt(e, t) {
	if (be(e, { xmlVersion: t })) return e;
	throw Error(`Invalid entity name ${e}`);
}
var Rt = [
	48,
	1632,
	1776,
	2406,
	2534,
	2662,
	2790,
	2918,
	3046,
	3174,
	3302,
	3430,
	3558,
	3664,
	3792,
	3872,
	4160,
	4240,
	6112,
	6160,
	6470,
	6608,
	6784,
	6800,
	6992,
	7088,
	7232,
	7248,
	65296,
	120782,
	120792,
	120802,
	120812,
	120822,
	66720,
	68912,
	69734,
	69872,
	69942,
	70096,
	70384,
	70736,
	70864,
	71248,
	71360,
	71472,
	71904,
	72016,
	72688,
	72784,
	73040,
	73120,
	73552,
	92768,
	92864,
	93008,
	123200,
	123632,
	124144,
	125264,
	130032
];
var zt = /* @__PURE__ */ new Map();
var Bt = 65535;
var Vt = 1632;
var Ht = (/* @__PURE__ */ new Uint8Array(63904)).fill(255);
for (let e of Rt) for (let t = 0; t < 10; t++) {
	let n = e + t;
	n <= Bt ? Ht[n - Vt] = t : zt.set(n, t);
}
var Ut = 48;
var Wt = 57;
var Gt = 45;
var Kt = /* @__PURE__ */ new Set([
	8722,
	65293,
	65123
]);
function qt(e) {
	if (typeof e != "string") return e;
	let t = e.length;
	if (t === 0) return e;
	let n = -1;
	for (let r = 0; r < t; r++) {
		let i = e.charCodeAt(r);
		if (!(i >= Ut && i <= Wt || i === Gt)) {
			if (i < 1632) {
				if (Kt.has(i)) {
					n = r;
					break;
				}
				continue;
			}
			if (i >= 55296 && i <= 56319) {
				if (r + 1 < t) {
					let t = e.charCodeAt(r + 1);
					if (t >= 56320 && t <= 57343) {
						let e = 65536 + (i - 55296 << 10) + (t - 56320);
						if (zt.has(e)) {
							n = r;
							break;
						}
					}
				}
				continue;
			}
			if (Ht[i - 1632] !== 255 || Kt.has(i)) {
				n = r;
				break;
			}
		}
	}
	if (n === -1) return e;
	let r = [];
	n > 0 && r.push(e.slice(0, n));
	for (let i = n; i < t; i++) {
		let n = e.charCodeAt(i);
		if (n >= Ut && n <= Wt || n === Gt) {
			r.push(e[i]);
			continue;
		}
		if (n < 1632) {
			r.push(Kt.has(n) ? "-" : e[i]);
			continue;
		}
		if (n >= 55296 && n <= 56319) {
			if (i + 1 < t) {
				let t = e.charCodeAt(i + 1);
				if (t >= 56320 && t <= 57343) {
					let e = 65536 + (n - 55296 << 10) + (t - 56320), a = zt.get(e);
					if (a !== void 0) {
						r.push(String.fromCharCode(a + 48)), i++;
						continue;
					}
				}
			}
			r.push(e[i]);
			continue;
		}
		if (Kt.has(n)) {
			r.push("-");
			continue;
		}
		let a = Ht[n - Vt];
		r.push(a === 255 ? e[i] : String.fromCharCode(a + 48));
	}
	return r.join("");
}
var Jt = /^[-+]?0x[a-fA-F0-9]+$/;
var Yt = /^0b[01]+$/;
var Xt = /^0o[0-7]+$/;
var Zt = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
var Qt = {
	hex: !0,
	binary: !1,
	octal: !1,
	leadingZeros: !0,
	decimalPoint: ".",
	eNotation: !0,
	infinity: "original",
	unicode: !1
};
function $t(e, t = {}) {
	if (t = Object.assign({}, Qt, t), !e || typeof e != "string") return e;
	let n = e.trim();
	if (n.length === 0 || t.skipLike !== void 0 && t.skipLike.test(n)) return e;
	if (n === "0" || t.unicode && (n = qt(n), n === "0")) return 0;
	if (t.hex && Jt.test(n)) return rn(n, 16);
	if (t.binary && Yt.test(n)) return rn(n, 2);
	if (t.octal && Xt.test(n)) return rn(n, 8);
	if (!isFinite(n)) return an(e, Number(n), t);
	if (n.includes("e") || n.includes("E")) return tn(e, n, t);
	{
		let r = Zt.exec(n);
		if (r) {
			let i = r[1] || "", a = r[2], o = nn(r[3]), s = i ? e[a.length + 1] === "." : e[a.length] === ".";
			if (!t.leadingZeros && (a.length > 1 || a.length === 1 && !s)) return e;
			{
				let r = Number(n), s = String(r);
				if (r === 0) return r;
				if (s.search(/[eE]/) !== -1) return t.eNotation ? r : e;
				if (n.indexOf(".") !== -1) return s === "0" || s === o || s === `${i}${o}` ? r : e;
				let c = a ? o : n;
				return a ? c === s || i + c === s ? r : e : c === s || c === i + s ? r : e;
			}
		}
		return e;
	}
}
var en = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function tn(e, t, n) {
	if (!n.eNotation) return e;
	let r = t.match(en);
	if (r) {
		let i = r[1] || "", a = r[3].indexOf("e") === -1 ? "E" : "e", o = r[2], s = i ? e[o.length + 1] === a : e[o.length] === a;
		return o.length > 1 && s ? e : o.length === 1 && (r[3].startsWith(`.${a}`) || r[3][0] === a) ? Number(t) : o.length > 0 ? n.leadingZeros && !s ? (t = (r[1] || "") + r[3], Number(t)) : e : Number(t);
	}
	return e;
}
function nn(e) {
	if (e && e.indexOf(".") !== -1) {
		let t = e.length;
		for (; t > 0 && e.charCodeAt(t - 1) === 48;) t--;
		return e = e.slice(0, t), e === "." ? e = "0" : e[0] === "." ? e = "0" + e : e[e.length - 1] === "." && (e = e.substring(0, e.length - 1)), e;
	}
	return e;
}
function rn(e, t) {
	let n = e.trim();
	if ((t === 2 || t === 8) && (e = n.substring(2)), parseInt) return parseInt(e, t);
	if (Number.parseInt) return Number.parseInt(e, t);
	if (window && window.parseInt) return window.parseInt(e, t);
	throw Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
function an(e, t, n) {
	let r = t === Infinity;
	switch (n.infinity.toLowerCase()) {
		case "null": return null;
		case "infinity": return t;
		case "string": return r ? "Infinity" : "-Infinity";
		default: return e;
	}
}
function on(e) {
	return typeof e == "function" ? e : Array.isArray(e) ? (t) => {
		for (let n of e) if (typeof n == "string" && t === n || n instanceof RegExp && n.test(t)) return !0;
	} : () => !1;
}
var sn = [
	{
		id: "html-script-open",
		description: "<script opening tag",
		pattern: /<script[\s>/]/i
	},
	{
		id: "html-script-close",
		description: "<\/script closing tag",
		pattern: /<\/script[\s>]/i
	},
	{
		id: "html-javascript-protocol",
		description: "javascript: URI scheme (with optional whitespace/encoding)",
		pattern: /j[\t\n\r ]*a[\t\n\r ]*v[\t\n\r ]*a[\t\n\r ]*s[\t\n\r ]*c[\t\n\r ]*r[\t\n\r ]*i[\t\n\r ]*p[\t\n\r ]*t[\t\n\r ]*:/i
	},
	{
		id: "html-vbscript-protocol",
		description: "vbscript: URI scheme",
		pattern: /vbscript[\t\n\r ]*:/i
	},
	{
		id: "html-data-html",
		description: "data:text/html URI — can execute scripts in browsers",
		pattern: /data[\t\n\r ]*:[\t\n\r ]*text\/html/i
	},
	{
		id: "html-data-xhtml",
		description: "data:application/xhtml+xml URI",
		pattern: /data[\t\n\r ]*:[\t\n\r ]*application\/xhtml/i
	},
	{
		id: "html-data-svg",
		description: "data:image/svg+xml URI — can execute scripts",
		pattern: /data[\t\n\r ]*:[\t\n\r ]*image\/svg\+xml/i
	},
	{
		id: "html-inline-event-handler",
		description: "Inline event handler attributes: onclick=, onerror=, onload=, etc.",
		pattern: /\bon\w{1,30}\s*=/i
	},
	{
		id: "html-entity-obfuscated-script",
		description: "HTML-entity-encoded <script (e.g. &#x3C;script or &lt;script)",
		pattern: /(?:&#x0*3[Cc];?|&#0*60;?|&lt;)\s*script/i
	},
	{
		id: "html-entity-obfuscated-javascript",
		description: "HTML-entity-encoded javascript: (partial — catches common &#106; or &#x6a; for \"j\")",
		pattern: /(?:&#x0*6[Aa];?|&#0*106;?)\s*(?:&#x0*61;?|a)[\s\S]{0,80}script\s*:/i
	},
	{
		id: "html-style-expression",
		description: "CSS expression() — IE-era code execution in style attributes",
		pattern: /style[\s\S]{0,20}expression\s*\(/i
	},
	{
		id: "html-object-embed",
		description: "<object or <embed tags that can load active content",
		pattern: /<(?:object|embed)[\s>/]/i
	},
	{
		id: "html-base-tag",
		description: "<base href= — can hijack all relative URLs on a page",
		pattern: /<base[\s>]/i
	},
	{
		id: "html-meta-refresh",
		description: "<meta http-equiv=\"refresh\" — can redirect users",
		pattern: /<meta[\s\S]{0,40}http-equiv[\s\S]{0,20}refresh/i
	},
	{
		id: "html-srcdoc",
		description: "srcdoc= attribute on iframes — embeds HTML that can run scripts",
		pattern: /srcdoc\s*=/i
	},
	{
		id: "html-iframe",
		description: "<iframe tag",
		pattern: /<iframe[\s>/]/i
	},
	{
		id: "html-form",
		description: "<form tag — can be used for phishing / credential harvesting injection",
		pattern: /<form[\s>/]/i
	}
];
var cn = [
	{
		id: "xml-cdata-injection",
		description: "CDATA section injection: <![CDATA[ breaks out of text node context",
		pattern: /<!\[CDATA\[/i
	},
	{
		id: "xml-cdata-close",
		description: "CDATA close sequence: ]]> can terminate an enclosing CDATA section",
		pattern: /\]\]>/
	},
	{
		id: "xml-processing-instruction",
		description: "XML processing instruction: <?xml-stylesheet or <?php etc.",
		pattern: /<\?(?:xml[\- ]|php|asp)/i
	},
	{
		id: "xml-doctype-injection",
		description: "DOCTYPE declaration embedded in content — can define entities",
		pattern: /<!DOCTYPE(?:[\s[]|$)/i
	},
	{
		id: "xml-entity-system",
		description: "SYSTEM keyword — used in external entity declarations (XXE)",
		pattern: /\bSYSTEM\s+["']/i
	},
	{
		id: "xml-entity-public",
		description: "PUBLIC keyword — used in external entity declarations (XXE)",
		pattern: /\bPUBLIC\s+["']/i
	},
	{
		id: "xml-entity-declaration",
		description: "<!ENTITY declaration — defines entities, potential XXE or entity expansion",
		pattern: /<!ENTITY[\s%]/i
	},
	{
		id: "xml-billion-laughs",
		description: "Entity reference chaining / billion laughs: repeated &eX; style references",
		pattern: /(?:&\w{1,20};){3,}/
	},
	{
		id: "xml-namespace-confusion",
		description: "xmlns: attribute injection — can redefine namespaces to confuse parsers",
		pattern: /\bxmlns(?::\w{1,40})?\s*=/i
	},
	{
		id: "xml-comment-injection",
		description: "<!-- comment injection — can hide content from some parsers",
		pattern: /<!--/
	},
	{
		id: "xml-comment-close",
		description: "--> closes an enclosing XML comment",
		pattern: /-->/
	},
	{
		id: "xml-pi-close",
		description: "?> closes an enclosing processing instruction",
		pattern: /\?>/
	}
];
var ln = [
	{
		id: "svg-script-element",
		description: "<script element inside SVG executes JavaScript",
		pattern: /<script[\s>/]/i
	},
	{
		id: "svg-xlink-href-javascript",
		description: "xlink:href with javascript: — classic SVG XSS via <a> or <use>",
		pattern: /xlink\s*:\s*href\s*=\s*["']?\s*javascript\s*:/i
	},
	{
		id: "svg-href-javascript",
		description: "href= with javascript: in SVG context (<a>, <animate>, etc.)",
		pattern: /href\s*=\s*["']?\s*javascript\s*:/i
	},
	{
		id: "svg-foreignobject",
		description: "<foreignObject embeds HTML inside SVG — can execute scripts",
		pattern: /<foreignObject[\s>/]/i
	},
	{
		id: "svg-use-external",
		description: "<use xlink:href or href pointing to external resource (non-fragment URL)",
		pattern: /<use[\s\S]{0,60}(?:xlink\s*:\s*)?href\s*=\s*(?:["'][^#]|[^"'#\s>])/i
	},
	{
		id: "svg-animate-href",
		description: "<animate attributeName=\"href\" — can dynamically change href to javascript:",
		pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*href["']/i
	},
	{
		id: "svg-animate-xlinkhref",
		description: "<animate attributeName=\"xlink:href\"",
		pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*xlink\s*:\s*href["']/i
	},
	{
		id: "svg-set-javascript",
		description: "<set to=\"javascript:...\" — sets an attribute to a javascript: URI",
		pattern: /<set[\s\S]{0,80}to\s*=\s*["']?\s*javascript\s*:/i
	},
	{
		id: "svg-event-handler",
		description: "SVG-specific event handler attributes: onload=, onerror=, onactivate=, etc.",
		pattern: /\bon(?:load|error|activate|begin|end|repeat|focus|blur|click|mouse\w{1,20}|key\w{1,20})\s*=/i
	},
	{
		id: "svg-handler-generic",
		description: "Generic on* handler catch-all for SVG attributes",
		pattern: /\bon\w{1,30}\s*=/i
	},
	{
		id: "svg-filter-feimage",
		description: "<feImage href= — filter primitive that can load external resources",
		pattern: /<feImage[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=/i
	},
	{
		id: "svg-image-external",
		description: "<image xlink:href with http/https or javascript protocol",
		pattern: /<image[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=\s*["']?\s*(?:https?|javascript)\s*:/i
	},
	{
		id: "svg-style-javascript",
		description: "style= attribute containing javascript: (e.g. background:url(javascript:...))",
		pattern: /style\s*=[\s\S]{0,60}javascript\s*:/i
	}
];
var un = [
	{
		id: "sql-block-comment-open",
		description: "SQL block comment open: /* ... */ — unusual in legitimate user text",
		pattern: /\/\*/
	},
	{
		id: "sql-union-select",
		description: "UNION SELECT — most common SQL injection aggregation attack",
		pattern: /\bUNION\s{1,20}(?:ALL\s{1,20})?SELECT\b/i
	},
	{
		id: "sql-drop-table",
		description: "DROP TABLE — destructive DDL injection",
		pattern: /\bDROP\s{1,20}TABLE\b/i
	},
	{
		id: "sql-drop-database",
		description: "DROP DATABASE — destructive DDL injection",
		pattern: /\bDROP\s{1,20}DATABASE\b/i
	},
	{
		id: "sql-insert-into",
		description: "INSERT INTO — data injection",
		pattern: /\bINSERT\s{1,20}INTO\b/i
	},
	{
		id: "sql-delete-from",
		description: "DELETE FROM — data deletion injection",
		pattern: /\bDELETE\s{1,20}FROM\b/i
	},
	{
		id: "sql-update-set",
		description: "UPDATE ... SET — data modification injection",
		pattern: /\bUPDATE\b[\s\S]{1,60}\bSET\b/i
	},
	{
		id: "sql-exec-xp",
		description: "EXEC xp_ — MSSQL extended stored procedure execution",
		pattern: /\bEXEC(?:UTE)?\s{1,20}xp_/i
	},
	{
		id: "sql-tautology-string",
		description: "Classic string tautology: ' OR '1'='1 or \" OR \"1\"=\"1\"",
		pattern: /'\s{0,10}OR\s{0,10}'[^']{0,20}'\s*=\s*'[^']{0,20}/i
	},
	{
		id: "sql-tautology-numeric",
		description: "Numeric tautology: OR 1=1",
		pattern: /\bOR\s{1,10}1\s*=\s*1\b/i
	},
	{
		id: "sql-always-true-zero",
		description: "Numeric tautology: OR 0=0",
		pattern: /\bOR\s{1,10}0\s*=\s*0\b/i
	},
	{
		id: "sql-sleep-benchmark",
		description: "Time-based blind injection: SLEEP() or BENCHMARK()",
		pattern: /\b(?:SLEEP|BENCHMARK)\s*\(/i
	},
	{
		id: "sql-waitfor-delay",
		description: "MSSQL time-based blind injection: WAITFOR DELAY",
		pattern: /\bWAITFOR\s{1,20}DELAY\b/i
	},
	{
		id: "sql-char-function",
		description: "CHAR() function — used to obfuscate injected strings",
		pattern: /\bCHAR\s*\(\s*\d{1,3}/i
	},
	{
		id: "sql-information-schema",
		description: "INFORMATION_SCHEMA — reconnaissance query for table/column enumeration",
		pattern: /\bINFORMATION_SCHEMA\b/i
	}
];
var dn = [
	{
		id: "shell-path-traversal-unix",
		description: "Unix path traversal: ../  — climbing the directory tree",
		pattern: /\.\.\//
	},
	{
		id: "shell-path-traversal-windows",
		description: "Windows path traversal: ..\\ — climbing the directory tree",
		pattern: /\.\.\\/
	},
	{
		id: "shell-path-traversal-encoded",
		description: "URL-encoded path traversal: %2e%2e or %2f variants",
		pattern: /%2e%2e|%2f\.\.|\.\.%2f/i
	},
	{
		id: "shell-null-byte",
		description: "Null byte injection: \\x00 or %00 — truncates strings in C-backed functions",
		pattern: /\x00|%00/
	},
	{
		id: "shell-semicolon",
		description: "Semicolon command separator: cmd1; cmd2",
		pattern: /;/
	},
	{
		id: "shell-pipe",
		description: "Pipe operator: cmd1 | cmd2",
		pattern: /\|/
	},
	{
		id: "shell-and-operator",
		description: "AND operator: cmd1 && cmd2",
		pattern: /&&/
	},
	{
		id: "shell-or-operator",
		description: "OR operator: cmd1 || cmd2",
		pattern: /\|\|/
	},
	{
		id: "shell-backtick",
		description: "Backtick command substitution: `cmd`",
		pattern: /`/
	},
	{
		id: "shell-dollar-paren",
		description: "Dollar-paren command substitution: $(cmd)",
		pattern: /\$\(/
	},
	{
		id: "shell-dollar-brace",
		description: "Dollar-brace variable expansion: ${var} — can be abused for injection",
		pattern: /\$\{/
	},
	{
		id: "shell-redirect-out",
		description: "Output redirection: cmd > file or cmd >> file",
		pattern: />{1,2}/
	},
	{
		id: "shell-redirect-in",
		description: "Input redirection: cmd < file",
		pattern: /</
	},
	{
		id: "shell-newline-injection",
		description: "Newline injection: \\n or \\r — can inject new shell commands",
		pattern: /[\n\r]/
	},
	{
		id: "shell-glob-star",
		description: "Glob expansion: * or ? — can expand to unintended files",
		pattern: /[/\\][*?]/
	},
	{
		id: "shell-absolute-root",
		description: "Absolute root path injection: string starting with / or \\ (Windows UNC)",
		pattern: /^(?:\/|\\\\)/
	},
	{
		id: "shell-windows-drive",
		description: "Windows drive letter path injection: C:\\ or D:/",
		pattern: /^[a-zA-Z]:[/\\]/
	},
	{
		id: "shell-curl-wget",
		description: "curl/wget with URL or flags — can exfiltrate data or download payloads",
		pattern: /\b(?:curl|wget)\s+(?:https?:\/\/|ftp:\/\/|-)/i
	}
];
var fn = [
	{
		id: "redos-nested-quantifier-plus",
		description: "Nested + quantifier inside a group with outer quantifier: (a+)+, (.+b)*, etc.",
		pattern: /\([^)]*\+[^)]*\)[+*]/
	},
	{
		id: "redos-nested-quantifier-star",
		description: "Nested * quantifier: (a*)* or (a*)+ — catastrophic backtracking",
		pattern: /\([^)]*\*[^)]*\)[*+]/
	},
	{
		id: "redos-nested-groups",
		description: "Doubly nested quantified groups: ((a+)+) — guaranteed catastrophic",
		pattern: /\(\([^)]{0,40}\)[+*]\)[+*]/
	},
	{
		id: "redos-alternation-overlap",
		description: "Overlapping alternation under quantifier: (a|a)+ — ambiguous NFA paths",
		pattern: /\(([^|()]{1,20})\|(?:\1)(?:\|[^|()]{1,20}){0,5}\)[+*?]{1,2}/
	},
	{
		id: "redos-star-plus-concat",
		description: "(x*x)+ pattern — triggers super-linear backtracking",
		pattern: /\([^)]{0,10}\*[^)]{0,10}\)[+*]/
	},
	{
		id: "redos-dot-star-greedy",
		description: "(.*){n,} or (.+){n,} — repeated greedy dot quantifiers",
		pattern: /\(\.[*+]\)\{?\d/
	},
	{
		id: "redos-large-repetition",
		description: "Very large fixed or range repetition count {1000,} or {1000,n} — denial of service via backtracking",
		pattern: /\{\d{4,}(?:,\d*)?\}/
	},
	{
		id: "redos-catastrophic-alternation",
		description: "Long alternation with many similar branches — polynomial backtracking risk",
		pattern: /\([^)]{0,200}(?:\|[^|)]{0,50}){9,}\)/
	}
];
var pn = "[\"'\\s]*:";
var mn = [
	{
		id: "nosql-where-operator",
		description: "$where — executes arbitrary JavaScript server-side in MongoDB",
		pattern: RegExp(`\\$where${pn}`, "i")
	},
	{
		id: "nosql-ne-operator",
		description: "$ne — \"not equal\" operator used to bypass equality checks",
		pattern: RegExp(`\\$ne${pn}`, "i")
	},
	{
		id: "nosql-gt-operator",
		description: "$gt — \"greater than\" used to bypass password/value checks",
		pattern: RegExp(`\\$gte?${pn}`, "i")
	},
	{
		id: "nosql-lt-operator",
		description: "$lt / $lte — \"less than\" bypass variants",
		pattern: RegExp(`\\$lte?${pn}`, "i")
	},
	{
		id: "nosql-regex-operator",
		description: "$regex — can be used to extract data character by character (blind injection)",
		pattern: RegExp(`\\$regex${pn}`, "i")
	},
	{
		id: "nosql-or-operator",
		description: "$or — logical OR; used to create always-true conditions",
		pattern: RegExp(`\\$or${pn}\\s*\\[`, "i")
	},
	{
		id: "nosql-and-operator",
		description: "$and — logical AND operator injection",
		pattern: RegExp(`\\$and${pn}\\s*\\[`, "i")
	},
	{
		id: "nosql-nor-operator",
		description: "$nor — logical NOR operator injection",
		pattern: RegExp(`\\$nor${pn}\\s*\\[`, "i")
	},
	{
		id: "nosql-exists-operator",
		description: "$exists — can enumerate fields to determine schema",
		pattern: RegExp(`\\$exists${pn}`, "i")
	},
	{
		id: "nosql-in-operator",
		description: "$in — matches any value in a list; can enumerate values",
		pattern: RegExp(`\\$in${pn}\\s*\\[`, "i")
	},
	{
		id: "nosql-expr-operator",
		description: "$expr — allows aggregation expressions in queries (MongoDB 3.6+)",
		pattern: RegExp(`\\$expr${pn}`, "i")
	},
	{
		id: "nosql-function-operator",
		description: "$function — executes arbitrary JavaScript in MongoDB 4.4+",
		pattern: RegExp(`\\$function${pn}`, "i")
	},
	{
		id: "nosql-accumulator-operator",
		description: "$accumulator — custom aggregation with arbitrary JS execution",
		pattern: RegExp(`\\$accumulator${pn}`, "i")
	},
	{
		id: "nosql-proto-pollution",
		description: "__proto__ — prototype pollution via object key injection",
		pattern: /__proto__/
	},
	{
		id: "nosql-constructor-prototype",
		description: "constructor.prototype — alternative prototype pollution vector (dot notation or JSON key)",
		pattern: /constructor[\s"':.,{\[]*prototype/i
	},
	{
		id: "nosql-proto-bracket",
		description: "[\"__proto__\"] — bracket-notation prototype pollution",
		pattern: /\[["']__proto__["']\]/
	}
];
var hn = [
	{
		id: "log-crlf-injection",
		description: "CRLF injection: literal \\r or \\n embeds fake log lines",
		pattern: /[\r\n]/
	},
	{
		id: "log-url-encoded-crlf",
		description: "URL-encoded CRLF: %0d, %0a, %0D, %0A — decoded by some log parsers",
		pattern: /%0[dDaA]/
	},
	{
		id: "log-unicode-newline",
		description: "Unicode newline variants: U+2028 (line separator), U+2029 (paragraph separator)",
		pattern: /[\u2028\u2029]/
	},
	{
		id: "log-log4shell-jndi",
		description: "Log4Shell: ${jndi:...} triggers remote code execution in Apache Log4j",
		pattern: /\$\{jndi\s*:/i
	},
	{
		id: "log-log4shell-obfuscated",
		description: "Obfuscated Log4Shell: ${::-j}... lookup-bypass prefix used to evade WAF detection",
		pattern: /\$\{::-/
	},
	{
		id: "log-log4j-lookup",
		description: "Log4j lookup syntax: ${env:...}, ${sys:...}, ${ctx:...} — data exfiltration",
		pattern: /\$\{(?:env|sys|ctx|main|map|sd|web|docker|k8s|spring)\s*:/i
	},
	{
		id: "log-ssti-double-brace",
		description: "SSTI double-brace: {{expression}} — Jinja2, Twig, Handlebars, etc.",
		pattern: /\{\{[\s\S]{0,80}\}\}/
	},
	{
		id: "log-ssti-hash-brace",
		description: "SSTI hash-brace: #{expression} — Thymeleaf, Velocity, Ruby ERB",
		pattern: /#\{[\s\S]{0,80}\}/
	},
	{
		id: "log-ssti-dollar-brace",
		description: "SSTI/EL injection: ${expression with operators or method calls} — JSP EL, Freemarker, SpEL",
		pattern: /\$\{[^}]*(?:\.|\(|\*|\+|\bclass\b|\bruntime\b|\bprocess\b|\bexec\b)[^}]{0,80}\}/i
	},
	{
		id: "log-ssti-percent-tag",
		description: "SSTI ERB/ASP tag: <%= expression %> — Ruby ERB, ASP",
		pattern: /<%=[\s\S]{0,80}%>/
	},
	{
		id: "log-null-byte",
		description: "Null byte: \\x00 or %00 — can truncate log entries in C-backed loggers",
		pattern: /\x00|%00/
	},
	{
		id: "log-ansi-escape",
		description: "ANSI escape sequence: ESC[ — can manipulate terminal output when logs are tailed",
		pattern: /\x1b\[/
	}
];
var gn = [
	{
		id: "sql-line-comment",
		description: "SQL line comment: -- followed by whitespace or end of string",
		pattern: /--(?:\s|$)/
	},
	{
		id: "sql-stacked-query",
		description: "Stacked queries: semicolon immediately followed by a SQL keyword",
		pattern: /;\s{0,10}(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b/i
	},
	{
		id: "sql-hex-encoding",
		description: "Hex-encoded string injection: 0x41414141 style (MySQL)",
		pattern: /\b0x[0-9a-f]{4,}/i
	}
];
var _n = [...un, ...gn];
sn.label = "HTML", cn.label = "XML", ln.label = "SVG", un.label = "SQL", _n.label = "SQL-STRICT", dn.label = "SHELL", fn.label = "REDOS", mn.label = "NOSQL", hn.label = "LOG", Object.freeze({
	HTML: sn,
	XML: cn,
	SVG: ln,
	SQL: un,
	"SQL-STRICT": _n,
	SHELL: dn,
	REDOS: fn,
	NOSQL: mn,
	LOG: hn
});
function vn(e) {
	if (typeof e != "string") throw TypeError(`is-unsafe: first argument must be a string, got ${typeof e}`);
}
function yn(e) {
	if (!(e instanceof RegExp)) {
		if (Array.isArray(e)) {
			if (e.length === 0) throw TypeError("is-unsafe: context must not be an empty array");
			if (Array.isArray(e[0])) {
				for (let t of e) if (!Array.isArray(t) || t.length === 0) throw TypeError("is-unsafe: each context in the array must be a non-empty pattern array (PatternList)");
			}
			return;
		}
		throw TypeError(`is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof e}`);
	}
}
function bn(e) {
	return e instanceof RegExp ? {
		lists: null,
		regex: e
	} : Array.isArray(e[0]) ? {
		lists: e,
		regex: null
	} : {
		lists: [e],
		regex: null
	};
}
function xn(e, t) {
	let n = t.label ?? "CUSTOM";
	for (let r of t) if (r.pattern.test(e)) return {
		context: n,
		id: r.id,
		description: r.description,
		pattern: r.pattern
	};
	return null;
}
function Sn(e, t) {
	vn(e), yn(t);
	let { lists: n, regex: r } = bn(t);
	if (r) return r.test(e);
	for (let t of n) if (xn(e, t) !== null) return !0;
	return !1;
}
function Cn(e, t) {
	if (!e) return {};
	let n = t.attributesGroupName ? e[t.attributesGroupName] : e;
	if (!n) return {};
	let r = {};
	for (let e in n) if (e.startsWith(t.attributeNamePrefix)) {
		let i = e.substring(t.attributeNamePrefix.length);
		r[i] = n[e];
	} else r[e] = n[e];
	return r;
}
function wn(e) {
	if (!e || typeof e != "string") return;
	let t = e.indexOf(":");
	if (t !== -1 && t > 0) {
		let n = e.substring(0, t);
		if (n !== "xmlns") return n;
	}
}
var Tn = class {
	constructor(e, t) {
		this.options = e, this.currentNode = null, this.tagsNodeStack = [], this.parseXml = An, this.parseTextData = En, this.resolveNameSpace = Dn, this.buildAttributesMap = kn, this.isItStopNode = Pn, this.replaceEntitiesValue = Mn, this.readStopNodeData = zn, this.saveTextToParentTag = Nn, this.addChild = jn, this.ignoreAttributesFn = on(this.options.ignoreAttributes), this.entityExpansionCount = 0, this.currentExpandedLength = 0, this.doctypefound = !1;
		let n = { ...pt };
		this.options.entityDecoder ? this.entityDecoder = this.options.entityDecoder : (typeof this.options.htmlEntities == "object" ? n = this.options.htmlEntities : this.options.htmlEntities === !0 && (n = {
			...mt,
			...ft
		}), this.entityDecoder = new Et({
			namedEntities: {
				...n,
				...t
			},
			numericAllowed: this.options.htmlEntities,
			limit: {
				maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
				maxExpandedLength: this.options.processEntities.maxExpandedLength,
				applyLimitsTo: this.options.processEntities.appliesTo
			},
			onInputEntity: (e, t) => Sn(t, [sn, cn]) ? ht.BLOCK : ht.ALLOW
		})), this.matcher = new ce(), this.readonlyMatcher = this.matcher.readOnly(), this.isCurrentNodeStopNode = !1, this.stopNodeExpressionsSet = new k();
		let r = this.options.stopNodes;
		if (r && r.length > 0) {
			for (let e = 0; e < r.length; e++) {
				let t = r[e];
				typeof t == "string" ? this.stopNodeExpressionsSet.add(new se(t)) : t instanceof se && this.stopNodeExpressionsSet.add(t);
			}
			this.stopNodeExpressionsSet.seal();
		}
	}
};
function En(e, t, n, r, i, a, o) {
	let s = this.options;
	if (e !== void 0 && (s.trimValues && !r && (e = e.trim()), e.length > 0)) {
		o || (e = this.replaceEntitiesValue(e, t, n));
		let r = s.jPath ? n.toString() : n, c = s.tagValueProcessor(t, e, r, i, a);
		return c == null ? e : typeof c != typeof e || c !== e ? c : s.trimValues || e.trim() === e ? Bn(e, s.parseTagValue, s.numberParseOptions) : e;
	}
}
function Dn(e) {
	if (this.options.removeNSPrefix) {
		let t = e.split(":"), n = e.charAt(0) === "/" ? "/" : "";
		if (t[0] === "xmlns") return "";
		t.length === 2 && (e = n + t[1]);
	}
	return e;
}
var On = /* @__PURE__ */ RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?", "gm");
function kn(e, t, n, r = !1) {
	let i = this.options;
	if (r === !0 || i.ignoreAttributes !== !0 && typeof e == "string") {
		let r = Ke(e, On), a = r.length, o = {}, s = Array(a), c = !1, l = {};
		for (let e = 0; e < a; e++) {
			let t = this.resolveNameSpace(r[e][1]), a = r[e][4];
			if (t.length && a !== void 0) {
				let r = a;
				i.trimValues && (r = r.trim()), r = this.replaceEntitiesValue(r, n, this.readonlyMatcher), s[e] = r, l[t] = r, c = !0;
			}
		}
		c && typeof t == "object" && t.updateCurrent && t.updateCurrent(l);
		let u = i.jPath ? t.toString() : this.readonlyMatcher, d = !1;
		for (let e = 0; e < a; e++) {
			let t = this.resolveNameSpace(r[e][1]);
			if (this.ignoreAttributesFn(t, u)) continue;
			let n = i.attributeNamePrefix + t;
			if (t.length) {
				if (i.transformAttributeName && (n = i.transformAttributeName(n)), n = Hn(n, i), r[e][4] !== void 0) {
					let r = s[e], a = i.attributeValueProcessor(t, r, u);
					a == null ? o[n] = r : typeof a != typeof r || a !== r ? o[n] = a : o[n] = Bn(r, i.parseAttributeValue, i.numberParseOptions), d = !0;
				} else i.allowBooleanAttributes && (o[n] = !0, d = !0);
			}
		}
		if (!d) return;
		if (i.attributesGroupName && !i.preserveOrder) {
			let e = {};
			return e[i.attributesGroupName] = o, e;
		}
		return o;
	}
}
var An = function(e) {
	e = e.replace(/\r\n?/g, "\n");
	let t = new Nt("!xml"), n = t, r = "";
	this.matcher.reset(), this.entityDecoder.reset(), this.entityExpansionCount = 0, this.currentExpandedLength = 0, this.doctypefound = !1;
	let i = this.options, a = new Pt(i.processEntities), o = e.length;
	for (let s = 0; s < o; s++) if (e[s] === "<") {
		let c = e.charCodeAt(s + 1);
		if (c === 47) {
			let a = In(e, ">", s, "Closing Tag is not closed."), o = e.substring(s + 2, a).trim();
			if (i.removeNSPrefix) {
				let e = o.indexOf(":");
				e !== -1 && (o = o.substr(e + 1));
			}
			o = Vn(i.transformTagName, o, "", i).tagName, n && (r = this.saveTextToParentTag(r, n, this.readonlyMatcher));
			let c = this.matcher.getCurrentTag();
			if (o && i.unpairedTagsSet.has(o)) throw Error(`Unpaired tag can not be used as closing tag: </${o}>`);
			c && i.unpairedTagsSet.has(c) && (this.matcher.pop(), this.tagsNodeStack.pop()), this.matcher.pop(), this.isCurrentNodeStopNode = !1, n = this.tagsNodeStack.pop() || t, i.captureMetaData && n && n.addEndIndex(a + 1), r = "", s = a;
		} else if (c === 63) {
			let t = Rn(e, s, !1, "?>");
			if (!t) throw Error("Pi Tag is not closed.");
			r = this.saveTextToParentTag(r, n, this.readonlyMatcher);
			let o = this.buildAttributesMap(t.tagExp, this.matcher, t.tagName, !0);
			if (o) {
				let e = o[this.options.attributeNamePrefix + "version"];
				this.entityDecoder.setXmlVersion(Number(e) || 1), a.setXmlVersion(Number(e) || 1);
			}
			if (!(i.ignoreDeclaration && t.tagName === "?xml" || i.ignorePiTags)) {
				let e = new Nt(t.tagName);
				e.add(i.textNodeName, ""), t.tagName !== t.tagExp && t.attrExpPresent && i.ignoreAttributes !== !0 && (e[":@"] = o), this.addChild(n, e, this.readonlyMatcher, s), i.captureMetaData && n.addEndIndex(t.closeIndex + 2);
			}
			s = t.closeIndex + 1;
		} else if (c === 33 && e.charCodeAt(s + 2) === 45 && e.charCodeAt(s + 3) === 45) {
			let t = In(e, "-->", s + 4, "Comment is not closed.");
			if (i.commentPropName) {
				let a = e.substring(s + 4, t - 2);
				r = this.saveTextToParentTag(r, n, this.readonlyMatcher), n.add(i.commentPropName, [{ [i.textNodeName]: a }]);
			}
			s = t;
		} else if (c === 33 && e.charCodeAt(s + 2) === 68) {
			if (this.doctypefound) throw Error("Multiple DOCTYPE declarations found.");
			this.doctypefound = !0;
			let t = a.readDocType(e, s);
			this.entityDecoder.addInputEntities(t.entities), s = t.i;
		} else if (c === 33 && e.charCodeAt(s + 2) === 91) {
			let t = In(e, "]]>", s, "CDATA is not closed.") - 2, a = e.substring(s + 9, t);
			r = this.saveTextToParentTag(r, n, this.readonlyMatcher);
			let o = this.parseTextData(a, n.tagname, this.readonlyMatcher, !0, !1, !0, !0);
			o ??= "", i.cdataPropName ? n.add(i.cdataPropName, [{ [i.textNodeName]: a }]) : n.add(i.textNodeName, o), s = t + 2;
		} else {
			let a = Rn(e, s, i.removeNSPrefix);
			if (!a) {
				let t = e.substring(Math.max(0, s - 50), Math.min(o, s + 50));
				throw Error(`readTagExp returned undefined at position ${s}. Context: "${t}"`);
			}
			let c = a.tagName, l = a.rawTagName, u = a.tagExp, d = a.attrExpPresent, f = a.closeIndex;
			if ({tagName: c, tagExp: u} = Vn(i.transformTagName, c, u, i), i.strictReservedNames && (c === i.commentPropName || c === i.cdataPropName || c === i.textNodeName || c === i.attributesGroupName)) throw Error(`Invalid tag name: ${c}`);
			n && r && n.tagname !== "!xml" && (r = this.saveTextToParentTag(r, n, this.readonlyMatcher, !1));
			let p = n;
			p && i.unpairedTagsSet.has(p.tagname) && (n = this.tagsNodeStack.pop(), this.matcher.pop());
			let m = !1;
			u.length > 0 && u.lastIndexOf("/") === u.length - 1 && (m = !0, c[c.length - 1] === "/" ? (c = c.substr(0, c.length - 1), u = c) : u = u.substr(0, u.length - 1), d = c !== u);
			let h = null, g;
			g = wn(l), c !== t.tagname && this.matcher.push(c, {}, g), c !== u && d && (h = this.buildAttributesMap(u, this.matcher, c), h && Cn(h, i)), c !== t.tagname && (this.isCurrentNodeStopNode = this.isItStopNode());
			let _ = s;
			if (this.isCurrentNodeStopNode) {
				let t = "";
				if (m) s = a.closeIndex;
				else if (i.unpairedTagsSet.has(c)) s = a.closeIndex;
				else {
					let n = this.readStopNodeData(e, l, f + 1);
					if (!n) throw Error(`Unexpected end of ${l}`);
					s = n.i, t = n.tagContent;
				}
				let r = new Nt(c);
				h && (r[":@"] = h), r.add(i.textNodeName, t), this.matcher.pop(), this.isCurrentNodeStopNode = !1, this.addChild(n, r, this.readonlyMatcher, _), i.captureMetaData && n.addEndIndex(s + 1);
			} else {
				if (m) {
					({tagName: c, tagExp: u} = Vn(i.transformTagName, c, u, i));
					let e = new Nt(c);
					h && (e[":@"] = h), this.addChild(n, e, this.readonlyMatcher, _), i.captureMetaData && n.addEndIndex(f + 1), this.matcher.pop(), this.isCurrentNodeStopNode = !1;
				} else if (i.unpairedTagsSet.has(c)) {
					let e = new Nt(c);
					h && (e[":@"] = h), this.addChild(n, e, this.readonlyMatcher, _), i.captureMetaData && n.addEndIndex(a.closeIndex + 1), this.matcher.pop(), this.isCurrentNodeStopNode = !1, s = a.closeIndex;
					continue;
				} else {
					let e = new Nt(c);
					if (this.tagsNodeStack.length > i.maxNestedTags) throw Error("Maximum nested tags exceeded");
					this.tagsNodeStack.push(n), h && (e[":@"] = h), this.addChild(n, e, this.readonlyMatcher, _), n = e;
				}
				r = "", s = f;
			}
		}
	} else r += e[s];
	return t.child;
};
function jn(e, t, n, r) {
	this.options.captureMetaData || (r = void 0);
	let i = this.options.jPath ? n.toString() : n, a = this.options.updateTag(t.tagname, i, t[":@"]);
	a === !1 || (typeof a == "string" && (t.tagname = a), e.addChild(t, r));
}
function Mn(e, t, n) {
	let r = this.options.processEntities;
	if (!r || !r.enabled) return e;
	if (r.allowedTags) {
		let i = this.options.jPath ? n.toString() : n;
		if (!(Array.isArray(r.allowedTags) ? r.allowedTags.includes(t) : r.allowedTags(t, i))) return e;
	}
	if (r.tagFilter) {
		let i = this.options.jPath ? n.toString() : n;
		if (!r.tagFilter(t, i)) return e;
	}
	return this.entityDecoder.decode(e);
}
function Nn(e, t, n, r) {
	return e &&= (r === void 0 && (r = t.child.length === 0), e = this.parseTextData(e, t.tagname, n, !1, t[":@"] ? Object.keys(t[":@"]).length !== 0 : !1, r), e !== void 0 && e !== "" && t.add(this.options.textNodeName, e), ""), e;
}
function Pn() {
	return this.stopNodeExpressionsSet.size !== 0 && this.matcher.matchesAny(this.stopNodeExpressionsSet);
}
function Fn(e, t, n = ">") {
	let r = 0, i = e.length, a = n.charCodeAt(0), o = n.length > 1 ? n.charCodeAt(1) : -1, s = "", c = t;
	for (let n = t; n < i; n++) {
		let t = e.charCodeAt(n);
		if (r) t === r && (r = 0);
		else if (t === 34 || t === 39) r = t;
		else if (t === a) {
			if (o !== -1) {
				if (e.charCodeAt(n + 1) === o) return s += e.substring(c, n), {
					data: s,
					index: n
				};
			} else return s += e.substring(c, n), {
				data: s,
				index: n
			};
		} else t === 9 && !r && (s += e.substring(c, n) + " ", c = n + 1);
	}
}
function In(e, t, n, r) {
	let i = e.indexOf(t, n);
	if (i === -1) throw Error(r);
	return i + t.length - 1;
}
function Ln(e, t, n, r) {
	let i = e.indexOf(t, n);
	if (i === -1) throw Error(r);
	return i;
}
function Rn(e, t, n, r = ">") {
	let i = Fn(e, t + 1, r);
	if (!i) return;
	let a = i.data, o = i.index, s = a.search(/\s/), c = a, l = !0;
	s !== -1 && (c = a.substring(0, s), a = a.substring(s + 1).trimStart());
	let u = c;
	if (n) {
		let e = c.indexOf(":");
		e !== -1 && (c = c.substr(e + 1), l = c !== i.data.substr(e + 1));
	}
	return {
		tagName: c,
		tagExp: a,
		closeIndex: o,
		attrExpPresent: l,
		rawTagName: u
	};
}
function zn(e, t, n) {
	let r = n, i = 1, a = e.length;
	for (; n < a; n++) if (e[n] === "<") {
		let a = e.charCodeAt(n + 1);
		if (a === 47) {
			let a = Ln(e, ">", n, `${t} is not closed`);
			if (e.substring(n + 2, a).trim() === t && (i--, i === 0)) return {
				tagContent: e.substring(r, n),
				i: a
			};
			n = a;
		} else if (a === 63) n = In(e, "?>", n + 1, "StopNode is not closed.");
		else if (a === 33 && e.charCodeAt(n + 2) === 45 && e.charCodeAt(n + 3) === 45) n = In(e, "-->", n + 3, "StopNode is not closed.");
		else if (a === 33 && e.charCodeAt(n + 2) === 91) n = In(e, "]]>", n, "StopNode is not closed.") - 2;
		else {
			let r = Rn(e, n, !1);
			r && ((r && r.tagName) === t && r.tagExp[r.tagExp.length - 1] !== "/" && i++, n = r.closeIndex);
		}
	}
}
function Bn(e, t, n) {
	if (t && typeof e == "string") {
		let t = e.trim();
		return t === "true" || t !== "false" && $t(e, n);
	}
	return Je(e) ? e : "";
}
function Vn(e, t, n, r) {
	if (e) {
		let r = e(t);
		n === t && (n = r), t = r;
	}
	return t = Hn(t, r), {
		tagName: t,
		tagExp: n
	};
}
function Hn(e, t) {
	if (Xe.includes(e)) throw Error(`[SECURITY] Invalid name: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`);
	return Ye.includes(e) ? t.onDangerousProperty(e) : e;
}
var Un = Nt.getMetaDataSymbol();
function Wn(e, t) {
	if (!e || typeof e != "object") return {};
	if (!t) return e;
	let n = {};
	for (let r in e) if (r.startsWith(t)) {
		let i = r.substring(t.length);
		n[i] = e[r];
	} else n[r] = e[r];
	return n;
}
function Gn(e, t, n, r) {
	return Kn(e, t, n, r);
}
function Kn(e, t, n, r) {
	let i, a = {};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = qn(s);
		if (c !== void 0 && c !== t.textNodeName) {
			let e = Wn(s[":@"] || {}, t.attributeNamePrefix);
			n.push(c, e);
		}
		if (c === t.textNodeName) i === void 0 ? i = s[c] : i += "" + s[c];
		else if (c === void 0) continue;
		else if (s[c]) {
			let e = Kn(s[c], t, n, r), i = Yn(e, t);
			if (Object.keys(e).length === 0 && t.alwaysCreateTextNode && (e[t.textNodeName] = ""), s[":@"] ? Jn(e, s[":@"], r, t) : Object.keys(e).length === 1 && e[t.textNodeName] !== void 0 && !t.alwaysCreateTextNode ? e = e[t.textNodeName] : Object.keys(e).length === 0 && (t.alwaysCreateTextNode ? e[t.textNodeName] = "" : e = ""), s[Un] !== void 0 && typeof e == "object" && e && (e[Un] = s[Un]), a[c] !== void 0 && Object.prototype.hasOwnProperty.call(a, c)) Array.isArray(a[c]) || (a[c] = [a[c]]), a[c].push(e);
			else {
				let n = t.jPath ? r.toString() : r;
				a[c] = t.isArray(c, n, i) ? [e] : e;
			}
			c !== void 0 && c !== t.textNodeName && n.pop();
		}
	}
	return typeof i == "string" ? i.length > 0 && (a[t.textNodeName] = i) : i !== void 0 && (a[t.textNodeName] = i), a;
}
function qn(e) {
	let t = Object.keys(e);
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (n !== ":@") return n;
	}
}
function Jn(e, t, n, r) {
	if (t) {
		let i = Object.keys(t), a = i.length;
		for (let o = 0; o < a; o++) {
			let a = i[o], s = a.startsWith(r.attributeNamePrefix) ? a.substring(r.attributeNamePrefix.length) : a, c = r.jPath ? n.toString() + "." + s : n;
			e[a] = r.isArray(a, c, !0, !0) ? [t[a]] : t[a];
		}
	}
}
function Yn(e, t) {
	let { textNodeName: n } = t, r = Object.keys(e).length;
	return !!(r === 0 || r === 1 && (e[n] || typeof e[n] == "boolean" || e[n] === 0));
}
var Xn = class {
	constructor(e) {
		this.externalEntities = {}, this.options = jt(e);
	}
	parse(e, t) {
		if (typeof e != "string" && e.toString) e = e.toString();
		else if (typeof e != "string") throw Error("XML data is accepted in String or Bytes[] form.");
		if (t) {
			t === !0 && (t = {});
			let n = Qe(e, t);
			if (n !== !0) throw Error(`${n.err.msg}:${n.err.line}:${n.err.col}`);
		}
		let n = new Tn(this.options, this.externalEntities), r = n.parseXml(e);
		return this.options.preserveOrder || r === void 0 ? r : Gn(r, this.options, n.matcher, n.readonlyMatcher);
	}
	addEntity(e, t) {
		if (t.indexOf("&") !== -1) throw Error("Entity value can't have '&'");
		if (e.indexOf("&") !== -1 || e.indexOf(";") !== -1) throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
		if (t === "&") throw Error("An entity with value '&' is not permitted");
		this.externalEntities[e] = t;
	}
	static getMetaDataSymbol() {
		return Nt.getMetaDataSymbol();
	}
};
var F = {
	Remove: "remove",
	Replace: "replace",
	Add: "add"
};
var Zn = Symbol.for("__MUTATIVE_PROXY_DRAFT__");
var Qn = Symbol("__MUTATIVE_RAW_RETURN_SYMBOL__");
var $n = Symbol.iterator;
var er = {
	mutable: "mutable",
	immutable: "immutable"
};
var tr = {};
function nr(e, t) {
	return e instanceof Map ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function rr(e, t) {
	if (t in e) {
		let n = Reflect.getPrototypeOf(e);
		for (; n;) {
			let e = Reflect.getOwnPropertyDescriptor(n, t);
			if (e) return e;
			n = Reflect.getPrototypeOf(n);
		}
	}
}
function ir(e) {
	return Object.getPrototypeOf(e) === Set.prototype;
}
function ar(e) {
	return Object.getPrototypeOf(e) === Map.prototype;
}
function or(e) {
	return e.copy ?? e.original;
}
function sr(e) {
	return !!I(e);
}
function I(e) {
	return typeof e == "object" ? e?.[Zn] : null;
}
function cr(e) {
	let t = I(e);
	return t ? t.copy ?? t.original : e;
}
function lr(e, t) {
	if (!e || typeof e != "object") return !1;
	let n;
	return Object.getPrototypeOf(e) === Object.prototype || Array.isArray(e) || e instanceof Map || e instanceof Set || !!t?.mark && ((n = t.mark(e, er)) === er.immutable || typeof n == "function");
}
function ur(e, t = []) {
	if (Object.hasOwnProperty.call(e, "key")) {
		let n = e.parent.copy, r = I(fr(n, e.key));
		if (r !== null && r?.original !== e.original) return null;
		let i = e.parent.type === 3, a = i ? Array.from(e.parent.setMap.keys()).indexOf(e.key) : e.key;
		if (!(i && n.size > a || nr(n, a))) return null;
		t.push(a);
	}
	if (e.parent) return ur(e.parent, t);
	t.reverse();
	try {
		vr(e.copy, t);
	} catch {
		return null;
	}
	return t;
}
function dr(e) {
	return Array.isArray(e) ? 1 : e instanceof Map ? 2 : e instanceof Set ? 3 : 0;
}
function fr(e, t) {
	return dr(e) === 2 ? e.get(t) : e[t];
}
function pr(e, t, n) {
	dr(e) === 2 ? e.set(t, n) : e[t] = n;
}
function mr(e, t) {
	let n = I(e);
	return (n ? or(n) : e)[t];
}
function hr(e, t) {
	return e === t ? e !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
function gr(e) {
	if (e) for (; e.finalities.revoke.length > 0;) e.finalities.revoke.pop()();
}
function _r(e, t) {
	return t ? e : [""].concat(e).map((e) => {
		let t = `${e}`;
		return t.indexOf("/") === -1 && t.indexOf("~") === -1 ? t : t.replace(/~/g, "~0").replace(/\//g, "~1");
	}).join("/");
}
function vr(e, t) {
	for (let n = 0; n < t.length - 1; n += 1) {
		let r = t[n];
		if (e = fr(dr(e) === 3 ? Array.from(e) : e, r), typeof e != "object") throw Error(`Cannot resolve patch at '${t.join("/")}'.`);
	}
	return e;
}
function yr(e) {
	let t = Object.create(Object.getPrototypeOf(e));
	return Reflect.ownKeys(e).forEach((n) => {
		let r = Reflect.getOwnPropertyDescriptor(e, n);
		if (r.enumerable && r.configurable && r.writable) {
			t[n] = e[n];
			return;
		}
		r.writable || (r.writable = !0, r.configurable = !0), (r.get || r.set) && (r = {
			configurable: !0,
			writable: !0,
			enumerable: r.enumerable,
			value: e[n]
		}), Reflect.defineProperty(t, n, r);
	}), t;
}
var br = Object.prototype.propertyIsEnumerable;
function xr(e, t) {
	let n;
	if (Array.isArray(e)) return Array.prototype.concat.call(e);
	if (e instanceof Set) {
		if (!ir(e)) {
			let t = Object.getPrototypeOf(e).constructor;
			return new t(e.values());
		}
		return Set.prototype.difference ? Set.prototype.difference.call(e, /* @__PURE__ */ new Set()) : new Set(e.values());
	}
	if (e instanceof Map) {
		if (!ar(e)) {
			let t = Object.getPrototypeOf(e).constructor;
			return new t(e);
		}
		return new Map(e);
	}
	if (t?.mark && (n = t.mark(e, er), n !== void 0) && n !== er.mutable) {
		if (n === er.immutable) return yr(e);
		if (typeof n == "function") {
			if (t.enablePatches || t.enableAutoFreeze) throw Error("You can't use mark and patches or auto freeze together.");
			return n();
		}
		throw Error(`Unsupported mark result: ${n}`);
	}
	if (typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype) {
		let t = {};
		return Object.keys(e).forEach((n) => {
			t[n] = e[n];
		}), Object.getOwnPropertySymbols(e).forEach((n) => {
			br.call(e, n) && (t[n] = e[n]);
		}), t;
	}
	throw Error("Please check mark() to ensure that it is a stable marker draftable function.");
}
function L(e) {
	e.copy ||= xr(e.original, e.options);
}
function Sr(e) {
	if (!lr(e)) return cr(e);
	if (Array.isArray(e)) return e.map(Sr);
	if (e instanceof Map) {
		let t = Array.from(e.entries()).map(([e, t]) => [e, Sr(t)]);
		if (!ar(e)) {
			let n = Object.getPrototypeOf(e).constructor;
			return new n(t);
		}
		return new Map(t);
	}
	if (e instanceof Set) {
		let t = Array.from(e).map(Sr);
		if (!ir(e)) {
			let n = Object.getPrototypeOf(e).constructor;
			return new n(t);
		}
		return new Set(t);
	}
	let t = Object.create(Object.getPrototypeOf(e));
	for (let n in e) t[n] = Sr(e[n]);
	return t;
}
function Cr(e) {
	return sr(e) ? Sr(e) : e;
}
function wr(e) {
	e.assignedMap = e.assignedMap ?? /* @__PURE__ */ new Map(), e.operated || (e.operated = !0, e.parent && wr(e.parent));
}
function Tr() {
	throw Error("Cannot modify frozen object");
}
function Er(e, t, n, r, i) {
	{
		n ??= /* @__PURE__ */ new WeakMap(), r ??= [], i ??= [];
		let a = n.has(e) ? n.get(e) : e;
		if (r.length > 0) {
			let e = r.indexOf(a);
			if (a && typeof a == "object" && e !== -1) throw r[0] === a ? Error("Forbids circular reference") : Error(`Forbids circular reference: ~/${i.slice(0, e).map((e, t) => {
				if (typeof e == "symbol") return `[${e.toString()}]`;
				let n = r[t];
				return typeof e == "object" && (n instanceof Map || n instanceof Set) ? Array.from(n.keys()).indexOf(e) : e;
			}).join("/")}`);
			r.push(a), i.push(t);
		} else r.push(a);
	}
	if (Object.isFrozen(e) || sr(e)) {
		r.pop(), i.pop();
		return;
	}
	switch (dr(e)) {
		case 2:
			for (let [t, a] of e) Er(t, t, n, r, i), Er(a, t, n, r, i);
			e.set = e.clear = e.delete = Tr;
			break;
		case 3:
			for (let t of e) Er(t, t, n, r, i);
			e.add = e.clear = e.delete = Tr;
			break;
		case 1:
			Object.freeze(e);
			let t = 0;
			for (let a of e) Er(a, t, n, r, i), t += 1;
			break;
		default: Object.freeze(e), Object.keys(e).forEach((t) => {
			let a = e[t];
			Er(a, t, n, r, i);
		});
	}
	r.pop(), i.pop();
}
function Dr(e, t) {
	let n = dr(e);
	if (n === 0) Reflect.ownKeys(e).forEach((n) => {
		t(n, e[n], e);
	});
	else if (n === 1) {
		let n = 0;
		for (let r of e) t(n, r, e), n += 1;
	} else e.forEach((n, r) => t(r, n, e));
}
function Or(e, t, n) {
	if (sr(e) || !lr(e, n) || t.has(e) || Object.isFrozen(e)) return;
	let r = e instanceof Set, i = r ? /* @__PURE__ */ new Map() : void 0;
	if (t.add(e), Dr(e, (a, o) => {
		if (sr(o)) {
			let t = I(o);
			L(t);
			let n = t.assignedMap?.size || t.operated ? t.copy : t.original;
			pr(r ? i : e, a, n);
		} else Or(o, t, n);
	}), i) {
		let t = e, n = Array.from(t);
		t.clear(), n.forEach((e) => {
			t.add(i.has(e) ? i.get(e) : e);
		});
	}
}
function kr(e, t) {
	let n = e.type === 3 ? e.setMap : e.copy;
	e.finalities.revoke.length > 1 && e.assignedMap.get(t) && n && Or(fr(n, t), e.finalities.handledSet, e.options);
}
function Ar(e) {
	e.type === 3 && e.copy && (e.copy.clear(), e.setMap.forEach((t) => {
		e.copy.add(cr(t));
	}));
}
function jr(e, t, n, r) {
	if (e.operated && e.assignedMap && e.assignedMap.size > 0 && !e.finalized) {
		if (n && r) {
			let i = ur(e);
			i && t(e, i, n, r);
		}
		e.finalized = !0;
	}
}
function Mr(e, t, n, r) {
	let i = I(n);
	i && (i.callbacks ||= [], i.callbacks.push((a, o) => {
		let s = e.type === 3 ? e.setMap : e.copy;
		if (hr(fr(s, t), n)) {
			let n = i.original;
			i.copy && (n = i.copy), Ar(e), jr(e, r, a, o), e.options.enableAutoFreeze && (e.options.updatedValues = e.options.updatedValues ?? /* @__PURE__ */ new WeakMap(), e.options.updatedValues.set(n, i.original)), pr(s, t, n);
		}
	}), e.options.enableAutoFreeze && i.finalities !== e.finalities && (e.options.enableAutoFreeze = !1)), lr(n, e.options) && e.finalities.draft.push(() => {
		hr(fr(e.type === 3 ? e.setMap : e.copy, t), n) && kr(e, t);
	});
}
function Nr(e, t, n, r, i) {
	let { original: a, assignedMap: o, options: s } = e, c = e.copy;
	c.length < a.length && ([a, c] = [c, a], [n, r] = [r, n]);
	for (let e = 0; e < a.length; e += 1) if (o.get(e.toString()) && c[e] !== a[e]) {
		let o = _r(t.concat([e]), i);
		n.push({
			op: F.Replace,
			path: o,
			value: Cr(c[e])
		}), r.push({
			op: F.Replace,
			path: o,
			value: Cr(a[e])
		});
	}
	for (let e = a.length; e < c.length; e += 1) {
		let r = _r(t.concat([e]), i);
		n.push({
			op: F.Add,
			path: r,
			value: Cr(c[e])
		});
	}
	if (a.length < c.length) {
		let { arrayLengthAssignment: e = !0 } = s.enablePatches;
		if (e) {
			let e = _r(t.concat(["length"]), i);
			r.push({
				op: F.Replace,
				path: e,
				value: a.length
			});
		} else for (let e = c.length; a.length < e; --e) {
			let n = _r(t.concat([e - 1]), i);
			r.push({
				op: F.Remove,
				path: n
			});
		}
	}
}
function Pr({ original: e, copy: t, assignedMap: n }, r, i, a, o) {
	n.forEach((n, s) => {
		let c = fr(e, s), l = Cr(fr(t, s)), u = n ? nr(e, s) ? F.Replace : F.Add : F.Remove;
		if (hr(c, l) && u === F.Replace) return;
		let d = _r(r.concat(s), o);
		i.push(u === F.Remove ? {
			op: u,
			path: d
		} : {
			op: u,
			path: d,
			value: l
		}), a.push(u === F.Add ? {
			op: F.Remove,
			path: d
		} : u === F.Remove ? {
			op: F.Add,
			path: d,
			value: c
		} : {
			op: F.Replace,
			path: d,
			value: c
		});
	});
}
function Fr({ original: e, copy: t }, n, r, i, a) {
	let o = 0;
	e.forEach((e) => {
		if (!t.has(e)) {
			let t = _r(n.concat([o]), a);
			r.push({
				op: F.Remove,
				path: t,
				value: e
			}), i.unshift({
				op: F.Add,
				path: t,
				value: e
			});
		}
		o += 1;
	}), o = 0, t.forEach((t) => {
		if (!e.has(t)) {
			let e = _r(n.concat([o]), a);
			r.push({
				op: F.Add,
				path: e,
				value: t
			}), i.unshift({
				op: F.Remove,
				path: e,
				value: t
			});
		}
		o += 1;
	});
}
function Ir(e, t, n, r) {
	let { pathAsArray: i = !0 } = e.options.enablePatches;
	switch (e.type) {
		case 0:
		case 2: return Pr(e, t, n, r, i);
		case 1: return Nr(e, t, n, r, i);
		case 3: return Fr(e, t, n, r, i);
	}
}
var Lr = (e, t, n = !1) => {
	if (typeof e == "object" && e && (!lr(e, t) || n)) throw Error("Strict mode: Mutable data cannot be accessed directly, please use 'unsafe(callback)' wrap.");
};
var Rr = {
	get size() {
		return or(I(this)).size;
	},
	has(e) {
		return or(I(this)).has(e);
	},
	set(e, t) {
		let n = I(this), r = or(n);
		return (!r.has(e) || !hr(r.get(e), t)) && (L(n), wr(n), n.assignedMap.set(e, !0), n.copy.set(e, t), Mr(n, e, t, Ir)), this;
	},
	delete(e) {
		if (!this.has(e)) return !1;
		let t = I(this);
		return L(t), wr(t), t.original.has(e) ? t.assignedMap.set(e, !1) : t.assignedMap.delete(e), t.copy.delete(e), !0;
	},
	clear() {
		let e = I(this);
		if (this.size) {
			L(e), wr(e), e.assignedMap = /* @__PURE__ */ new Map();
			for (let [t] of e.original) e.assignedMap.set(t, !1);
			e.copy.clear();
		}
	},
	forEach(e, t) {
		or(I(this)).forEach((n, r) => {
			e.call(t, this.get(r), r, this);
		});
	},
	get(e) {
		var t;
		let n = I(this), r = or(n).get(e), i = (t = n.options).mark?.call(t, r, er) === er.mutable;
		if (n.options.strict && Lr(r, n.options, i), i || n.finalized || !lr(r, n.options) || r !== n.original.get(e)) return r;
		let a = tr.createDraft({
			original: r,
			parentDraft: n,
			key: e,
			finalities: n.finalities,
			options: n.options
		});
		return L(n), n.copy.set(e, a), a;
	},
	keys() {
		return or(I(this)).keys();
	},
	values() {
		let e = this.keys();
		return {
			[$n]: () => this.values(),
			next: () => {
				let t = e.next();
				return t.done ? t : {
					done: !1,
					value: this.get(t.value)
				};
			}
		};
	},
	entries() {
		let e = this.keys();
		return {
			[$n]: () => this.entries(),
			next: () => {
				let t = e.next();
				if (t.done) return t;
				let n = this.get(t.value);
				return {
					done: !1,
					value: [t.value, n]
				};
			}
		};
	},
	[$n]() {
		return this.entries();
	}
};
var zr = Reflect.ownKeys(Rr);
var Br = (e, t, { isValuesIterator: n }) => () => {
	var r;
	let i = t.next();
	if (i.done) return i;
	let a = i.value, o = e.setMap.get(a), s = I(o), c = (r = e.options).mark?.call(r, o, er) === er.mutable;
	if (e.options.strict && Lr(a, e.options, c), !c && !s && lr(a, e.options) && !e.finalized && e.original.has(a)) {
		let t = tr.createDraft({
			original: a,
			parentDraft: e,
			key: a,
			finalities: e.finalities,
			options: e.options
		});
		e.setMap.set(a, t), o = t;
	} else s && (o = s.proxy);
	return {
		done: !1,
		value: n ? o : [o, o]
	};
};
var Vr = {
	get size() {
		return I(this).setMap.size;
	},
	has(e) {
		let t = I(this);
		if (t.setMap.has(e)) return !0;
		L(t);
		let n = I(e);
		return !!(n && t.setMap.has(n.original));
	},
	add(e) {
		let t = I(this);
		return this.has(e) || (L(t), wr(t), t.assignedMap.set(e, !0), t.setMap.set(e, e), Mr(t, e, e, Ir)), this;
	},
	delete(e) {
		if (!this.has(e)) return !1;
		let t = I(this);
		L(t), wr(t);
		let n = I(e);
		return n && t.setMap.has(n.original) ? (t.assignedMap.set(n.original, !1), t.setMap.delete(n.original)) : (!n && t.setMap.has(e) ? t.assignedMap.set(e, !1) : t.assignedMap.delete(e), t.setMap.delete(e));
	},
	clear() {
		if (!this.size) return;
		let e = I(this);
		L(e), wr(e);
		for (let t of e.original) e.assignedMap.set(t, !1);
		e.setMap.clear();
	},
	values() {
		let e = I(this);
		L(e);
		let t = e.setMap.keys();
		return {
			[Symbol.iterator]: () => this.values(),
			next: Br(e, t, { isValuesIterator: !0 })
		};
	},
	entries() {
		let e = I(this);
		L(e);
		let t = e.setMap.keys();
		return {
			[Symbol.iterator]: () => this.entries(),
			next: Br(e, t, { isValuesIterator: !1 })
		};
	},
	keys() {
		return this.values();
	},
	[$n]() {
		return this.values();
	},
	forEach(e, t) {
		let n = this.values(), r = n.next();
		for (; !r.done;) e.call(t, r.value, r.value, this), r = n.next();
	}
};
Set.prototype.difference && Object.assign(Vr, {
	intersection(e) {
		return Set.prototype.intersection.call(new Set(this.values()), e);
	},
	union(e) {
		return Set.prototype.union.call(new Set(this.values()), e);
	},
	difference(e) {
		return Set.prototype.difference.call(new Set(this.values()), e);
	},
	symmetricDifference(e) {
		return Set.prototype.symmetricDifference.call(new Set(this.values()), e);
	},
	isSubsetOf(e) {
		return Set.prototype.isSubsetOf.call(new Set(this.values()), e);
	},
	isSupersetOf(e) {
		return Set.prototype.isSupersetOf.call(new Set(this.values()), e);
	},
	isDisjointFrom(e) {
		return Set.prototype.isDisjointFrom.call(new Set(this.values()), e);
	}
});
var Hr = Reflect.ownKeys(Vr);
var Ur = {
	get(e, t, n) {
		let r = e.copy?.[t];
		if (r && e.finalities.draftsCache.has(r)) return r;
		if (t === Zn) return e;
		let i;
		if (e.options.mark) {
			let r = t === "size" && (e.original instanceof Map || e.original instanceof Set) ? Reflect.get(e.original, t) : Reflect.get(e.original, t, n);
			if (i = e.options.mark(r, er), i === er.mutable) return e.options.strict && Lr(r, e.options, !0), r;
		}
		let a = or(e);
		if (a instanceof Map && zr.includes(t)) return t === "size" ? Object.getOwnPropertyDescriptor(Rr, "size").get.call(e.proxy) : Rr[t].bind(e.proxy);
		if (a instanceof Set && Hr.includes(t)) return t === "size" ? Object.getOwnPropertyDescriptor(Vr, "size").get.call(e.proxy) : Vr[t].bind(e.proxy);
		if (!nr(a, t)) {
			let n = rr(a, t);
			return n ? "value" in n ? n.value : n.get?.call(e.proxy) : void 0;
		}
		let o = a[t];
		if (e.options.strict && Lr(o, e.options), e.finalized || !lr(o, e.options)) return o;
		if (o === mr(e.original, t)) {
			if (L(e), e.copy[t] = Wr({
				original: e.original[t],
				parentDraft: e,
				key: e.type === 1 ? Number(t) : t,
				finalities: e.finalities,
				options: e.options
			}), typeof i == "function") {
				let n = I(e.copy[t]);
				return L(n), wr(n), n.copy;
			}
			return e.copy[t];
		}
		return sr(o) && e.finalities.draftsCache.add(o), o;
	},
	set(e, t, n) {
		if (e.type === 3 || e.type === 2) throw Error("Map/Set draft does not support any property assignment.");
		let r;
		if (e.type === 1 && t !== "length" && !(Number.isInteger(r = Number(t)) && r >= 0 && (t === 0 || r === 0 || String(r) === String(t)))) throw Error("Only supports setting array indices and the 'length' property.");
		let i = rr(or(e), t);
		if (i?.set) return i.set.call(e.proxy, n), !0;
		let a = mr(or(e), t), o = I(a);
		return o && hr(o.original, n) ? (e.copy[t] = n, e.assignedMap = e.assignedMap ?? /* @__PURE__ */ new Map(), e.assignedMap.set(t, !1), !0) : hr(n, a) && (n !== void 0 || nr(e.original, t)) ? !0 : (L(e), wr(e), nr(e.original, t) && hr(n, e.original[t]) ? e.assignedMap.delete(t) : e.assignedMap.set(t, !0), e.copy[t] = n, Mr(e, t, n, Ir), !0);
	},
	has(e, t) {
		return t in or(e);
	},
	ownKeys(e) {
		return Reflect.ownKeys(or(e));
	},
	getOwnPropertyDescriptor(e, t) {
		let n = or(e), r = Reflect.getOwnPropertyDescriptor(n, t);
		return r && {
			writable: !0,
			configurable: e.type !== 1 || t !== "length",
			enumerable: r.enumerable,
			value: n[t]
		};
	},
	getPrototypeOf(e) {
		return Reflect.getPrototypeOf(e.original);
	},
	setPrototypeOf() {
		throw Error("Cannot call 'setPrototypeOf()' on drafts");
	},
	defineProperty() {
		throw Error("Cannot call 'defineProperty()' on drafts");
	},
	deleteProperty(e, t) {
		return e.type === 1 ? Ur.set.call(this, e, t, void 0, e.proxy) : (mr(e.original, t) !== void 0 || t in e.original ? (L(e), wr(e), e.assignedMap.set(t, !1)) : (e.assignedMap = e.assignedMap ?? /* @__PURE__ */ new Map(), e.assignedMap.delete(t)), e.copy && delete e.copy[t], !0);
	}
};
function Wr(e) {
	let { original: t, parentDraft: n, key: r, finalities: i, options: a } = e, o = dr(t), s = {
		type: o,
		finalized: !1,
		parent: n,
		original: t,
		copy: null,
		proxy: null,
		finalities: i,
		options: a,
		setMap: o === 3 ? new Map(t.entries()) : void 0
	};
	(r || "key" in e) && (s.key = r);
	let { proxy: c, revoke: l } = Proxy.revocable(o === 1 ? Object.assign([], s) : s, Ur);
	if (i.revoke.push(l), s.proxy = c, n) {
		let e = n;
		e.finalities.draft.push((t, n) => {
			var i;
			let a = I(c), o = e.type === 3 ? e.setMap : e.copy, s = fr(o, r), l = I(s);
			if (l) {
				let i = l.original;
				l.operated && (i = cr(s)), Ar(l), jr(l, Ir, t, n), e.options.enableAutoFreeze && (e.options.updatedValues = e.options.updatedValues ?? /* @__PURE__ */ new WeakMap(), e.options.updatedValues.set(i, l.original)), pr(o, r, i);
			}
			(i = a.callbacks) == null || i.forEach((e) => {
				e(t, n);
			});
		});
	} else {
		let e = I(c);
		e.finalities.draft.push((t, n) => {
			Ar(e), jr(e, Ir, t, n);
		});
	}
	return c;
}
tr.createDraft = Wr;
function Gr(e, t, n, r, i) {
	let a = I(e), o = a?.original ?? e, s = !!t.length;
	if (a?.operated) for (; a.finalities.draft.length > 0;) a.finalities.draft.pop()(n, r);
	let c = s ? t[0] : a ? a.operated ? a.copy : a.original : e;
	return a && gr(a), i && Er(c, c, a?.options.updatedValues), [
		c,
		n && s ? [{
			op: F.Replace,
			path: [],
			value: t[0]
		}] : n,
		r && s ? [{
			op: F.Replace,
			path: [],
			value: o
		}] : r
	];
}
function Kr(e, t) {
	let n = {
		draft: [],
		revoke: [],
		handledSet: /* @__PURE__ */ new WeakSet(),
		draftsCache: /* @__PURE__ */ new WeakSet()
	}, r, i;
	t.enablePatches && (r = [], i = []);
	let a = t.mark?.call(t, e, er) === er.mutable || !lr(e, t) ? e : Wr({
		original: e,
		parentDraft: null,
		finalities: n,
		options: t
	});
	return [a, (e = []) => {
		let [n, o, s] = Gr(a, e, r, i, t.enableAutoFreeze);
		return t.enablePatches ? [
			n,
			o,
			s
		] : n;
	}];
}
function qr(e) {
	let { rootDraft: t, value: n, useRawReturn: r = !1, isRoot: i = !0 } = e;
	Dr(n, (n, r, i) => {
		let a = I(r);
		if (a && t && a.finalities === t.finalities) {
			e.isContainDraft = !0;
			let t = a.original;
			if (i instanceof Set) {
				let e = Array.from(i);
				i.clear(), e.forEach((e) => i.add(n === e ? t : e));
			} else pr(i, n, t);
		} else typeof r == "object" && r && (e.value = r, e.isRoot = !1, qr(e));
	}), i && (e.isContainDraft || console.warn("The return value does not contain any draft, please use 'rawReturn()' to wrap the return value to improve performance."), r && console.warn("The return value contains drafts, please don't use 'rawReturn()' to wrap the return value."));
}
function Jr(e) {
	let t = I(e);
	if (!lr(e, t?.options)) return e;
	let n = dr(e);
	if (t && !t.operated) return t.original;
	let r;
	function i() {
		r = n === 2 ? ar(e) ? new Map(e) : new (Object.getPrototypeOf(e)).constructor(e) : n === 3 ? Array.from(t.setMap.values()) : xr(e, t?.options);
	}
	if (t) {
		t.finalized = !0;
		try {
			i();
		} finally {
			t.finalized = !1;
		}
	} else r = e;
	if (Dr(r, (n, a) => {
		if (t && hr(fr(t.original, n), a)) return;
		let o = Jr(a);
		o !== a && (r === e && i(), pr(r, n, o));
	}), n === 3) {
		let e = t?.original ?? r;
		return ir(e) ? new Set(r) : new (Object.getPrototypeOf(e)).constructor(r);
	}
	return r;
}
function Yr(e) {
	if (!sr(e)) throw Error(`current() is only used for Draft, parameter: ${e}`);
	return Jr(e);
}
var Xr = ((e) => {
	if (e !== void 0 && Object.prototype.toString.call(e) !== "[object Object]") throw Error(`Invalid options: ${String(e)}, 'options' should be an object.`);
	return function t(n, r, i) {
		if (typeof n == "function" && typeof r != "function") return function(e, ...i) {
			return t(e, (e) => n.call(this, e, ...i), r);
		};
		let a = n, o = r, s = i;
		if (typeof r != "function" && (s = r), s !== void 0 && Object.prototype.toString.call(s) !== "[object Object]") throw Error(`Invalid options: ${s}, 'options' should be an object.`);
		s = Object.assign(Object.assign({}, e), s);
		let c = sr(a) ? Yr(a) : a, l = Array.isArray(s.mark) ? ((e, t) => {
			for (let n of s.mark) {
				if (typeof n != "function") throw Error(`Invalid mark: ${n}, 'mark' should be a function.`);
				let r = n(e, t);
				if (r) return r;
			}
		}) : s.mark, u = s.enablePatches ?? !1, d = s.strict ?? !1, f = {
			enableAutoFreeze: s.enableAutoFreeze ?? !1,
			mark: l,
			strict: d,
			enablePatches: u
		};
		if (!lr(c, f) && typeof c == "object" && c) throw Error("Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.");
		let [p, m] = Kr(c, f);
		if (typeof r != "function") {
			if (!lr(c, f)) throw Error("Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.");
			return [p, m];
		}
		let h;
		try {
			h = o(p);
		} catch (e) {
			throw gr(I(p)), e;
		}
		let g = (e) => {
			let t = I(p);
			if (!sr(e)) {
				if (e !== void 0 && !hr(e, p) && t?.operated) throw Error("Either the value is returned as a new non-draft value, or only the draft is modified without returning any value.");
				let n = e?.[Qn];
				if (n) {
					let r = n[0];
					return f.strict && typeof e == "object" && e && qr({
						rootDraft: t,
						value: e,
						useRawReturn: !0
					}), m([r]);
				}
				if (e !== void 0) return typeof e == "object" && e && qr({
					rootDraft: t,
					value: e
				}), m([e]);
			}
			if (e === p || e === void 0) return m([]);
			let n = I(e);
			if (f === n.options) {
				if (n.operated) throw Error("Cannot return a modified child draft.");
				return m([Yr(e)]);
			}
			return m([e]);
		};
		return h instanceof Promise ? h.then(g, (e) => {
			throw gr(I(p)), e;
		}) : g(h);
	};
})();
Object.prototype.constructor.toString();
var Zr = {
	root: void 0,
	item: void 0,
	path: "",
	ids: "",
	level: 0
};
var R = {
	find(e, t, n = Zr, r = 0) {
		let i = {
			parent: n.item,
			index: r,
			path: e.name && n.path ? `${n.path}⫻${e.name}` : e.name || "",
			ids: e.id && n.ids ? `${n.ids}⫻${e.id}` : e.id || "",
			level: n.level + 1,
			hasChildren: !!e.children?.length,
			root: n.root || e
		}, a = t(e, i);
		if (a) return typeof a == "boolean" ? e : a;
		if (i.hasChildren) {
			let { path: n, ids: r, level: a, root: o } = i, s = e.children || [];
			for (let i = 0, c = s.length; i < c; i++) {
				let c = s[i], l = R.find(c, t, {
					item: e,
					path: n,
					ids: r,
					level: a,
					root: o
				}, i);
				if (l) return typeof l == "boolean" ? c : l;
			}
		}
	},
	list(e, t, n = Zr, r = 0, i, a = []) {
		let o = {
			parent: n.item,
			index: r,
			path: e.name && n.path ? `${n.path}⫻${e.name}` : e.name || "",
			ids: e.id && n.ids ? `${n.ids}⫻${e.id}` : e.id || "",
			level: n.level + 1,
			hasChildren: !!e.children?.length,
			root: n.root || e
		}, s = t(e, i, o);
		if (s && (a.push(s), o.hasChildren)) {
			let { path: n, ids: r, level: i, root: c } = o, l = e.children || [];
			for (let o = 0, u = l.length; o < u; o++) {
				let u = l[o];
				R.list(u, t, {
					item: e,
					path: n,
					ids: r,
					level: i,
					root: c
				}, o, s, a);
			}
		}
		return a;
	},
	map(e, t, n = Zr, r = 0, i) {
		let a = {
			parent: n.item,
			index: r,
			path: e.name && n.path ? `${n.path}⫻${e.name}` : e.name || "",
			ids: e.id && n.ids ? `${n.ids}⫻${e.id}` : e.id || "",
			level: n.level + 1,
			hasChildren: !!e.children?.length,
			root: n.root || e
		}, o = t(e, i, a);
		if (delete o.children, a.hasChildren) {
			let { path: n, ids: r, level: i, root: s } = a;
			o.children = e.children.map((a, c) => R.map(a, t, {
				item: e,
				path: n,
				ids: r,
				level: i,
				root: s
			}, c, o));
		}
		return o;
	},
	filter(e, t, n = Zr, r = 0) {
		let i = {
			parent: n.item,
			index: r,
			path: e.name && n.path ? `${n.path}⫻${e.name}` : e.name || "",
			ids: e.id && n.ids ? `${n.ids}⫻${e.id}` : e.id || "",
			level: n.level + 1,
			hasChildren: !!e.children?.length,
			root: n.root || e
		};
		if (t(e, i)) {
			if (i.hasChildren) {
				let { path: n, ids: r, level: a, root: o } = i, s = e.children.map((i, s) => R.filter(i, t, {
					item: e,
					path: n,
					ids: r,
					level: a,
					root: o
				}, s)).filter(Boolean);
				e.children = s.length ? s : void 0;
			}
			return e;
		}
	},
	each(e, t, n = Zr, r = 0) {
		let { name: i, id: a, children: o } = e, s = {
			parent: n.item,
			index: r,
			path: i && n.path ? `${n.path}⫻${i}` : i || "",
			ids: a && n.ids ? `${n.ids}⫻${a}` : a || "",
			level: n.level + 1,
			hasChildren: !!o?.length,
			root: n.root || e
		}, c = t(e, s);
		if (c !== void 0) return c;
		if (s.hasChildren) {
			let { path: n, ids: r, level: i, root: a } = s, c = o;
			for (let o = 0, s = c.length; o < s; o++) {
				let s = c[o];
				if (R.each(s, t, {
					item: e,
					path: n,
					ids: r,
					level: i,
					root: a
				}, o)) return !0;
			}
		}
	},
	recurse(e, t, n, r = Zr, i = 0) {
		let a = {
			parent: r.item,
			index: i,
			path: e.name && r.path ? `${r.path}⫻${e.name}` : e.name || "",
			ids: e.id && r.ids ? `${r.ids}⫻${e.id}` : e.id || "",
			level: r.level + 1,
			hasChildren: !!e.children?.length,
			root: r.root || e
		};
		if (t(e, a)) return n(e, a), !0;
		if (a.hasChildren) {
			let { path: r, ids: i, level: o, root: s } = a, c = e.children;
			for (let l = 0, u = c.length; l < u; l++) {
				let u = c[l];
				if (R.recurse(u, t, n, {
					item: e,
					path: r,
					ids: i,
					level: o,
					root: s
				}, l)) return n(e, a), !0;
			}
		}
		n(e, a);
	},
	toMap(e, t = "id") {
		let n = {};
		return R.each(e, (e) => {
			let r = e[t];
			n[r] = e;
		}), n;
	},
	produce(e, t, n, r = {
		item: void 0,
		path: "",
		ids: "",
		level: 0
	}, i = 0) {
		return Xr(e, (e) => {
			let a = e;
			R.each(a, t, r, i), n?.(a);
		});
	}
};
var Qr = "_temp_";
var z = "_item_";
var B = "_key_";
var V = "_length_";
var $r = `^${z}(?=[.[])`;
var ei = "_Brand_";
var ti = "_ENV_";
var H = {
	_string: "_string",
	_number: "_number",
	_boolean: "_boolean",
	_date: "_date",
	_time: "_time",
	_datetime: "_datetime",
	_any: "_any",
	_path: "_path"
};
var U = {
	_createMap: "_createMap",
	_arrayPush: "_arrayPush",
	_mappingEach: "_mappingEach",
	_loopKeyValue: "_loopKeyValue",
	_matchVariable: "_matchVariable"
};
var ni = "_utils";
var ri = {
	...H,
	...U,
	[ti]: ti,
	[ei]: ei,
	[ni]: ni,
	[Qr]: Qr,
	[V]: V,
	[z]: z,
	[B]: B
};
Object.keys(ri).reduce((e, t) => (e[ri[t]] = t, e), {});
var ii = {
	schema: {
		id: ni,
		name: ni,
		type: T.Object,
		children: []
	},
	nameReg: ""
};
function ai(e) {
	ii.schema = W.toSchemaModelTreeWithJsObject({
		name: ni,
		disabled: !0,
		type: T.Object,
		children: e.children
	}), ii.nameReg = `^(${e.children.map((e) => e.name).join("|").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\.`;
}
var oi = {
	id: "_system_",
	name: "_system_",
	label: O.systemVariables,
	type: T.Object,
	disabled: !0,
	children: [
		{
			id: ti,
			name: ti,
			tips: O.envVariableTips,
			type: T.String
		},
		{
			id: "''",
			name: "emptyString",
			tips: O.emptyStringTips,
			type: T.String
		},
		{
			id: "null",
			name: "null",
			type: T.Any
		},
		{
			id: "undefined",
			name: "undefined",
			type: T.Any
		}
	]
};
var si = {
	isContainer(e) {
		return e === T.Object || e === T.Array || e === T.Map;
	},
	matchVariable(e) {
		if (e) {
			let t = e.match(RegExp(`^(${Object.values(H).join("|")})\\((.+)\\)$`));
			if (t) {
				let n = t[2].split(","), r = n.shift().trim(), i = n.map((e) => e.trim());
				return {
					text: e,
					fun: t[1],
					variable: r,
					args: i,
					isAssert: r.endsWith("!")
				};
			}
			let n = e;
			return {
				text: e,
				fun: "",
				variable: n,
				args: [],
				isAssert: n.endsWith("!")
			};
		}
		return {
			text: e,
			fun: "",
			variable: "",
			args: [],
			isAssert: !1
		};
	},
	getValidContextRef({ text: e, source: t }) {
		if (t === D.Variable) {
			let { fun: t, variable: n } = si.matchVariable(e);
			return t === H._number ? "0" : n;
		}
		return /\D/.test(e) ? "" : "0";
	},
	getVariableMode(e) {
		return e === "_key_" || e.startsWith("_item_") ? "context" : oi.children.some((t) => t.id === e) ? "constant" : e.startsWith("_utils") ? "utils" : "output";
	},
	getConstants() {
		return oi;
	},
	getUtils() {
		return ii.schema;
	},
	getContext(e, t) {
		if (e) {
			if (!/\D/.test(e)) return {
				id: "_context_",
				name: "_context_",
				label: `${O.iteratorSource}: Number`,
				type: T.Any,
				disabled: !0,
				children: [
					{
						id: z,
						name: z,
						type: T.Number
					},
					{
						id: B,
						name: B,
						type: T.Number
					},
					{
						id: V,
						name: V,
						type: T.Number
					}
				]
			};
			if (t) {
				let n = t.children?.find((e) => e.name === "*") || {
					name: "*",
					type: T.Any
				};
				return {
					id: "_context_",
					name: "_context_",
					label: `${O.iteratorSource}: ${e}`,
					type: T.Any,
					disabled: !0,
					children: [
						{
							id: B,
							name: B,
							type: t.type === T.Array ? T.Number : T.String
						},
						{
							id: V,
							name: V,
							type: T.Number
						},
						W.regenSchemaModelWithJsObject({
							...n,
							label: "",
							name: z
						})
					]
				};
			}
			return {
				id: "_context_",
				name: "_context_",
				label: `${O.iteratorSource}: ${e}`,
				type: T.Any,
				disabled: !0,
				children: [
					{
						id: B,
						name: B,
						type: T.Any
					},
					{
						id: V,
						name: V,
						type: T.Number
					},
					{
						id: z,
						name: z,
						type: T.Any
					}
				]
			};
		}
	}
};
var ci = new Le({
	preserveOrder: !0,
	ignoreAttributes: !1,
	suppressEmptyNode: !0,
	suppressBooleanAttributes: !0,
	format: !0
});
var li = new Xn({
	preserveOrder: !0,
	ignoreAttributes: !1,
	allowBooleanAttributes: !0
});
function ui(e) {
	let { type: t, name: n, label: r, tips: i, optional: a, direct: o, enums: s, children: c = [] } = e, l = {
		[E[t]]: c.map(ui),
		":@": {}
	}, u = l[":@"];
	return n && (u["@_name"] = n), r && (u["@_label"] = r), i && (u["@_tips"] = i), o && (u["@_direct"] = o), a && (u["@_optional"] = !0), s?.length && (u["@_enums"] = JSON.stringify(s)), l;
}
var di = {
	string: T.String,
	number: T.Number,
	boolean: T.Bool,
	object: T.Object,
	array: T.Array,
	map: T.Map
};
function fi(e, t, n, r, i, a, o) {
	return e.map((e) => {
		let s = oe((n === T.Array || n === T.Map) && e.name === "*" && (a || o) ? "0" : e.name, e.optional, t, r), c = r ? s.replace(/\?$/, "") : s, l = {
			...e,
			id: c
		};
		i !== void 0 && (l.folded = i);
		let u = a && e.type === T.File ? [{
			name: "fileName",
			type: T.String
		}, {
			name: "fileSize",
			type: T.Number
		}] : e.children;
		return l.children = u ? fi(a && e.type === T.Array ? [{
			name: "length",
			type: T.Number
		}, ...u] : u, s, e.type, r, i, a, o) : void 0, l;
	});
}
function pi(e, t = "", n = !1, r, i, a) {
	let o = oe(e.name, e.optional, t, n), s = i && e.type === T.File ? [{
		name: "fileName",
		type: T.String
	}, {
		name: "fileSize",
		type: T.Number
	}] : e.children;
	return {
		...e,
		id: o,
		folded: r,
		children: s ? fi(i && e.type === T.Array ? [{
			name: "length",
			type: T.Number
		}, ...s] : s, o, e.type, n, r, i, a) : void 0
	};
}
function mi(e, t, n) {
	if (e == null) {
		n.push({
			name: t,
			type: T.String,
			optional: !0
		});
		return;
	}
	let r = typeof e, i = {
		name: t,
		type: di[r === "object" ? Array.isArray(e) ? "array" : "*" in e ? "map" : "object" : r]
	};
	if (n.push(i), i.type === T.Object) {
		i.children = [];
		for (let t in e) {
			let n = e[t];
			mi(n, t, i.children);
		}
	} else i.type === T.Array ? (i.children = [], mi(e[0], "*", i.children)) : i.type === T.Map && (i.children = [], mi(e["*"], "*", i.children));
}
function hi(e) {
	switch (e) {
		case T.String: return "xxx";
		case T.Number: return 123;
		case T.Bool: return !0;
		case T.Date: return "1970-01-01 00:00:00";
		case T.Object: return {};
		case T.Array: return [];
		case T.Map: return {};
		case T.Any: return "xxx";
	}
}
function gi(e, t, n) {
	e.forEach((e) => {
		let r = t === T.Array ? "0" : e.name, i = hi(e.type);
		n[r] = i, e.children && gi(e.children, e.type, i);
	});
}
function _i(e, t) {
	let n = {};
	return e.map((e) => {
		let [r] = Object.keys(e), i = e[":@"] || {}, a = {};
		for (let e in i) a[e.substring(2)] = i[e].toString();
		let o = t === T.Array || t === T.Map ? "*" : a.name, s = a.label;
		if (!o) throw O.nameIsRequired;
		if (n[o]) throw re(O.nameIsRepeat, { name: o });
		if (!T[r]) throw re(O.typeRestricted, { type: r });
		n[o] = !0;
		let c = e[r], l = {
			name: o,
			type: T[r]
		};
		return a.optional === "true" && (l.optional = !0), a.tips && (l.tips = a.tips), a.enums && (l.enums = JSON.parse(a.enums)), s && (l.label = s), l.type === T.Array || l.type === T.Map ? l.children = _i([c[0] || { [E[T.String]]: [] }], l.type) : l.type === T.Object && c.length && (l.children = _i(c, l.type)), l;
	});
}
var W = {
	toSchemaTitle(e, t, n) {
		let r = n?.(e, t) || {}, i = e.name === "*" ? "item" : e.name, a = r.label === void 0 ? e.label : r.label;
		return {
			title: (r.name || i) + (a ? ` (${a})` : ""),
			tips: r.tips || e.tips || ""
		};
	},
	toSchemaModelTree(e, t = "") {
		return pi(e, t);
	},
	toSchemaModelTreeWithJsObject(e, t = "", n) {
		return pi(e, t, !0, n, !0);
	},
	regenSchemaModelWithJsObject(e, t, n) {
		return pi(e, t, !0, n, !1, !0);
	},
	patchSchemaDirect(e, t, n, r) {
		if (e.direct) {
			let i = t[e.direct];
			if (i) {
				if ((i.type === T.Array || i.type === T.Map) && (e.name === "_item_" || e.name === "_key_")) {
					if (e.name === "_item_") {
						let i = t[`${e.direct}[0]`];
						if (i) {
							let a = W.regenSchemaModelWithJsObject({
								...i,
								name: e.name,
								label: e.label,
								direct: void 0
							}, n, r);
							Object.assign(e, a), R.each(e, (e) => {
								t[e.id] = e;
							});
							return;
						}
					} else {
						Object.assign(e, {
							type: i.type === T.Array ? T.Number : T.String,
							direct: void 0
						});
						return;
					}
				}
				let a = pi({
					...i,
					name: e.name,
					label: e.label,
					direct: void 0
				}, n, !0, r, !1, !0);
				Object.assign(e, a), R.each(e, (e) => {
					t[e.id] = e;
				});
			}
		}
	},
	highlightOutputs(e, t, n) {
		let r = {}, i;
		return R.produce(t, (t, { ids: a }) => {
			r[t.id] = t, t.id === e ? (i = a, t.folded &&= void 0, t.highlighted = !0) : (n && (t.folded = !0), t.highlighted &&= void 0);
		}, () => {
			i && i.split("⫻").forEach((e) => {
				let t = r[e];
				t.folded &&= void 0;
			});
		});
	},
	filterArraySpecific(e) {
		if (e.children) {
			let t = { ...e };
			return e.type === T.Array && (t.children = e.children.filter((e) => e.name === "*")), t.children = t.children.map((e) => W.filterArraySpecific(e)), t;
		}
		return e;
	},
	schemaModelToXmlData: ui,
	schemaModelToXml(e) {
		return ci.build([ui(e)]).trim();
	},
	xmlDataToSchemaModel: _i,
	xmlToSchemaModel(e) {
		return _i(li.parse(e))[0];
	},
	formatXml(e) {
		let t = li.parse(e);
		return ci.build(t).trim();
	},
	jsonToSchemaModel(e) {
		let t = JSON.parse(e);
		if (t == null) return {
			name: "???",
			type: T.String,
			optional: !0
		};
		let n = typeof t, r = {
			name: "???",
			type: di[n === "object" ? Array.isArray(t) ? "array" : "*" in t ? "map" : "object" : n]
		};
		if (r.type === T.Object) {
			r.children = [];
			for (let e in t) {
				let n = t[e];
				mi(n, e, r.children);
			}
		} else r.type === T.Array ? (r.children = [], mi(t[0], "*", r.children)) : r.type === T.Map && (r.children = [], mi(t["*"], "*", r.children));
		return r;
	},
	schemaModelToJson(e) {
		let t = hi(e.type);
		return e.children && gi(e.children, e.type, t), JSON.stringify(t, null, 4);
	}
};
function vi(e, t) {
	return e.map((e) => {
		let n = oe(e.name, !1, t, !1), r = {
			...e,
			id: n
		};
		return r.children = e.children ? vi(e.children, n) : void 0, r;
	});
}
function yi(e, t, n) {
	return e.map((e) => bi(e, t, n));
}
function bi(e, t, n) {
	let { id: r, name: i, type: a, optional: o } = e, s = e.children || [], c = typeof n == "string" ? oe(i, !1, n, !1) : void 0, l = t[i], u = l?.value, d = l?.children, f = d?.reduce((e, t) => (e[t.name] = t, e), {}), p = s.length && d, m = u ? u.type === a && u.optional === o ? u : {
		...u,
		type: a,
		optional: o
	} : {
		type: a,
		optional: o,
		source: D.Variable,
		text: ""
	};
	if (!p && m.text === "*" && (m.text = ""), p) {
		let { id: e, type: t, optional: n, children: r } = s[0];
		if (a === T.Array || a === T.Map) {
			if (m.text === "*") {
				if (a === T.Array) {
					s = [];
					let i = 0;
					for (; Object.hasOwn(f, `${i}`);) s.push({
						name: `${i}`,
						id: e,
						type: t,
						optional: n,
						children: r
					}), i++;
					s.length || s.push({
						name: "0",
						id: e,
						type: t,
						optional: n,
						children: r
					});
				} else a === T.Map && (s = Object.keys(f).map((i) => ({
					name: i,
					id: e,
					type: t,
					optional: n,
					children: r
				})), s.length || s.push({
					name: "???",
					id: e,
					type: t,
					optional: n,
					children: r
				}));
			} else s = [{
				name: "*",
				id: e,
				type: t,
				optional: n,
				children: r
			}];
		} else m = {
			type: a,
			optional: o,
			source: D.Template,
			text: "*"
		};
	}
	let h = {
		name: i,
		value: m,
		children: p ? yi(s, f || {}, c) : void 0
	};
	return typeof n == "string" && (h.id = c, h.schemaId = r), h;
}
var G = {
	getValueMode(e) {
		let t = e.value, n = t.type;
		return n === T.Object ? t.text === "*" ? "deconstruct" : "assign" : n === T.Array || n === T.Map ? t.text === "*" ? "deconstruct" : e.children ? "mapping" : "assign" : "assign";
	},
	valueModeIsMapping(e) {
		let t = e.value, n = e.value.type;
		return !!((n === T.Array || n === T.Map) && t.text !== "*" && e.children);
	},
	toSchemaValueTree(e, t) {
		return vi(e, t);
	},
	createSchemaValueByModel(e, t, n) {
		return bi(n ? e : W.toSchemaModelTree(e), { [e.name]: t });
	},
	createSchemaValueTreeByModel(e, t, n = "", r) {
		return bi(r ? e : W.toSchemaModelTree(e), { [e.name]: t }, n);
	},
	checkForm(e) {
		return e.querySelector(".ͼbaseflow-SuperInput[data-error]")?.getAttribute("data-error") || "";
	},
	matchSchemaValueByModel(e, t) {
		if (e.name !== t.name && e.name !== "*") return `(${t.name})${O.nameMismatch}`;
		if (e.type !== t.value.type) return `(${t.name})${O.typeMismatch}`;
		if (e.optional !== t.value.optional) return `(${t.name})${O.optionalMismatch}`;
		let n = e.children, r = t.children;
		if (!n && r || n && !r && t.value.text === "*") return `(${t.name})${O.structureMismatch}`;
		if (n && r) {
			if (e.type === T.Object) {
				if (r.length !== n.length) return `(${t.name})${O.structureMismatch}`;
				let e = r.reduce((e, t) => (e[t.name] = t, e), {});
				for (let t = 0, r = n.length; t < r; t++) {
					let r = n[t], i = e[r.name];
					if (i) {
						let e = G.matchSchemaValueByModel(r, i);
						if (e) return e;
					} else return `(${r.name})${O.requiredPrompt}`;
				}
			} else {
				let e = n[0];
				for (let t = 0, n = r.length; t < n; t++) {
					let n = r[t], i = G.matchSchemaValueByModel(e, n);
					if (i) return i;
				}
			}
		}
	},
	setValueMode(e, t, n) {
		let r = t.children || [];
		n !== "assign" && !r[0] && (n = "assign");
		let i = t.type, a = {
			type: i,
			optional: t.optional,
			source: n === "deconstruct" ? D.Template : D.Variable,
			text: n === "deconstruct" ? "*" : ""
		};
		if (n === "assign") return {
			...e,
			value: a,
			children: void 0
		};
		let { id: o, name: s, type: c, optional: l, children: u } = r[0];
		(i === T.Array || i === T.Map) && (r = [{
			name: n === "deconstruct" ? i === T.Array ? "0" : "???" : s,
			id: o,
			type: c,
			optional: l,
			children: u
		}]);
		let d = yi(r, {}, e.id);
		return {
			...e,
			value: a,
			children: d
		};
	},
	createNoDuplicateKey(e, t = "???") {
		let n = 1, r = t + n;
		for (; e[r];) n++, r = t + n;
		return r;
	}
};
var xi = /* @__PURE__ */ w((/* @__PURE__ */ S(((e, t) => {
	(function() {
		var e = {}.hasOwnProperty;
		function n() {
			for (var e = "", t = 0; t < arguments.length; t++) {
				var n = arguments[t];
				n && (e = i(e, r(n)));
			}
			return e;
		}
		function r(t) {
			if (typeof t == "string" || typeof t == "number") return t;
			if (typeof t != "object") return "";
			if (Array.isArray(t)) return n.apply(null, t);
			if (t.toString !== Object.prototype.toString && !t.toString.toString().includes("[native code]")) return t.toString();
			var r = "";
			for (var a in t) e.call(t, a) && t[a] && (r = i(r, a));
			return r;
		}
		function i(e, t) {
			return t ? e ? e + " " + t : e + t : e;
		}
		t !== void 0 && t.exports ? (n.default = n, t.exports = n) : typeof define == "function" && typeof define.amd == "object" && define.amd ? define("classnames", [], function() {
			return n;
		}) : window.classNames = n;
	})();
})))(), 1);
function Si(e, t, n, r = 9999) {
	let i = 0;
	do {
		if (i++, t(e)) return e;
		e = e.parentElement;
	} while (e && e !== n && i < r);
	return null;
}
function Ci(e, t) {
	let n = (e.getAttribute("class") || "").split(" ");
	n.includes(t) || n.push(t), e.setAttribute("class", n.join(" "));
}
function wi(e, t) {
	let n = (e.getAttribute("class") || "").split(" ").filter((e) => e !== t);
	e.setAttribute("class", n.join(" "));
}
function Ti(e, t, n, r) {
	let i = {
		source: void 0,
		target: void 0,
		folder: void 0
	};
	return {
		onDragStart(e) {
			r?.current && e.dataTransfer.setDragImage(r.current, 0, 0);
			let t = e.target;
			Ci(t, "ͼbaseflow-dragging"), i = { source: t }, n?.(t, !0);
		},
		onDragEnter(t) {
			if (!i.source) return;
			let { target: n, folder: r } = e(t.target);
			i.folder !== r && (i.folder && wi(i.folder, "drop-active"), r && Ci(r, "drop-active"), i.folder = r), i.target !== n && (i.target && wi(i.target, "drop-active"), n && (Ci(n, "drop-active"), t.preventDefault()), i.target = n);
		},
		onDragOver(e) {
			i.target && e.preventDefault();
		},
		onDragEnd(e) {
			i.source && (n?.(i.source, !1), wi(i.source, "ͼbaseflow-dragging")), i.target && wi(i.target, "drop-active"), i.folder && wi(i.folder, "drop-active"), i = {};
		},
		onDrap() {
			i.source && i.target && t(i.source, i.target);
		}
	};
}
var K = {
	domRoles: {
		SuperInput: "ͼbaseflow-SuperInput",
		SuperInputVariables: "ͼbaseflow-SuperInputVariables",
		GraphContiner: "ͼbaseflow-GraphContiner",
		FlowNode: "ͼbaseflow-FlowNode",
		FlowNodePlus: "ͼbaseflow-FlowNodePlus",
		FlowNodeRange: "ͼbaseflow-FlowNodeRange"
	},
	attrRoles: "data-baseflow-role",
	closestTarget: Si,
	addClass: Ci,
	removeClass: wi,
	classNames: (...e) => (0, xi.default)(...e),
	buildDragHandlers: Ti
};
var Ei = "Node";
var q = {
	[T.Any]: "any",
	[T.String]: "string",
	[T.Number]: "number",
	[T.Bool]: "boolean",
	[T.Date]: "_Date_",
	[T.Time]: "_Time_",
	[T.DateTime]: "_DateTime_",
	[T.Object]: "_Object_",
	[T.Map]: "_Map_",
	[T.Array]: "_Array_",
	[T.File]: "_File_"
};
var Di = " | null | undefined";
var Oi = [`declare const ${ei}: unique symbol;
declare const ${ti}: string;
interface ${q[T.Time]} {
  [${ei}]: 'Time';
  toString: () => string;
};
interface ${q[T.Date]} {
  [${ei}]: 'Date';
  toString: () => string;
};
interface ${q[T.DateTime]} {
  [${ei}]: 'DateTime';
  toString: () => string;
};
interface ${q[T.File]} {
  [${ei}]: 'File';
  toString: () => string;
  fileName: string;
  fileSize: number;
};
type ${q[T.Object]} = { [key: string]: any };
type ${q[T.Map]} = { [key: string]: any };
type ${q[T.Array]} = any[];
type _Iterator_ = number | { [key: string]: any };
type _IMapItems_<T, Keys extends keyof T = keyof T> = Keys extends any ? { [K in keyof T]: T[Keys] } : never;
function ${H._string}(value: any): string;
function ${H._number}(value: any): number;
function ${H._boolean}(value: any): boolean;
function ${H._any}(value: any): any;
function ${H._date}(value: any): ${q[T.Date]};
function ${H._time}(value: any): ${q[T.Time]};
function ${H._datetime}(value: any): ${q[T.DateTime]};
function ${H._path}<T>(value: T, ...args: any[]): T;
function ${U._createMap}<T extends {[key:string]: any}>(obj: T & (T extends _IMapItems_<T> ? unknown : never)): T;
function ${U._loopKeyValue}<A extends number>(arr: A): {${z}: number; ${B}: number; ${V}: number};
function ${U._loopKeyValue}<A extends any[]>(arr: A): {${z}: A[0]; ${B}: number; ${V}: number};
function ${U._loopKeyValue}<A extends {[key: string]: any}>(arr: A): {${z}: A[0]; ${B}: string; ${V}: number};
function ${U._arrayPush}<A extends any[]>(arr: A, ...item: A): A;
function ${U._mappingEach}<A extends {[key: string | number]: any}, T extends number>(target: A, source: T, reduce: (${z}: number, ${B}: number, ${V}: number) => A[0]);
function ${U._mappingEach}<A extends {[key: string | number]: any}, T extends any[]>(target: A, source: T, reduce: (${z}: T[0], ${B}: number, ${V}: number) => A[0]);
function ${U._mappingEach}<A extends {[key: string | number]: any}, T extends {[key: string]: any}>(target: A, source: T, reduce: (${z}: T[0], ${B}: string, ${V}: number) => A[0]);
function ${U._matchVariable}<T, U extends T>(variable: T, value: U): void;
  `];
function ki(e) {
	let t = [];
	return R.each(e, (e) => {
		e.outputSchema && t.push(`const ${e.id}: ${Ei}.${e.id};`);
	}), t.join("\n");
}
var J = {
	A: "{⫻",
	B: "⫻}",
	REG: "\\{⫻([^⫻]+?)⫻\\}",
	VarTag: "CITE",
	toJSTpl(e) {
		return e ? `\`${e.replace(new RegExp(J.REG, "g"), (e, t) => `\${${t}}`)}\`` : "";
	},
	hasVariable(e) {
		return new RegExp(J.REG).test(e);
	},
	extractVariable(e) {
		return e.match(new RegExp(J.REG, "g"))?.map((e) => e.slice(2, -2));
	},
	wrapVariable(e) {
		return `${J.A}${e}${J.B}`;
	},
	getPureValue(e) {
		let t = J.extractVariable(e);
		return t ? t.length === 1 && J.wrapVariable(t[0]) === e ? t[0] : "" : e;
	},
	getSingleVariable(e) {
		let t = J.extractVariable(e);
		return t && t.length === 1 && J.wrapVariable(t[0]) === e ? t[0] : "";
	}
};
function Ai(e) {
	return !!(ne[e.source] && e.text);
}
function ji(e) {
	return !!(E[e.type] && e.name);
}
function Mi(e) {
	return !!(e.value && ne[e.value.source] && e.name);
}
function Ni(e, t, n, r = { current: 0 }, i = "") {
	let a = `${i}const v${r.current++}`;
	if (t) n.push(`${a}: _Iterator_ = ${e.text || "null"};`);
	else {
		let t = `${a}: ${q[e.type]}${e.optional ? Di : ""} = `;
		if (e.text) {
			if (e.source !== D.Template) n.push(`${t}${e.text};`);
			else if (e.text !== "*") {
				let r = J.extractVariable(e.text);
				r && (r.length === 1 && J.wrapVariable(r[0]) === e.text ? n.push(`${t}${r[0]};`) : r.forEach((e) => {
					n.push(`${i}${e};`);
				}));
			}
		} else n.push(`${t}null;`);
	}
}
function Pi(e, t, n, r = 0, i = "") {
	let a = "    ".repeat(r), o = G.valueModeIsMapping(e);
	if (Ni(e.value, o, t, n, a), o) {
		t.push(`${a}{`);
		let { text: n, source: r } = e.value;
		if (!n || r !== D.Variable && /\D/.test(n) || new RegExp($r).test(n) && !i) t.push(`${a}    const ${Qr} = undefined;`), t.push(`${a}    const ${V} = undefined;`), t.push(`${a}    const ${z} = undefined;`), t.push(`${a}    const ${B} = undefined;`), i = "";
		else if (/\D/.test(n)) {
			let e = n.replace(new RegExp($r), i);
			t.push(`${a}    const ${Qr} = ${e};`), t.push(`${a}    const {${V}, ${z}, ${B}} = ${U._loopKeyValue}(${Qr});`), i = `${e}[0]`;
		} else t.push(`${a}    const ${Qr}: number[] = null as any;`), t.push(`${a}    const ${V}: number = null as any;`), t.push(`${a}    const ${z}: number = null as any;`), t.push(`${a}    const ${B}: number = null as any;`), i = "";
	}
	let s = e.children;
	if (s) for (let e = 0, a = s.length; e < a; e++) Pi(s[e], t, n, o ? r + 1 : r, i);
	o && t.push(`${a}}`);
}
function Fi(e, t) {
	let n = { current: 0 };
	for (let r in e) {
		let i = e[r];
		i && typeof i == "object" && (Mi(i) ? Pi(i, t, n) : Ai(i) ? Ni(i, !1, t, n, "") : ji(i) || Fi(i, t));
	}
}
function Ii(e) {
	let t = [];
	return Fi(e, t), t;
}
function Li(e, t = []) {
	return e && (/\D/.test(e) ? (t.push(`const ${Qr} = ${e};`), t.push(`const {${V}, ${z}, ${B}} = ${U._loopKeyValue}(${Qr});`)) : (t.push(`const ${Qr}: number[] = null as any;`), t.push(`const ${V}: number = null as any;`), t.push(`const ${z}: number = null as any;`), t.push(`const ${B}: number = null as any;`))), t.join("\n");
}
function Ri(e, t, n) {
	let r = [];
	return Li(t, r), Ni(e, n, r), r.join("\n");
}
function zi(e, t, n, r, i, a) {
	let o = " ".repeat((t - 1) * 2);
	if (n) {
		let n = e[0];
		return n.type === T.Array ? (r.push(`${o}Array<`), zi(n.children || [], t + 1, !0, r, `${i + "⫻" + (n.optional ? "?" : "!")}0`, n), r.push(`${o}${n.optional ? Di : ""}>`)) : n.type === T.Object || n.type === T.Map ? (r.push(`${o}Array<{`), zi(n.children || [], t + 1, !1, r, `${i + "⫻" + (n.optional ? "?" : "!")}0`, n), r.push(`${o}}${n.optional ? Di : ""}>`)) : n.optional ? r.push(`${o}(${q[n.type]} | null)[]`) : r.push(`${o}${q[n.type]}[]`), r;
	}
	{
		let n = a?.type === T.Map;
		return e.forEach((e) => {
			let a = i ? `${i}⫻${e.optional ? "?" : "!"}${e.name}` : `${e.optional ? "?" : "!"}${e.name}`;
			n || r.push(`${o}/** [@${a.substring(1).replace(/* @__PURE__ */ RegExp("⫻[?!]+", "g"), "->").replace(/([[\]])/g, "\\$1")}](@/${a.replace(/([()])/g, "\\$1")}) */`);
			let s = e.optional ? Di : "", c = t === 1 ? `${o}type ${e.name} = ` : n ? `${o}[key: string]: ` : `${o}"${e.name.replace(/"/g, "\\\"")}"${e.optional ? "?" : ""}: `;
			if (e.type === T.Object || e.type === T.Map) r.push(`${c}{`), zi(e.children || [], t + 1, !1, r, a, e), r.push(`${o}}${s};`);
			else if (e.type === T.Array) {
				let n = (e.children || [])[0] || {
					name: "*",
					type: T.Any
				};
				n.type === T.Object || n.type === T.Map ? (r.push(`${c}Array<{`), zi(n.children || [], t + 1, !1, r, `${a + "⫻" + (n.optional ? "?" : "!")}0`, n), r.push(`${o}}${n.optional ? Di : ""}>${s};`)) : n.type === T.Array ? (r.push(`${c}Array<`), zi(n.children || [], t + 1, !0, r, `${a + "⫻" + (n.optional ? "?" : "!")}0`, n), r.push(`${o}${n.optional ? Di : ""}>${s};`)) : n.optional ? r.push(`${c}(${q[n.type]} | null)[]${s};`) : r.push(`${c}${q[n.type]}[]${s};`);
			} else r.push(`${c}${q[e.type]}${s};`);
		}), r;
	}
}
function Bi(e) {
	return zi(e, 1, !1, [], "", null);
}
function Vi(e, t, n, r = 0, i = !1) {
	let a = " ".repeat(r * 2), o = G.getValueMode(e), { name: s, children: c } = e, { type: l, text: u, source: d } = e.value, f = s === "*" ? "0" : s.replace(/"/g, "\\\""), p = i || r === 0 ? `${a}` : `${a}"${f}": `, m = r === 0 ? n : `${n}["${f}"]`, h = r === 0 ? "" : ",";
	if (o === "assign") t.push(`${p}${d === D.Template ? "'' as any" : u || "null"}${h}`);
	else if (o === "deconstruct") {
		let e = l === T.Array;
		t.push(`${p}${e ? `${U._arrayPush}(${m}!, ` : "{"}`), c?.forEach((n) => {
			Vi(n, t, m, r + 1, e);
		}), t.push(`${a}${e ? ")" : "}"}${h}`);
	} else o === "mapping" && (t.push(`${p}${U._mappingEach}(${m}!, ${u || "null"}, (${z}, ${B}, ${V}) => (`), c?.forEach((e) => {
		Vi(e, t, m, r + 1, !0);
	}), t[t.length - 1] = t[t.length - 1].replace(/,$/, ""), t.push(`)${a})${h}`));
}
function Hi(e) {
	let { variable: t } = si.matchVariable(e.path);
	if (e.value) {
		let n = [];
		return Vi(e.value, n, t), `    ${U._matchVariable}(${t}, ${n.join("\n")});`;
	}
	return `    ${U._matchVariable}(${t}, undefined);`;
}
var Ui = {
	NodeFlag: ae,
	NodeNamespace: Ei,
	systemDTS: Oi,
	superInputToInspector: Ri,
	propsToInspector: Ii,
	contextToInspector: Li,
	deviceToVariable: ki,
	schemaToDTS: Bi,
	schemaValueToSRC: Hi
};
var Wi = {
	locale: "",
	monacoEditorUrl: "/monaco/index.html"
};
function Gi({ locale: e, lang: t, monacoEditorUrl: n, expressionUtils: r }) {
	t && Object.assign(O, t), e && (Wi.locale = e), n && (Wi.monacoEditorUrl = n), r && ai(r);
}
function Ki() {
	return Wi.locale;
}
var qi = { validateContextExpression: 50 };
if (!window["@baseflow/schema"]) {
	let e = 1, t;
	class n {
		proxy;
		bindId;
		tsServer;
		iframe;
		callback = {
			resolve: () => void 0,
			reject: () => void 0
		};
		validateSuperInputTimer;
		constructor() {
			let e = document.createElement("iframe");
			this.iframe = e, e.className = "ͼbaseflow-sr-monaco", e.src = Wi.monacoEditorUrl, document.body.appendChild(e), this.proxy = new Promise((e, t) => {
				this.callback = {
					resolve: e,
					reject: t
				};
			});
		}
		init(e) {
			this.tsServer = e, e.ss(Ui.systemDTS.join("\n")), this.callback.resolve({
				tsServer: e,
				editorDom: this.iframe,
				validateSuperInput: this.validateSuperInput.bind(this)
			});
		}
		destory = () => {
			this.iframe.remove(), t = void 0;
		};
		bindApp(e) {
			this.bindId = e;
		}
		validateSuperInput(e, t, n) {
			this.validateSuperInputTimer ||= {
				timer: setTimeout(() => {
					let e = this.validateSuperInputTimer.items;
					this.validateSuperInputTimer = void 0, this.commitValidateSuperInput(e);
				}, qi.validateContextExpression),
				items: {}
			};
			let r = this.validateSuperInputTimer.items;
			r[e] = {
				validator: t,
				callback: n
			};
		}
		commitValidateSuperInput(e) {
			let t = [];
			for (let n in e) {
				let r = e[n];
				t.push(ie + n), t.push("{"), t.push(r.validator), t.push("}");
			}
			let n = t.join("\n");
			this.tsServer?.ce(n, ie).then((t) => {
				for (let n in e) e[n].callback(t[n] || "");
			});
		}
	}
	window[ee] = {
		createUID: () => (e++, e),
		initTSServer: (e) => {
			t && t.init(e);
		},
		createValidateProvider() {
			return t ||= new n(), t;
		}
	};
}
var Ji = window[ee];
var Yi = {
	message: {
		error: (e) => alert(e),
		success: (e) => alert(e),
		warning: (e) => alert(e),
		info: (e) => alert(e)
	},
	confirm: (e, t) => {
		window.confirm(e) ? t(!0) : t(!1);
	},
	clipboard: {
		write: (e) => navigator.clipboard ? navigator.clipboard.writeText(e) : Promise.resolve(localStorage.setItem("@baseflow-clipboard", e)),
		read: () => navigator.clipboard ? navigator.clipboard.readText() : Promise.resolve(localStorage.getItem("@baseflow-clipboard") || "")
	}
};
function Xi(e) {
	Object.assign(Yi, e);
}
var Zi = G.createSchemaValueByModel;
var Y = {
	ArrowRight: "ArrowRight",
	ArrowLeft: "ArrowLeft",
	ArrowDown: "ArrowDown",
	Align: "Align",
	Export: "Export",
	Empty: "Empty",
	Import: "Import",
	Close: "Close",
	CloseFilled: "CloseFilled",
	Edit: "Edit",
	Delete: "Delete",
	DownCircle: "DownCircle",
	Cut: "Cut",
	Copy: "Copy",
	CheckCircle: "CheckCircle",
	CloseCircle: "CloseCircle",
	Switch: "Switch",
	Undo: "Undo",
	Redo: "Redo",
	BoldPlus: "BoldPlus",
	CloudUpload: "CloudUpload",
	CloudDownload: "CloudDownload",
	Stop: "Stop",
	Increase: "Increase",
	Decrease: "decrease",
	Plus: "Plus",
	Minus: "Minus",
	Fit: "Fit",
	Code: "Code",
	Dagre: "Dagre",
	Run: "Run",
	AddNext: "AddNext",
	AddSub: "AddSub",
	Pause: "Pause",
	PlusNext: "PlusNext",
	PlusSub: "PlusSub",
	PlusCircle: "PlusCircle",
	MinusCircle: "MinusCircle",
	Loop: "Loop",
	Down: "Down",
	Debug: "Debug",
	Help: "Help",
	History: "History",
	Info: "Info",
	Options: "Options",
	Versions: "Versions",
	XML: "XML",
	JSON: "JSON"
};
var X = (0, import_react.memo)(function({ className: e, name: t, button: n, role: r, ...i }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "img",
		"data-baseflow-role": r,
		className: K.classNames("ͼbaseflow-sr-icon", e, { "ͼbaseflow-sr-btn": n }),
		...i,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			"aria-hidden": "true",
			width: "1em",
			height: "1em",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("use", { href: `#@baseflow-icon-${t}` })
		})
	});
});
var Qi = {
	name: Y.AddNext,
	box: "0 0 500 500",
	content: "<path d=\"M 430 319.997 C 430 419.406 349.409 500 250.003 500 C 150.591 500 70 419.406 70 319.997 C 70 227.353 140.001 151.049 230 141.099 L 230 60 L 85 60 L 85 0 L 415 0 L 415 60 L 270 60 L 270 141.098 C 359.996 151.047 430 227.351 430 319.997 Z M 140.497 343.956 L 226.046 343.956 L 226.046 429.5 L 273.958 429.5 L 273.958 343.956 L 359.508 343.956 L 359.508 296.046 L 273.958 296.046 L 273.958 210.495 L 226.046 210.495 L 226.046 296.046 L 140.497 296.046 Z\"></path>"
};
var $i = {
	name: Y.AddSub,
	box: "0 0 500 500",
	content: "<path d=\"M 0.078 0 L 330 0.456 L 329.922 60.456 L 40 60.055 L 40 311.553 L 140.195 311.553 C 144.605 216.066 223.42 140 320.002 140 C 419.409 140 500 220.59 500 319.998 C 500 419.408 419.409 500 320.002 500 C 231.354 500 157.675 435.918 142.757 351.553 L 20 351.553 C 8.954 351.553 0 342.599 0 331.553 L 0 42.56 L 0.023 42.56 Z M 210.495 343.956 L 296.045 343.956 L 296.045 429.501 L 343.958 429.501 L 343.958 343.956 L 429.507 343.956 L 429.507 296.046 L 343.958 296.046 L 343.958 210.494 L 296.045 210.494 L 296.045 296.046 L 210.495 296.046 Z\"></path>"
};
var ea = {
	name: Y.Align,
	box: "64 64 896 896",
	content: "<path d=\"M264 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm496 424c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496zm144 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z\"></path>"
};
var ta = {
	name: Y.ArrowDown,
	box: "0 0 1024 1024",
	content: "<path d=\"M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z\"></path>"
};
var na = {
	name: Y.ArrowLeft,
	box: "0 0 1024 1024",
	content: "<path d=\"M689 165.1L308.2 493.5c-10.9 9.4-10.9 27.5 0 37L689 858.9c14.2 12.2 35 1.2 35-18.5V183.6c0-19.7-20.8-30.7-35-18.5z\"></path>"
};
var ra = {
	name: Y.ArrowRight,
	box: "-100 0 1024 1024",
	content: "<path d=\"M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z\" />"
};
var ia = {
	name: Y.BoldPlus,
	box: "0 0 1024 1024",
	content: "<path d=\"M576 192 448 192 448 448 192 448 192 576 448 576 448 832 576 832 576 576 832 576 832 448 576 448Z\"></path>"
};
var aa = {
	name: Y.CheckCircle,
	box: "64 64 896 896",
	content: "<path d=\"M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path>"
};
var oa = {
	name: Y.Close,
	box: "64 64 896 896",
	content: "<path d=\"M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z\"></path>"
};
var sa = {
	name: Y.CloseCircle,
	box: "64 64 896 896",
	content: "<path d=\"M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm128.01 198.83c.03 0 .05.01.09.06l45.02 45.01a.2.2 0 01.05.09.12.12 0 010 .07c0 .02-.01.04-.05.08L557.25 512l127.87 127.86a.27.27 0 01.05.06v.02a.12.12 0 010 .07c0 .03-.01.05-.05.09l-45.02 45.02a.2.2 0 01-.09.05.12.12 0 01-.07 0c-.02 0-.04-.01-.08-.05L512 557.25 384.14 685.12c-.04.04-.06.05-.08.05a.12.12 0 01-.07 0c-.03 0-.05-.01-.09-.05l-45.02-45.02a.2.2 0 01-.05-.09.12.12 0 010-.07c0-.02.01-.04.06-.08L466.75 512 338.88 384.14a.27.27 0 01-.05-.06l-.01-.02a.12.12 0 010-.07c0-.03.01-.05.05-.09l45.02-45.02a.2.2 0 01.09-.05.12.12 0 01.07 0c.02 0 .04.01.08.06L512 466.75l127.86-127.86c.04-.05.06-.06.08-.06a.12.12 0 01.07 0z\"></path>"
};
var ca = {
	name: Y.CloseFilled,
	box: "64 64 896 896",
	content: "<path d=\"M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z\"></path>"
};
var la = {
	name: Y.CloudDownload,
	box: "0 0 230 230",
	content: "<g transform=\"matrix(1, 0, 0, 1, -270.3800, -1.1368)\">\n  <path d=\"M 386.998 219.18 C 386.175 220.23 384.585 220.23 383.764 219.18 L 355.014 182.806 C 354.041 181.565 354.777 179.736 356.339 179.515 C 356.435 179.501 356.533 179.494 356.631 179.495 L 375.601 179.495 L 375.601 109.272 C 375.601 108.143 376.524 107.219 377.655 107.219 L 393.056 107.219 C 394.185 107.219 395.11 108.143 395.11 109.272 L 395.11 179.469 L 414.131 179.469 C 415.85 179.469 416.801 181.446 415.748 182.78 L 386.998 219.18 Z\"/>\n  <path d=\"M 462.235 77.318 C 450.479 46.308 420.523 24.258 385.432 24.258 C 350.342 24.258 320.385 46.283 308.628 77.292 C 286.629 83.067 270.38 103.115 270.38 126.937 C 270.38 155.302 293.355 178.276 321.694 178.276 L 331.987 178.276 C 333.117 178.276 334.041 177.352 334.041 176.223 L 334.041 160.821 C 334.041 159.692 333.117 158.767 331.987 158.767 L 321.694 158.767 C 313.043 158.767 304.906 155.327 298.848 149.09 C 292.816 142.878 289.607 134.509 289.889 125.833 C 290.121 119.056 292.43 112.69 296.615 107.326 C 300.902 101.858 306.908 97.879 313.582 96.108 L 323.311 93.566 L 326.88 84.171 C 329.087 78.319 332.167 72.85 336.044 67.896 C 339.87 62.987 344.403 58.669 349.494 55.088 C 360.045 47.669 372.469 43.742 385.432 43.742 C 398.396 43.742 410.82 47.669 421.37 55.088 C 426.478 58.681 430.996 62.994 434.82 67.896 C 438.696 72.85 441.776 78.344 443.984 84.171 L 447.527 93.54 L 457.229 96.108 C 471.143 99.855 480.872 112.51 480.872 126.937 C 480.872 135.434 477.56 143.443 471.553 149.449 C 465.603 155.434 457.506 158.789 449.067 158.767 L 438.773 158.767 C 437.644 158.767 436.719 159.692 436.719 160.821 L 436.719 176.223 C 436.719 177.352 437.644 178.276 438.773 178.276 L 449.067 178.276 C 477.406 178.276 500.38 155.302 500.38 126.937 C 500.38 103.141 484.182 83.119 462.235 77.318 Z\"/>\n  </g>"
};
var ua = {
	name: Y.CloudUpload,
	box: "64 64 896 896",
	content: "<path d=\"M518.3 459a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z\"></path><path d=\"M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z\"></path>"
};
var da = {
	name: Y.Code,
	box: "183 243 103.68 93.433",
	content: "<path d=\"M 186.044 280.381 C 184.896 280.381 183.958 279.443 183.958 278.295 L 183.958 245.865 C 183.958 244.717 184.896 243.778 186.044 243.778 L 241.817 243.778 C 242.965 243.778 243.904 244.717 243.904 245.865 L 243.904 278.295 C 243.904 279.443 242.965 280.381 241.817 280.381 L 186.044 280.381 Z M 193.347 270.991 L 234.514 270.991 L 234.514 253.168 L 193.347 253.168 L 193.347 270.991 Z M 254.337 271.252 C 254.337 270.679 254.807 270.209 255.381 270.209 L 286.594 270.209 C 287.168 270.209 287.637 270.679 287.637 271.252 L 287.637 278.556 C 287.637 279.129 287.168 279.599 286.594 279.599 L 255.381 279.599 C 254.807 279.599 254.337 279.129 254.337 278.556 L 254.337 271.252 Z M 254.337 252.907 L 254.337 245.604 C 254.337 245.03 254.807 244.561 255.381 244.561 L 286.594 244.561 C 287.168 244.561 287.637 245.03 287.637 245.604 L 287.637 252.907 C 287.637 253.481 287.168 253.951 286.594 253.951 L 255.381 253.951 C 254.807 253.951 254.337 253.481 254.337 252.907 Z M 186.045 337.211 C 184.897 337.211 183.959 336.273 183.959 335.125 L 183.959 302.695 C 183.959 301.547 184.897 300.608 186.045 300.608 L 241.818 300.608 C 242.966 300.608 243.905 301.547 243.905 302.695 L 243.905 335.125 C 243.905 336.273 242.966 337.211 241.818 337.211 L 186.045 337.211 Z M 193.348 327.821 L 234.515 327.821 L 234.515 309.998 L 193.348 309.998 L 193.348 327.821 Z M 254.338 328.082 C 254.338 327.509 254.808 327.039 255.382 327.039 L 286.595 327.039 C 287.169 327.039 287.638 327.509 287.638 328.082 L 287.638 335.386 C 287.638 335.959 287.169 336.429 286.595 336.429 L 255.382 336.429 C 254.808 336.429 254.338 335.959 254.338 335.386 L 254.338 328.082 Z M 254.338 309.737 L 254.338 302.434 C 254.338 301.86 254.808 301.391 255.382 301.391 L 286.595 301.391 C 287.169 301.391 287.638 301.86 287.638 302.434 L 287.638 309.737 C 287.638 310.311 287.169 310.781 286.595 310.781 L 255.382 310.781 C 254.808 310.781 254.338 310.311 254.338 309.737 Z\"></path>"
};
var fa = {
	name: Y.Copy,
	box: "207.054 191.403 178.89 227.674",
	content: "<path d=\"M 377.814 203.6 L 350.364 203.6 L 350.364 193.436 C 350.364 192.318 349.454 191.403 348.334 191.403 L 334.104 191.403 C 332.984 191.403 332.074 192.318 332.074 193.436 L 332.074 203.6 L 293.444 203.6 L 293.444 193.436 C 293.444 192.318 292.534 191.403 291.414 191.403 L 277.184 191.403 C 276.064 191.403 275.154 192.318 275.154 193.436 L 275.154 203.6 L 247.714 203.6 C 243.214 203.6 239.584 207.234 239.584 211.731 L 239.584 242.224 L 215.184 242.224 C 210.684 242.224 207.054 245.857 207.054 250.355 L 207.054 410.946 C 207.054 415.443 210.684 419.077 215.184 419.077 L 341.284 419.077 C 345.784 419.077 349.414 415.443 349.414 410.946 L 349.414 386.552 L 377.814 386.552 C 382.304 386.552 385.944 382.918 385.944 378.421 L 385.944 211.731 C 385.944 207.234 382.304 203.6 377.814 203.6 Z M 331.124 400.782 L 225.354 400.782 L 225.354 260.519 L 276.744 260.519 L 276.744 304.732 C 276.744 310.347 281.294 314.896 286.904 314.896 L 331.124 314.896 L 331.124 400.782 Z M 331.124 298.634 L 293.004 298.634 L 293.004 260.519 L 293.054 260.519 L 331.124 298.583 L 331.124 298.634 Z M 367.644 368.257 L 349.414 368.257 L 349.414 291.011 L 300.624 242.224 L 257.874 242.224 L 257.874 221.895 L 275.154 221.895 L 293.444 221.895 L 332.074 221.895 L 350.364 221.895 L 367.644 221.895 L 367.644 368.257 Z\" />"
};
var pa = {
	name: Y.Cut,
	box: "64 64 896 896",
	content: "<path d=\"M567.1 512l318.5-319.3c5-5 1.5-13.7-5.6-13.7h-90.5c-2.1 0-4.2.8-5.6 2.3l-273.3 274-90.2-90.5c12.5-22.1 19.7-47.6 19.7-74.8 0-83.9-68.1-152-152-152s-152 68.1-152 152 68.1 152 152 152c27.7 0 53.6-7.4 75.9-20.3l90 90.3-90.1 90.3A151.04 151.04 0 00288 582c-83.9 0-152 68.1-152 152s68.1 152 152 152 152-68.1 152-152c0-27.2-7.2-52.7-19.7-74.8l90.2-90.5 273.3 274c1.5 1.5 3.5 2.3 5.6 2.3H880c7.1 0 10.7-8.6 5.6-13.7L567.1 512zM288 370c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm0 444c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z\"></path>"
};
var ma = {
	name: Y.Dagre,
	box: "64 64 896 896",
	content: "<path d=\"M908 640H804V488c0-4.4-3.6-8-8-8H548v-96h108c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h108v96H228c-4.4 0-8 3.6-8 8v152H116c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16H292v-88h440v88H620c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16zm-564 76v168H176V716h168zm84-408V140h168v168H428zm420 576H680V716h168v168z\"></path>"
};
var ha = {
	name: Y.Debug,
	box: "64 64 896 896",
	content: "<path d=\"M304 280h56c4.4 0 8-3.6 8-8 0-28.3 5.9-53.2 17.1-73.5 10.6-19.4 26-34.8 45.4-45.4C450.9 142 475.7 136 504 136h16c28.3 0 53.2 5.9 73.5 17.1 19.4 10.6 34.8 26 45.4 45.4C650 218.9 656 243.7 656 272c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-40-8.8-76.7-25.9-108.1a184.31 184.31 0 00-74-74C596.7 72.8 560 64 520 64h-16c-40 0-76.7 8.8-108.1 25.9a184.31 184.31 0 00-74 74C304.8 195.3 296 232 296 272c0 4.4 3.6 8 8 8z\"></path><path d=\"M940 512H792V412c76.8 0 139-62.2 139-139 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8a63 63 0 01-63 63H232a63 63 0 01-63-63c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 76.8 62.2 139 139 139v100H84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h148v96c0 6.5.2 13 .7 19.3C164.1 728.6 116 796.7 116 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-44.2 23.9-82.9 59.6-103.7a273 273 0 0022.7 49c24.3 41.5 59 76.2 100.5 100.5S460.5 960 512 960s99.8-13.9 141.3-38.2a281.38 281.38 0 00123.2-149.5A120 120 0 01836 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-79.3-48.1-147.4-116.7-176.7.4-6.4.7-12.8.7-19.3v-96h148c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM716 680c0 36.8-9.7 72-27.8 102.9-17.7 30.3-43 55.6-73.3 73.3C584 874.3 548.8 884 512 884s-72-9.7-102.9-27.8c-30.3-17.7-55.6-43-73.3-73.3A202.75 202.75 0 01308 680V412h408v268z\"></path>"
};
var ga = {
	name: Y.Decrease,
	box: "64 64 896 896",
	content: "<path d=\"M328 544h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z\"></path>"
};
var _a = {
	name: Y.Delete,
	box: "199.548 216.473 128.723 134.085",
	content: "<path d=\"M 238.433 240.607 L 289.386 240.607 L 289.386 228.54 L 290.727 228.54 C 289.989 228.54 289.386 227.939 289.386 227.198 L 289.386 228.54 L 238.433 228.54 L 238.433 227.198 C 238.433 227.939 237.83 228.54 237.092 228.54 L 238.433 228.54 L 238.433 240.607 Z M 301.453 240.607 L 322.907 240.607 C 325.874 240.607 328.271 243.006 328.271 245.97 L 328.271 251.333 C 328.271 252.073 327.667 252.675 326.93 252.675 L 316.806 252.675 L 312.666 340.334 C 312.398 346.066 307.688 350.558 301.956 350.558 L 225.862 350.558 C 220.147 350.558 215.421 346.05 215.152 340.334 L 211.012 252.675 L 200.889 252.675 C 200.152 252.675 199.548 252.073 199.548 251.333 L 199.548 245.97 C 199.548 243.006 201.945 240.607 204.912 240.607 L 226.365 240.607 L 226.365 227.198 C 226.365 221.284 231.176 216.473 237.092 216.473 L 290.727 216.473 C 296.643 216.473 301.453 221.284 301.453 227.198 L 301.453 240.607 Z M 304.722 252.675 L 223.097 252.675 L 227.153 338.49 L 257.505 338.49 L 257.505 281.736 L 270.314 281.736 L 270.314 338.49 L 300.666 338.49 L 304.722 252.675 Z\" />"
};
var va = {
	name: Y.Down,
	box: "0 0 1024 1024",
	content: "<path d=\"M512 559.1552l398.1824-389.31456a47.2832 47.2832 0 0 1 68.38272 2.38592 51.5584 51.5584 0 0 1-2.7648 71.40352l-426.1376 410.24c-21.69344 20.74624-56.90368 20.74624-78.62272 0-1.09568-1.04448-142.70976-137.55392-424.85248-409.52832a51.88096 51.88096 0 0 1-2.69312-71.90016 47.80544 47.80544 0 0 1 69.0176-2.4064l399.488 389.12z\"></path>"
};
var ya = {
	name: Y.DownCircle,
	box: "64 64 896 896",
	content: "<path d=\"M690 405h-46.9c-10.2 0-19.9 4.9-25.9 13.2L512 563.6 406.8 418.2c-6-8.3-15.6-13.2-25.9-13.2H334c-6.5 0-10.3 7.4-6.5 12.7l178 246c3.2 4.4 9.7 4.4 12.9 0l178-246c3.9-5.3.1-12.7-6.4-12.7z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path>"
};
var ba = {
	name: Y.Edit,
	box: "2 0 18 20",
	content: "<path d=\"M10.8427581,3.29049799 C11.201201,2.93447931 11.7623576,2.90549653 12.1537974,3.20466412 L12.247906,3.28629312 L16.8505452,7.80340428 C17.217684,8.16372079 17.2475577,8.73689045 16.938996,9.13182034 L16.8548041,9.22661316 L7.3073426,18.709502 C7.15122797,18.8645608 6.94928875,18.962923 6.73351075,18.9914032 L6.60263918,19 L2,19 C1.48716416,19 1.06449284,18.6139598 1.00672773,18.1166211 L1,18 L1,13.4828888 C1,13.2608951 1.07381291,13.0465477 1.20779568,12.8726263 L1.29529659,12.7733868 L10.8427581,3.29049799 Z M11.552,5.405 L3,13.898 L3,17 L6.189,17 L14.726,8.521 L11.552,5.405 Z M14.6835225,0.476509026 L14.7774278,0.560038383 L19.4786615,5.29545958 C19.8677684,5.68739611 19.8654745,6.32055694 19.473538,6.70966386 C19.1117504,7.06883949 18.5444226,7.09451387 18.1532391,6.78806977 L18.0593337,6.70454042 L13.3581001,1.96911922 C12.9689932,1.57718269 12.971287,0.944021865 13.3632235,0.554914937 C13.7250111,0.195739311 14.2923389,0.170064935 14.6835225,0.476509026 Z\" />"
};
var xa = {
	name: Y.Empty,
	box: "0 0 1024 1024",
	content: "<path d=\"M615.565239 262.567068H800.894178L604.662935 65.334008v186.272427c0 5.482875 5.450129 10.960633 10.902304 10.960633z m-1.090845 333.101517H253.629c-13.080923 0-23.984251-10.955516-23.984251-24.102954 0-13.152555 10.904351-24.109094 23.984251-24.109095H629.735983c11.993149 0 20.716834 8.763594 22.895453 19.722181 34.886555-20.820188 75.223239-32.868595 118.826316-32.868595 10.904351 0 21.804608 1.093914 31.616068 2.192945V309.685201H615.565239c-31.614022 0-57.778938-26.301016-57.778938-58.077743V63.142086H111.906208c-26.164916 0-46.876634 20.818141-46.876634 47.11711v756.058529c0 26.292829 20.711717 47.113017 46.876634 47.113017h470.953141a236.410338 236.410338 0 0 1-46.87561-141.349285c0-70.123081 30.523177-133.678582 78.490655-176.412872zM253.629 406.105205H629.735983c13.08604 0 23.985274 10.960633 23.985274 24.109094s-10.899234 24.108071-23.985274 24.10807H253.629c-13.080923 0-23.984251-10.959609-23.984251-24.10807s10.903328-24.109094 23.984251-24.109094zM770.368954 583.615061c-103.567797 0-188.598402 84.372619-188.598402 189.564403 0 104.093776 83.941807 189.56031 188.598402 189.56031 104.656595-1.094938 188.599426-85.467557 188.599425-190.656271 0-104.095823-83.941807-188.468442-188.599425-188.468442z m0 306.806641c-13.0799 0-23.984251-10.955516-23.984251-24.102954 0-13.153578 10.904351-24.108071 23.984251-24.108071 13.080923 0 23.985274 10.95347 23.985274 24.108071 0.001023 14.239306-10.904351 24.102954-23.985274 24.102954z m0-71.223135c-13.0799 0-23.984251-129.294738-23.984251-141.348262 0-12.056594 10.904351-24.111141 23.984251-24.11114 13.080923 0 23.985274 10.960633 23.985274 24.11114 0.001023 13.146415-10.904351 141.348262-23.985274 141.348262z\"></path>"
};
var Sa = {
	name: Y.Export,
	box: "0 0 1024 1024",
	content: "<path d=\"M904 632c30.912 0 56 25.088 56 56v216a56 56 0 0 1-56 56H120A56 56 0 0 1 64 904V688a56 56 0 0 1 112 0v160h672v-160c0-30.912 25.088-56 56-56zM512.192 64c14.336 0 28.672 5.44 39.68 16.384l237.44 237.568a56 56 0 1 1-79.168 79.168l-142.144-142.08v401.728a56 56 0 0 1-112 0V255.36L314.24 397.12A56 56 0 0 1 234.88 317.952l221.248-221.184 16.384-16.384A55.808 55.808 0 0 1 512.192 64z\"></path>"
};
var Ca = {
	name: Y.Fit,
	box: "95.628 190.849 169.872 132.891",
	content: "<path d=\"M 158.073 293.017 L 122.351 257.294 L 158.073 221.571 L 158.073 248.363 L 203.055 248.363 L 203.055 221.571 L 238.777 257.294 L 203.055 293.017 L 203.055 266.225 L 158.073 266.225 L 158.073 293.017 Z M 95.628 323.74 L 95.628 190.849 L 113.489 190.849 L 113.489 323.74 L 95.628 323.74 Z M 247.639 323.74 L 247.639 190.849 L 265.5 190.849 L 265.5 323.74 L 247.639 323.74 Z\" />"
};
var wa = {
	name: Y.Help,
	box: "64 64 896 896",
	content: "<path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path><path d=\"M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z\"></path>"
};
var Ta = {
	name: Y.History,
	box: "64 64 896 896",
	content: "<path d=\"M536.1 273H488c-4.4 0-8 3.6-8 8v275.3c0 2.6 1.2 5 3.3 6.5l165.3 120.7c3.6 2.6 8.6 1.9 11.2-1.7l28.6-39c2.7-3.7 1.9-8.7-1.7-11.2L544.1 528.5V281c0-4.4-3.6-8-8-8zm219.8 75.2l156.8 38.3c5 1.2 9.9-2.6 9.9-7.7l.8-161.5c0-6.7-7.7-10.5-12.9-6.3L752.9 334.1a8 8 0 003 14.1zm167.7 301.1l-56.7-19.5a8 8 0 00-10.1 4.8c-1.9 5.1-3.9 10.1-6 15.1-17.8 42.1-43.3 80-75.9 112.5a353 353 0 01-112.5 75.9 352.18 352.18 0 01-137.7 27.8c-47.8 0-94.1-9.3-137.7-27.8a353 353 0 01-112.5-75.9c-32.5-32.5-58-70.4-75.9-112.5A353.44 353.44 0 01171 512c0-47.8 9.3-94.2 27.8-137.8 17.8-42.1 43.3-80 75.9-112.5a353 353 0 01112.5-75.9C430.6 167.3 477 158 524.8 158s94.1 9.3 137.7 27.8A353 353 0 01775 261.7c10.2 10.3 19.8 21 28.6 32.3l59.8-46.8C784.7 146.6 662.2 81.9 524.6 82 285 82.1 92.6 276.7 95 516.4 97.4 751.9 288.9 942 524.8 942c185.5 0 343.5-117.6 403.7-282.3 1.5-4.2-.7-8.9-4.9-10.4z\"></path>"
};
var Ea = {
	name: Y.Import,
	box: "-50 0 1150 1100",
	content: "<path d=\"M1035.498324 624.689133a60.590605 60.590605 0 0 0-63.620135 60.590604v181.771814a28.477584 28.477584 0 0 1-28.477584 28.477584h-787.67786a28.477584 28.477584 0 0 1-28.477584-28.477584v-181.771814a63.620135 63.620135 0 0 0-127.240269 0v181.771814a155.717854 155.717854 0 0 0 158.141478 156.929666h787.677859a155.717854 155.717854 0 0 0 155.717854-155.717854v-181.771813a60.590605 60.590605 0 0 0-66.043759-61.802417z\"></path>\n        <path d=\"M209.042477 127.24027h173.28913A105.427652 105.427652 0 0 1 487.153352 232.062015v264.175036L360.518989 384.144433a60.590605 60.590605 0 0 0-79.979598 90.885907l193.889934 172.077317a116.939867 116.939867 0 0 0 155.111948 0l192.072217-172.077317a60.590605 60.590605 0 0 0-81.191411-90.280001L614.393622 501.0843V232.062015A232.667921 232.667921 0 0 0 382.331607 0H209.042477a63.620135 63.620135 0 0 0 0 127.24027z\"></path>"
};
var Da = {
	name: Y.Increase,
	box: "64 64 896 896",
	content: "<path d=\"M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z\"></path>"
};
var Oa = {
	name: Y.Info,
	box: "64 64 896 896",
	content: "<path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path><path d=\"M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z\"></path>"
};
var ka = {
	name: Y.JSON,
	box: "0 0 323.83 237.259",
	content: "<path d=\"M 0 133.403 L 0 103.56 C 6.566 102.96 11.64 102.66 14.625 100.57 C 17.609 99.68 20.293 96.7 22.68 93.41 C 25.067 89.83 26.559 85.95 27.754 80.28 C 28.352 76.4 29.246 69.84 29.246 60.29 C 29.246 44.17 29.844 33.13 31.633 26.56 C 33.126 20.59 36.11 14.92 39.692 11.34 C 43.571 7.76 49.84 4.78 57.301 2.39 C 62.372 1.49 70.43 0 82.07 0 L 89.233 0 L 89.233 29.25 C 79.684 29.25 73.117 29.84 70.731 31.34 C 68.344 32.23 66.254 33.73 64.164 36.41 C 62.672 38.5 62.075 42.08 62.075 46.86 C 62.075 51.93 61.477 62.08 60.582 76.1 C 59.985 84.76 59.09 91.32 57.598 95.8 C 55.508 100.87 53.122 104.75 50.437 108.33 C 48.047 111.32 43.274 114.9 37.902 118.48 C 42.973 121.46 47.453 124.45 50.437 128.031 C 53.419 131.612 56.106 136.686 57.898 141.461 C 59.985 147.131 60.88 153.995 60.88 162.948 C 61.477 176.378 61.477 185.033 61.477 189.211 C 61.477 194.881 62.075 198.164 63.567 200.85 C 65.059 203.237 67.446 204.431 70.133 205.923 C 72.52 206.819 79.086 208.012 88.636 208.012 L 88.636 237.259 L 81.176 237.259 C 69.536 237.259 59.985 236.663 54.614 234.872 C 48.047 232.783 42.973 229.798 38.5 225.919 C 34.023 222.039 31.336 216.966 29.547 210.698 C 28.052 204.73 27.457 195.18 27.457 182.048 C 27.457 166.828 26.86 156.98 25.367 152.801 C 23.278 146.236 20.293 141.162 16.414 138.178 C 14.027 135.194 7.758 133.403 0 133.403 Z M 323.83 133.403 C 317.264 134 312.191 134.298 309.207 136.387 C 306.222 137.283 303.536 140.267 301.149 143.55 C 298.761 147.131 297.269 151.011 296.075 156.681 C 295.478 160.561 294.583 167.126 294.583 176.676 C 294.583 192.792 293.986 203.834 292.196 210.4 C 290.703 216.966 287.719 222.039 284.138 225.62 C 280.258 229.202 273.991 232.186 266.53 234.573 C 261.456 235.469 253.399 236.961 241.76 236.961 L 234.597 236.961 L 234.597 207.714 C 244.147 207.714 249.817 207.117 253.1 205.625 C 256.085 204.73 258.174 202.641 259.666 200.552 C 261.158 198.462 261.755 194.881 261.755 190.106 C 261.755 185.331 262.352 175.483 263.247 161.456 C 263.844 152.801 265.336 145.937 267.127 141.461 C 269.216 135.79 271.603 131.911 274.588 128.33 C 277.572 124.748 281.75 121.76 286.525 118.78 C 278.467 113.71 273.394 110.12 271.006 106.84 C 267.127 101.17 263.844 94.31 262.949 86.85 C 261.456 80.88 260.86 68.34 260.86 49.24 C 260.86 43.27 260.263 39.1 258.771 36.71 C 257.278 34.62 255.786 33.13 253.1 31.64 C 250.713 30.74 244.147 29.55 234 29.55 L 234 0.3 L 241.163 0.3 C 252.802 0.3 262.352 0.9 267.724 2.69 C 274.289 4.78 279.363 7.76 283.839 11.64 C 288.316 15.52 291.002 20.59 292.792 26.86 C 294.285 32.83 295.18 42.38 295.18 55.51 C 295.18 70.73 295.777 80.28 297.269 84.76 C 299.358 91.32 302.342 96.4 306.222 98.19 C 310.102 101.17 316.369 102.07 323.83 103.26 L 323.83 133.403 Z M 140.206 108.868 C 147.727 129.921 130.204 147.214 109.112 139.392 C 104.859 137.822 100.095 133.027 98.523 128.81 C 90.703 107.718 107.99 90.233 129.043 97.71 C 133.571 99.322 138.559 104.307 140.206 108.868 Z M 225.294 108.447 C 233.202 129.691 215.603 147.254 194.35 139.392 C 190.096 137.822 185.344 133.027 183.772 128.81 C 175.865 107.566 193.476 90.004 214.717 97.865 C 218.97 99.436 223.723 104.19 225.294 108.447 Z\" />"
};
var Aa = {
	name: Y.Loop,
	box: "0 0 1024 1024",
	content: "<path d=\"M546.8 601l-0.6 116c97.8-16.4 172.6-102 172.6-205 0-31.8-7.2-62-20-89-5.6-11.6-12-22.6-19.6-33l94.2-87c2.2 2.6 4.2 5.4 6.2 8 41.8 56 66.4 125.6 66.4 201 0 2.4 0 5 0 7.4-3 143-95.2 264-222.8 309.2-24.6 8.6-50.4 14.6-77 17.4l-0.2 114-152.4-134L341.2 780l88.8-77.4L546.8 601z\" p-id=\"2358\"></path><path d=\"M178 504.6c3.2-144.2 96.6-266 225.8-310.4 23.4-8 48-13.6 73.6-16.2l0.2-114 152.2 133.8 52.4 46.2-88.6 77.2-116.8 101.8 0.4-115.8c-97.6 16.6-172 102.2-172 204.8 0 32 7.2 62.2 20.2 89.4 5.4 11.6 12 22.4 19.4 32.6l-94 87.2c-2.6-3.2-5.2-6.6-7.6-10C202.2 655.4 178 586.6 178 512 178 509.6 178 507 178 504.6z\"></path>"
};
var ja = {
	name: Y.Minus,
	box: "0 0 1024 1024",
	content: "<path d=\"M64 576h896V448H64z\"></path>"
};
var Ma = {
	name: Y.MinusCircle,
	box: "64 64 896 896",
	content: "<path d=\"M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path>"
};
var Na = {
	name: Y.Options,
	box: "0 0 20 20",
	content: "<path d=\"M4,8 C5.1045695,8 6,8.8954305 6,10 C6,11.1045695 5.1045695,12 4,12 C2.8954305,12 2,11.1045695 2,10 C2,8.8954305 2.8954305,8 4,8 Z M10,8 C11.1045695,8 12,8.8954305 12,10 C12,11.1045695 11.1045695,12 10,12 C8.8954305,12 8,11.1045695 8,10 C8,8.8954305 8.8954305,8 10,8 Z M16,8 C17.1045695,8 18,8.8954305 18,10 C18,11.1045695 17.1045695,12 16,12 C14.8954305,12 14,11.1045695 14,10 C14,8.8954305 14.8954305,8 16,8 Z\" />"
};
var Pa = {
	name: Y.Pause,
	box: "64 64 896 896",
	content: "<path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm-88-532h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8zm224 0h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8z\"></path>"
};
var Fa = {
	name: Y.Plus,
	box: "0 0 1024 1024",
	content: "<path d=\"M576 64H448v384H64v128h384v384h128V576h384V448H576z\"></path>"
};
var Ia = {
	name: Y.PlusCircle,
	box: "64 64 896 896",
	content: "<path d=\"M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path>"
};
var La = {
	name: Y.PlusNext,
	box: "45.809 204.634 139.187 139.187",
	content: "<g><rect x=\"45.809\" y=\"204.634\" width=\"139.187\" height=\"139.187\" style=\"fill: rgba(0, 0, 0, 0);\" /><path d=\"M 129.783 227.155 C 129.783 233.207 126.045 238.386 120.751 240.508 L 120.751 257.522 C 139.903 260.131 154.662 276.552 154.662 296.421 C 154.662 318.103 137.084 335.68 115.402 335.68 C 93.72 335.68 76.143 318.103 76.143 296.421 C 76.143 276.541 90.918 260.113 110.086 257.518 L 110.086 240.52 C 104.776 238.406 101.023 233.219 101.023 227.155 C 101.023 219.213 107.461 212.775 115.403 212.775 C 123.345 212.775 129.783 219.213 129.783 227.155 Z M 110.692 291.463 L 93.373 291.463 L 93.373 301.381 L 110.692 301.381 L 110.692 318.395 L 120.109 318.395 L 120.109 301.381 L 137.431 301.381 L 137.431 291.463 L 120.109 291.463 L 120.109 274.447 L 110.692 274.447 L 110.692 291.463 Z\" /></g>"
};
var Ra = {
	name: Y.PlusSub,
	box: "223.545 204.634 139.187 139.187",
	content: "<g><rect x=\"223.545\" y=\"204.634\" width=\"139.187\" height=\"139.187\" style=\"fill: rgba(0, 0, 0, 0);\"/><path d=\"M 271.538 232.479 L 271.538 286.999 C 271.538 289.299 273.39 291.149 275.686 291.149 L 283.889 291.149 C 286.397 271.885 302.87 257.008 322.818 257.008 C 344.5 257.008 362.077 274.585 362.077 296.268 C 362.077 317.95 344.5 335.527 322.818 335.527 C 303.019 335.527 286.644 320.872 283.947 301.819 L 275.686 301.819 C 267.509 301.819 260.872 295.179 260.872 286.999 L 260.872 232.479 L 251.606 232.479 C 249.502 237.699 244.391 241.369 238.421 241.369 C 230.569 241.369 224.199 234.999 224.199 227.149 C 224.199 219.299 230.569 212.929 238.421 212.929 C 244.218 212.929 249.435 216.439 251.606 221.819 L 321.492 221.819 C 322.144 221.819 322.677 222.349 322.677 222.999 L 322.677 231.299 C 322.677 231.949 322.144 232.479 321.492 232.479 L 271.538 232.479 Z M 318.119 291.32 L 300.839 291.32 L 300.839 301.214 L 318.119 301.214 L 318.119 318.191 L 327.514 318.191 L 327.514 301.214 L 344.796 301.214 L 344.796 291.32 L 327.514 291.32 L 327.514 274.344 L 318.119 274.344 L 318.119 291.32 Z\" /></g>"
};
var za = {
	name: Y.Redo,
	box: "0 0 1024 1024",
	content: "<path d=\"M0.00032 576a510.72 510.72 0 0 0 173.344 384l84.672-96A383.136 383.136 0 0 1 128.00032 576C128.00032 363.936 299.93632 192 512.00032 192c106.048 0 202.048 42.976 271.52 112.48L640.00032 448h384V64l-149.984 149.984A510.272 510.272 0 0 0 512.00032 64C229.21632 64 0.00032 293.216 0.00032 576z\"></path>"
};
var Ba = {
	name: Y.Run,
	box: "0 0 24 24",
	content: "<path d=\"M8 18.3915V5.60846L18.2264 12L8 18.3915ZM6 3.80421V20.1957C6 20.9812 6.86395 21.46 7.53 21.0437L20.6432 12.848C21.2699 12.4563 21.2699 11.5436 20.6432 11.152L7.53 2.95621C6.86395 2.53993 6 3.01878 6 3.80421Z\"></path>"
};
var Va = {
	name: Y.Stop,
	box: "64 64 896 896",
	content: "<path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z\"></path>"
};
var Ha = {
	name: Y.Switch,
	box: "60 80 335 322",
	content: "<path d=\"M 385.053 296.328 L 313.542 387.029 C 311.615 389.173 308.295 390.767 305.465 390.938 L 274.753 390.938 C 272.284 390.588 269.428 388.856 268.549 387.027 C 267.67 385.199 268.092 381.895 269.336 379.764 L 325.993 307.912 L 76.849 307.912 C 75.2 307.758 73.035 306.946 71.981 305.893 C 70.926 304.841 70.111 302.675 69.956 301.023 L 69.956 275.607 C 70.111 273.955 70.926 271.789 71.981 270.737 C 73.035 269.684 75.2 268.872 76.849 268.718 L 371.631 268.718 C 378.347 269.06 384.517 273.221 386.995 278.325 C 389.473 283.43 388.922 290.853 385.054 296.328 Z M 388.728 175.637 L 388.728 201.053 C 388.574 202.703 387.761 204.868 386.708 205.921 C 385.655 206.974 383.49 207.788 381.84 207.942 L 87.01 207.942 C 80.316 207.598 74.157 203.436 71.686 198.332 C 69.216 193.228 69.767 185.808 73.636 180.333 L 145.145 89.629 C 147.073 87.488 150.391 85.894 153.222 85.723 L 183.933 85.723 C 186.402 86.073 189.258 87.805 190.137 89.634 C 191.016 91.462 190.593 94.766 189.35 96.897 L 132.693 168.749 L 381.84 168.749 C 383.49 168.903 385.655 169.716 386.708 170.769 C 387.761 171.822 388.574 173.987 388.728 175.637 Z\" />"
};
var Ua = {
	name: T.Any,
	box: "64 64 896 896",
	content: "<path d=\"M264 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm496 424c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496zm144 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z\"></path>"
};
var Wa = {
	name: T.Array,
	box: "0 80 470 300",
	content: "<path d=\"M 146.307 239.485 L 159.609 198.424 C 190.259 209.219 212.525 218.568 226.405 226.472 C 222.742 191.579 220.814 167.579 220.621 154.471 L 262.55 154.471 C 261.971 173.555 259.754 197.46 255.899 226.183 C 275.755 216.159 298.502 206.905 324.141 198.424 L 337.442 239.485 C 312.96 247.581 288.96 252.978 265.442 255.677 C 277.201 265.895 293.778 284.112 315.177 310.328 L 280.478 334.907 C 269.296 319.678 256.091 298.955 240.863 272.738 C 226.597 299.919 214.067 320.642 203.272 334.907 L 169.151 310.328 C 191.513 282.761 207.513 264.544 217.152 255.677 C 192.283 250.857 168.669 245.46 146.307 239.485 Z M 23.162 402.827 L 23.162 89.135 L 118.114 89.135 L 118.114 112.291 L 71.481 112.291 L 71.481 379.67 L 118.114 379.67 L 118.114 402.827 L 23.162 402.827 Z M 460.588 402.159 L 365.636 402.159 L 365.636 379.002 L 412.268 379.002 L 412.268 111.623 L 365.636 111.623 L 365.636 88.467 L 460.588 88.467 L 460.588 402.159 Z\" />"
};
var Ga = {
	name: T.Bool,
	box: "0 -1 20 20",
	content: "<path d=\"M14.5,4.59302522 C17.5375661,4.59302522 20,7.0554591 20,10.0930252 C20,13.1305913 17.5375661,15.5930252 14.5,15.5930252 C12.6400269,15.5930252 10.9956939,14.6697601 10.0002965,13.2565253 C9.00430607,14.6697601 7.3599731,15.5930252 5.5,15.5930252 C2.46243388,15.5930252 0,13.1305913 0,10.0930252 C0,7.0554591 2.46243388,4.59302522 5.5,4.59302522 C7.3599731,4.59302522 9.00430607,5.51629032 9.99970353,6.92952513 C10.9956939,5.51629032 12.6400269,4.59302522 14.5,4.59302522 Z M5.5,6.59302522 C3.56700338,6.59302522 2,8.1600286 2,10.0930252 C2,12.0260218 3.56700338,13.5930252 5.5,13.5930252 C7.43299662,13.5930252 9,12.0260218 9,10.0930252 C9,8.1600286 7.43299662,6.59302522 5.5,6.59302522 Z M16.1099312,8.05749132 L13.8022389,10.4574913 L12.6483927,9.25749132 L11.8791619,10.0574913 L13.8022389,12.0574913 L16.8791619,8.85749132 L16.1099312,8.05749132 Z M6.66446609,8.05749132 L7.46446609,8.85749132 L6.26446609,10.0574913 L7.46446609,11.2574913 L6.66446609,12.0574913 L5.46446609,10.8574913 L4.26446609,12.0574913 L3.46446609,11.2574913 L4.66446609,10.0574913 L3.46446609,8.85749132 L4.26446609,8.05749132 L5.46446609,9.25749132 L6.66446609,8.05749132 Z\" />"
};
var Ka = {
	name: T.Date,
	box: "0 0 20 20",
	content: "<path d=\"M13,2 C13.5522847,2 14,2.44771525 14,3 L17,3 C18.1045695,3 19,3.8954305 19,5 L19,16 C19,17.1045695 18.1045695,18 17,18 L3,18 C1.8954305,18 1,17.1045695 1,16 L1,5 C1,3.8954305 1.8954305,3 3,3 L6,3 C6,2.44771525 6.44771525,2 7,2 C7.55228475,2 8,2.44771525 8,3 L12,3 C12,2.44771525 12.4477153,2 13,2 Z M17,9 L3,9 L3,16 L17,16 L17,9 Z M6,13 C6.55228475,13 7,13.4477153 7,14 C7,14.5522847 6.55228475,15 6,15 C5.44771525,15 5,14.5522847 5,14 C5,13.4477153 5.44771525,13 6,13 Z M10,13 C10.5522847,13 11,13.4477153 11,14 C11,14.5522847 10.5522847,15 10,15 C9.44771525,15 9,14.5522847 9,14 C9,13.4477153 9.44771525,13 10,13 Z M14,13 C14.5522847,13 15,13.4477153 15,14 C15,14.5522847 14.5522847,15 14,15 C13.4477153,15 13,14.5522847 13,14 C13,13.4477153 13.4477153,13 14,13 Z M6,10 C6.55228475,10 7,10.4477153 7,11 C7,11.5522847 6.55228475,12 6,12 C5.44771525,12 5,11.5522847 5,11 C5,10.4477153 5.44771525,10 6,10 Z M10,10 C10.5522847,10 11,10.4477153 11,11 C11,11.5522847 10.5522847,12 10,12 C9.44771525,12 9,11.5522847 9,11 C9,10.4477153 9.44771525,10 10,10 Z M14,10 C14.5522847,10 15,10.4477153 15,11 C15,11.5522847 14.5522847,12 14,12 C13.4477153,12 13,11.5522847 13,11 C13,10.4477153 13.4477153,10 14,10 Z M6,5 L3,5 L3,7 L17,7 L17,5 L14,5 C14,5.55228475 13.5522847,6 13,6 C12.4477153,6 12,5.55228475 12,5 L8,5 C8,5.55228475 7.55228475,6 7,6 C6.44771525,6 6,5.55228475 6,5 Z\" />"
};
var qa = {
	name: T.DateTime,
	box: "0 0 20 20",
	content: "<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M13,2 C13.5522847,2 14,2.44771525 14,3 L17,3 C18.1045695,3 19,3.8954305 19,5 L19.0008411,9.6834702 C19.632174,10.6335237 20,11.7738067 20,13 C20,16.3137085 17.3137085,19 14,19 C12.7738067,19 11.6335237,18.632174 10.6834702,18.0008411 L3,18 C1.8954305,18 1,17.1045695 1,16 L1,5 C1,3.8954305 1.8954305,3 3,3 L6,3 C6,2.44771525 6.44771525,2 7,2 C7.55228475,2 8,2.44771525 8,3 L12,3 C12,2.44771525 12.4477153,2 13,2 Z M14,9 C11.790861,9 10,10.790861 10,13 C10,15.209139 11.790861,17 14,17 C16.209139,17 18,15.209139 18,13 C18,10.790861 16.209139,9 14,9 Z M9.52766929,9.0001315 L3,9 L3,16 L8.80325037,16.000963 C8.29239547,15.1182253 8,14.093259 8,13 C8,11.5593949 8.50770848,10.2373715 9.35395605,9.20309916 L9.52766929,9.0001315 Z M14,10 C14.5522847,10 15,10.4477153 15,11 L15,12.47 L16.470203,13.3745556 C16.8961053,13.6363239 17.058206,14.1671476 16.8676427,14.616159 L16.7990381,14.75 C16.551053,15.1795228 16.0249969,15.348408 15.5795487,15.1605478 L15.4470893,15.0924003 L13.5389825,13.9196388 C13.4794306,13.883037 13.4250363,13.8411748 13.3760426,13.7950116 L13.3066327,13.7226607 C13.1182557,13.5400593 13,13.2838397 13,13 L13,11 C13,10.4477153 13.4477153,10 14,10 Z M6,5 L3,5 L3,7 L14,7 C15.093259,7 16.1182253,7.29239547 17.000963,7.80325037 L17,5 L14,5 C14,5.55228475 13.5522847,6 13,6 C12.4477153,6 12,5.55228475 12,5 L8,5 C8,5.55228475 7.55228475,6 7,6 C6.44771525,6 6,5.55228475 6,5 Z\" />"
};
var Ja = {
	name: T.File,
	box: "0 0 174.6638 215.24",
	content: "<path d=\"M 164.446 215.226 L 10.201 215.226 C 4.561 215.36 -0.069 210.78 0.001 205.133 L 0.001 10.104 C 0.001 4.381 4.411 0.01 10.201 0.01 L 95.497 0.01 C 96.479 -0.034 97.46 0.067 98.406 0.313 C 100.891 0.915 102.972 2.378 104.331 4.39 L 171.589 70.665 C 173.417 72.474 174.426 74.756 174.617 77.056 C 174.648 77.389 174.664 77.727 174.664 78.07 L 174.664 205.146 C 174.664 210.524 170.252 215.24 164.46 215.24 L 164.446 215.226 Z M 106.041 67.976 L 140.004 67.976 L 106.041 34.351 L 106.041 67.976 Z M 20.391 195.053 L 154.284 195.053 L 154.284 88.15 L 95.821 88.15 C 90.181 88.275 85.561 83.698 85.631 78.056 L 85.631 20.182 L 20.381 20.182 L 20.381 195.039 L 20.391 195.053 Z\" />"
};
var Ya = {
	name: T.Map,
	box: "0 0 500 500",
	content: "<path d=\"M 0.311 248.111 L 72.314 406.373 L 127.585 406.373 L 55.239 248.111 L 127.585 93.626 L 72.314 93.626 L 0.311 248.111 Z\" />\n  <path d=\"M 427.684 93.626 L 372.413 93.626 L 444.76 248.111 L 372.413 406.373 L 427.684 406.373 L 499.688 248.111 L 427.684 93.626 Z\" />\n  <path d=\"M 156.34 243.402 L 169.642 202.341 C 200.292 213.136 222.558 222.485 236.438 230.389 C 232.775 195.496 230.847 171.496 230.654 158.388 L 272.583 158.388 C 272.004 177.472 269.787 201.377 265.932 230.1 C 285.788 220.076 308.535 210.822 334.174 202.341 L 347.475 243.402 C 322.993 251.498 298.993 256.895 275.475 259.594 C 287.234 269.812 303.811 288.029 325.21 314.245 L 290.511 338.824 C 279.329 323.595 266.124 302.872 250.896 276.655 C 236.63 303.836 224.1 324.559 213.305 338.824 L 179.184 314.245 C 201.546 286.678 217.546 268.461 227.185 259.594 C 202.316 254.774 178.702 249.377 156.34 243.402 Z\" />"
};
var Xa = {
	name: T.Number,
	box: "0 0 57.543 40",
	content: "<g><path d=\"M 1.433 28.672 L 1.433 23.755 L 6.533 23.755 L 6.533 7.224 L 2.111 7.224 L 2.111 3.063 C 4.693 2.495 6.371 1.739 8.05 0.529 L 12.278 0.529 L 12.278 23.755 L 16.603 23.755 L 16.603 28.672 L 1.433 28.672 Z M 19.928 28.672 L 19.928 24.815 C 25.931 18.422 29.966 13.314 29.966 9.229 C 29.966 6.657 28.739 5.258 26.835 5.258 C 25.189 5.258 23.898 6.543 22.768 7.981 L 19.637 4.35 C 21.993 1.437 24.188 0 27.61 0 C 32.258 0 35.485 3.48 35.485 8.851 C 35.485 13.693 31.935 19.027 28.255 23.377 C 29.412 23.377 35.518 23.377 36.583 23.377 L 36.583 28.672 L 19.928 28.672 Z M 39.004 25.269 L 41.65 21.031 C 43.103 22.657 44.781 23.755 46.653 23.755 C 48.88 23.755 50.333 22.657 50.333 20.54 C 50.333 18.119 49.235 16.681 44.2 16.681 L 44.2 11.953 C 48.299 11.953 49.59 10.477 49.59 8.246 C 49.59 6.316 48.622 5.258 46.847 5.258 C 45.233 5.258 44.006 6.128 42.554 7.603 L 39.649 3.48 C 41.876 1.285 44.265 0 47.105 0 C 52.076 0 55.336 2.723 55.336 7.754 C 55.336 10.553 54.045 12.748 51.462 13.958 L 51.462 14.147 C 54.141 15.093 56.11 17.362 56.11 20.994 C 56.11 26.252 52.011 29.202 47.234 29.202 C 43.425 29.202 40.746 27.651 39.004 25.269 Z M 0 36.573 L 57.543 36.573 L 57.543 42.536 L 0 42.536 L 0 36.573 Z\" /></g>"
};
var Za = {
	name: T.Object,
	box: "20 0 1024 1024",
	content: "<path d=\"M 414.165 463.242 C 345.265 438.742 288.765 495.942 314.365 564.942 C 319.465 578.842 334.965 594.442 348.965 599.642 C 417.865 625.242 475.265 568.642 450.665 499.742 C 445.165 484.842 428.965 468.542 414.165 463.242\" />\n  <path d=\"M 795.283 99.791 L 743.883 99.791 C 730.478 99.523 719.402 109.76 719.183 122.618 L 719.183 151.103 C 719.402 163.961 730.478 174.198 743.883 173.93 L 777.483 173.93 C 814.983 173.93 832.683 193.112 832.683 233.299 L 832.683 412.461 C 832.683 455.046 848.983 487.368 880.783 508.852 C 894.367 517.607 894.625 536.688 881.283 545.778 C 849.183 568.03 832.883 599.584 832.883 641.018 L 832.883 820.948 C 832.883 859.312 815.083 879.453 777.583 879.453 L 743.983 879.453 C 730.578 879.186 719.502 889.423 719.283 902.28 L 719.283 930.766 C 719.501 943.662 730.64 953.914 744.083 953.593 L 795.283 953.593 C 838.683 953.593 872.283 939.878 895.983 914.365 C 917.683 890.483 928.483 857.682 928.483 817.399 L 928.483 645.622 C 928.483 619.15 934.383 599.872 946.183 588.075 C 957.083 576.566 974.683 569.564 999.183 566.207 C 1011.124 564.821 1020.171 555.202 1020.383 543.668 L 1020.383 509.907 C 1020.184 498.437 1011.245 488.842 999.383 487.368 C 974.883 483.724 957.283 476.434 946.283 465.5 C 934.483 452.744 928.583 433.562 928.583 407.954 L 928.583 237.04 C 928.583 195.894 917.783 162.996 896.083 139.306 C 872.283 112.739 838.683 99.887 795.283 99.791 Z\" />\n  <path d=\"M 304.883 116.291 L 304.883 157.054 C 304.719 166.43 296.659 173.902 286.883 173.742 L 246.683 173.742 C 209.183 173.742 191.483 192.924 191.483 233.111 L 191.483 412.273 C 191.483 457.831 172.883 491.496 136.483 513.076 C 125.472 519.373 125.255 534.595 136.083 541.178 C 172.683 563.717 191.483 596.711 191.483 640.926 L 191.483 820.951 C 191.483 859.316 209.183 879.457 246.683 879.457 L 286.883 879.457 C 296.783 879.457 304.883 886.842 304.883 896.146 L 304.883 936.908 C 304.719 946.246 296.72 953.703 286.983 953.597 L 228.983 953.597 C 185.583 953.597 151.983 939.881 128.283 914.369 C 106.583 890.487 95.783 857.685 95.783 817.403 L 95.783 645.434 C 95.783 618.962 89.883 599.684 78.083 587.887 C 66.383 575.514 46.983 568.321 19.883 565.444 C 10.962 564.659 4.099 557.539 3.983 548.947 L 3.983 504.348 C 3.983 495.908 10.783 488.811 19.883 487.852 C 46.983 484.686 66.383 477.014 78.083 465.408 C 89.883 452.652 95.783 433.374 95.783 407.862 L 95.783 236.852 C 95.783 195.706 106.583 162.808 128.283 139.118 C 151.983 112.647 185.583 99.795 228.983 99.795 L 286.883 99.795 C 296.626 99.526 304.72 106.944 304.883 116.291\" />\n  <path d=\"M 690.657 463.747 C 621.157 438.047 563.657 495.447 589.457 564.947 C 594.557 578.847 610.157 594.447 624.057 599.647 C 693.557 625.347 751.057 567.847 725.257 498.347 C 720.057 484.447 704.457 468.947 690.557 463.747\" />"
};
var Qa = [
	{
		name: T.String,
		box: "0 0 59.931 33.007",
		content: "<path d=\"M 5.434 32.408 L 6.718 25.097 L 13.288 25.097 L 14.572 32.408 L 20.186 32.408 L 13.288 0.599 L 6.898 0.599 L 0 32.408 L 5.434 32.408 Z M 12.273 19.197 L 7.734 19.197 L 8.211 16.503 C 8.779 13.339 9.376 9.62 9.914 6.285 L 10.033 6.285 C 10.63 9.535 11.198 13.339 11.795 16.503 L 12.273 19.197 Z M 30.906 32.408 C 35.743 32.408 39.595 29.501 39.595 23.002 C 39.595 18.77 37.893 16.375 35.654 15.52 L 35.654 15.349 C 37.445 14.365 38.55 11.288 38.55 8.466 C 38.55 2.352 34.877 0.599 30.279 0.599 L 22.515 0.599 L 22.515 32.408 L 30.906 32.408 Z M 30.07 13.212 L 27.86 13.212 L 27.86 6.414 L 30.07 6.414 C 32.309 6.414 33.354 7.354 33.354 9.62 C 33.354 11.8 32.339 13.212 30.07 13.212 Z M 30.518 26.55 L 27.86 26.55 L 27.86 18.855 L 30.518 18.855 C 33.116 18.855 34.4 19.881 34.4 22.489 C 34.4 25.225 33.086 26.55 30.518 26.55 Z M 52.675 33.007 C 55.571 33.007 58.05 31.425 59.931 28.304 L 57.124 23.515 C 56.079 25.14 54.645 26.423 52.884 26.423 C 49.748 26.423 47.718 22.746 47.718 16.418 C 47.718 10.219 50.077 6.542 52.943 6.542 C 54.526 6.542 55.69 7.568 56.795 9.021 L 59.602 4.147 C 58.079 1.924 55.75 0 52.854 0 C 47.21 0 42.253 6.072 42.253 16.674 C 42.253 27.449 47.031 33.007 52.675 33.007 Z\"\" />"
	},
	Xa,
	Ga,
	Ka,
	{
		name: T.Time,
		box: "0 0 20 20",
		content: "<path d=\"M3.40035701171875,3.40035701171875Q0.66668701171875,6.13402701171875,0.66668701171875,10.00001701171875Q0.66668701171875,13.86598701171875,3.40035701171875,16.59968701171875Q6.13402701171875,19.33338701171875,10.00001701171875,19.33338701171875Q13.86598701171875,19.33338701171875,16.59968701171875,16.59968701171875Q19.33338701171875,13.86598701171875,19.33338701171875,10.00001701171875Q19.33338701171875,6.13402701171875,16.59968701171875,3.40035701171875Q13.86598701171875,0.66668701171875,10.00001701171875,0.66668701171875Q6.13402701171875,0.66668701171875,3.40035701171875,3.40035701171875ZM4.81456701171875,15.18548701171875Q2.66668701171875,13.03758701171875,2.66668701171875,10.00001701171875Q2.66668701171875,6.96245701171875,4.81456701171875,4.81456701171875Q6.96245701171875,2.66668701171875,10.00001701171875,2.66668701171875Q13.03758701171875,2.66668701171875,15.18548701171875,4.81456701171875Q17.33338701171875,6.96245701171875,17.33338701171875,10.00001701171875Q17.33338701171875,13.03758701171875,15.18548701171875,15.18548701171875Q13.03758701171875,17.33338701171875,10.00001701171875,17.33338701171875Q6.96244701171875,17.33338701171875,4.81456701171875,15.18548701171875Z\" fill-rule=\"evenodd\" />\n  <path d=\"M10.90349072265625,5.00046591815625L10.90308072265625,9.103731035156251L14.58337072265625,9.10372103515625Q14.67201072265625,9.10372103515625,14.75895072265625,9.12101103515625Q14.84589072265625,9.13831103515625,14.927790722656251,9.172231035156251Q15.009680722656249,9.20615103515625,15.083390722656251,9.25540103515625Q15.15709072265625,9.304651035156251,15.21977072265625,9.367331035156251Q15.28245072265625,9.43001103515625,15.331700722656251,9.50371103515625Q15.38094072265625,9.57741103515625,15.41486072265625,9.65931103515625Q15.44879072265625,9.74120103515625,15.466080722656251,9.82814103515625Q15.48337072265625,9.91508103515625,15.48337072265625,10.00372103515625Q15.48337072265625,10.09236103515625,15.466080722656251,10.17930103515625Q15.44879072265625,10.26624103515625,15.41486072265625,10.34814103515625Q15.38094072265625,10.43003103515625,15.331700722656251,10.50373103515625Q15.28245072265625,10.57744103515625,15.21977072265625,10.64012103515625Q15.15709072265625,10.70280103515625,15.083390722656251,10.75204103515625Q15.009680722656249,10.80129103515625,14.927790722656251,10.835211035156249Q14.84589072265625,10.86913103515625,14.75895072265625,10.88643103515625Q14.67202072265625,10.90372103515625,14.58337072265625,10.90372103515625L14.582450722656251,10.90372103515625L10.00299072265625,10.90373103515625Q9.82396972265625,10.90373103515625,9.65857572265625,10.83522103515625Q9.49318272265625,10.76671103515625,9.36659572265625,10.64012103515625Q9.24000772265625,10.513541035156251,9.17149972265625,10.34814103515625Q9.10299072265625,10.182751035156251,9.10299072265625,10.00373103515625L9.10349072265625,5.000061035155353L9.10349072265625,4.99997112195625Q9.10349972265625,4.91133453515625,9.12079872265625,4.82440303515625Q9.13809872265625,4.73747103515625,9.17202472265625,4.65558403515625Q9.205950722656251,4.57369703515625,9.25519872265625,4.5000010351562505Q9.30444772265625,4.42630603515625,9.36712672265625,4.36363303515625Q9.42980472265625,4.30096103515625,9.50350572265625,4.25172003515625Q9.57720572265625,4.20247903515625,9.65909672265625,4.16856103515625Q9.74098672265625,4.13464303515625,9.82792072265625,4.11735203515625Q9.91485402265625,4.10006103515625,10.00349062665625,4.10006103515625Q10.09213292265625,4.10006103515625,10.17907172265625,4.11735403515625Q10.26601072265625,4.13464803515625,10.34790572265625,4.16857003515625Q10.42980072265625,4.20249103515625,10.50350372265625,4.25173903515625Q10.57720672265625,4.30098503515625,10.63988672265625,4.3636650351562505Q10.70256572265625,4.42634503515625,10.75181272265625,4.50004803515625Q10.80105972265625,4.57375103515625,10.83498172265625,4.65564603515625Q10.86890372265625,4.73754103515625,10.88619772265625,4.82448003515625Q10.90349072265625,4.91141883515625,10.90349072265625,5.00006103515625L10.90349072265625,5.00015094835625L10.90349072265625,5.00046591815625Z\" fill-rule=\"evenodd\" />"
	},
	qa,
	Za,
	Wa,
	Ya,
	Ja,
	Ua,
	ra,
	na,
	ta,
	ea,
	Sa,
	xa,
	Ea,
	oa,
	ca,
	ua,
	la,
	sa,
	_a,
	ha,
	pa,
	fa,
	aa,
	Ha,
	Va,
	Aa,
	Fa,
	ia,
	ba,
	Ca,
	Ba,
	{
		name: Y.Undo,
		box: "0 0 1024 1024",
		content: "<path d=\"M512 64A510.272 510.272 0 0 0 149.984 213.984L0.032 64v384h384L240.512 304.48A382.784 382.784 0 0 1 512.032 192c212.064 0 384 171.936 384 384 0 114.688-50.304 217.632-130.016 288l84.672 96a510.72 510.72 0 0 0 173.344-384c0-282.784-229.216-512-512-512z\"></path>"
	},
	za,
	ma,
	da,
	Qi,
	$i,
	va,
	ya,
	Da,
	ja,
	ga,
	wa,
	Ta,
	Oa,
	Na,
	La,
	Ra,
	Ia,
	Pa,
	Ma,
	{
		name: Y.Versions,
		box: "64 64 896 896",
		content: "<path d=\"M945 412H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h256c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM811 548H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h122c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM477.3 322.5H434c-6.2 0-11.2 5-11.2 11.2v248c0 3.6 1.7 6.9 4.6 9l148.9 108.6c5 3.6 12 2.6 15.6-2.4l25.7-35.1v-.1c3.6-5 2.5-12-2.5-15.6l-126.7-91.6V333.7c.1-6.2-5-11.2-11.1-11.2z\"></path><path d=\"M804.8 673.9H747c-5.6 0-10.9 2.9-13.9 7.7a321 321 0 01-44.5 55.7 317.17 317.17 0 01-101.3 68.3c-39.3 16.6-81 25-124 25-43.1 0-84.8-8.4-124-25-37.9-16-72-39-101.3-68.3s-52.3-63.4-68.3-101.3c-16.6-39.2-25-80.9-25-124 0-43.1 8.4-84.7 25-124 16-37.9 39-72 68.3-101.3 29.3-29.3 63.4-52.3 101.3-68.3 39.2-16.6 81-25 124-25 43.1 0 84.8 8.4 124 25 37.9 16 72 39 101.3 68.3a321 321 0 0144.5 55.7c3 4.8 8.3 7.7 13.9 7.7h57.8c6.9 0 11.3-7.2 8.2-13.3-65.2-129.7-197.4-214-345-215.7-216.1-2.7-395.6 174.2-396 390.1C71.6 727.5 246.9 903 463.2 903c149.5 0 283.9-84.6 349.8-215.8a9.18 9.18 0 00-8.2-13.3z\"></path>"
	},
	ka,
	{
		name: Y.XML,
		box: "0 0 1163 1024",
		content: "<path d=\"M631.490909 0l109.454546 22.763636L532.145455 1024l-109.454546-22.763636L631.490909 0m374.109091 512l-200.436364-204.218182V146.763636L1163.636364 512l-358.472728 364.654545V715.636364l200.436364-203.636364M0 512l358.472727-365.236364v161.018182L158.036364 512l200.436363 203.636364v161.018181L0 512z\" p-id=\"8050\"></path>"
	}
].map((e) => `  <symbol viewBox="${e.box}" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" id="@baseflow-icon-${e.name}">${e.content}</symbol>`);
Qa.unshift("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" aria-hidden=\"true\" focusable=\"false\" width=\"0\" height=\"0\">"), Qa.push("</svg>");
var $a = Qa.join("\n");
var eo = (0, import_react.createContext)("");
function to() {
	return (0, import_react.useContext)(eo);
}
var no = (0, import_react.createContext)({});
function ro() {
	return (0, import_react.useContext)(no);
}
no.Provider;
function Z(e) {
	let t = (0, import_react.useRef)(e);
	t.current = e;
	let n = (0, import_react.useRef)(void 0);
	return n.current ||= function(...e) {
		return t.current.apply(this, e);
	}, n.current;
}
var io = function({ className: e, style: t, htmlType: n, children: r }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: e,
		style: t,
		type: n,
		children: r
	});
};
var ao = function({ value: e, onChange: t, className: n, placeholder: r }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: n,
		type: "date",
		value: e,
		placeholder: r,
		onChange: (e) => {
			t?.(e.target.value);
		}
	});
};
var oo = (0, import_react.memo)(({ value: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: e }));
var so = function({ value: e, onChange: t, className: n, block: r, placeholder: i }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: K.classNames(n, { "ͼbaseflow-sr-inputBlock": r }),
		value: e,
		placeholder: i,
		onChange: (e) => {
			t?.(e.target.value);
		}
	});
};
var co = (0, import_react.memo)(({ options: e, value: t, onChange: n, className: r }) => {
	let i = Z((e) => {
		e !== t && n?.(e);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-LinkTab", r),
		children: e.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: e.value === t ? "on" : "",
			onClick: () => i(e.value),
			children: e.label
		}, e.value))
	});
});
var lo = function({ value: e, options: t, onChange: n, className: r, block: i }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: K.classNames(r, { "ͼbaseflow-sr-inputBlock": i }),
		value: e,
		onChange: (e) => {
			n?.(e.target.value);
		},
		children: t.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: e.label }, e.value))
	});
};
var uo = function() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading..." });
};
var fo = function({ value: e, onChange: t, className: n }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: n,
		type: "checkbox",
		checked: !!e,
		onChange: (e) => {
			t?.(e.target.checked);
		}
	});
};
var po = function({ className: e, style: t, rows: n, value: r, noTrim: i, block: a, onChange: o, onBlur: s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: K.classNames(e, { "ͼbaseflow-sr-inputBlock": a }),
		style: t,
		value: r,
		rows: n,
		onBlur: s,
		onChange: (e) => o?.(i ? e.target.value : e.target.value.trim())
	});
};
var mo = function({ value: e, onChange: t, className: n, placeholder: r }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: n,
		type: "time",
		value: e,
		placeholder: r,
		onChange: (e) => {
			t?.(e.target.value);
		}
	});
};
var ho = (0, import_react.memo)(function({ payload: e, onClose: t }) {
	let [n, r] = (0, import_react.useState)(!0);
	return (0, import_react.useEffect)(() => {
		r(!1);
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [e.mask && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-Modal__mask",
		onClick: t
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-Modal__window", { enter: n }),
		children: e.content
	})] });
});
function go(e, t, n = {}) {
	let r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = {
		left: r.left,
		top: r.bottom + 8
	}, o = window.innerHeight - i.height;
	a.top > o && (a.top = o);
	let s = window.innerWidth - i.width;
	a.left > s && (a.left = s), Object.assign(t.style, {
		left: `${a.left}px`,
		top: `${a.top}px`,
		marginTop: n.top || void 0,
		marginLeft: n.left || void 0
	});
}
var _o = (0, import_react.memo)(({ payload: e, onClose: t }) => {
	let n = (0, import_react.useRef)(void 0), r = (0, import_react.useRef)(void 0), i = (0, import_react.useRef)(0), a = Z(() => {
		e && !i.current && (i.current = setTimeout(() => {
			t(), i.current = 0;
		}, 300));
	}), o = Z(() => {
		e && (clearTimeout(i.current), i.current = 0, t());
	}), c = Z(() => {
		i.current &&= (clearTimeout(i.current), 0);
	});
	return (0, import_react.useEffect)(() => {
		r.current && r.current.removeEventListener("mouseleave", a, !1);
		let t = e.target;
		return r.current = t, t && (i.current &&= (clearTimeout(i.current), 0), go(t, n.current, e.offset), t.addEventListener("mouseleave", a, !1)), () => {
			t.removeEventListener("mouseleave", a, !1);
		};
	}, [a, e]), (0, import_react.useEffect)(() => {
		let e = (e) => {
			let t = e.target;
			n.current?.contains(t) || o();
		};
		return document.addEventListener("mousedown", e, !0), () => {
			document.removeEventListener("mousedown", e, !0);
		};
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-Popup"),
		onMouseOver: c,
		onMouseLeave: a,
		ref: n,
		children: e.content
	});
});
function vo(e, t) {
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect(), i = {
		left: n.left,
		top: n.bottom + 8
	}, a = window.innerHeight - r.height;
	i.top > a && (i.top = a);
	let o = window.innerWidth - r.width;
	i.left > o && (i.left = o), Object.assign(t.style, {
		left: `${i.left}px`,
		top: `${i.top}px`
	});
}
var yo = (0, import_react.memo)(({ payload: e, onClose: t }) => {
	let n = (0, import_react.useRef)(void 0), r = (0, import_react.useRef)(void 0), i = (0, import_react.useRef)(0), a = Z(() => {
		e && !i.current && (i.current = setTimeout(() => {
			t(), i.current = 0;
		}, 300));
	}), o = Z(() => {
		i.current &&= (clearTimeout(i.current), 0);
	});
	return (0, import_react.useEffect)(() => {
		r.current && r.current.removeEventListener("mouseleave", a, !1);
		let t = e.target;
		return r.current = t, t && (i.current &&= (clearTimeout(i.current), 0), vo(t, n.current), t.addEventListener("mouseleave", a, !1)), () => {
			t.removeEventListener("mouseleave", a, !1);
		};
	}, [a, e.target]), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-Tooltip"),
		ref: n,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "content",
			onMouseEnter: o,
			onMouseLeave: a,
			children: e.content
		})
	});
});
var bo = (0, import_react.memo)(() => {
	let [e, t] = (0, import_react.useState)(null), [n, r] = (0, import_react.useState)(null), [i, o] = (0, import_react.useState)(null), s = Z(() => {
		e?.mask === "closeAble" && t(null);
	}), c = (0, import_react.useCallback)(() => {
		o(null);
	}, []), l = (0, import_react.useCallback)(() => {
		r(null);
	}, []);
	return (0, import_react.useMemo)(() => {
		xo({
			popup: o,
			tooltip: r,
			modal: t
		});
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			zIndex: 1001
		},
		children: [
			n ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(yo, {
				payload: n,
				onClose: l
			}) : null,
			e ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ho, {
				payload: e,
				onClose: s
			}) : null,
			i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_o, {
				payload: i,
				onClose: c
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { display: "none" },
				dangerouslySetInnerHTML: { __html: $a }
			})
		]
	});
});
var Q = {
	Button: io,
	Select: lo,
	Input: so,
	TextArea: po,
	Switch: fo,
	DatePicker: ao,
	TimePicker: mo,
	Segmented: co,
	DescMD: oo,
	Spin: uo,
	popup: () => void 0,
	modal: () => void 0,
	tooltip: () => void 0
};
function xo(e) {
	Object.assign(Q, e);
}
var So = class {
	_listenerId = 0;
	_listenerMap;
	constructor(e) {
		this._listenerMap = e;
	}
	addListener(e, t) {
		let n = e, r = this._listenerMap[n];
		if (r) {
			this._listenerId++;
			let e = `${this._listenerId}`;
			return r[e] = t, () => {
				delete r[e];
			};
		}
		throw Error(`event[${n}] not found`);
	}
	dispatch(e, t) {
		let n = e, r = this._listenerMap[n];
		r && Object.keys(r).forEach((e) => {
			r[e]?.(t);
		});
	}
};
function Co(e) {
	return typeof e == "object" && typeof e.then == "function";
}
var wo = class extends So {
	constructor() {
		super({
			variableClick: {},
			expressionClick: {},
			valueChanged: {}
		});
	}
};
var To = {
	[D.Expression](e, t) {
		if (e) {
			if (t === D.Variable) return e;
			if (t === D.Template) return J.toJSTpl(e);
		}
		return e;
	},
	[D.Template](e, t) {
		if (e) {
			if (t === D.Variable) return J.wrapVariable(e);
			if (t === D.Expression) return "";
		}
		return e;
	},
	[D.Variable](e, t) {
		if (e) {
			if (t === D.Expression) return "";
			if (t === D.Template) return J.extractVariable(e)?.[0] || "";
		}
		return e;
	}
};
function Eo(e, t) {
	let n = t || e?.source || D.Variable, r = e?.text || "", i = "";
	return e?.text ? (t && e.source !== t && (r = To[t](e.text, e.source)), i = n === D.Variable && r ? J.wrapVariable(r) : r) : i = "", {
		source: n,
		text: r,
		mode: n === D.Expression ? "complex" : "simple",
		code: i
	};
}
function Do(e, t, n, r, i) {
	e = e.trim();
	let a, o;
	if (n.mode === t ? t === "simple" ? e ? (o = J.getSingleVariable(e), o ? a = D.Variable : (a = D.Template, o = e)) : (a = D.Variable, o = "") : (a = D.Expression, o = e) : t === "simple" ? (a = D.Variable, o = "") : (a = D.Expression, o = J.getSingleVariable(e), o ||= J.toJSTpl(e)), r && r !== a && (o = To[r](o, a), a = r), i === "mapping") {
		if (a === D.Template && /\D/.test(o) || a === D.Expression) o = "", a = D.Variable;
		else if (a === D.Variable) {
			let { fun: e } = si.matchVariable(o);
			e && e !== H._number && e !== H._path && (o = "", a = D.Variable);
		}
	} else if (i === "variable") {
		if (a === D.Template || a === D.Expression) o = "", a = D.Variable;
		else if (a === D.Variable) {
			let { fun: e } = si.matchVariable(o);
			e && e !== H._path && (o = "", a = D.Variable);
		}
	}
	return {
		source: a,
		text: o
	};
}
var Oo = (0, import_react.memo)((e) => {
	let t = (0, import_react.useRef)(null), { onChange: n, onClickExpression: r, text: i } = e;
	return (0, import_react.useEffect)(() => {
		let e = t.current;
		e.style.height = "auto", e.style.height = `${e.scrollHeight}px`;
	}, [i]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		ref: t,
		className: "codePre",
		rows: 1,
		readOnly: !0,
		value: i,
		placeholder: `${O.complexValue}...`,
		onClick: (e) => r(i)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		button: !0,
		name: Y.CloseFilled,
		className: "codeClear",
		onClick: (e) => {
			e.stopPropagation(), n("");
		}
	})] });
});
function ko(e) {
	return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r?\n/g, "<br/>").replace(/\s/g, "&nbsp;").replace(RegExp(`(${J.REG})`, "g"), `<${J.VarTag} contentEditable="false" class="ͼbaseflow-TplEditor__var"><i class="act"></i>$2</${J.VarTag}>`);
}
function Ao(e) {
	let t = "", n = Array.from(e.childNodes);
	return n[n.length - 1] && n[n.length - 1].nodeName === "BR" && n.length > 1 && (n = n.splice(0, n.length - 1)), n.forEach((e) => {
		if (e.nodeName === "#text") t += e.nodeValue;
		else if (e.nodeName === "BR") t += "\n";
		else if (e.nodeName === "P") t += `\n${Ao(e)}`;
		else if (e.nodeName === J.VarTag) t += J.wrapVariable(e.textContent);
		else if (e.nodeName === "DIV") {
			let n = Array.from(e.childNodes);
			n.length === 1 && n[0].nodeName === "BR" || e.previousSibling && e.previousSibling.nodeName === "BR" ? t += Ao(e) : t += `\n${Ao(e)}`;
		} else t += Ao(e);
	}), t.replace(/\u00A0/g, " ").trim();
}
function jo(e, t) {
	let n = window.getSelection();
	if (n) {
		n.removeAllRanges();
		let { args: r } = e;
		if (r[0].parentNode && r[2].parentNode) {
			let e = document.createRange();
			e.setStart(r[0], r[1]), e.setEnd(r[2], r[3]), e.deleteContents(), e.insertNode(t), e.setStartAfter(t), e.collapse(!0), n.addRange(e);
		}
	}
}
function Mo(e) {
	if (e.key === "Enter") {
		let t = window.getSelection();
		if (t?.rangeCount) {
			let n = t.getRangeAt(0), r = document.createElement("br");
			jo({ args: [
				n.startContainer,
				n.startOffset,
				n.endContainer,
				n.endOffset
			] }, r), e.preventDefault();
		}
	}
}
function No(e, t) {
	let n = document.createElement(J.VarTag);
	n.contentEditable = "false", n.className = "ͼbaseflow-TplEditor__var", n.innerHTML = `<i class="act"></i>${t.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\s/g, "&nbsp;")}`, jo(e, n);
}
function Po(e) {
	e.stopPropagation(), e.preventDefault();
	let t = e.clipboardData?.getData("text/plain");
	if (t) {
		let e = ko(t), n = window.getSelection();
		n?.rangeCount && n.getRangeAt(0).deleteContents(), document.execCommand("insertHTML", !1, e);
	}
}
var Fo = {
	valueToHtml: ko,
	htmlToValue: Ao,
	onKeyDown: Mo,
	insertVariable: No,
	onPaste: Po
};
var Io = (0, import_react.memo)(({ path: e, args: t, onChange: n }) => {
	let r = (0, import_react.useRef)(null), i = (0, import_react.useMemo)(() => {
		let n = e.split("[0]");
		if (n.length === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ͼbaseflow-TplEditor__Path",
			children: e
		});
		let r = n.length - 1, i = [];
		return n.forEach((e, n) => {
			i.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e }, `s${n}`)), n < r && i.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { defaultValue: t[n]?.replace(/^'/, "").replace(/'$/, "").replace(/\\'/g, "'") || "0" }) }, `i${n}`));
		}), i;
	}, [e, t]), o = (0, import_react.useCallback)(() => Q.popup(null), []), s = Z(() => {
		let e = r.current.getElementsByTagName("input");
		n(Array.from(e).map((e) => e.value.trim() || "0").map((e) => /\D/.test(e) ? `'${e.replace(/'/g, "\\'")}'` : e));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-TplEditor__Path",
		ref: r,
		children: [i, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "con",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
				size: "small",
				onClick: o,
				children: O.ButtonCancel
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
				size: "small",
				type: "primary",
				onClick: s,
				children: O.ButtonSubmit
			})]
		})]
	});
});
var Lo = (0, import_react.memo)(({ tag: e, target: t, sourceType: n, onSubmit: r }) => {
	let { text: i, fun: a, variable: o, args: s, isAssert: c } = (0, import_react.useMemo)(() => si.matchVariable(e.textContent || ""), [e.textContent]), l = Z(() => {
		let t = o.endsWith("!") ? o.slice(0, -1) : `${o}!`, n = e.childNodes[1];
		n.textContent = i.replace(o, t), Q.popup(null), r();
	}), d = Z((t) => {
		let n = e.childNodes[1];
		n.textContent = t.some((e) => e !== "0") ? `${H._path}(${o},${t.join(",")})` : o, Q.popup(null), r();
	}), f = Z((n) => {
		let i = e.childNodes[1];
		n === H._path ? Q.popup({
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Io, {
				path: o,
				args: s,
				onChange: d
			}),
			target: t
		}) : (i.textContent = a === n ? o : `${n}(${o})`, Q.popup(null), r());
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-TplEditor__Menu",
		children: [n !== "variable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "assert",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Switch, {
				size: "small",
				value: c,
				onChange: l
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: O.nullAssert })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "funs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: K.classNames("ͼbaseflow-TplEditor__Fun", {
						on: a === H._path,
						disabled: !o.includes("[0]")
					}),
					onClick: () => o.includes("[0]") && f(H._path),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.setPath }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {})
					]
				}),
				n !== "variable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === H._number }),
					onClick: () => f(H._number),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.convertTo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Number)" })
					]
				}),
				!n && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === H._string }),
						onClick: () => f(H._string),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(String)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === H._boolean }),
						onClick: () => f(H._boolean),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Boolean)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === H._date }),
						onClick: () => f(H._date),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Date)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === H._time }),
						onClick: () => f(H._time),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Time)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === H._datetime }),
						onClick: () => f(H._datetime),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(DateTime)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === H._any }),
						onClick: () => f(H._any),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Any)" })
						]
					})
				] })
			]
		})]
	});
});
function Ro(e, t) {
	return Array.prototype.indexOf.call(e, t);
}
var zo = (0, import_react.forwardRef)(({ value: e = "", onChange: t, onBlur: n, onFocus: r, onClickVariable: i, placeholder: a, sourceType: o }, c) => {
	let p = (0, import_react.useRef)(null), g = (0, import_react.useRef)({
		value: "",
		html: "",
		currentHtml: "",
		currentEmpty: !0
	}), _ = (0, import_react.useRef)(null), [v, y] = (0, import_react.useState)(0);
	(0, import_react.useMemo)(() => {
		Object.assign(g.current, {
			value: e,
			html: Fo.valueToHtml(e),
			currentEmpty: !e
		});
	}, [e]);
	let b = Z(() => {
		let e = !p.current.textContent;
		e !== g.current.currentEmpty && (g.current.currentEmpty = e, y(v + 1));
	}), x = Z(() => {
		let n = Fo.htmlToValue(p.current);
		e !== n && (g.current.currentHtml = p.current.innerHTML, g.current.currentEmpty = !e, p.current.innerHTML = g.current.html, y(v + 1), t?.(n));
	}), S = Z((e) => {
		n?.(e), x();
	}), C = Z((e) => {
		if (e.target.nodeName === "I") {
			let t = e.target.parentNode, n = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lo, {
				sourceType: o,
				tag: t,
				target: e.target,
				onSubmit: x
			});
			Q.popup({
				content: n,
				target: e.target
			}), e.stopPropagation();
		}
		let { variable: t } = si.matchVariable(e.target.nodeName === J.VarTag ? e.target.textContent : "");
		t = t.replace(/!$/, ""), t && i?.(t);
	}), w = Z((e) => {
		if (!_.current) {
			let e = p.current.childNodes;
			_.current = {
				start: {
					index: -1,
					offset: e.length
				},
				end: {
					index: -1,
					offset: e.length
				}
			};
		}
		let { start: t, end: n } = _.current, r = p.current.childNodes;
		try {
			Fo.insertVariable({ args: [
				r[t.index] || p.current,
				t.offset,
				r[n.index] || p.current,
				n.offset
			] }, e);
		} catch (e) {
			console.log(e), _.current = null;
		}
		setTimeout(x);
	}), ee = Z(() => {
		let e = window.getSelection();
		if (e?.rangeCount) {
			let { startContainer: t, endContainer: n, startOffset: r, endOffset: i } = e.getRangeAt(0);
			if (p.current.contains(t) && p.current.contains(n) && t.parentNode?.nodeName !== J.VarTag && n.parentNode?.nodeName !== J.VarTag) {
				let e = p.current.childNodes;
				_.current = {
					start: {
						index: Ro(e, t),
						offset: r
					},
					end: {
						index: Ro(e, n),
						offset: i
					}
				};
				return;
			}
		}
		_.current = null;
	});
	return (0, import_react.useImperativeHandle)(c, () => ({ insertVariable: w }), [w]), (0, import_react.useEffect)(() => {
		if (p.current.innerHTML = g.current.html, p.current.innerHTML !== g.current.currentHtml && (_.current = null), document.activeElement === p.current && _.current) {
			let { start: e, end: t } = _.current, n = p.current.childNodes, r = [
				n[e.index] || p.current,
				e.offset,
				n[t.index] || p.current,
				t.offset
			], i = window.getSelection();
			if (i) {
				i.removeAllRanges();
				try {
					let e = document.createRange();
					e.setStart(r[0], r[1]), e.setEnd(r[2], r[3]), e.collapse(!0), i.addRange(e);
				} catch (e) {
					_.current = null, console.log(e);
				}
			}
		}
	}, [e]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-TplEditor",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: p,
			className: "input",
			contentEditable: !0,
			onKeyDown: Fo.onKeyDown,
			onInput: b,
			onBlur: S,
			onFocus: r,
			onPaste: Fo.onPaste,
			onSelect: ee,
			onClick: C
		}), g.current.currentEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "placeholder",
			children: a || O.requiredPrompt
		}) : null]
	});
});
var Bo = (0, import_react.memo)(zo);
var Vo = (0, import_react.memo)(({ value: e, onChange: t, options: n }) => {
	let r = (0, import_react.useMemo)(() => {
		if (e) try {
			return JSON.parse(e);
		} catch (e) {
			console.error(e);
		}
	}, [e]), i = Z((e) => {
		e?.length ? t?.(JSON.stringify(e)) : t?.("");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
		multiple: !0,
		valueNotBeEmpty: !0,
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: O.selectPrompt,
		value: r,
		onChange: i,
		options: n
	});
});
var Ho = [{
	value: "true",
	label: "true"
}, {
	value: "false",
	label: "false"
}];
function Uo(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime());
}
function Wo(e) {
	let t = /* @__PURE__ */ new Date(`1979-01-01 ${e}`);
	return Number.isNaN(t.getTime());
}
var Go = {
	[T.Bool]: (e, t) => !e || e === "true" || e === "false" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
		valueNotBeEmpty: !0,
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: O.selectPrompt,
		options: Ho,
		...t
	}) : null,
	[T.Date]: (e, t) => !e || !Uo(e) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.DatePicker, {
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: O.selectPrompt,
		...t
	}) : null,
	[T.Time]: (e, t) => !e || !Wo(e) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.TimePicker, {
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: O.selectPrompt,
		...t
	}) : null,
	[T.DateTime]: (e, t) => !e || !Uo(e) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.DatePicker, {
		variant: "borderless",
		block: !0,
		showTime: !0,
		className: "nativeInput",
		placeholder: O.selectPrompt,
		...t
	}) : null,
	[T.String]: (e, t) => t ? (t = t.map((e) => e.label ? e : {
		...e,
		label: e.value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
		valueNotBeEmpty: !0,
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: O.selectPrompt,
		options: t
	})) : null,
	[T.Array]: (e, t) => t ? (t = t.map((e) => e.label ? e : {
		...e,
		label: e.value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vo, { options: t })) : null
};
function Ko(e, t) {
	return e === T.String || e === T.Number ? t ? Go[T.String] : void 0 : e === T.Array ? t ? Go[T.Array] : void 0 : Go[e];
}
var qo = (0, import_react.forwardRef)((t, n) => {
	let { value: r, onChange: i, onClickVariable: a, dataType: o, nativeRenderOptions: s, placeholder: c, sourceType: g } = t, [_, v] = (0, import_react.useState)(!0), y = t.nativeRender || Ko(o, s), b = (0, import_react.useRef)(null), x = (0, import_react.useMemo)(() => {
		let t = y ? y(r, s) : null;
		return t ? (0, import_react.cloneElement)(t, {
			value: r,
			onChange: i
		}) : null;
	}, [
		y,
		i,
		s,
		r
	]), S = Z((e) => {
		e.stopPropagation(), v(!_), !_ && !x && i("");
	});
	(0, import_react.useMemo)(() => {
		v(!r || !!x);
	}, [x, r]);
	let C = Z((e) => {
		b.current ? b.current.insertVariable(e) : i(J.wrapVariable(e));
	});
	return (0, import_react.useImperativeHandle)(n, () => ({ insertVariable: C }), [C]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!_ || !x ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bo, {
		ref: b,
		value: r,
		onChange: i,
		onClickVariable: a,
		placeholder: c,
		sourceType: g
	}) : x, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-SuperInput__rightBar",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
			name: Y.CloseFilled,
			onClick: (e) => {
				e.stopPropagation(), i("");
			}
		}), y && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
			name: Y.Switch,
			onClick: S,
			onMouseEnter: (e) => Q.tooltip({
				content: "选取 / 输入",
				target: e.target
			})
		})]
	})] });
});
var Jo = (0, import_react.memo)(qo);
var Yo = (0, import_react.forwardRef)((e, t) => {
	let n = ro(), [r] = (0, import_react.useState)(Ji.createUID()), i = (0, import_react.useRef)(null), o = (0, import_react.useRef)(""), { style: c, variant: p, nativeRender: g, optional: _, nativeRenderOptions: v, onChange: y, sourceType: b, error: x, hideError: S, dataTypeEditable: C, context: w = "", runtime: ee = "expression", dataType: E = T.String } = e, ne = e.variableFilter, re = ee === "script" ? D.Expression : e.dataSource, ie = b === "mapping" ? e.placeholder || O.loopContextPrompt : e.placeholder, ae = b === "mapping" || e.hideIcon, [oe, se] = (0, import_react.useState)(!1), [k] = (0, import_react.useState)(new wo()), [A, ce] = (0, import_react.useState)(""), j = Z((e) => {
		A !== e && ce(e);
	}), le = (0, import_react.useMemo)(() => {
		if (e.height) return { minHeight: e.height };
	}, [e.height]), ue = (0, import_react.useMemo)(() => K.classNames("ͼbaseflow-SuperInput", e.className, p, {
		active: oe,
		hideIcon: ae,
		hasError: !S && (x || A)
	}), [
		e.className,
		ae,
		x,
		A,
		S,
		p,
		oe
	]), de = (0, import_react.useRef)(void 0);
	(0, import_react.useMemo)(() => {
		de.current = E;
	}, [E]);
	let M = (0, import_react.useMemo)(() => Eo(e.value, re), [e.value, re]), fe = Z((t) => {
		if (M.mode !== t) {
			let { source: n, text: r } = Do(M.code, t, M, re, b);
			(n !== e.value?.source || r !== e.value?.text) && y?.({
				type: E,
				optional: _,
				source: n,
				text: r
			});
		}
	}), pe = Z((t) => {
		if (M.code !== t) {
			let { source: n, text: r } = Do(t, M.mode, M, re, b);
			if (n !== e.value?.source || r !== e.value?.text) {
				let e = {
					type: E,
					optional: _,
					source: n,
					text: r
				};
				C && n === D.Variable && de.current && (e.type = de.current), y?.(e);
			}
		}
	}), me = Z((e) => {
		y?.({
			type: E,
			optional: _,
			source: M.source,
			text: e
		});
	}), he = (0, import_react.useCallback)((e, t) => {
		de.current = t, i.current?.insertVariable(e);
	}, []), ge = Z(() => M.mode), _e = Z(() => E), ve = Z(() => w), ye = Z(() => ee), be = Z(() => ne), xe = Z(() => e.value), Se = (0, import_react.useCallback)(() => o.current, []), Ce = Z(() => e.brand), we = (0, import_react.useCallback)((e) => {
		e || (o.current = ""), se(e);
	}, []), [Te] = (0, import_react.useState)({
		setMode: fe,
		getMode: ge,
		setText: me,
		insertVariable: he,
		getDataType: _e,
		getContext: ve,
		getValue: xe,
		getHighlight: Se,
		getBrand: Ce,
		getRuntime: ye,
		setActive: we,
		getVariableFilter: be,
		addListener: k.addListener.bind(k)
	});
	(0, import_react.useImperativeHandle)(t, () => Te, [Te]);
	let Ee = Z(() => {
		oe || n.setActivedSuperInput(Te);
	}), De = Z(() => {
		if (!_ && !M.text) {
			j(O.requiredPrompt);
			return;
		}
		let e = Ui.superInputToInspector({
			type: E,
			optional: _,
			source: M.source,
			text: M.text
		}, w, b === "mapping");
		e ? n.validateSuperInput(`${r}`, e, j) : j("");
	}), Oe = Z((e) => {
		o.current = e, k.dispatch("variableClick", {
			variable: e,
			target: Te
		});
	}), ke = Z((e) => {
		k.dispatch("expressionClick", {
			expression: e,
			target: Te
		});
	}), Ae = Z((e) => {
		Q.popup(null);
		let t = e.target, n = t.dataset.type || t.parentElement?.dataset.type;
		n && y?.({
			type: n,
			optional: _,
			source: M.source,
			text: M.text
		});
	}), je = (0, import_react.useMemo)(() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "ͼbaseflow-SuperInput__dataTypeMenu",
		onClick: Ae,
		children: te.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			"data-type": e.value,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: e.value }),
				" ",
				e.label
			]
		}, e.value))
	}), [Ae]), Me = Z((e) => {
		C && Q.popup({
			content: je,
			target: e.target,
			offset: {
				left: "-15px",
				top: "2px"
			}
		});
	});
	return (0, import_react.useEffect)(() => {
		De();
	}, [w, e.value]), (0, import_react.useEffect)(() => () => {
		n.getActivedSuperInput() === Te && n.setActivedSuperInput(null);
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames(ue, M.mode),
		"data-error": x || A || void 0,
		style: c,
		children: [
			!re && !b && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ͼbaseflow-SuperInput__modeSwitch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: K.classNames("item", { on: M.mode === "simple" }),
					onClick: () => fe("simple"),
					children: O.simpleValue
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: K.classNames("item", { on: M.mode === "complex" }),
					onClick: () => fe("complex"),
					children: O.complexValue
				})]
			}),
			!ae && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				className: K.classNames("dataType", { editable: C }),
				name: E,
				onClick: Me
			}),
			!S && (x || A) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "dataError",
				title: x || A,
				onClick: (e) => {
					Yi.clipboard.write(e.currentTarget.textContent), Yi.message.success(O.copied);
				},
				children: x || A
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("ͼbaseflow-SuperInput__input", M.mode),
				"data-baseflow-role": K.domRoles.SuperInput,
				style: le,
				onClick: Ee,
				children: M.mode === "complex" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Oo, {
					onChange: pe,
					text: M.code,
					onClickExpression: ke
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jo, {
					ref: i,
					dataType: E,
					value: M.code,
					onChange: pe,
					nativeRender: g,
					nativeRenderOptions: v,
					onClickVariable: Oe,
					placeholder: ie,
					sourceType: b
				})
			})
		]
	});
});
var Xo = (0, import_react.memo)(Yo);
function Zo(e) {}
function Qo(e) {
	switch (e) {
		case T.String: return [
			{
				label: O.equalTo,
				value: "equalTo"
			},
			{
				label: O.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: O.startsWith,
				value: "startsWith"
			},
			{
				label: O.endsWith,
				value: "endsWith"
			},
			{
				label: O.containsString,
				value: "containsString"
			},
			{
				label: O.notContainsString,
				value: "notContainsString"
			},
			{
				label: O.containedIn,
				value: "containedIn"
			},
			{
				label: O.notContainedIn,
				value: "notContainedIn"
			},
			{
				label: O.in,
				value: "in"
			},
			{
				label: O.notIn,
				value: "notIn"
			}
		];
		case T.Number: return [
			{
				label: O.equalTo,
				value: "equalTo"
			},
			{
				label: O.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: O.greaterThan,
				value: "greaterThan"
			},
			{
				label: O.lessThan,
				value: "lessThan"
			},
			{
				label: O.greaterOrEqual,
				value: "greaterOrEqual"
			},
			{
				label: O.lessOrEqual,
				value: "lessOrEqual"
			},
			{
				label: O.in,
				value: "in"
			},
			{
				label: O.notIn,
				value: "notIn"
			}
		];
		case T.Date:
		case T.Time:
		case T.DateTime: return [
			{
				label: O.equalTo,
				value: "equalTo"
			},
			{
				label: O.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: O.laterThan,
				value: "laterThan"
			},
			{
				label: O.earlierThan,
				value: "earlierThan"
			},
			{
				label: O.laterOrEqual,
				value: "laterOrEqual"
			},
			{
				label: O.earlierOrEqual,
				value: "earlierOrEqual"
			},
			{
				label: O.in,
				value: "in"
			},
			{
				label: O.notIn,
				value: "notIn"
			}
		];
		case T.Bool: return [
			{
				label: O.equalTo,
				value: "equalTo"
			},
			{
				label: O.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: O.in,
				value: "in"
			},
			{
				label: O.notIn,
				value: "notIn"
			}
		];
		case T.Array: return [
			{
				label: O.equalTo,
				value: "equalTo"
			},
			{
				label: O.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: O.containsItem,
				value: "containsItem"
			},
			{
				label: O.notContainsItem,
				value: "notContainsItem"
			},
			{
				label: O.in,
				value: "in"
			},
			{
				label: O.notIn,
				value: "notIn"
			}
		];
		case T.Map:
		case T.Object: return [
			{
				label: O.equalTo,
				value: "equalTo"
			},
			{
				label: O.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: O.containsItem,
				value: "containsItem"
			},
			{
				label: O.notContainsItem,
				value: "notContainsItem"
			},
			{
				label: O.hasKey,
				value: "hasKey"
			},
			{
				label: O.notHasKey,
				value: "notHasKey"
			},
			{
				label: O.in,
				value: "in"
			},
			{
				label: O.notIn,
				value: "notIn"
			}
		];
	}
	return [
		{
			label: O.equalTo,
			value: "equalTo"
		},
		{
			label: O.notEqualTo,
			value: "notEqualTo"
		},
		{
			label: O.in,
			value: "in"
		},
		{
			label: O.notIn,
			value: "notIn"
		}
	];
}
function $o(e, t) {
	return t === "in" || t === "notIn" ? T.Array : t === "hasKey" || t === "notHasKey" ? T.String : t === "containsItem" || t === "notContainsItem" ? T.Any : e;
}
var es = (0, import_react.memo)(({ value: e, onChange: t }) => {
	let n = Z(() => {
		t(e === "and" ? "or" : "and");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-ConditionSelector__Relation",
		onClick: n,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.ArrowDown }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.toUpperCase() })]
	});
});
var ts = {
	type: T.String,
	source: D.Variable,
	text: ""
};
var ns = (0, import_react.memo)((e) => {
	let t = (0, import_react.useRef)(1), n = (0, import_react.useRef)({});
	(0, import_react.useMemo)(() => {
		if (e.value !== n.current.value) {
			n.current.value = e.value;
			let t = JSON.parse(JSON.stringify(e.value));
			n.current._value = t, n.current.__value = t, t.groups.forEach((e) => {
				e.items.forEach((e) => {
					e.operatorOptions ||= Qo(e.source.type);
				});
			});
		} else n.current._value = n.current.__value;
	}, [e.value]);
	let r = Z((t) => {
		let r = e.onChange;
		if (t) {
			let e = {
				...t,
				groups: t.groups.map(({ relation: e, items: t }) => ({
					relation: e,
					items: t.map(({ source: e, target: t, operator: n }) => ({
						source: e,
						target: t,
						operator: n
					}))
				}))
			};
			n.current.value = e, n.current.__value = t, r(e);
		} else r(void 0);
	}), i = n.current._value, a = Z((e) => {
		r({
			...i,
			relation: e
		});
	}), o = (e, t) => {
		r({
			...i,
			groups: i.groups.map((n, r) => r === e ? {
				...n,
				relation: t
			} : n)
		});
	}, s = (e) => {
		r({
			...i,
			groups: [...i.groups, {
				relation: "and",
				items: [{
					source: { ...ts },
					operator: "equalTo",
					target: { ...ts },
					operatorOptions: Qo(ts.type)
				}]
			}]
		});
	}, c = (e) => {
		let t = i.groups.filter((t, n) => e !== n);
		r(t.length ? {
			...i,
			groups: t
		} : void 0);
	}, l = (e, t) => {
		r({
			...i,
			groups: i.groups.map((n, r) => r === e ? {
				...n,
				items: [
					...n.items.slice(0, t + 1),
					{
						source: { ...ts },
						operator: "equalTo",
						target: { ...ts },
						operatorOptions: Qo(ts.type)
					},
					...n.items.slice(t + 1)
				]
			} : n)
		});
	}, f = (e, t) => {
		let n = i.groups[e].items.filter((e, n) => n !== t);
		if (n.length) {
			r({
				...i,
				groups: i.groups.map((t, r) => r === e ? {
					...t,
					items: n
				} : t)
			});
			return;
		}
		let a = i.groups.filter((t, n) => n !== e);
		if (a.length) {
			r({
				...i,
				groups: a
			});
			return;
		}
		r(void 0);
	}, p = (e, t, n) => {
		r({
			...i,
			groups: i.groups.map((r, i) => i === e ? {
				...r,
				items: r.items.map((e, r) => {
					if (r === t) {
						let t = {
							...e,
							source: n
						};
						return e.source.type !== n.type && Object.assign(t, {
							operator: "equalTo",
							target: { ...ts },
							operatorOptions: Qo(n.type)
						}), t;
					}
					return e;
				})
			} : r)
		});
	}, g = (e, t, n) => {
		r({
			...i,
			groups: i.groups.map((r, i) => i === e ? {
				...r,
				items: r.items.map((e, r) => r === t ? {
					...e,
					target: n
				} : e)
			} : r)
		});
	}, _ = (e, t, n) => {
		r({
			...i,
			groups: i.groups.map((r, i) => i === e ? {
				...r,
				items: r.items.map((e, r) => {
					if (r === t) {
						let t = {
							...e,
							operator: n
						}, r = $o(e.source.type, n);
						return e.target.type !== r && (t.target = {
							...ts,
							type: r
						}), t;
					}
					return e;
				})
			} : r)
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-ConditionSelector__conditionForm",
		children: i.groups.map((e, n) => (e.key ||= t.current++, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group",
			children: [e.items.map((r, i) => (r.key ||= t.current++, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ͼbaseflow-ConditionSelector__conditionItem",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hd",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "title",
							children: i === 0 ? "WHEN" : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(es, {
								value: e.relation,
								onChange: (e) => o(n, e)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xo, {
							dataTypeEditable: !0,
							dataType: r.source.type,
							value: r.source,
							onChange: (e) => p(n, i, e)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "action",
							name: Y.MinusCircle,
							onClick: () => f(n, i)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bd",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
							className: "operator",
							value: r.operator,
							options: r.operatorOptions,
							onChange: (e) => _(n, i, e)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xo, {
							dataType: r.target.type,
							value: r.target,
							onChange: (e) => g(n, i, e)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "action",
							name: Y.PlusCircle,
							onClick: () => l(n, i)
						})
					]
				})]
			}, r.key))), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ͼbaseflow-ConditionSelector__groupActions",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "btn",
						onClick: () => s(n),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.PlusCircle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.addGroup })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "btn",
						onClick: () => c(n),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.MinusCircle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.delGroup })]
					}),
					i.groups.length > 1 && n < i.groups.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "group-relation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(es, {
							value: i.relation,
							onChange: a
						})
					})
				]
			})]
		}, e.key)))
	});
});
var rs = {
	type: T.String,
	source: D.Variable,
	text: ""
};
var is = {
	relation: "or",
	groups: [{
		relation: "and",
		items: [{
			source: { ...rs },
			operator: "equalTo",
			target: { ...rs }
		}]
	}]
};
var as = (0, import_react.memo)(({ value: e, onChange: t }) => {
	let n = (0, import_react.useMemo)(() => {
		if (typeof e == "string") return {
			type: T.String,
			text: e,
			source: D.Expression
		};
	}, [e]), r = Z((e) => {
		t?.(e.text);
	}), i = Z((e) => {
		e ? t?.("") : t?.(is);
	});
	return e === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-ConditionSelector",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
			type: "link",
			size: "small",
			onClick: () => t?.(is),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.PlusCircle }),
			children: O.createCondition
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-ConditionSelector",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mode-switch",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "title",
				children: O.condition
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Switch, {
				checkedChildren: O.scriptsMode,
				unCheckedChildren: O.scriptsMode,
				value: typeof e == "string",
				onChange: i
			})]
		}), typeof e == "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-ConditionSelector__conditionScripts",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label",
				children: O.conditionScripts
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "input",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xo, {
					height: 100,
					hideIcon: !0,
					runtime: "script",
					brand: "variable",
					dataType: T.Any,
					value: n,
					onChange: r
				})
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ns, {
			value: e,
			onChange: t || Zo
		})]
	});
});
var os = (e) => typeof e == "boolean" || e instanceof Boolean;
var ss = (e) => typeof e == "number" || e instanceof Number;
var cs = (e) => typeof e == "bigint" || e instanceof BigInt;
var ls = (e) => !!e && e instanceof Date;
var us = (e) => typeof e == "string" || e instanceof String;
var ds = (e) => Array.isArray(e);
var fs = (e) => typeof e == "object" && !!e;
var ps = (e) => !!e && e instanceof Object && typeof e == "function";
function ms(e, t) {
	return t === void 0 && (t = !1), !e || t ? `"${e}"` : e;
}
function hs(e, t, n) {
	return n ? JSON.stringify(e) : t ? `"${e}"` : e;
}
function gs(e) {
	let { field: t, value: r, data: i, lastElement: a, openBracket: o, closeBracket: l, level: u, style: p, shouldExpandNode: m, clickToExpandNode: h, outerRef: g, beforeExpandChange: _ } = e, v = (0, import_react.useRef)(!1), [y, b] = (0, import_react.useState)(() => m(u, r, t)), x = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		v.current ? b(m(u, r, t)) : v.current = !0;
	}, [m]);
	let S = (0, import_react.useId)();
	if (i.length === 0) return _s({
		field: t,
		openBracket: o,
		closeBracket: l,
		lastElement: a,
		style: p
	});
	let C = y ? p.collapseIcon : p.expandIcon, w = y ? p.ariaLables.collapseJson : p.ariaLables.expandJson, ee = u + 1, T = i.length - 1, E = (e) => {
		y !== e && (!_ || _({
			level: u,
			value: r,
			field: t,
			newExpandValue: e
		})) && b(e);
	}, te = (e) => {
		if (e.key === "ArrowRight" || e.key === "ArrowLeft") e.preventDefault(), E(e.key === "ArrowRight");
		else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			let t = e.key === "ArrowUp" ? -1 : 1;
			if (!g.current) return;
			let n = g.current.querySelectorAll("[role=button]"), r = -1;
			for (let e = 0; e < n.length; e++) if (n[e].tabIndex === 0) {
				r = e;
				break;
			}
			if (r < 0) return;
			let i = (r + t + n.length) % n.length;
			n[r].tabIndex = -1, n[i].tabIndex = 0, n[i].focus();
		}
	}, D = () => {
		E(!y);
		let e = x.current;
		if (!e) return;
		let t = g.current?.querySelector("[role=button][tabindex=\"0\"]");
		t && (t.tabIndex = -1), e.tabIndex = 0, e.focus();
	};
	return /*#__PURE__*/ (0, import_react.createElement)("div", {
		className: p.basicChildStyle,
		role: "treeitem",
		"aria-expanded": y,
		"aria-selected": void 0
	}, /*#__PURE__*/ (0, import_react.createElement)("span", {
		className: C,
		onClick: D,
		onKeyDown: te,
		role: "button",
		"aria-label": w,
		"aria-expanded": y,
		"aria-controls": y ? S : void 0,
		ref: x,
		tabIndex: u === 0 ? 0 : -1
	}), (t || t === "") && (h ? /*#__PURE__*/ (0, import_react.createElement)("span", {
		className: p.clickableLabel,
		onClick: D,
		onKeyDown: te
	}, ms(t, p.quotesForFieldNames), ":") : /*#__PURE__*/ (0, import_react.createElement)("span", { className: p.label }, ms(t, p.quotesForFieldNames), ":")), /*#__PURE__*/ (0, import_react.createElement)("span", { className: p.punctuation }, o), y ? /*#__PURE__*/ (0, import_react.createElement)("ul", {
		id: S,
		role: "group",
		className: p.childFieldsContainer
	}, i.map((e, t) => /*#__PURE__*/ (0, import_react.createElement)(xs, {
		key: e[0] || t,
		field: e[0],
		value: e[1],
		style: p,
		lastElement: t === T,
		level: ee,
		shouldExpandNode: m,
		clickToExpandNode: h,
		beforeExpandChange: _,
		outerRef: g
	}))) : /*#__PURE__*/ (0, import_react.createElement)("span", {
		className: p.collapsedContent,
		onClick: D,
		onKeyDown: te
	}), /*#__PURE__*/ (0, import_react.createElement)("span", { className: p.punctuation }, l), !a && /*#__PURE__*/ (0, import_react.createElement)("span", { className: p.punctuation }, ","));
}
function _s(e) {
	let { field: t, openBracket: r, closeBracket: i, lastElement: a, style: o } = e;
	return /*#__PURE__*/ (0, import_react.createElement)("div", {
		className: o.basicChildStyle,
		role: "treeitem",
		"aria-selected": void 0
	}, (t || t === "") && /*#__PURE__*/ (0, import_react.createElement)("span", { className: o.label }, ms(t, o.quotesForFieldNames), ":"), /*#__PURE__*/ (0, import_react.createElement)("span", { className: o.punctuation }, r), /*#__PURE__*/ (0, import_react.createElement)("span", { className: o.punctuation }, i), !a && /*#__PURE__*/ (0, import_react.createElement)("span", { className: o.punctuation }, ","));
}
function vs(e) {
	let { field: t, value: n, style: r, lastElement: i, shouldExpandNode: a, clickToExpandNode: o, level: s, outerRef: c, beforeExpandChange: l } = e;
	return gs({
		field: t,
		value: n,
		lastElement: i || !1,
		level: s,
		openBracket: "{",
		closeBracket: "}",
		style: r,
		shouldExpandNode: a,
		clickToExpandNode: o,
		data: Object.keys(n).map((e) => [e, n[e]]),
		outerRef: c,
		beforeExpandChange: l
	});
}
function ys(e) {
	let { field: t, value: n, style: r, lastElement: i, level: a, shouldExpandNode: o, clickToExpandNode: s, outerRef: c, beforeExpandChange: l } = e;
	return gs({
		field: t,
		value: n,
		lastElement: i || !1,
		level: a,
		openBracket: "[",
		closeBracket: "]",
		style: r,
		shouldExpandNode: o,
		clickToExpandNode: s,
		data: n.map((e) => [void 0, e]),
		outerRef: c,
		beforeExpandChange: l
	});
}
function bs(e) {
	let { field: t, value: r, style: i, lastElement: a } = e, o, s = i.otherValue;
	return r === null ? (o = "null", s = i.nullValue) : r === void 0 ? (o = "undefined", s = i.undefinedValue) : us(r) ? (o = hs(r, !i.noQuotesForStringValues, i.stringifyStringValues), s = i.stringValue) : os(r) ? (o = r ? "true" : "false", s = i.booleanValue) : ss(r) ? (o = r.toString(), s = i.numberValue) : cs(r) ? (o = `${r.toString()}n`, s = i.numberValue) : o = ls(r) ? r.toISOString() : ps(r) ? "function() { }" : r.toString(), /*#__PURE__*/ (0, import_react.createElement)("div", {
		className: i.basicChildStyle,
		role: "treeitem",
		"aria-selected": void 0
	}, (t || t === "") && /*#__PURE__*/ (0, import_react.createElement)("span", { className: i.label }, ms(t, i.quotesForFieldNames), ":"), /*#__PURE__*/ (0, import_react.createElement)("span", { className: s }, o), !a && /*#__PURE__*/ (0, import_react.createElement)("span", { className: i.punctuation }, ","));
}
function xs(e) {
	let t = e.value;
	return ds(t) ? /*#__PURE__*/ (0, import_react.createElement)(ys, Object.assign({}, e)) : fs(t) && !ls(t) && !ps(t) ? /*#__PURE__*/ (0, import_react.createElement)(vs, Object.assign({}, e)) : /*#__PURE__*/ (0, import_react.createElement)(bs, Object.assign({}, e));
}
var $ = {
	"container-base": "_GzYRV",
	"punctuation-base": "_3eOF8",
	pointer: "_1MFti",
	"expander-base": "_f10Tu _1MFti",
	"expand-icon": "_1UmXx",
	"collapse-icon": "_1LId0",
	"collapsed-content-base": "_1pNG9 _1MFti",
	"container-light": "_2IvMF _GzYRV",
	"basic-element-style": "_2bkNM",
	"child-fields-container": "_1BXBN",
	"label-light": "_1MGIk",
	"clickable-label-light": "_2YKJg _1MGIk _1MFti",
	"punctuation-light": "_3uHL6 _3eOF8",
	"value-null-light": "_2T6PJ",
	"value-undefined-light": "_1Gho6",
	"value-string-light": "_vGjyY",
	"value-number-light": "_1bQdo",
	"value-boolean-light": "_3zQKs",
	"value-other-light": "_1xvuR",
	"collapse-icon-light": "_oLqym _f10Tu _1MFti _1LId0",
	"expand-icon-light": "_2AXVT _f10Tu _1MFti _1UmXx",
	"collapsed-content-light": "_2KJWg _1pNG9 _1MFti",
	"container-dark": "_11RoI _GzYRV",
	"expand-icon-dark": "_17H2C _f10Tu _1MFti _1UmXx",
	"collapse-icon-dark": "_3QHg2 _f10Tu _1MFti _1LId0",
	"collapsed-content-dark": "_3fDAz _1pNG9 _1MFti",
	"label-dark": "_2bSDX",
	"clickable-label-dark": "_1RQEj _2bSDX _1MFti",
	"punctuation-dark": "_gsbQL _3eOF8",
	"value-null-dark": "_LaAZe",
	"value-undefined-dark": "_GTKgm",
	"value-string-dark": "_Chy1W",
	"value-number-dark": "_2bveF",
	"value-boolean-dark": "_2vRm-",
	"value-other-dark": "_1prJR"
};
var Ss = {
	container: $["container-light"],
	basicChildStyle: $["basic-element-style"],
	childFieldsContainer: $["child-fields-container"],
	label: $["label-light"],
	clickableLabel: $["clickable-label-light"],
	nullValue: $["value-null-light"],
	undefinedValue: $["value-undefined-light"],
	stringValue: $["value-string-light"],
	booleanValue: $["value-boolean-light"],
	numberValue: $["value-number-light"],
	otherValue: $["value-other-light"],
	punctuation: $["punctuation-light"],
	collapseIcon: $["collapse-icon-light"],
	expandIcon: $["expand-icon-light"],
	collapsedContent: $["collapsed-content-light"],
	noQuotesForStringValues: !1,
	quotesForFieldNames: !1,
	ariaLables: {
		collapseJson: "collapse JSON",
		expandJson: "expand JSON"
	},
	stringifyStringValues: !1
};
$["container-dark"], $["basic-element-style"], $["child-fields-container"], $["label-dark"], $["clickable-label-dark"], $["value-null-dark"], $["value-undefined-dark"], $["value-string-dark"], $["value-boolean-dark"], $["value-number-dark"], $["value-other-dark"], $["punctuation-dark"], $["collapse-icon-dark"], $["expand-icon-dark"], $["collapsed-content-dark"];
var Cs = () => !0;
var ws = (e) => {
	let { data: t, style: r = Ss, shouldExpandNode: i = Cs, clickToExpandNode: a = !1, beforeExpandChange: o, compactTopLevel: s, ...c } = e, l = (0, import_react.useRef)(null);
	return /*#__PURE__*/ (0, import_react.createElement)("div", Object.assign({ "aria-label": "JSON view" }, c, {
		className: r.container,
		ref: l,
		role: "tree"
	}), s && fs(t) ? Object.entries(t).map((e) => {
		let [t, s] = e;
		return /*#__PURE__*/ (0, import_react.createElement)(xs, {
			key: t,
			field: t,
			value: s,
			style: {
				...Ss,
				...r
			},
			lastElement: !0,
			level: 1,
			shouldExpandNode: i,
			clickToExpandNode: a,
			beforeExpandChange: o,
			outerRef: l
		});
	}) : /*#__PURE__*/ (0, import_react.createElement)(xs, {
		value: t,
		style: {
			...Ss,
			...r
		},
		lastElement: !0,
		level: 0,
		shouldExpandNode: i,
		clickToExpandNode: a,
		outerRef: l,
		beforeExpandChange: o
	}));
};
var Ts = (0, import_react.memo)(({ data: e, shouldExpandNode: t }) => {
	let n = (0, import_react.useMemo)(() => ({
		...Ss,
		quotesForFieldNames: !0
	}), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-JsonView",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ws, {
			data: e,
			shouldExpandNode: t,
			clickToExpandNode: !0,
			style: n
		})
	});
});
var Es = (0, import_react.memo)(({ value: e, onChange: t, ...n }) => {
	let [r, i] = (0, import_react.useState)(e);
	(0, import_react.useMemo)(() => {
		i(e);
	}, [e]);
	let a = Z(() => {
		let n = (r || "").trim();
		(e || "").trim() !== n && t?.(n);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Input, {
		value: r,
		onChange: i,
		onBlur: a,
		...n
	});
});
var Ds = (0, import_react.memo)(({ value: e, onChange: t, labelPlaceholder: n = "label", valuePlaceholder: r = "value", hideLabel: i, className: a, variant: o }) => {
	let s = (0, import_react.useRef)(0), c = (0, import_react.useRef)(/* @__PURE__ */ new Map()), l = Z(() => {
		let n = {
			value: "",
			label: i ? void 0 : ""
		};
		t?.(e ? [...e, n] : [n]);
	}), u = Z((n) => {
		t?.(e.filter((e, t) => t !== n || (c.current.delete(e), !1)));
	}), f = Z((n, r) => {
		let i = e.map((e, t) => t === r ? (c.current.delete(e), {
			...e,
			value: n
		}) : e);
		t?.(i);
	}), p = Z((n, r) => {
		let i = e.map((e, t) => t === r ? (c.current.delete(e), {
			...e,
			label: n
		}) : e);
		t?.(i);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-KeyValues", a, o),
		children: [e?.length ? e.map((e, t) => {
			let a = c.current.get(e);
			return a || (a = ++s.current, c.current.set(e, a)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "item",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Es, {
						className: K.classNames("input", { "input-error": !e.value }),
						variant: "filled",
						placeholder: r,
						value: e.value,
						onChange: (e) => f(e || "", t)
					}),
					!i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Es, {
						className: "input",
						variant: "filled",
						placeholder: n,
						value: e.label,
						onChange: (e) => p(e || "", t)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						name: Y.MinusCircle,
						onClick: () => u(t)
					})
				]
			}, a);
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: K.classNames("create", { more: e?.length }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.PlusCircle,
				onClick: l
			})
		})]
	});
});
var Os = (0, import_react.memo)(({ onClose: e, item: t }) => {
	let [n, r] = (0, import_react.useState)(W.schemaModelToXml(t)), [i, a] = (0, import_react.useState)(""), o = Z(() => {
		let e = W.xmlToSchemaModel(n), t = W.schemaModelToJson(e);
		a(t);
	}), s = Z((e) => {
		Yi.clipboard.write(e).then(() => Yi.message.success(O.alreadyToClipboard));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-sr-modal head-split ͼbaseflow-SchemaExport"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				className: "close",
				button: !0,
				name: Y.Close,
				onClick: e
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hd",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "icon",
					name: Y.Export
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "title",
					children: O.export
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bd",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ͼbaseflow-SchemaExport__col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hd",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "title",
								children: `${O.jsonValue}:`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "link",
								onClick: () => s(i),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Copy }), O.copy]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.TextArea, {
							className: "input",
							variant: "filled",
							rows: 10,
							block: !0,
							value: i,
							onChange: a
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ͼbaseflow-SchemaExport__con",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
							size: "small",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.ArrowLeft }),
							onClick: o,
							children: O.generate
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ͼbaseflow-SchemaExport__col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hd",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "title",
								children: `${O.schemaModel}:`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "link",
								onClick: () => s(n),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Copy }), O.copy]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.TextArea, {
							className: "input",
							variant: "filled",
							rows: 10,
							block: !0,
							value: n,
							onChange: r
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ft",
				children: O.exportSchemaTips
			})
		]
	});
});
function ks({ namespace: e, looseLeaf: t, node: n, parent: r, index: i, isFirst: a, isLast: s, parentLevel: c, parentPath: l, parentIds: u, parentIsEnd: d, parentIsFinish: f, attributeRender: p, context: g, contextValueRender: _, nodeRender: v, folderRender: y }) {
	let b = {
		node: n,
		parent: r,
		index: i,
		level: c + 1,
		path: n.name && l ? `${l}⫻${n.name}` : n.name || "",
		ids: n.id && u ? `${u}⫻${n.id}` : n.id || "",
		isFirst: a,
		isLast: s,
		isBegin: a && c === 0,
		isEnd: s && d,
		isFinish: s && f,
		isLeaf: t ? !n.children : !n.children?.length,
		folded: !!n.folded,
		disabled: !!n.disabled,
		contextValue: g ? (0, import_react.useContext)(g) : void 0
	}, x = p ? p(b) : void 0, S = _ ? _(b) : void 0, C = !b.isLeaf && n.disabled !== "all", w = C && n.children.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(As, {
		namespace: e,
		looseLeaf: t,
		context: g,
		contextValueRender: _,
		attributeRender: p,
		folderRender: y,
		nodeRender: v,
		node: r,
		parent: n,
		index: i,
		isFirst: i === 0,
		isLast: i === n.children.length - 1,
		parentLevel: b.level,
		parentPath: b.path,
		parentIds: b.ids,
		parentIsEnd: b.isLast,
		parentIsFinish: b.isFinish
	}, r.id || (r.name && b.path ? `${b.path}⫻${r.name}` : r.name || "")));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		...x,
		className: K.classNames("ͼbaseflow-SimpleTree__item", e && `ͼbaseflow-${e}`, x?.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("ͼbaseflow-SimpleTree__node", e && `ͼbaseflow-${e}`, { "ͼbaseflow-root": !r }),
				children: v(b)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("ͼbaseflow-SimpleTree__folder", e && `ͼbaseflow-${e}`, {
					"ͼbaseflow-root": !r,
					"ͼbaseflow-folded": b.folded,
					"ͼbaseflow-leaf": b.isLeaf
				}),
				children: y(b)
			}),
			C && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("ͼbaseflow-SimpleTree__children", e && `ͼbaseflow-${e}`, `ͼbaseflow-level${b.level % 2}`, {
					"ͼbaseflow-folded": b.folded,
					"ͼbaseflow-root": !r
				}),
				children: g && S !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(g.Provider, {
					value: S,
					children: w
				}) : w
			})
		]
	});
}
var As = (0, import_react.memo)(ks);
function js(e) {
	let t = e.source, { style: n, namespace: r, looseLeaf: i = !1, context: a, contextValueRender: s, attributeRender: c, nodeRender: l, folderRender: u } = e;
	if (e.renderRoot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SimpleTree", r && `ͼbaseflow-${r}`),
		style: n,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(As, {
			namespace: r,
			looseLeaf: i,
			context: a,
			contextValueRender: s,
			attributeRender: c,
			folderRender: u,
			nodeRender: l,
			node: t,
			parent: void 0,
			index: 0,
			parentLevel: 0,
			parentPath: "",
			parentIds: "",
			isFirst: !0,
			isLast: !0,
			parentIsEnd: !0,
			parentIsFinish: !0
		}, t.id || t.name)
	});
	let d = e.source?.children;
	if (!d?.length) return null;
	let f = t.disabled, p = {
		node: t,
		parent: void 0,
		index: 0,
		level: 0,
		path: t.name || "",
		ids: t.id || "",
		isFirst: !0,
		isLast: !0,
		isBegin: !0,
		isEnd: !0,
		isFinish: !0,
		isLeaf: !1,
		folded: !!t.folded,
		disabled: !!t.disabled,
		contextValue: a ? (0, import_react.useContext)(a) : void 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SimpleTree", r && `ͼbaseflow-${r}`),
		style: n,
		children: f !== "all" && d.map((e, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(As, {
			namespace: r,
			looseLeaf: i,
			context: a,
			contextValueRender: s,
			attributeRender: c,
			folderRender: u,
			nodeRender: l,
			node: e,
			parent: t,
			index: n,
			isFirst: n === 0,
			isLast: n === d.length - 1,
			parentLevel: p.level,
			parentPath: p.path,
			parentIds: p.ids,
			parentIsEnd: p.isLast,
			parentIsFinish: p.isFinish
		}, e.id || (e.name && p.path ? `${p.path}⫻${e.name}` : e.name || "")))
	});
}
var Ms = (0, import_react.memo)(js);
var Ns = ({ className: e, children: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
	className: K.classNames("ͼbaseflow-FormLayout", e),
	children: t
});
var Ps = (0, import_react.memo)(({ value: e, onChange: t, error: n }) => {
	let [r, i] = (0, import_react.useState)(""), [a, o] = (0, import_react.useState)(e), [s, c] = (0, import_react.useState)(""), [l, d] = (0, import_react.useState)(n);
	(0, import_react.useMemo)(() => {
		d(n);
	}, [n]);
	let p = Z(() => {
		r || c(O.jsonValueTips);
		let e;
		try {
			e = W.jsonToSchemaModel(r);
		} catch (e) {
			console.error(e);
		}
		if (e) {
			c(""), d("");
			let n = W.schemaModelToXml(e);
			o(n), t?.(n);
		} else c(O.jsonValueTips);
	}), g = Z(() => {
		t?.(a);
	}), _ = Z(() => {
		let e = r.trim();
		if (e) try {
			let t = JSON.parse(e);
			e = JSON.stringify(t, null, 4), i(e), c("");
		} catch (e) {
			console.error(e), d(O.jsonValueTips);
		}
	}), v = Z(() => {
		let e = a.trim();
		if (e) try {
			let t = W.formatXml(e);
			o(t), d("");
		} catch (e) {
			console.error(e), d(O.schemaValueTips);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-SchemaModelForm-SchemaImport",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bd",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ͼbaseflow-SchemaModelForm-SchemaImport__col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hd",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "title",
								children: `${O.jsonValue}:`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "error",
								children: s
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "format",
								onClick: _,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Loop }), O.format]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.TextArea, {
						className: "input",
						variant: "filled",
						rows: 10,
						block: !0,
						value: r,
						onChange: i
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ͼbaseflow-SchemaModelForm-SchemaImport__con",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
						size: "small",
						iconPosition: "end",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.ArrowRight }),
						onClick: p,
						children: O.infer
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ͼbaseflow-SchemaModelForm-SchemaImport__col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hd",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "title",
								children: `${O.schemaModel}:`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "error",
								children: l
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "format",
								onClick: v,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Loop }), O.format]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.TextArea, {
						className: "input",
						variant: "filled",
						rows: 10,
						block: !0,
						value: a,
						onChange: o,
						onBlur: g
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ft",
			children: O.importSchemaTips.split("\n").map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: e }, e))
		})]
	});
});
var Fs = [{
	label: O.createdFromManual,
	value: "manual"
}, {
	label: O.createdFromDSL,
	value: "import"
}];
var Is = (0, import_react.memo)(({ onCancel: e, onSubmit: t, item: n, place: r, target: i, targetPath: a, parent: o, nameExists: c, editableFilter: l }) => {
	let d = o?.type === T.Array || o?.type === T.Map, [p, g] = (0, import_react.useState)(), _ = !!(!p || p.name === void 0 || p.name) && !d && !!o, v = !!(!p || p.type === void 0 || p.type), { typeOptions: y, typeMap: b } = (0, import_react.useMemo)(() => {
		let e = te, t = p?.type;
		return t === !1 ? e = [{
			value: n.type || T.String,
			label: E[n.type || T.String]
		}] : Array.isArray(t) && (e = t.map((e) => ({
			label: E[e],
			value: e
		}))), {
			typeOptions: e,
			typeMap: e.reduce((e, t) => (e[t.value] = !0, e), {})
		};
	}, [p?.type, n.type]), { subTypeOptions: x, subTypeMap: S } = (0, import_react.useMemo)(() => {
		let e = te, t = p?.subType;
		return t === !1 ? e = [{
			value: n.subType || T.String,
			label: E[n.subType || T.String]
		}] : Array.isArray(t) && (e = t.map((e) => ({
			label: E[e],
			value: e
		}))), {
			subTypeOptions: e,
			subTypeMap: e.reduce((e, t) => (e[t.value] = !0, e), {})
		};
	}, [p?.subType, n.subType]), C = (0, import_react.useMemo)(() => {
		let e = p?.name, t;
		return e === !1 ? t = (e) => {
			if (e !== n.name) return re(O.nameRestricted, { name: e });
		} : typeof e == "function" && (t = e), t;
	}, [p?.name, n.name]), [w, ee] = (0, import_react.useState)("manual"), [D, ne] = (0, import_react.useState)(""), [ie, ae] = (0, import_react.useState)(""), oe = Z((e) => {
		e === "import" && (D || ne(W.schemaModelToXml(n))), ee(e);
	}), se = Z((e) => {
		if (!e) return O.nameIsRequired;
		if (!_ && e !== n.name) return re(O.nameRestricted, { name: e });
		if (e !== n.name && c[e]) return re(O.nameIsRepeat, { name: e });
	}), [k, A] = (0, import_react.useState)(() => ({
		type: n.type,
		name: n.name,
		label: n.label,
		tips: n.tips,
		optional: n.optional,
		enums: n.enums,
		subType: n.subType,
		nameError: ""
	}));
	(0, import_react.useMemo)(() => {
		A({
			type: n.type,
			name: n.name,
			label: n.label,
			tips: n.tips,
			optional: n.optional,
			enums: n.enums,
			subType: n.subType,
			nameError: ""
		});
	}, [n]);
	let ce = Z((e) => {
		A({
			...k,
			enums: e?.length ? e : void 0
		});
	}), j = Z((e) => {
		A({
			...k,
			optional: e || void 0
		});
	}), le = Z((e) => {
		A({
			...k,
			tips: e || void 0
		});
	}), ue = Z((e) => {
		A({
			...k,
			label: e || void 0
		});
	}), de = Z((e) => {
		let t = e || "";
		A({
			...k,
			name: t,
			nameError: se(t) || C?.(t) || ""
		});
	}), M = Z((e) => {
		A({
			...k,
			type: e,
			subType: e === T.Array || e === T.Map ? n.subType || T.String : void 0
		});
	}), fe = Z((e) => {
		A({
			...k,
			subType: e
		});
	}), pe = Z((e) => {
		if (!e.trim()) return O.schemaValueTips;
		let t, n;
		try {
			t = W.xmlToSchemaModel(e);
		} catch (e) {
			n = e;
		}
		if (!t) return typeof n == "string" ? n : O.schemaValueTips;
		let r = se(t.name) || C?.(t.name) || "";
		if (r) return r;
		if (!b[t.type]) return re(O.typeRestricted, { type: E[t.type] });
		let i = t.type === T.Array || t.type === T.Map ? t.children[0].type : void 0;
		return i && !S[i] ? re(O.typeRestricted, { type: E[i] }) : t;
	}), me = Z(() => {
		let e;
		if (w === "import") {
			let t = pe(D);
			typeof t == "string" ? ae(t) : e = t;
		} else {
			let { type: t, name: n, label: a, tips: o, optional: s, subType: c } = k, l = k.enums, u = se(n) || C?.(n) || "";
			if (u !== k.nameError && A({
				...k,
				nameError: u
			}), !u && (e = {
				type: t,
				name: n,
				label: a,
				tips: o,
				optional: s
			}, r === "replace" && i.type === t && (t === T.Object || (t === T.Array || t === T.Map) && i.children?.[0].type === c) && (e.children = i.children), l && (l = l.filter((e) => e.value), l.length || (l = void 0), e.enums = l), (t === T.Array || t === T.Map) && !e.children)) {
				let t = {
					type: c || T.String,
					name: "*"
				};
				e.children = [t], (t.type === T.Array || t.type === T.Map) && (t.children = [{
					type: T.String,
					name: "*"
				}]);
			}
		}
		e && t(e, r, a);
	});
	return (0, import_react.useEffect)(() => {
		let e = l?.(n, o);
		Co(e) ? e.then(g) : g(e);
	}, [
		l,
		n,
		o
	]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-SchemaModelForm-Editor ͼbaseflow-sr-modal head-split",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hd",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: r === "replace" ? Y.Edit : r === "sub" ? Y.AddSub : Y.AddNext }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r === "replace" ? O.update : r === "sub" ? O.insertChild : O.insertNext, i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "tips",
					children: `(${i.name})`
				}) : null] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bd",
				children: [p?.import !== !1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ͼbaseflow-SchemaModelForm-Editor__tab",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Segmented, {
						className: "tab",
						value: w,
						options: Fs,
						onChange: oe
					})
				}), w === "import" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ps, {
					value: D,
					onChange: ne,
					error: ie
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ns, {
					className: "ͼbaseflow-SchemaModelForm-Editor__form",
					children: [
						_ && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label required",
							children: O.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "item-content",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Es, {
								value: k.name,
								className: `ͼbaseflow-input${k.nameError ? " ͼbaseflow-error" : ""}`,
								placeholder: "name",
								onChange: de,
								block: !0
							}), !!k.nameError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "item-error",
								children: k.nameError
							})]
						})] }),
						v && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label required",
							children: O.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
								value: k.type,
								options: y,
								block: !0,
								placeholder: "type",
								onChange: M
							})
						})] }),
						(k.type === T.String || k.type === T.Number) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label",
							children: O.useEnum
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ds, {
								value: k.enums,
								onChange: ce
							})
						})] }),
						(k.type === T.Array || k.type === T.Map) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label required",
							children: O.subType
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
								value: k.subType,
								options: x,
								placeholder: "item type",
								block: !0,
								onChange: fe
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label",
							children: O.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Es, {
								value: k.label,
								block: !0,
								placeholder: "label",
								onChange: ue
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label",
							children: O.tips
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Es, {
								value: k.tips,
								block: !0,
								placeholder: "tips",
								onChange: le
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label",
							children: O.optional
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Switch, {
								value: k.optional,
								className: "ͼbaseflow-checkbox",
								onChange: j
							})
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
					className: "ͼbaseflow-form-button",
					onClick: e,
					children: O.ButtonCancel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
					className: "ͼbaseflow-form-submit",
					type: "primary",
					onClick: me,
					children: O.ButtonSubmit
				})]
			})
		]
	});
});
var Ls = {
	name: "",
	type: T.String
};
var Rs = (0, import_react.memo)(({ className: e, node: t, parent: n, nodePath: r, labelRender: i, toolsFilter: a, onDelItem: o, onEditItem: c, onExportItem: l }) => {
	let d = n && (n.type === T.Array || n.type === T.Map), [p, g] = (0, import_react.useState)(), _ = (0, import_react.useMemo)(() => W.toSchemaTitle(t, n, i), [
		i,
		t,
		n
	]), v = {
		addNext: n && !d ? {
			key: "addNext",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.AddNext,
				button: !0,
				title: O.insertNext,
				onClick: () => c(Ls, "next", t, r, n)
			}, "addNext")
		} : !1,
		addSub: t.type === T.Object && {
			key: "addChild",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.AddSub,
				button: !0,
				title: O.insertChild,
				onClick: () => c(Ls, "sub", t, r, t)
			}, "addChild")
		},
		edit: {
			key: "edit",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.Edit,
				button: !0,
				title: O.edit,
				onClick: () => c(t, "replace", t, r, n)
			}, "edit")
		},
		delete: !d && {
			key: "delete",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.Delete,
				button: !0,
				title: O.delete,
				onClick: () => o(r)
			}, "delete")
		},
		export: {
			key: "export",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.Export,
				button: !0,
				title: O.export,
				onClick: () => l(t)
			}, "export")
		}
	}, y = [
		v.addNext,
		v.addSub,
		v.edit,
		v.delete,
		v.export
	];
	return y = p ? y.filter((e) => e && p[e.key] !== !1) : y.filter(Boolean), (0, import_react.useEffect)(() => {
		let e = a?.(t, n);
		Co(e) ? e.then(g) : g(e);
	}, [
		a,
		t,
		n
	]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-SchemaModelForm__item", e),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				className: "item-icon",
				name: t.type
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: K.classNames("item-title", { tips: _.tips }),
				title: _.tips || _.title,
				children: _.title
			}),
			t.optional && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "item-optional ͼbaseflow-sr-optional" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "item-tools",
				children: y.map((e) => e.btn)
			})
		]
	});
});
var zs = {
	name: "data",
	type: T.Object
};
var Bs = (0, import_react.memo)((e) => {
	let t = e.renderRoot === void 0, n = e.defaultValue || zs, r = (0, import_react.useRef)(null), i = Z((e) => {
		Q.modal(e ? {
			content: e,
			mask: "closeAble"
		} : null), r.current = e;
	}), a = Z(() => {
		i(null);
	}), { onChange: o, labelRender: c, toolsFilter: l, editableFilter: p } = e, [h, g] = (0, import_react.useState)(e.value || n);
	(0, import_react.useMemo)(() => {
		g(e.value || n);
	}, [n, e.value]);
	let _ = Z((e) => {
		h !== e && o?.(e);
	}), v = Z((e) => {
		if (e === h.name) {
			_(void 0);
			return;
		}
		let t, n, r = R.produce(h, (r, i) => {
			if (i.path === e) return t = r, n = i.parent, !0;
		}, () => {
			let e = n.children;
			e.splice(e.indexOf(t), 1);
		});
		_(r);
	}), y = Z((e, t, n) => {
		if (i(null), n === h.name && t === "replace") {
			_(e);
			return;
		}
		let r = R.produce(h, (r, i) => {
			if (i.path === n) {
				if (t === "next" || t === "replace") {
					let n = i.parent.children;
					t === "next" ? n.splice(n.indexOf(r) + 1, 0, e) : n.splice(n.indexOf(r), 1, e);
				} else r.children ? r.children.unshift(e) : r.children = [e];
				return !0;
			}
		});
		_(r);
	}), b = Z((e, t, n, r, o) => {
		let s = (o?.children || []).reduce((e, t) => (e[t.name] = !0, e), {}), c = e.children?.[0];
		c && (e = {
			...e,
			subType: c.type
		}), i(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Is, {
			item: e,
			parent: o,
			target: n,
			targetPath: r,
			place: t,
			nameExists: s,
			editableFilter: p,
			onCancel: a,
			onSubmit: y
		}));
	}), x = Z((e) => {
		let t = R.produce(h, (t, n) => {
			if (n.path === e) return t.folded = !t.folded, !0;
		});
		g(t);
	}), S = Z(({ path: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		name: Y.ArrowRight,
		className: "ͼbaseflow-folder",
		onClick: () => x(e)
	})), C = Z((e) => {
		i(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Os, {
			item: e,
			onClose: a
		}));
	}), w = Z(({ node: e, parent: t, path: n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rs, {
		node: e,
		nodePath: n,
		parent: t,
		onDelItem: v,
		onEditItem: b,
		onExportItem: C,
		labelRender: c,
		toolsFilter: l
	}));
	return (0, import_react.useEffect)(() => () => {
		r.current && i(null);
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SchemaModelForm", e.variant, { showRootTools: e.showRootTools }),
		children: e.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ms, {
			namespace: "SchemaModelFormTree",
			source: h,
			nodeRender: w,
			folderRender: S,
			renderRoot: t
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
			className: "empty",
			name: Y.PlusCircle,
			onClick: () => _({ ...n })
		})
	});
});
var Vs = (0, import_react.memo)(({ node: e, parent: t, labelRender: n, onSelect: r }) => {
	let i = (0, import_react.useMemo)(() => W.toSchemaTitle(e, t, n), [
		e,
		t,
		n
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-SchemaSelector__item",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: e.type,
				className: "item-icon"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: K.classNames("item-title", {
					tips: i.tips,
					highlight: e.highlighted,
					disabled: e.disabled
				}),
				title: i.tips || e.id,
				onClick: () => r?.(e),
				children: i.title
			}),
			e.optional && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ͼbaseflow-sr-optional" })
		]
	});
});
var Hs = (0, import_react.memo)(({ className: e, schema: t, onSwitch: n, onSelected: r, labelRender: i }) => {
	let a = Z((e) => {
		r?.(e.id, e.type);
	}), o = Z(({ node: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		button: !0,
		name: Y.ArrowRight,
		className: "ͼbaseflow-folder",
		onClick: () => n?.(e.id)
	})), s = Z(({ node: e, parent: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vs, {
		parent: t,
		node: e,
		labelRender: i,
		onSelect: e.disabled ? void 0 : a
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SchemaSelector", e),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ms, {
			renderRoot: !0,
			source: t,
			nodeRender: s,
			folderRender: o
		})
	});
});
var Us = (0, import_react.memo)(({ node: e, parent: t, labelRender: n }) => {
	let r = (0, import_react.useMemo)(() => W.toSchemaTitle(e, t, n), [
		n,
		e,
		t
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-SchemaShow__item",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: e.type,
				className: "item-icon"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: K.classNames("item-title", {
					tips: r.tips,
					highlight: e.highlighted,
					disabled: e.disabled
				}),
				title: r.tips || r.title,
				children: r.title
			}),
			e.optional && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ͼbaseflow-sr-optional" })
		]
	});
});
var Ws = (0, import_react.memo)(({ className: e, schema: t, labelRender: n }) => {
	let [r, i] = (0, import_react.useState)(t);
	(0, import_react.useMemo)(() => {
		i(t);
	}, [t]);
	let a = Z((e) => {
		let t = R.produce(r, (t, n) => {
			if (n.path === e) return t.folded = !t.folded, !0;
		});
		i(t);
	}), o = Z(({ path: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		button: !0,
		name: Y.ArrowRight,
		className: "ͼbaseflow-folder",
		onClick: () => a(e)
	})), s = Z(({ node: e, parent: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Us, {
		labelRender: n,
		parent: t,
		node: e
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SchemaShow", e),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ms, {
			renderRoot: !0,
			source: r,
			nodeRender: s,
			folderRender: o
		})
	});
});
var Gs = (0, import_react.memo)(({ className: e = "", value: t = "", title: n, onChange: r }) => {
	let i = (0, import_react.useRef)(null), [a, o] = (0, import_react.useState)(!1), [c, l] = (0, import_react.useState)(t), g = Z(() => {
		o(!1), t !== c && (l(t), r?.(c));
	});
	return (0, import_react.useMemo)(() => {
		l(t);
	}, [t]), (0, import_react.useEffect)(() => {
		a && i.current?.focus();
	}, [a]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [a ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref: i,
		className: K.classNames("ͼbaseflow-TextEditor__input", e),
		onBlur: g,
		onKeyDown: (e) => e.key === "Enter" && i.current.blur(),
		value: c,
		onChange: (e) => {
			l(e.target.value.trim());
		}
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "ͼbaseflow-TextEditor__title",
		title: n,
		children: t
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		title: O.edit,
		name: Y.Edit,
		className: "ͼbaseflow-TextEditor__editBtn",
		onClick: () => o(!a)
	})] });
});
var Ks = (0, import_react.memo)(({ dataType: e, mode: t, onChange: n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: K.classNames("item", { on: t === "assign" }),
		onClick: () => {
			t !== "assign" && n("assign");
		},
		children: O.assign
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: K.classNames("item", { on: t === "deconstruct" }),
		onClick: () => t !== "deconstruct" && n("deconstruct"),
		children: O.deconstruct
	}),
	(e === T.Array || e === T.Map) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: K.classNames("item", { on: t === "mapping" }),
		onClick: () => t !== "mapping" && n("mapping"),
		children: O.mapping
	})
] }));
var qs = (0, import_react.memo)(({ className: e, node: t, index: n, schema: r, parent: i, parentSchema: a, labelRender: o, onItemNameChange: s, onItemValueChange: c, onItemModeChange: l, onAddItem: d, onDelItem: f, inputPropsRender: p }) => {
	let g = r.type, _ = r.optional, v = g === T.Object || g === T.Array || g === T.Map, y = g === T.Array || g === T.Map, b = i ? i.value.type : void 0, x = i ? G.getValueMode(i) : void 0, S = b === T.Array || b === T.Map, C = G.getValueMode(t), w = to(), ee = (0, import_react.useMemo)(() => W.toSchemaTitle(r, a, o), [
		o,
		a,
		r
	]), E = {
		addNext: i && S && x === "deconstruct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "item",
			title: O.insertNext,
			onClick: () => d(G.createSchemaValueTreeByModel(r, void 0, i.id, !0), n + 1, i),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.AddNext })
		}, "addNext"),
		addSub: y && C === "deconstruct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "item",
			title: O.insertChild,
			onClick: () => d(G.createSchemaValueTreeByModel(r.children[0], void 0, t.id, !0), 0, t),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.AddSub })
		}, "addSub"),
		delete: i && S && x === "deconstruct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "item",
			title: O.delete,
			onClick: () => f(n, i),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Delete })
		}, "delete")
	}, te = Z((e) => {
		l(t, e);
	}), D = Z((e) => c(t.id, e)), ne = Z((e) => {
		if (!i) return;
		if (!e) {
			Yi.message.error(O.requiredPrompt);
			return;
		}
		b === T.Array && (e = `${Number(e) || 0}`);
		let n = i.children || [];
		for (let t of n) if (t.name === e) {
			Yi.message.error(re(O.hasExist, { item: e }));
			return;
		}
		s(e, t, i);
	}), ie = [
		E.addNext,
		E.addSub,
		E.delete
	].filter(Boolean), ae = (0, import_react.useMemo)(() => {
		if (r.enums) return r.enums;
		if (r.type === T.Array) return r.children?.[0]?.enums;
	}, [r]), oe = p?.(r);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-SchemaValueForm__item",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: K.classNames("ͼbaseflow-SchemaValueForm__itemHead", e),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "item-icon",
						name: g
					}),
					S && x === "deconstruct" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gs, {
						value: t.name,
						onChange: ne,
						title: ee.tips || ee.title
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: K.classNames("item-title", { tips: ee.tips }),
						title: ee.tips || ee.title,
						children: ee.title
					}),
					r.optional && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "item-optional ͼbaseflow-sr-optional" }),
					(v || ie.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "item-tools",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ͼbaseflow-SchemaValueForm__itemTools",
							children: [v && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ks, {
								dataType: g,
								mode: C,
								onChange: te
							}, "ModeSwitch"), ie]
						})
					})
				]
			}),
			C === "mapping" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ͼbaseflow-SchemaValueForm__itemBody is-mapping",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					alt: "",
					src: "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='192.207%20151.293%2065.95%20145.3553'%20width='65.95px'%20height='145.355px'%20fill='%2379d600'%3e%3cg%3e%3cpath%20d='M%20258.157%20184.268%20C%20258.157%20193.212%20254.343%20201.741%20248.499%20207.585%20C%20242.655%20213.429%20234.126%20217.243%20225.182%20217.243%20C%20216.238%20217.243%20207.709%20213.429%20201.865%20207.585%20C%20196.021%20201.741%20192.207%20193.212%20192.207%20184.268%20C%20192.207%20175.324%20196.021%20166.795%20201.865%20160.951%20C%20207.709%20155.107%20216.238%20151.293%20225.182%20151.293%20C%20234.126%20151.293%20242.655%20155.107%20248.499%20160.951%20C%20254.343%20166.795%20258.157%20175.324%20258.157%20184.268%20Z%20M%20245.317%20164.133%20C%20240.04%20158.857%20233.207%20155.793%20225.182%20155.793%20C%20217.157%20155.793%20210.324%20158.857%20205.047%20164.133%20C%20199.771%20169.41%20196.707%20176.243%20196.707%20184.268%20C%20196.707%20192.293%20199.771%20199.126%20205.047%20204.403%20C%20210.324%20209.679%20217.157%20212.743%20225.182%20212.743%20C%20233.207%20212.743%20240.04%20209.679%20245.317%20204.403%20C%20250.593%20199.126%20253.657%20192.293%20253.657%20184.268%20C%20253.657%20176.243%20250.593%20169.41%20245.317%20164.133%20Z%20M%20225.226%20291.953%20L%20242.179%20275.379%20C%20243%20274.576%20244.326%20274.622%20245.09%20275.48%20C%20245.873%20276.361%20245.821%20277.703%20244.972%20278.52%20L%20226.829%20295.986%20C%20225.906%20296.869%20224.406%20296.869%20223.482%20295.986%20C%20223.436%20295.941%20217.407%20290.129%20205.394%20278.55%20C%20204.54%20277.727%20204.489%20276.375%20205.28%20275.489%20C%20206.051%20274.625%20207.388%20274.578%20208.218%20275.387%20L%20225.226%20291.953%20Z'/%3e%3cline%20style='stroke:%20%2379d600;%20stroke-width:%205;%20stroke-dasharray:%2010;'%20x1='224.937'%20y1='223.794'%20x2='225.427'%20y2='281.854'/%3e%3cpath%20d='M%20226.676%20190.424%20L%20226.645%20196.582%20L%20227.231%20196.48%20C%20230.127%20195.977%20232.765%20194.436%20234.595%20192.287%20C%20236.424%20190.139%20237.566%20187.259%20237.566%20184.207%20C%20237.566%20182.322%20237.12%20180.476%20236.367%20178.876%20C%20236.036%20178.192%20235.795%20177.782%20235.45%20177.268%20L%20240.143%20172.934%20C%20240.148%20172.942%20240.155%20172.95%20240.162%20172.959%20C%20242.528%20176.11%20243.875%20179.957%20243.875%20184.207%20C%20243.875%20184.345%20243.875%20184.491%20243.875%20184.628%20C%20243.803%20188.654%20242.476%20192.295%20240.255%20195.328%20C%20238.035%20198.36%20235.006%20200.665%20231.407%20201.928%20C%20230.02%20202.415%20228.594%20202.747%20227.096%20202.902%20L%20226.649%20202.948%20L%20226.638%20208.846%20L%20218.709%20201.874%20L%20216.127%20199.608%20L%20220.799%20195.536%20L%20226.676%20190.424%20Z%20M%20206.49%20183.787%20C%20206.569%20179.726%20207.915%20176.057%20210.165%20173.01%20C%20212.415%20169.963%20215.483%20167.657%20219.127%20166.418%20C%20220.446%20165.965%20221.805%20165.657%20223.246%20165.511%20L%20223.694%20165.466%20L%20223.704%20159.567%20L%20231.622%20166.527%20L%20234.204%20168.805%20L%20229.543%20172.866%20L%20223.664%20177.991%20L%20223.685%20171.843%20L%20223.099%20171.946%20C%20220.209%20172.455%20217.579%20173.999%20215.757%20176.146%20C%20213.935%20178.293%20212.799%20181.167%20212.799%20184.207%20C%20212.799%20186.104%20213.244%20187.945%20214.007%20189.557%20C%20214.331%20190.249%20214.578%20190.646%20214.916%20191.147%20L%20210.235%20195.49%20C%20210.204%20195.448%20210.273%20195.546%20210.14%20195.358%20C%20207.818%20192.216%20206.49%20188.411%20206.49%20184.207%20C%20206.49%20184.069%20206.49%20183.923%20206.49%20183.787%20Z'/%3e%3c/g%3e%3c/svg%3e",
					className: "loop-icon",
					title: O.loopContextPrompt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xo, {
					sourceType: "mapping",
					dataType: g,
					value: t.value,
					context: w,
					onChange: D,
					...oe
				})]
			}),
			C === "assign" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ͼbaseflow-SchemaValueForm__itemBody",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xo, {
					hideIcon: !0,
					value: t.value,
					nativeRenderOptions: ae,
					onChange: D,
					dataType: g,
					optional: _,
					context: w,
					...oe
				})
			})
		]
	});
});
var Js = {
	name: "mock",
	type: T.Any
};
var Ys = (0, import_react.memo)(({ schema: e = Js, value: t, labelRender: n, onChange: r, inputPropsRender: i, showRootTools: a, variant: o }) => {
	let [, s] = (0, import_react.useState)(0), c = (0, import_react.useRef)({}), l = Z((e) => {
		if (c.current.valueTree !== e) {
			let t = R.map(e, ({ name: e, value: t, folded: n }) => ({
				name: e,
				value: t,
				folded: n
			}));
			c.current.value = t, c.current._valueTree = e, r?.(t);
		}
	}), p = Z(() => {
		if (c.current.schema === Js) c.current.value !== void 0 && r?.(void 0);
		else {
			let e = G.createSchemaValueTreeByModel(c.current.schemaTree, c.current.valueTree, void 0, !0);
			l(e);
		}
	});
	(0, import_react.useMemo)(() => {
		let n = !c.current.schema, r = c.current.schema !== e, i = c.current.value !== t;
		if (r) {
			c.current.schema = e;
			let t = W.toSchemaModelTree(e);
			c.current.schemaTree = t, c.current.schemaMap = R.toMap(t);
		}
		if (c.current.matchError = e === Js ? "Schema is undefined" : void 0, n || i) {
			let n = c.current.schemaTree;
			if (c.current.value = t, !t) c.current.valueTree = G.createSchemaValueTreeByModel(n, void 0, void 0, !0);
			else {
				let r = e === Js ? "Schema is undefined" : G.matchSchemaValueByModel(n, t);
				r ? (c.current.matchError = r, c.current.valueTree = G.toSchemaValueTree([t], "")[0]) : c.current.valueTree = G.createSchemaValueTreeByModel(n, t, void 0, !0);
			}
			c.current._valueTree = c.current.valueTree;
		} else if (r) {
			let e = G.createSchemaValueTreeByModel(c.current.schemaTree, c.current.value, void 0, !0);
			l(e);
		} else c.current.valueTree = c.current._valueTree;
	}, [e, t]);
	let g = c.current.schemaMap, _ = c.current.valueTree, v = Z((e) => {
		let t = R.produce(_, (t) => {
			if (e.id === t.id) return t.folded = !t.folded, !0;
		});
		c.current.value = t, c.current.valueTree = t, s(Date.now());
	}), y = Z((e, t) => {
		let n = G.setValueMode(e, g[e.schemaId], t), r = R.produce(_, (t) => {
			if (e.id === t.id) return t.value = n.value, t.children = n.children, !0;
		});
		l(r);
	}), b = Z((e, t) => {
		let n = R.produce(_, (n) => {
			if (e === n.id) return n.value = t, !0;
		});
		l(n);
	}), x = Z((e, t, n) => {
		let r = _;
		if (n.value.type === T.Array) {
			let i = n.children.map((n) => n.id === t.id ? {
				...n,
				name: e
			} : n);
			i.sort((e, t) => Number(e.name) - Number(t.name));
			let a = 0;
			for (; i[a] && i[a] === n.children[a];) a++;
			i = i.slice(a), i = i.map((e, t) => ({
				...e,
				name: `${t + a}`
			})), i = G.toSchemaValueTree(i, n.id), r = R.produce(_, (e) => {
				if (n.id === e.id) return e.children.splice(a, e.children.length - a, ...i), !0;
			});
		} else {
			let i = {
				...t,
				name: e
			};
			i = G.toSchemaValueTree([i], n.id)[0], r = R.produce(_, (e) => {
				if (t.id === e.id) return e.id = i.id, e.name = i.name, e.children = i.children, !0;
			});
		}
		l(r);
	}), S = Z((e, t, n) => {
		let r = _;
		if (n.value.type === T.Array) {
			let i = (n.children || []).slice(t);
			i.unshift(e), i = i.map((e, n) => ({
				...e,
				name: `${n + t}`
			})), i = G.toSchemaValueTree(i, n.id), r = R.produce(_, (e) => {
				if (n.id === e.id) return e.children.splice(t, e.children.length - t, ...i), !0;
			});
		} else {
			let i = (n.children || []).reduce((e, t) => (e[t.name] = !0, e), {}), a = [{
				...e,
				name: G.createNoDuplicateKey(i)
			}];
			a = G.toSchemaValueTree(a, n.id), r = R.produce(_, (e) => {
				if (n.id === e.id) return e.children.splice(t, 0, a[0]), !0;
			});
		}
		l(r);
	}), C = Z((e, t) => {
		let n = _;
		if (t.value.type === T.Array) {
			let r = (t.children || []).slice(e);
			r.shift(), r.length && (r = r.map((t, n) => ({
				...t,
				name: `${n + e}`
			})), r = G.toSchemaValueTree(r, t.id)), n = R.produce(_, (n) => {
				if (t.id === n.id) return n.children.splice(e, n.children.length - e, ...r), n.children.length || (n.value.source = D.Variable, n.value.text = "", n.children = void 0), !0;
			});
		} else n = R.produce(_, (n) => {
			if (t.id === n.id) return n.children.splice(e, 1), n.children.length || (n.value.source = D.Variable, n.value.text = "", n.children = void 0), !0;
		});
		l(n);
	}), w = Z(({ node: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		name: Y.ArrowRight,
		className: "ͼbaseflow-folder",
		onClick: () => v(e)
	})), ee = Z(({ node: e, parent: t, index: r }) => {
		let o = g[e.schemaId];
		if (!o) {
			let t = G.getValueMode(e);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ͼbaseflow-SchemaValueForm__item invalid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ͼbaseflow-SchemaValueForm__itemHead",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "item-icon",
						name: e.value.type
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.name })]
				}), t === "assign" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ͼbaseflow-SchemaValueForm__itemBody",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "superInput",
						children: e.value.text
					})
				})]
			});
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(qs, {
			className: !t && a ? "showRootTools" : "",
			index: r,
			node: e,
			schema: o,
			parent: t,
			parentSchema: t ? g[t.schemaId] : void 0,
			labelRender: n,
			onItemNameChange: x,
			onItemValueChange: b,
			onItemModeChange: y,
			onAddItem: S,
			onDelItem: C,
			inputPropsRender: i
		});
	}), E = Z(({ node: e, contextValue: t }) => {
		if (G.getValueMode(e) === "mapping") {
			let n = si.getValidContextRef(e.value);
			return new RegExp($r).test(n) && (n = t && /\D/.test(t) ? n.replace(z, `${t}[0]`) : ""), n;
		}
	}), te = Z(({ node: e, isLast: t, isLeaf: n }) => {
		if (t && n) return { className: "ͼbaseflow-last" };
	});
	return c.current.schema === Js && !c.current.value ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-SchemaValueForm", o),
		children: [c.current.matchError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ͼbaseflow-SchemaValueForm__matchError",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tools",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tips",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: O.invalidTips }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "msg",
						children: c.current.matchError
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
					type: "link",
					size: "small",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Loop }),
					onClick: p,
					children: O.fix
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ms, {
			namespace: "SchemaValueFormTree",
			source: _,
			nodeRender: ee,
			folderRender: w,
			contextValueRender: E,
			attributeRender: te,
			context: eo,
			renderRoot: !0
		})]
	});
});
var Xs = {};
var Zs = (0, import_react.memo)(({ locale: e = "en", lang: t, widgets: n, expressionUtils: r, children: i }) => ((0, import_react.useMemo)(() => {
	t && Gi({ lang: t }), e && Gi({ locale: e }), r && Gi({ expressionUtils: r }), n && Xi(n), n && xo(n);
}, []), (0, import_react.useEffect)(() => {
	Ji.createValidateProvider(), Object.assign(Xs, Yi, Q);
}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [i, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(bo, {})] })));
var Qs = [{ required: !0 }];
//#endregion
export { Xs as BaseWidgets, as as ConditionSelector, T as DataType, Ts as JsonView, Ds as KeyValues, Zs as RenderConfigProvider, Qs as RequiredRule, Bs as SchemaModelForm, Hs as SchemaSelector, Ws as SchemaShow, Ys as SchemaValueForm, Xo as SuperInput, X as SvgIcon, D as ValueSource, Le as XMLBuilder, Xn as XMLParser, Zi as createSchemaValueByModel, Ki as getLocale };

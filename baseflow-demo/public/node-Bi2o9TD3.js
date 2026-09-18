//#region src/errors.ts
var RpcErrorCodes = {
	/** 调用超时（最终防线） */
	TIMEOUT: "TIMEOUT",
	/** 握手在 handshakeTimeout 内未完成 */
	HANDSHAKE_TIMEOUT: "HANDSHAKE_TIMEOUT",
	/** iframe 在 loadTimeout 内未完成首次加载 */
	LOAD_TIMEOUT: "LOAD_TIMEOUT",
	/** 本轮父端连接等待被业务主动取消 */
	CONNECT_ABORTED: "CONNECT_ABORTED",
	/** 本轮父端连接等待被新的 createConnection 调用取代 */
	CONNECT_SUPERSEDED: "CONNECT_SUPERSEDED",
	/** 对端已消失：iframe reload、连接换代、flood 封禁或目标窗口已不可达 */
	PEER_GONE: "PEER_GONE",
	/** 管道尚未建立就发起了调用（本库不排队） */
	NOT_CONNECTED: "NOT_CONNECTED",
	/** 本端已 dispose */
	DISPOSED: "DISPOSED",
	/** 对端未注册该方法 */
	METHOD_NOT_FOUND: "METHOD_NOT_FOUND",
	/** 对端 handler 执行时抛错 */
	HANDLER_ERROR: "HANDLER_ERROR",
	/** 入参或返回值无法被结构化克隆 */
	CLONE_FAILED: "CLONE_FAILED",
	/** 对端未完成任务已达 maxInflight 上限，请求未被受理（可重试） */
	BUSY: "BUSY"
};
var RpcError = class extends Error {
	name = "RpcError";
	code;
	remoteName;
	constructor(code, message, options = {}) {
		super(message, options.cause !== void 0 ? { cause: options.cause } : void 0);
		this.code = code;
		this.remoteName = options.remoteName;
	}
};
/** 把任意抛出物序列化成可跨端传递的纯数据，保证自身绝不抛错。 */
function serializeError(thrown) {
	try {
		return serializeErrorUnsafe(thrown);
	} catch {
		return {
			name: "Error",
			message: "对端抛出了无法序列化的错误",
			code: RpcErrorCodes.HANDLER_ERROR
		};
	}
}
/**
* 出站方向刻意原样保留 RpcError 的 code——它是本端对自己那次失败的如实描述，
* 收信方是否采信由 deserializeError 的白名单单独决定。发送侧收窄没有意义：
* 真正的攻击者不会用本库的序列化器。
*/
function serializeErrorUnsafe(thrown) {
	if (thrown instanceof RpcError) return {
		name: thrown.remoteName ?? thrown.name,
		message: thrown.message,
		code: thrown.code
	};
	if (thrown instanceof Error) return {
		name: thrown.name,
		message: thrown.message,
		code: RpcErrorCodes.HANDLER_ERROR
	};
	return {
		name: "Error",
		message: typeof thrown === "string" ? thrown : safeStringify(thrown),
		code: RpcErrorCodes.HANDLER_ERROR
	};
}
function safeStringify(value) {
	try {
		const json = JSON.stringify(value);
		if (json !== void 0) return json;
	} catch {}
	try {
		return String(value);
	} catch {
		return "对端抛出了无法转换为文本的值";
	}
}
/**
* 允许从对端应答里原样采信的错误码：它们描述的都是**对端处理这次请求**的结果。
*
* 其余各码（TIMEOUT、PEER_GONE、DISPOSED、NOT_CONNECTED、LOAD/HANDSHAKE_TIMEOUT、CONNECT_*）
* 全部是**本端对自己连接状态**的判定，只能由本端得出。不可信 child 把它们写进 `res.error.code`，
* 业务照 code 分支时就会被牵着走——「收到 PEER_GONE 就重建 iframe」正是最自然也最危险的写法。
* 一律归一到 HANDLER_ERROR，原始 message 仍然保留，排查信息不丢。
*
* 代价：handler 内部嵌套 RPC 拿到的 TIMEOUT / PEER_GONE 传到对端也会变成 HANDLER_ERROR。
* 这是有意的——那是**对端的**连接出了问题，对本端而言它就是一次普通的 handler 失败。
*/
var RemoteErrorCodes = /* @__PURE__ */ new Set([
	RpcErrorCodes.HANDLER_ERROR,
	RpcErrorCodes.METHOD_NOT_FOUND,
	RpcErrorCodes.CLONE_FAILED,
	RpcErrorCodes.BUSY
]);
/**
* 在 client 侧把序列化错误重建成 RpcError。
*
* 刻意对畸形输入保持宽容：调用方在此之前已经把 pending 条目摘掉、定时器也清了，
* 这里一旦抛错，那次调用就会永远不 settle——宁可给一个含糊的错误也不能让它悬着。
*/
function deserializeError(serialized) {
	const source = typeof serialized === "object" && serialized !== null ? serialized : {};
	return new RpcError(typeof source.code === "string" && RemoteErrorCodes.has(source.code) ? source.code : RpcErrorCodes.HANDLER_ERROR, typeof source.message === "string" ? source.message : "对端返回了无法解析的错误", { remoteName: typeof source.name === "string" ? source.name : void 0 });
}
//#endregion
//#region src/types.ts
/**
* 全部可配置项的默认值。
*
* 集中一处，避免默认值散落在 endpoint / transport 各模块，也让 README 的选项表有唯一出处。
* 作为包根公开导出：调用方按对端容量分批时需要对齐 `maxInflight`，排查配置时需要对照其余几项。
*/
var RpcDefaults = {
	/** 频道用于隔离同一个页面上其它无关的 postMessage 流量。 */
	channel: "iframe-rpc",
	/** 单次 RPC 调用超时。 */
	timeout: 3e3,
	/** 父端从挂载到 iframe 首次 load。 */
	loadTimeout: 5e3,
	/** 父端从首次 load 到收到合法 ack。 */
	handshakeTimeout: 3e3,
	/** 本端作为 server 时同时未完成任务数的上限。调用方按对端容量分批时可直接对齐这个值。 */
	maxInflight: 50,
	/** 父端每秒允许的无配额入站消息数。 */
	floodMaxPerSecond: 20
};
//#endregion
//#region src/endpoint.ts
function assertTimeout(value, optionName) {
	if (value === Number.POSITIVE_INFINITY || Number.isFinite(value) && value >= 0) return;
	throw new TypeError(`[iframe-rpc] ${optionName} 必须是 >= 0 的有限毫秒数或 Infinity，收到 ${String(value)}`);
}
function assertMaxInflight(value) {
	if (value === Number.POSITIVE_INFINITY || Number.isInteger(value) && value >= 1) return;
	throw new TypeError(`[iframe-rpc] maxInflight 必须是 >= 1 的整数或 Infinity，收到 ${String(value)}`);
}
function normalizeCallMethodTimeouts(value) {
	if (value === void 0) return /* @__PURE__ */ new Map();
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TypeError("[iframe-rpc] callMethodTimeouts 必须是以方法名为 key、超时毫秒数为 value 的对象");
	const timeouts = /* @__PURE__ */ new Map();
	for (const [method, timeout] of Object.entries(value)) {
		assertTimeout(timeout, `callMethodTimeouts[${JSON.stringify(method)}]`);
		timeouts.set(method, timeout);
	}
	return timeouts;
}
/**
* 武装一个定时器；`0` 与 `Infinity` 都表示「关闭」，此时返回 undefined。
*
* 「关闭」的判断必须收在这一处：`setTimeout(fn, Infinity)` 会把延迟强制转成 0 立即触发，
* 任何一个调用点漏掉 `Number.isFinite`，症状都是「刚连上就超时」这种极难定位的故障。
*/
function armTimer(ms, fn) {
	if (!(ms > 0) || !Number.isFinite(ms)) return void 0;
	const timer = setTimeout(fn, ms);
	timer.unref?.();
	return timer;
}
/** 两侧共享的 RPC 核心；握手生命周期由角色专属子类负责。 */
var BaseEndpoint = class {
	#transport;
	#channel;
	#defaultTimeout;
	#callMethodTimeouts;
	#maxInflight;
	#connected = false;
	#seq = 0n;
	#handlers = /* @__PURE__ */ new Map();
	#pending = /* @__PURE__ */ new Map();
	#inflightCount = 0;
	#disposed = false;
	constructor(options) {
		this.#transport = options.transport;
		this.#channel = options.channel ?? RpcDefaults.channel;
		this.#defaultTimeout = options.timeout ?? RpcDefaults.timeout;
		this.#callMethodTimeouts = normalizeCallMethodTimeouts(options.callMethodTimeouts);
		this.#maxInflight = options.maxInflight ?? RpcDefaults.maxInflight;
		assertTimeout(this.#defaultTimeout, "timeout");
		assertMaxInflight(this.#maxInflight);
		if (options.handlers) this.registerAll(options.handlers);
		this.#transport.onMessage((message) => this.#receive(message));
	}
	register(method, handler) {
		const fn = handler;
		this.#handlers.set(method, fn);
		return () => {
			if (this.#handlers.get(method) === fn) this.#handlers.delete(method);
		};
	}
	registerAll(handlers) {
		const offs = [];
		for (const [method, handler] of Object.entries(handlers)) {
			if (typeof handler !== "function") continue;
			offs.push(this.register(method, handler));
		}
		return () => {
			for (const off of offs) off();
		};
	}
	call(method, ...args) {
		return this.invoke(method, args);
	}
	invoke(method, args, options = {}) {
		if (this.#disposed) return Promise.reject(new RpcError(RpcErrorCodes.DISPOSED, `端点已销毁，无法调用 '${method}'`));
		if (!this.#connected) return Promise.reject(new RpcError(RpcErrorCodes.NOT_CONNECTED, `当前没有已连接的对端，无法调用 '${method}'`));
		const timeoutMs = options.timeout ?? this.#callMethodTimeouts.get(method) ?? this.#defaultTimeout;
		try {
			assertTimeout(timeoutMs, "timeout");
		} catch (error) {
			return Promise.reject(error);
		}
		const id = String(++this.#seq);
		return new Promise((resolve, reject) => {
			const call = {
				id,
				method,
				timer: void 0,
				resolve,
				reject
			};
			this.#pending.set(id, call);
			call.timer = armTimer(timeoutMs, () => {
				this.#rejectCall(id, new RpcError(RpcErrorCodes.TIMEOUT, `调用 '${method}' 超时（${timeoutMs}ms）`));
			});
			this.#dispatch(call, args);
		});
	}
	get connected() {
		return this.#connected;
	}
	get disposed() {
		return this.#disposed;
	}
	stats() {
		return {
			pending: this.#pending.size,
			inflight: this.#inflightCount
		};
	}
	/** @internal 传输层确认当前对端失效时收口本地状态。 */
	markPeerLost(message) {
		if (this.#disposed) return;
		this.losePeer(RpcErrorCodes.PEER_GONE, message);
	}
	dispose(reason) {
		if (this.#disposed) return;
		this.#disposed = true;
		const error = new RpcError(RpcErrorCodes.DISPOSED, reason ? `端点已销毁：${reason}` : "端点已销毁");
		this.#rejectAllPending(error);
		this.#handlers.clear();
		this.#connected = false;
		this.onTerminated(error);
		this.#transport.close();
	}
	get isDisposed() {
		return this.#disposed;
	}
	setConnected() {
		if (!this.#disposed) this.#connected = true;
	}
	head() {
		return { ch: this.#channel };
	}
	/** 统一处理所有可靠发送路径上的目标消失，避免新增路径漏掉断连收口。 */
	postOrLosePeer(message, peerGoneMessage) {
		try {
			this.#transport.post(message);
			return true;
		} catch (error) {
			if (error instanceof RpcError && error.code === RpcErrorCodes.PEER_GONE) {
				this.losePeer(RpcErrorCodes.PEER_GONE, peerGoneMessage);
				return false;
			}
			throw error;
		}
	}
	losePeer(code, message) {
		this.#connected = false;
		const error = new RpcError(code, message);
		this.#rejectAllPending(error);
		this.onTerminated(error);
	}
	/**
	* 本端进入终态（对端丢失或端点销毁）时的唯一钩子。
	*
	* 两种终态在两个子类里的处置本来就完全一致——parent 收口当前连接，child 拒绝未 settle 的 ready——
	* 分成两个钩子只会让「新增一种终态时漏改一个」变成必然。
	*/
	onTerminated(_error) {}
	onHello() {}
	onHelloAck() {}
	currentServerConnection() {
		return null;
	}
	isServerConnectionCurrent(connection) {
		return connection === null;
	}
	#receive(message) {
		if (this.#disposed || message.ch !== this.#channel) return;
		if (message.t === "hello") {
			this.onHello();
			return;
		}
		if (message.t === "hello-ack") {
			this.onHelloAck();
			return;
		}
		if (!this.#connected) return;
		switch (message.t) {
			case "req":
				this.#onRequest(message);
				break;
			case "res": this.#onResponse(message);
		}
	}
	#dispatch(call, args) {
		try {
			if (!this.postOrLosePeer({
				...this.head(),
				t: "req",
				id: call.id,
				method: call.method,
				args
			}, "目标窗口已不可达（iframe 可能已从 DOM 移除）")) return;
		} catch (error) {
			this.#rejectCall(call.id, new RpcError(RpcErrorCodes.CLONE_FAILED, `调用 '${call.method}' 的入参无法被结构化克隆（函数、Symbol、DOM 节点等无法跨窗口传递）`, { cause: error }));
		}
	}
	#onResponse(message) {
		const call = this.#takeCall(message.id);
		if (!call) return;
		if (message.ok) call.resolve(message.value);
		else call.reject(deserializeError(message.error));
	}
	#takeCall(id) {
		const call = this.#pending.get(id);
		if (!call) return void 0;
		this.#pending.delete(id);
		if (call.timer !== void 0) clearTimeout(call.timer);
		return call;
	}
	#rejectCall(id, error) {
		const call = this.#takeCall(id);
		if (call) call.reject(error);
	}
	/** 先快照 key 再遍历：#rejectCall 会在过程中删除条目。 */
	#rejectAllPending(error) {
		for (const id of [...this.#pending.keys()]) this.#rejectCall(id, error);
	}
	#onRequest(message) {
		const task = {
			id: message.id,
			method: message.method,
			args: message.args,
			connection: this.currentServerConnection()
		};
		if (this.#inflightCount >= this.#maxInflight) {
			this.#respond(task, {
				ok: false,
				error: {
					name: "RpcError",
					message: `对端未完成任务已达上限（maxInflight=${this.#maxInflight}），拒绝执行 '${task.method}'`,
					code: RpcErrorCodes.BUSY
				}
			});
			return;
		}
		this.#inflightCount += 1;
		this.#run(task);
	}
	async #run(task) {
		try {
			const handler = this.#handlers.get(task.method);
			if (!handler) throw new RpcError(RpcErrorCodes.METHOD_NOT_FOUND, `对端未注册方法 '${task.method}'`);
			const value = await handler(...task.args);
			this.#respond(task, {
				ok: true,
				value
			});
		} catch (error) {
			this.#respond(task, {
				ok: false,
				error: serializeError(error)
			});
		} finally {
			this.#inflightCount -= 1;
		}
	}
	#respond(task, payload) {
		if (this.#disposed || !this.#connected || !this.isServerConnectionCurrent(task.connection)) return;
		try {
			if (!this.postOrLosePeer({
				...this.head(),
				t: "res",
				id: task.id,
				...payload
			}, "目标窗口已不可达（iframe 可能已从 DOM 移除）")) return;
		} catch {
			try {
				this.postOrLosePeer({
					...this.head(),
					t: "res",
					id: task.id,
					ok: false,
					error: {
						name: "RpcError",
						message: `方法 '${task.method}' 的返回值无法被结构化克隆`,
						code: RpcErrorCodes.CLONE_FAILED
					}
				}, "发送克隆失败响应时发现目标窗口已不可达（iframe 可能已从 DOM 移除）");
			} catch {}
		}
	}
};
var ChildEndpoint = class extends BaseEndpoint {
	#ready;
	#resolveReady;
	#rejectReady;
	#readySettled = false;
	constructor(options) {
		super(options);
		this.#ready = new Promise((resolve, reject) => {
			this.#resolveReady = resolve;
			this.#rejectReady = reject;
		});
		this.#ready.catch(() => {});
	}
	get ready() {
		return this.#ready;
	}
	onHello() {
		if (this.#readySettled || this.connected) return;
		try {
			if (!this.postOrLosePeer({
				...this.head(),
				t: "hello-ack"
			}, "回复握手时发现父窗口已不可达")) return;
		} catch {
			this.markPeerLost("回复握手时发现父窗口已不可达");
			return;
		}
		this.setConnected();
		this.#readySettled = true;
		this.#resolveReady();
	}
	/** 首次握手前进入任何终态（dispose 或本地可观测的不可达），都以该错误拒绝 ready。 */
	onTerminated(error) {
		if (this.#readySettled) return;
		this.#readySettled = true;
		this.#rejectReady(error);
	}
};
//#endregion
//#region src/transport.ts
function createFloodState(options) {
	const maxPerSecond = options.maxPerSecond ?? RpcDefaults.floodMaxPerSecond;
	if (!Number.isInteger(maxPerSecond) || maxPerSecond < 1) throw new TypeError(`[iframe-rpc] flood.maxPerSecond 必须是 >= 1 的整数，收到 ${String(maxPerSecond)}`);
	if (typeof options.onAbuse !== "function") throw new TypeError("[iframe-rpc] flood.onAbuse 必填：没有它就只剩静默封禁，安全事件会被藏起来");
	return {
		maxPerSecond,
		onAbuse: options.onAbuse,
		target: null,
		banned: false,
		count: 0,
		credits: 0,
		windowStart: 0
	};
}
function resetFloodState(flood) {
	flood.target = null;
	flood.banned = false;
	flood.count = 0;
	flood.credits = 0;
	flood.windowStart = 0;
}
/**
* 换代（新 iframe 元素 → 全新 Window）时把这份账清零：计数、配额、封禁一起。
*
* 收发两条路径都要调用它，否则「先 post 出去、再收到第一条回信」会被误判成换代，
* 刚发出的配额当场被清掉。
*
* 刻意不在这里启动秒表：`count` 归零就足以让下一条计数消息重新起表。见 isFlooding。
*/
function syncFloodTarget(flood, target) {
	if (target === flood.target) return;
	resetFloodState(flood);
	flood.target = target;
}
/**
* 入站限速判定：返回 true 表示这条消息应当被丢弃。
*
* 调用点排在任何人访问 `event.data` 之前。在 Blink 上这能省下整份反序列化代价；在按 HTML 标准
* 先反序列化再派发的引擎（WebKit 实测如此）上省不到，但也不吃亏——见文件末尾的说明。
*/
function isFlooding(flood, target, origin) {
	syncFloodTarget(flood, target);
	if (flood.banned) return true;
	if (flood.credits > 0) {
		flood.credits--;
		return false;
	}
	if (flood.count === 0) flood.windowStart = performance.now();
	if (++flood.count <= flood.maxPerSecond) return false;
	const now = performance.now();
	if (now - flood.windowStart >= 1e3) {
		flood.count = 1;
		flood.windowStart = now;
		return false;
	}
	flood.banned = true;
	flood.onAbuse({
		origin,
		count: flood.count,
		maxPerSecond: flood.maxPerSecond
	});
	return true;
}
/**
* 出站 req 为入站授权一条额度。
*
* 入站计数分不清「对端主动灌来的」和「我自己请求的应答」——要分清就得读
* `event.data`，那正是限速要避免的事。于是一次合法的并发突发（`maxInflight`
* 默认 50）应答回来也可能显著消耗限额。读本端自己构造的信封是零成本的，
* 用它换额度即可。
*
* 额度不与具体应答关联：下一条入站消息无论类型都会消耗。因此它表达的是「本端每发起
* 一次调用，就接受一条由此带来的入站消息」，不是严格的入站速率上限。余额封顶只防止
* 长期收不到应答时无限累积；持续交错的 req / 入站仍会逐条补充和消耗额度。
*/
function grantFloodCredit(flood, target, message) {
	syncFloodTarget(flood, target);
	if (message.t === "req" && flood.credits < flood.maxPerSecond) flood.credits++;
}
/**
* 校验并规范化 origin。
*
* 浏览器发送时会把 `https://example.com/`、默认端口和路径都折叠成 origin，
* `message` 事件的 `event.origin` 也只给规范化后的值。若内部保留调用方原字符串，
* 消息虽然能发出去，回信却会因字符串不完全相等而被误拒。
*/
function normalizeOrigin(origin, optionName = "targetOrigin") {
	if (typeof origin !== "string" || origin.length === 0) throw new TypeError(`[iframe-rpc] ${optionName} 必填，且必须是具体的 origin`);
	if (origin === "*") throw new TypeError(`[iframe-rpc] ${optionName} 不允许使用 '*'：那会把已注册的方法暴露给任意窗口。请填写具体 origin，例如 'https://child.example.com'。`);
	const rejectOpaque = () => {
		throw new TypeError(`[iframe-rpc] ${optionName} 是 opaque origin，无法在禁用 '*' 的前提下安全通信。sandbox iframe 请启用 allow-same-origin 并填写它的实际 origin。`);
	};
	if (origin === "null") rejectOpaque();
	let normalized;
	try {
		normalized = new URL(origin).origin;
	} catch (cause) {
		throw new TypeError(`[iframe-rpc] ${optionName} 必须是合法的绝对 origin，收到 ${JSON.stringify(origin)}`, { cause });
	}
	if (normalized === "null") rejectOpaque();
	return normalized;
}
/** 结构校验：确认这是一条属于本频道的、格式合法的 RPC 消息。 */
function isEnvelope(value, channel) {
	if (typeof value !== "object" || value === null) return false;
	const msg = value;
	if (msg.ch !== channel) return false;
	switch (msg.t) {
		case "hello":
		case "hello-ack": return true;
		case "req": return typeof msg.id === "string" && typeof msg.method === "string" && Array.isArray(msg.args);
		case "res":
			if (typeof msg.id !== "string") return false;
			if (msg.ok === false) return typeof msg.error === "object" && msg.error !== null;
			return msg.ok === true;
		default: return false;
	}
}
function createWindowTransport(options) {
	const { channel, resolveTarget } = options;
	const targetOrigin = normalizeOrigin(options.targetOrigin, options.originOptionName);
	const listenOn = options.listenOn ?? globalThis;
	const flood = options.flood ? createFloodState(options.flood) : null;
	let handler = null;
	let closed = false;
	const onWindowMessage = (event) => {
		if (closed || handler === null) return;
		const target = resolveTarget();
		if (target === null) {
			options.onTargetUnavailable?.();
			return;
		}
		if (event.source !== target) return;
		if (event.origin !== targetOrigin) return;
		if (options.isTargetAvailable && !options.isTargetAvailable()) {
			options.onTargetUnavailable?.();
			return;
		}
		if (flood !== null && isFlooding(flood, target, targetOrigin)) return;
		const data = event.data;
		if (!isEnvelope(data, channel)) return;
		handler(data);
	};
	listenOn.addEventListener("message", onWindowMessage);
	return {
		post(message) {
			if (closed) return;
			const target = resolveTarget();
			if (target === null || options.isTargetAvailable && !options.isTargetAvailable()) throw new RpcError(RpcErrorCodes.PEER_GONE, "目标窗口不可达（iframe 未挂载或已从 DOM 移除）");
			target.postMessage(message, targetOrigin);
			if (flood !== null) grantFloodCredit(flood, target, message);
		},
		onMessage(next) {
			handler = next;
		},
		resetPeerState() {
			if (flood !== null) resetFloodState(flood);
		},
		close() {
			if (closed) return;
			closed = true;
			handler = null;
			if (flood !== null) resetFloodState(flood);
			listenOn.removeEventListener("message", onWindowMessage);
		}
	};
}
//#endregion
//#region src/index.ts
/**
* 构造端点；构造失败时先把 transport 关掉，再把错误原样抛出去。
*
* createWindowTransport 一返回就已经挂上了 message 监听，而 Endpoint 的构造期
* 是会抛错的（例如 maxInflight 非法）。不兜这一手，一次失败的构造就会在宿主窗口上
* 永久留下一个再也没人 close 的监听——反复重试就反复累积。
*/
function buildEndpoint(transport, create) {
	try {
		return create();
	} catch (error) {
		transport.close();
		throw error;
	}
}
/** 在 iframe 侧创建端点。 */
function createChildRpc(options) {
	const { parentOrigin, hostWindow, channel = RpcDefaults.channel, ...rest } = options;
	const self = hostWindow ?? globalThis;
	const transport = createWindowTransport({
		channel,
		targetOrigin: parentOrigin,
		originOptionName: "parentOrigin",
		resolveTarget: () => self.parent && self.parent !== self ? self.parent : null,
		listenOn: self
	});
	return buildEndpoint(transport, () => new ChildEndpoint({
		...rest,
		channel,
		transport
	}));
}
//#endregion
//#region child-app/node.js
var PARENT_ORIGIN = window.location.hash.slice(1);
window.baseflow = {};
window.__RPC__ = createChildRpc({
	parentOrigin: PARENT_ORIGIN,
	handlers: { onInit(url, data) {
		window.__baseflow__ = data;
		import(url).then(() => {
			document.getElementById("root-loading")?.remove();
		});
	} }
});
//#endregion

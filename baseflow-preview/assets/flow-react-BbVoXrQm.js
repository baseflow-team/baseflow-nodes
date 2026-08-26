import { n as __toESM, t as __commonJSMin } from "./rolldown-runtime-BPOCksWG.js";
import { i as require_react, r as require_react_dom, t as require_jsx_runtime } from "./react-vendor-Cx6FFdeZ.js";
//#region ../node_modules/path-expression-matcher/src/Expression.js
/**
* Expression - Parses and stores a tag pattern expression
* 
* Patterns are parsed once and stored in an optimized structure for fast matching.
* 
* @example
* const expr = new Expression("root.users.user");
* const expr2 = new Expression("..user[id]:first");
* const expr3 = new Expression("root/users/user", { separator: '/' });
*/
var Expression = class {
	/**
	* Create a new Expression
	* @param {string} pattern - Pattern string (e.g., "root.users.user", "..user[id]")
	* @param {Object} options - Configuration options
	* @param {string} options.separator - Path separator (default: '.')
	*/
	constructor(pattern, options = {}, data) {
		this.pattern = pattern;
		this.separator = options.separator || ".";
		this.segments = this._parse(pattern);
		this.data = data;
		this._hasDeepWildcard = this.segments.some((seg) => seg.type === "deep-wildcard");
		this._hasAttributeCondition = this.segments.some((seg) => seg.attrName !== void 0);
		this._hasPositionSelector = this.segments.some((seg) => seg.position !== void 0);
	}
	/**
	* Parse pattern string into segments
	* @private
	* @param {string} pattern - Pattern to parse
	* @returns {Array} Array of segment objects
	*/
	_parse(pattern) {
		const segments = [];
		let i = 0;
		let currentPart = "";
		while (i < pattern.length) if (pattern[i] === this.separator) {
			if (i + 1 < pattern.length && pattern[i + 1] === this.separator) {
				if (currentPart.trim()) {
					segments.push(this._parseSegment(currentPart.trim()));
					currentPart = "";
				}
				segments.push({ type: "deep-wildcard" });
				i += 2;
			} else {
				if (currentPart.trim()) segments.push(this._parseSegment(currentPart.trim()));
				currentPart = "";
				i++;
			}
		} else {
			currentPart += pattern[i];
			i++;
		}
		if (currentPart.trim()) segments.push(this._parseSegment(currentPart.trim()));
		return segments;
	}
	/**
	* Parse a single segment
	* @private
	* @param {string} part - Segment string (e.g., "user", "ns::user", "user[id]", "ns::user:first")
	* @returns {Object} Segment object
	*/
	_parseSegment(part) {
		const segment = { type: "tag" };
		let bracketContent = null;
		let withoutBrackets = part;
		const bracketMatch = part.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
		if (bracketMatch) {
			withoutBrackets = bracketMatch[1] + bracketMatch[3];
			if (bracketMatch[2]) {
				const content = bracketMatch[2].slice(1, -1);
				if (content) bracketContent = content;
			}
		}
		let namespace = void 0;
		let tagAndPosition = withoutBrackets;
		if (withoutBrackets.includes("::")) {
			const nsIndex = withoutBrackets.indexOf("::");
			namespace = withoutBrackets.substring(0, nsIndex).trim();
			tagAndPosition = withoutBrackets.substring(nsIndex + 2).trim();
			if (!namespace) throw new Error(`Invalid namespace in pattern: ${part}`);
		}
		let tag = void 0;
		let positionMatch = null;
		if (tagAndPosition.includes(":")) {
			const colonIndex = tagAndPosition.lastIndexOf(":");
			const tagPart = tagAndPosition.substring(0, colonIndex).trim();
			const posPart = tagAndPosition.substring(colonIndex + 1).trim();
			if ([
				"first",
				"last",
				"odd",
				"even"
			].includes(posPart) || /^nth\(\d+\)$/.test(posPart)) {
				tag = tagPart;
				positionMatch = posPart;
			} else tag = tagAndPosition;
		} else tag = tagAndPosition;
		if (!tag) throw new Error(`Invalid segment pattern: ${part}`);
		segment.tag = tag;
		if (namespace) segment.namespace = namespace;
		if (bracketContent) {
			if (bracketContent.includes("=")) {
				const eqIndex = bracketContent.indexOf("=");
				segment.attrName = bracketContent.substring(0, eqIndex).trim();
				segment.attrValue = bracketContent.substring(eqIndex + 1).trim();
			} else segment.attrName = bracketContent.trim();
		}
		if (positionMatch) {
			const nthMatch = positionMatch.match(/^nth\((\d+)\)$/);
			if (nthMatch) {
				segment.position = "nth";
				segment.positionValue = parseInt(nthMatch[1], 10);
			} else segment.position = positionMatch;
		}
		return segment;
	}
	/**
	* Get the number of segments
	* @returns {number}
	*/
	get length() {
		return this.segments.length;
	}
	/**
	* Check if expression contains deep wildcard
	* @returns {boolean}
	*/
	hasDeepWildcard() {
		return this._hasDeepWildcard;
	}
	/**
	* Check if expression has attribute conditions
	* @returns {boolean}
	*/
	hasAttributeCondition() {
		return this._hasAttributeCondition;
	}
	/**
	* Check if expression has position selectors
	* @returns {boolean}
	*/
	hasPositionSelector() {
		return this._hasPositionSelector;
	}
	/**
	* Get string representation
	* @returns {string}
	*/
	toString() {
		return this.pattern;
	}
};
//#endregion
//#region ../node_modules/path-expression-matcher/src/ExpressionSet.js
/**
* ExpressionSet - An indexed collection of Expressions for efficient bulk matching
*
* Instead of iterating all expressions on every tag, ExpressionSet pre-indexes
* them at insertion time by depth and terminal tag name. At match time, only
* the relevant bucket is evaluated — typically reducing checks from O(E) to O(1)
* lookup plus O(small bucket) matches.
*
* Three buckets are maintained:
*  - `_byDepthAndTag`  — exact depth + exact tag name  (tightest, used first)
*  - `_wildcardByDepth` — exact depth + wildcard tag `*` (depth-matched only)
*  - `_deepWildcards`  — expressions containing `..`  (cannot be depth-indexed)
*
* @example
* import { Expression, ExpressionSet } from 'fast-xml-tagger';
*
* // Build once at config time
* const stopNodes = new ExpressionSet();
* stopNodes.add(new Expression('root.users.user'));
* stopNodes.add(new Expression('root.config.setting'));
* stopNodes.add(new Expression('..script'));
*
* // Query on every tag — hot path
* if (stopNodes.matchesAny(matcher)) { ... }
*/
var ExpressionSet = class {
	constructor() {
		/** @type {Map<string, import('./Expression.js').default[]>} depth:tag → expressions */
		this._byDepthAndTag = /* @__PURE__ */ new Map();
		/** @type {Map<number, import('./Expression.js').default[]>} depth → wildcard-tag expressions */
		this._wildcardByDepth = /* @__PURE__ */ new Map();
		/** @type {import('./Expression.js').default[]} expressions containing deep wildcard (..) */
		this._deepWildcards = [];
		/** @type {Map<string, import('./Expression.js').default[]>} terminalTag → deep wildcard expressions */
		this._deepByTerminalTag = /* @__PURE__ */ new Map();
		/** @type {Set<string>} pattern strings already added — used for deduplication */
		this._patterns = /* @__PURE__ */ new Set();
		/** @type {boolean} whether the set is sealed against further additions */
		this._sealed = false;
	}
	/**
	* Add an Expression to the set.
	* Duplicate patterns (same pattern string) are silently ignored.
	*
	* @param {import('./Expression.js').default} expression - A pre-constructed Expression instance
	* @returns {this} for chaining
	* @throws {TypeError} if called after seal()
	*
	* @example
	* set.add(new Expression('root.users.user'));
	* set.add(new Expression('..script'));
	*/
	add(expression) {
		if (this._sealed) throw new TypeError("ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.");
		if (this._patterns.has(expression.pattern)) return this;
		this._patterns.add(expression.pattern);
		if (expression.hasDeepWildcard()) {
			const lastSeg = expression.segments[expression.segments.length - 1];
			if (lastSeg && lastSeg.type !== "deep-wildcard" && lastSeg.tag !== "*") {
				const tag = lastSeg.tag;
				if (!this._deepByTerminalTag.has(tag)) this._deepByTerminalTag.set(tag, []);
				this._deepByTerminalTag.get(tag).push(expression);
			} else this._deepWildcards.push(expression);
			return this;
		}
		const depth = expression.length;
		const tag = expression.segments[expression.segments.length - 1]?.tag;
		if (!tag || tag === "*") {
			if (!this._wildcardByDepth.has(depth)) this._wildcardByDepth.set(depth, []);
			this._wildcardByDepth.get(depth).push(expression);
		} else {
			const key = `${depth}:${tag}`;
			if (!this._byDepthAndTag.has(key)) this._byDepthAndTag.set(key, []);
			this._byDepthAndTag.get(key).push(expression);
		}
		return this;
	}
	/**
	* Add multiple expressions at once.
	*
	* @param {import('./Expression.js').default[]} expressions - Array of Expression instances
	* @returns {this} for chaining
	*
	* @example
	* set.addAll([
	*   new Expression('root.users.user'),
	*   new Expression('root.config.setting'),
	* ]);
	*/
	addAll(expressions) {
		for (const expr of expressions) this.add(expr);
		return this;
	}
	/**
	* Check whether a pattern string is already present in the set.
	*
	* @param {import('./Expression.js').default} expression
	* @returns {boolean}
	*/
	has(expression) {
		return this._patterns.has(expression.pattern);
	}
	/**
	* Number of expressions in the set.
	* @type {number}
	*/
	get size() {
		return this._patterns.size;
	}
	/**
	* Seal the set against further modifications.
	* Useful to prevent accidental mutations after config is built.
	* Calling add() or addAll() on a sealed set throws a TypeError.
	*
	* @returns {this}
	*/
	seal() {
		this._sealed = true;
		return this;
	}
	/**
	* Whether the set has been sealed.
	* @type {boolean}
	*/
	get isSealed() {
		return this._sealed;
	}
	/**
	* Test whether the matcher's current path matches any expression in the set.
	*
	* Evaluation order (cheapest → most expensive):
	*  1. Exact depth + tag bucket  — O(1) lookup, typically 0–2 expressions
	*  2. Depth-only wildcard bucket — O(1) lookup, rare
	*  3. Deep-wildcard list         — always checked, but usually small
	*
	* @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
	* @returns {boolean} true if any expression matches the current path
	*
	* @example
	* if (stopNodes.matchesAny(matcher)) {
	*   // handle stop node
	* }
	*/
	matchesAny(matcher) {
		return this.findMatch(matcher) !== null;
	}
	/**
	* Find and return the first Expression that matches the matcher's current path.
	*
	* Uses the same evaluation order as matchesAny (cheapest → most expensive):
	*  1. Exact depth + tag bucket
	*  2. Depth-only wildcard bucket
	*  3. Deep-wildcard list
	*
	* @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
	* @returns {import('./Expression.js').default | null} the first matching Expression, or null
	*
	* @example
	* const expr = stopNodes.findMatch(matcher);
	* if (expr) {
	*   // access expr.config, expr.pattern, etc.
	* }
	*/
	findMatch(matcher) {
		const depth = matcher.getDepth();
		const tag = matcher.getCurrentTag();
		const exactKey = `${depth}:${tag}`;
		const exactBucket = this._byDepthAndTag.get(exactKey);
		if (exactBucket) {
			for (let i = 0; i < exactBucket.length; i++) if (matcher.matches(exactBucket[i])) return exactBucket[i];
		}
		const wildcardBucket = this._wildcardByDepth.get(depth);
		if (wildcardBucket) {
			for (let i = 0; i < wildcardBucket.length; i++) if (matcher.matches(wildcardBucket[i])) return wildcardBucket[i];
		}
		const deepBucket = this._deepByTerminalTag.get(tag);
		if (deepBucket) {
			for (let i = 0; i < deepBucket.length; i++) if (matcher.matches(deepBucket[i])) return deepBucket[i];
		}
		for (let i = 0; i < this._deepWildcards.length; i++) if (matcher.matches(this._deepWildcards[i])) return this._deepWildcards[i];
		return null;
	}
};
//#endregion
//#region ../node_modules/path-expression-matcher/src/Matcher.js
/**
* MatcherView - A lightweight read-only view over a Matcher's internal state.
*
* Created once by Matcher and reused across all callbacks. Holds a direct
* reference to the parent Matcher so it always reflects current parser state
* with zero copying or freezing overhead.
*
* Users receive this via {@link Matcher#readOnly} or directly from parser
* callbacks. It exposes all query and matching methods but has no mutation
* methods — misuse is caught at the TypeScript level rather than at runtime.
*
* @example
* const matcher = new Matcher();
* const view = matcher.readOnly();
*
* matcher.push("root", {});
* view.getCurrentTag(); // "root"
* view.getDepth();      // 1
*/
var MatcherView = class {
	/**
	* @param {Matcher} matcher - The parent Matcher instance to read from.
	*/
	constructor(matcher) {
		this._matcher = matcher;
	}
	/**
	* Get the path separator used by the parent matcher.
	* @returns {string}
	*/
	get separator() {
		return this._matcher.separator;
	}
	/**
	* Get current tag name.
	* @returns {string|undefined}
	*/
	getCurrentTag() {
		const path = this._matcher.path;
		return path.length > 0 ? path[path.length - 1].tag : void 0;
	}
	/**
	* Get current namespace.
	* @returns {string|undefined}
	*/
	getCurrentNamespace() {
		const path = this._matcher.path;
		return path.length > 0 ? path[path.length - 1].namespace : void 0;
	}
	/**
	* Get current node's attribute value.
	* @param {string} attrName
	* @returns {*}
	*/
	getAttrValue(attrName) {
		const path = this._matcher.path;
		if (path.length === 0) return void 0;
		return path[path.length - 1].values?.[attrName];
	}
	/**
	* Check if current node has an attribute.
	* @param {string} attrName
	* @returns {boolean}
	*/
	hasAttr(attrName) {
		const path = this._matcher.path;
		if (path.length === 0) return false;
		const current = path[path.length - 1];
		return current.values !== void 0 && attrName in current.values;
	}
	/**
	* Get the value of a "kept" attribute from the nearest ancestor (or
	* current node) that declared it via `push(tag, attrs, ns, { keep: [...] })`.
	* @param {string} attrName
	* @returns {*}
	*/
	getAnyParentAttr(attrName) {
		return this._matcher.getAnyParentAttr(attrName);
	}
	/**
	* Check whether any ancestor (or the current node) kept the given
	* attribute via `push(tag, attrs, ns, { keep: [...] })`.
	* @param {string} attrName
	* @returns {boolean}
	*/
	hasAnyParentAttr(attrName) {
		return this._matcher.hasAnyParentAttr(attrName);
	}
	/**
	* Get current node's sibling position (child index in parent).
	* @returns {number}
	*/
	getPosition() {
		const path = this._matcher.path;
		if (path.length === 0) return -1;
		return path[path.length - 1].position ?? 0;
	}
	/**
	* Get current node's repeat counter (occurrence count of this tag name).
	* @returns {number}
	*/
	getCounter() {
		const path = this._matcher.path;
		if (path.length === 0) return -1;
		return path[path.length - 1].counter ?? 0;
	}
	/**
	* Get current node's sibling index (alias for getPosition).
	* @returns {number}
	* @deprecated Use getPosition() or getCounter() instead
	*/
	getIndex() {
		return this.getPosition();
	}
	/**
	* Get current path depth.
	* @returns {number}
	*/
	getDepth() {
		return this._matcher.path.length;
	}
	/**
	* Get path as string.
	* @param {string} [separator] - Optional separator (uses default if not provided)
	* @param {boolean} [includeNamespace=true]
	* @returns {string}
	*/
	toString(separator, includeNamespace = true) {
		return this._matcher.toString(separator, includeNamespace);
	}
	/**
	* Get path as array of tag names.
	* @returns {string[]}
	*/
	toArray() {
		return this._matcher.path.map((n) => n.tag);
	}
	/**
	* Match current path against an Expression.
	* @param {Expression} expression
	* @returns {boolean}
	*/
	matches(expression) {
		return this._matcher.matches(expression);
	}
	/**
	* Match any expression in the given set against the current path.
	* @param {ExpressionSet} exprSet
	* @returns {boolean}
	*/
	matchesAny(exprSet) {
		return exprSet.matchesAny(this._matcher);
	}
};
/**
* Matcher - Tracks current path in XML/JSON tree and matches against Expressions.
*
* The matcher maintains a stack of nodes representing the current path from root to
* current tag. It only stores attribute values for the current (top) node to minimize
* memory usage. Sibling tracking is used to auto-calculate position and counter.
*
* Use {@link Matcher#readOnly} to obtain a {@link MatcherView} safe to pass to
* user callbacks — it always reflects current state with no Proxy overhead.
*
* @example
* const matcher = new Matcher();
* matcher.push("root", {});
* matcher.push("users", {});
* matcher.push("user", { id: "123", type: "admin" });
*
* const expr = new Expression("root.users.user");
* matcher.matches(expr); // true
*/
var Matcher = class {
	/**
	* Create a new Matcher.
	* @param {Object} [options={}]
	* @param {string} [options.separator='.'] - Default path separator
	*/
	constructor(options = {}) {
		this.separator = options.separator || ".";
		this.path = [];
		this.siblingStacks = [];
		this._pathStringCache = null;
		this._view = new MatcherView(this);
		this._keptAttrs = [];
	}
	/**
	* Push a new tag onto the path.
	* @param {string} tagName
	* @param {Object|null} [attrValues=null]
	* @param {string|null} [namespace=null]
	* @param {Object|null} [options=null]
	* @param {string[]} [options.keep] - Names of attributes (from attrValues)
	*/
	push(tagName, attrValues = null, namespace = null, options = null) {
		this._pathStringCache = null;
		if (this.path.length > 0) this.path[this.path.length - 1].values = void 0;
		const currentLevel = this.path.length;
		let level = this.siblingStacks[currentLevel];
		if (!level) {
			level = {
				counts: /* @__PURE__ */ new Map(),
				total: 0
			};
			this.siblingStacks[currentLevel] = level;
		}
		const siblingKey = namespace ? `${namespace}:${tagName}` : tagName;
		const counter = level.counts.get(siblingKey) || 0;
		const position = level.total;
		level.counts.set(siblingKey, counter + 1);
		level.total++;
		const node = {
			tag: tagName,
			position,
			counter
		};
		if (namespace !== null && namespace !== void 0) node.namespace = namespace;
		if (attrValues !== null && attrValues !== void 0) node.values = attrValues;
		this.path.push(node);
		const depth = this.path.length;
		const keep = options !== null ? options.keep : null;
		if (keep !== null && keep !== void 0 && keep.length > 0 && attrValues) for (let i = 0; i < keep.length; i++) {
			const name = keep[i];
			if (attrValues[name] !== void 0) this._keptAttrs.push({
				depth,
				name,
				value: attrValues[name]
			});
		}
	}
	/**
	* Pop the last tag from the path.
	* @returns {Object|undefined} The popped node
	*/
	pop() {
		if (this.path.length === 0) return void 0;
		this._pathStringCache = null;
		const node = this.path.pop();
		if (this.siblingStacks.length > this.path.length + 1) this.siblingStacks.length = this.path.length + 1;
		const poppedDepth = this.path.length + 1;
		while (this._keptAttrs.length > 0 && this._keptAttrs[this._keptAttrs.length - 1].depth >= poppedDepth) this._keptAttrs.pop();
		return node;
	}
	/**
	* Update current node's attribute values.
	* Useful when attributes are parsed after push.
	* @param {Object} attrValues
	*/
	updateCurrent(attrValues) {
		if (this.path.length > 0) {
			const current = this.path[this.path.length - 1];
			if (attrValues !== null && attrValues !== void 0) current.values = attrValues;
		}
	}
	/**
	* Get current tag name.
	* @returns {string|undefined}
	*/
	getCurrentTag() {
		return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
	}
	/**
	* Get current namespace.
	* @returns {string|undefined}
	*/
	getCurrentNamespace() {
		return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
	}
	/**
	* Get current node's attribute value.
	* @param {string} attrName
	* @returns {*}
	*/
	getAttrValue(attrName) {
		if (this.path.length === 0) return void 0;
		return this.path[this.path.length - 1].values?.[attrName];
	}
	/**
	* Check if current node has an attribute.
	* @param {string} attrName
	* @returns {boolean}
	*/
	hasAttr(attrName) {
		if (this.path.length === 0) return false;
		const current = this.path[this.path.length - 1];
		return current.values !== void 0 && attrName in current.values;
	}
	/**
	* Get the value of a "kept" attribute from the nearest ancestor (or
	* current node) that declared it via `push(tag, attrs, ns, { keep: [...] })`.
	* Unlike getAttrValue(), this works regardless of how deep the path has
	* gone since the attribute was pushed — but only for attribute names that
	* were explicitly marked with `keep` at push time. Cost is proportional to
	* the number of currently-kept attributes (typically 0-3), not path depth.
	* @param {string} attrName
	* @returns {*} the value, or undefined if no ancestor kept this attribute
	*/
	getAnyParentAttr(attrName) {
		const kept = this._keptAttrs;
		for (let i = kept.length - 1; i >= 0; i--) if (kept[i].name === attrName) return kept[i].value;
	}
	/**
	* Check whether any ancestor (or the current node) kept the given
	* attribute via `push(tag, attrs, ns, { keep: [...] })`.
	* @param {string} attrName
	* @returns {boolean}
	*/
	hasAnyParentAttr(attrName) {
		const kept = this._keptAttrs;
		for (let i = kept.length - 1; i >= 0; i--) if (kept[i].name === attrName) return true;
		return false;
	}
	/**
	* Get current node's sibling position (child index in parent).
	* @returns {number}
	*/
	getPosition() {
		if (this.path.length === 0) return -1;
		return this.path[this.path.length - 1].position ?? 0;
	}
	/**
	* Get current node's repeat counter (occurrence count of this tag name).
	* @returns {number}
	*/
	getCounter() {
		if (this.path.length === 0) return -1;
		return this.path[this.path.length - 1].counter ?? 0;
	}
	/**
	* Get current node's sibling index (alias for getPosition).
	* @returns {number}
	* @deprecated Use getPosition() or getCounter() instead
	*/
	getIndex() {
		return this.getPosition();
	}
	/**
	* Get current path depth.
	* @returns {number}
	*/
	getDepth() {
		return this.path.length;
	}
	/**
	* Get path as string.
	* @param {string} [separator] - Optional separator (uses default if not provided)
	* @param {boolean} [includeNamespace=true]
	* @returns {string}
	*/
	toString(separator, includeNamespace = true) {
		const sep = separator || this.separator;
		if (sep === this.separator && includeNamespace === true) {
			if (this._pathStringCache !== null) return this._pathStringCache;
			const result = this.path.map((n) => n.namespace ? `${n.namespace}:${n.tag}` : n.tag).join(sep);
			this._pathStringCache = result;
			return result;
		}
		return this.path.map((n) => includeNamespace && n.namespace ? `${n.namespace}:${n.tag}` : n.tag).join(sep);
	}
	/**
	* Get path as array of tag names.
	* @returns {string[]}
	*/
	toArray() {
		return this.path.map((n) => n.tag);
	}
	/**
	* Reset the path to empty.
	*/
	reset() {
		this._pathStringCache = null;
		this.path = [];
		this.siblingStacks = [];
		this._keptAttrs = [];
	}
	/**
	* Match current path against an Expression.
	* @param {Expression} expression
	* @returns {boolean}
	*/
	matches(expression) {
		const segments = expression.segments;
		if (segments.length === 0) return false;
		if (expression.hasDeepWildcard()) return this._matchWithDeepWildcard(segments);
		return this._matchSimple(segments);
	}
	/**
	* @private
	*/
	_matchSimple(segments) {
		if (this.path.length !== segments.length) return false;
		for (let i = 0; i < segments.length; i++) if (!this._matchSegment(segments[i], this.path[i], i === this.path.length - 1)) return false;
		return true;
	}
	/**
	* @private
	*/
	_matchWithDeepWildcard(segments) {
		let pathIdx = this.path.length - 1;
		let segIdx = segments.length - 1;
		while (segIdx >= 0 && pathIdx >= 0) {
			const segment = segments[segIdx];
			if (segment.type === "deep-wildcard") {
				segIdx--;
				if (segIdx < 0) return true;
				const nextSeg = segments[segIdx];
				let found = false;
				for (let i = pathIdx; i >= 0; i--) if (this._matchSegment(nextSeg, this.path[i], i === this.path.length - 1)) {
					pathIdx = i - 1;
					segIdx--;
					found = true;
					break;
				}
				if (!found) return false;
			} else {
				if (!this._matchSegment(segment, this.path[pathIdx], pathIdx === this.path.length - 1)) return false;
				pathIdx--;
				segIdx--;
			}
		}
		return segIdx < 0;
	}
	/**
	* @private
	*/
	_matchSegment(segment, node, isCurrentNode) {
		if (segment.tag !== "*" && segment.tag !== node.tag) return false;
		if (segment.namespace !== void 0) {
			if (segment.namespace !== "*" && segment.namespace !== node.namespace) return false;
		}
		if (segment.attrName !== void 0) {
			if (!isCurrentNode) return false;
			if (!node.values || !(segment.attrName in node.values)) return false;
			if (segment.attrValue !== void 0) {
				if (String(node.values[segment.attrName]) !== String(segment.attrValue)) return false;
			}
		}
		if (segment.position !== void 0) {
			if (!isCurrentNode) return false;
			const counter = node.counter ?? 0;
			if (segment.position === "first" && counter !== 0) return false;
			else if (segment.position === "odd" && counter % 2 !== 1) return false;
			else if (segment.position === "even" && counter % 2 !== 0) return false;
			else if (segment.position === "nth" && counter !== segment.positionValue) return false;
		}
		return true;
	}
	/**
	* Match any expression in the given set against the current path.
	* @param {ExpressionSet} exprSet
	* @returns {boolean}
	*/
	matchesAny(exprSet) {
		return exprSet.matchesAny(this);
	}
	/**
	* Create a snapshot of current state.
	* @returns {Object}
	*/
	snapshot() {
		return {
			path: this.path.map((node) => ({ ...node })),
			siblingStacks: this.siblingStacks.map((level) => level ? {
				counts: new Map(level.counts),
				total: level.total
			} : level),
			keptAttrs: this._keptAttrs.map((entry) => ({ ...entry }))
		};
	}
	/**
	* Restore state from snapshot.
	* @param {Object} snapshot
	*/
	restore(snapshot) {
		this._pathStringCache = null;
		this.path = snapshot.path.map((node) => ({ ...node }));
		this.siblingStacks = snapshot.siblingStacks.map((level) => level ? {
			counts: new Map(level.counts),
			total: level.total
		} : level);
		this._keptAttrs = (snapshot.keptAttrs || []).map((entry) => ({ ...entry }));
	}
	/**
	* Return the read-only {@link MatcherView} for this matcher.
	*
	* The same instance is returned on every call — no allocation occurs.
	* It always reflects the current parser state and is safe to pass to
	* user callbacks without risk of accidental mutation.
	*
	* @returns {MatcherView}
	*
	* @example
	* const view = matcher.readOnly();
	* // pass view to callbacks — it stays in sync automatically
	* view.matches(expr);       // ✓
	* view.getCurrentTag();     // ✓
	* // view.push(...)         // ✗ method does not exist — caught by TypeScript
	*/
	readOnly() {
		return this._view;
	}
};
//#endregion
//#region ../node_modules/fast-xml-builder/src/util.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
require_react_dom();
function valToStr(val) {
	return typeof val === "number" && Object.is(val, -0) ? "-0" : String(val);
}
function safeComment(val) {
	return valToStr(val).replace(/--/g, "- -").replace(/--/g, "- -").replace(/-$/, "- ");
}
function safeCdata(val) {
	return valToStr(val).replace(/\]\]>/g, "]]]]><![CDATA[>");
}
function escapeAttribute(val) {
	return valToStr(val).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
//#endregion
//#region ../node_modules/xml-naming/src/index.js
/**
* xml-naming
* Validates XML Name productions as defined in the XML 1.0 and 1.1 specifications.
* Covers: Name, NCName, QName, NMToken, NMTokens
*
* XML 1.0 spec: https://www.w3.org/TR/xml/#NT-Name
* XML 1.1 spec: https://www.w3.org/TR/xml11/#NT-NameStartChar
* XML NS spec:  https://www.w3.org/TR/xml-names/#NT-NCName
*/
var nameStartChar10 = ":A-Za-z_À-ÖØ-öø-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�";
var nameChar10 = nameStartChar10 + "\\-\\.\\d·̀-ͯ‿-⁀";
var nameStartChar11 = ":A-Za-z_À-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�𐀀-󯿿";
var nameChar11 = nameStartChar11 + "\\-\\.\\d·̀-ͯ҇‿-⁀";
var buildRegexes = (startChar, char, flags = "") => {
	const ncNamePat = `[${startChar.replace(":", "")}][${char.replace(":", "")}]*`;
	return {
		name: new RegExp(`^[${startChar}][${char}]*$`, flags),
		ncName: new RegExp(`^${ncNamePat}$`, flags),
		qName: new RegExp(`^${ncNamePat}(?::${ncNamePat})?$`, flags),
		nmToken: new RegExp(`^[${char}]+$`, flags),
		nmTokens: new RegExp(`^[${char}]+(?:\\s+[${char}]+)*$`, flags)
	};
};
var regexes10 = buildRegexes(nameStartChar10, nameChar10);
var regexes11 = buildRegexes(nameStartChar11, nameChar11, "u");
var regexesAscii = buildRegexes(":A-Za-z_", ":A-Za-z_\\-\\.\\d");
var getRegexes = (xmlVersion = "1.0", asciiOnly = false) => {
	if (asciiOnly) return regexesAscii;
	return xmlVersion === "1.1" ? regexes11 : regexes10;
};
/**
* Returns true if the string is a valid QName (Qualified Name).
* Allows exactly one colon as a prefix separator: prefix:localName.
* Used for: element and attribute names in namespace-aware XML/SVG.
*
* @param {{ xmlVersion?: '1.0'|'1.1', asciiOnly?: boolean }} [opts]
*   asciiOnly: skip unicode-aware matching, ASCII names only (default false).
*/
var qName = (str, { xmlVersion = "1.0", asciiOnly = false } = {}) => getRegexes(xmlVersion, asciiOnly).qName.test(str);
var PRODUCTIONS = [
	"name",
	"ncName",
	"qName",
	"nmToken",
	"nmTokens"
];
/**
* Returns a memoized boolean validator function for a single production,
* with opts fixed at creation time.
*
* @param {'name'|'ncName'|'qName'|'nmToken'|'nmTokens'} production
* @param {{ xmlVersion?: '1.0'|'1.1', asciiOnly?: boolean, maxCacheSize?: number }} [opts]
*   maxCacheSize: max number of distinct strings to cache (default 2048).
*   Once reached, new strings are validated but not cached; existing cached
*   entries keep being served.
* @returns {((str: string) => boolean) & { reset: () => void }}
*/
var createValidator = (production, { xmlVersion = "1.0", asciiOnly = false, maxCacheSize = 2048 } = {}) => {
	if (!PRODUCTIONS.includes(production)) throw new TypeError(`Unknown production "${production}". Must be one of: ${PRODUCTIONS.join(", ")}`);
	const regex = getRegexes(xmlVersion, asciiOnly)[production];
	let cache = /* @__PURE__ */ new Map();
	const validator = (str) => {
		const cached = cache.get(str);
		if (cached !== void 0) return cached;
		const result = regex.test(str);
		if (cache.size < maxCacheSize) cache.set(str, result);
		return result;
	};
	validator.reset = () => {
		cache = /* @__PURE__ */ new Map();
	};
	return validator;
};
//#endregion
//#region ../node_modules/fast-xml-builder/src/orderedJs2Xml.js
var EOL = "\n";
/**
* Detect XML version from the first element of the ordered array input.
* The first element must be a ?xml processing instruction with a version attribute.
* Returns '1.0' if not found.
*
* @param {array}  jArray
* @param {object} options
*/
function detectXmlVersionFromArray(jArray, options) {
	if (!Array.isArray(jArray) || jArray.length === 0) return "1.0";
	const first = jArray[0];
	if (propName$1(first) === "?xml") {
		const attrs = first[":@"];
		if (attrs) {
			const versionKey = options.attributeNamePrefix + "version";
			if (attrs[versionKey]) return attrs[versionKey];
		}
	}
	return "1.0";
}
/**
* Resolve a tag or attribute name through sanitizeName if configured.
* Validation via xml-naming's qName is performed first; the sanitizeName
* callback is invoked only when the name is invalid. If sanitizeName is
* false (default), no validation occurs and the name is used as-is.
*
* @param {string}  name        - raw name from the JS object
* @param {boolean} isAttribute - true when resolving an attribute name
* @param {object}  options
* @param {Matcher} matcher     - current matcher state (readonly from callback perspective)
* @param {function} qNameValidator - function to validate tag names
*/
function resolveTagName$1(name, isAttribute, options, matcher, qNameValidator) {
	if (!options.sanitizeName) return name;
	if (qNameValidator(name)) return name;
	return options.sanitizeName(name, {
		isAttribute,
		matcher: matcher.readOnly()
	});
}
/**
* @param {array} jArray
* @param {any} options
* @returns
*/
function toXml(jArray, options) {
	let indentation = "";
	if (options.format) indentation = EOL;
	const stopNodeExpressions = [];
	if (options.stopNodes && Array.isArray(options.stopNodes)) for (let i = 0; i < options.stopNodes.length; i++) {
		const node = options.stopNodes[i];
		if (typeof node === "string") stopNodeExpressions.push(new Expression(node));
		else if (node instanceof Expression) stopNodeExpressions.push(node);
	}
	const qNameValidator = createValidator("qName", { xmlVersion: detectXmlVersionFromArray(jArray, options) });
	const matcher = new Matcher();
	return arrToStr(jArray, options, indentation, matcher, stopNodeExpressions, qNameValidator);
}
function arrToStr(arr, options, indentation, matcher, stopNodeExpressions, qNameValidator) {
	let xmlStr = "";
	let isPreviousElementTag = false;
	if (options.maxNestedTags && matcher.getDepth() > options.maxNestedTags) throw new Error("Maximum nested tags exceeded");
	if (!Array.isArray(arr)) {
		if (arr !== void 0 && arr !== null) {
			let text = valToStr(arr);
			text = replaceEntitiesValue$1(text, options);
			return text;
		}
		return "";
	}
	for (let i = 0; i < arr.length; i++) {
		const tagObj = arr[i];
		const rawTagName = propName$1(tagObj);
		if (rawTagName === void 0) continue;
		const tagName = rawTagName === options.textNodeName || rawTagName === options.cdataPropName || rawTagName === options.commentPropName || rawTagName[0] === "?" ? rawTagName : resolveTagName$1(rawTagName, false, options, matcher, qNameValidator);
		const attrValues = extractAttributeValues(tagObj[":@"], options);
		matcher.push(tagName, attrValues);
		const isStopNode = checkStopNode(matcher, stopNodeExpressions);
		if (tagName === options.textNodeName) {
			let tagText = tagObj[rawTagName];
			if (!isStopNode) {
				tagText = options.tagValueProcessor(tagName, tagText);
				tagText = replaceEntitiesValue$1(tagText, options);
			}
			tagText = valToStr(tagText);
			if (isPreviousElementTag) xmlStr += indentation;
			xmlStr += tagText;
			isPreviousElementTag = false;
			matcher.pop();
			continue;
		} else if (tagName === options.cdataPropName) {
			if (isPreviousElementTag) xmlStr += indentation;
			const val = tagObj[rawTagName][0][options.textNodeName];
			const safeVal = safeCdata(val);
			xmlStr += `<![CDATA[${safeVal}]]>`;
			isPreviousElementTag = false;
			matcher.pop();
			continue;
		} else if (tagName === options.commentPropName) {
			const val = tagObj[rawTagName][0][options.textNodeName];
			const safeVal = safeComment(val);
			xmlStr += indentation + `<!--${safeVal}-->`;
			isPreviousElementTag = true;
			matcher.pop();
			continue;
		} else if (tagName[0] === "?") {
			const attStr = attr_to_str(tagObj[":@"], options, isStopNode, matcher, qNameValidator);
			xmlStr += (tagName === "?xml" ? "" : indentation) + `<${tagName}${attStr}?>`;
			isPreviousElementTag = true;
			matcher.pop();
			continue;
		}
		let newIdentation = indentation;
		if (newIdentation !== "") newIdentation += options.indentBy;
		const tagStart = indentation + `<${tagName}${attr_to_str(tagObj[":@"], options, isStopNode, matcher, qNameValidator)}`;
		let tagValue;
		if (isStopNode) tagValue = getRawContent(tagObj[rawTagName], options);
		else tagValue = arrToStr(tagObj[rawTagName], options, newIdentation, matcher, stopNodeExpressions, qNameValidator);
		if (options.unpairedTags.indexOf(tagName) !== -1) {
			if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
			else xmlStr += tagStart + "/>";
		} else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) xmlStr += tagStart + "/>";
		else if (tagValue && tagValue.endsWith(">")) xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
		else {
			xmlStr += tagStart + ">";
			if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) xmlStr += indentation + options.indentBy + tagValue + indentation;
			else xmlStr += tagValue;
			xmlStr += `</${tagName}>`;
		}
		isPreviousElementTag = true;
		matcher.pop();
	}
	return xmlStr;
}
/**
* Extract attribute values from the ":@" object and return as plain object
* for passing to matcher.push()
*/
function extractAttributeValues(attrMap, options) {
	if (!attrMap || options.ignoreAttributes) return null;
	const attrValues = {};
	let hasAttrs = false;
	for (let attr in attrMap) {
		if (!Object.prototype.hasOwnProperty.call(attrMap, attr)) continue;
		const cleanAttrName = attr.startsWith(options.attributeNamePrefix) ? attr.substr(options.attributeNamePrefix.length) : attr;
		attrValues[cleanAttrName] = escapeAttribute(attrMap[attr]);
		hasAttrs = true;
	}
	return hasAttrs ? attrValues : null;
}
/**
* Extract raw content from a stopNode without any processing
* This preserves the content exactly as-is, including special characters
*/
function getRawContent(arr, options) {
	if (!Array.isArray(arr)) {
		if (arr !== void 0 && arr !== null) return valToStr(arr);
		return "";
	}
	let content = "";
	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];
		const tagName = propName$1(item);
		if (tagName === options.textNodeName) content += valToStr(item[tagName]);
		else if (tagName === options.cdataPropName) content += item[tagName][0][options.textNodeName];
		else if (tagName === options.commentPropName) content += item[tagName][0][options.textNodeName];
		else if (tagName && tagName[0] === "?") continue;
		else if (tagName) {
			const attStr = attr_to_str_raw(item[":@"], options);
			const nestedContent = getRawContent(item[tagName], options);
			if (!nestedContent || nestedContent.length === 0) content += `<${tagName}${attStr}/>`;
			else content += `<${tagName}${attStr}>${nestedContent}</${tagName}>`;
		}
	}
	return content;
}
/**
* Build attribute string for stopNodes - NO entity replacement
*/
function attr_to_str_raw(attrMap, options) {
	let attrStr = "";
	if (attrMap && !options.ignoreAttributes) for (let attr in attrMap) {
		if (!Object.prototype.hasOwnProperty.call(attrMap, attr)) continue;
		let attrVal = attrMap[attr];
		if (attrVal === true && options.suppressBooleanAttributes) attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
		else attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${escapeAttribute(attrVal)}"`;
	}
	return attrStr;
}
function propName$1(obj) {
	const keys = Object.keys(obj);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
		if (key !== ":@") return key;
	}
}
/**
* Build attribute string, resolving attribute names through sanitizeName when configured.
* Accepts matcher so the callback has path context.
*/
function attr_to_str(attrMap, options, isStopNode, matcher, qNameValidator) {
	let attrStr = "";
	if (attrMap && !options.ignoreAttributes) for (let attr in attrMap) {
		if (!Object.prototype.hasOwnProperty.call(attrMap, attr)) continue;
		const cleanAttrName = attr.substr(options.attributeNamePrefix.length);
		const resolvedAttrName = isStopNode ? cleanAttrName : resolveTagName$1(cleanAttrName, true, options, matcher, qNameValidator);
		let attrVal;
		if (isStopNode) attrVal = attrMap[attr];
		else {
			attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
			attrVal = replaceEntitiesValue$1(attrVal, options);
		}
		if (attrVal === true && options.suppressBooleanAttributes) attrStr += ` ${resolvedAttrName}`;
		else attrStr += ` ${resolvedAttrName}="${escapeAttribute(attrVal)}"`;
	}
	return attrStr;
}
function checkStopNode(matcher, stopNodeExpressions) {
	if (!stopNodeExpressions || stopNodeExpressions.length === 0) return false;
	for (let i = 0; i < stopNodeExpressions.length; i++) if (matcher.matches(stopNodeExpressions[i])) return true;
	return false;
}
function replaceEntitiesValue$1(textValue, options) {
	if (textValue && textValue.length > 0 && options.processEntities) for (let i = 0; i < options.entities.length; i++) {
		const entity = options.entities[i];
		textValue = textValue.replace(entity.regex, entity.val);
	}
	return textValue;
}
//#endregion
//#region ../node_modules/fast-xml-builder/src/ignoreAttributes.js
function getIgnoreAttributesFn$1(ignoreAttributes) {
	if (typeof ignoreAttributes === "function") return ignoreAttributes;
	if (Array.isArray(ignoreAttributes)) return (attrName) => {
		for (const pattern of ignoreAttributes) {
			if (typeof pattern === "string" && attrName === pattern) return true;
			if (pattern instanceof RegExp && pattern.test(attrName)) return true;
		}
	};
	return () => false;
}
//#endregion
//#region ../node_modules/fast-xml-builder/src/fxb.js
var defaultOptions$2 = {
	attributeNamePrefix: "@_",
	attributesGroupName: false,
	textNodeName: "#text",
	ignoreAttributes: true,
	cdataPropName: false,
	format: false,
	indentBy: "  ",
	suppressEmptyNode: false,
	suppressUnpairedNode: true,
	suppressBooleanAttributes: true,
	tagValueProcessor: function(key, a) {
		return a;
	},
	attributeValueProcessor: function(attrName, a) {
		return a;
	},
	preserveOrder: false,
	commentPropName: false,
	unpairedTags: [],
	entities: [
		{
			regex: /* @__PURE__ */ new RegExp("&", "g"),
			val: "&amp;"
		},
		{
			regex: /* @__PURE__ */ new RegExp(">", "g"),
			val: "&gt;"
		},
		{
			regex: /* @__PURE__ */ new RegExp("<", "g"),
			val: "&lt;"
		},
		{
			regex: /* @__PURE__ */ new RegExp("'", "g"),
			val: "&apos;"
		},
		{
			regex: /* @__PURE__ */ new RegExp("\"", "g"),
			val: "&quot;"
		}
	],
	processEntities: true,
	stopNodes: [],
	oneListGroup: false,
	maxNestedTags: 100,
	jPath: true,
	sanitizeName: false
};
function Builder(options) {
	this.options = Object.assign({}, defaultOptions$2, options);
	if (this.options.stopNodes && Array.isArray(this.options.stopNodes)) this.options.stopNodes = this.options.stopNodes.map((node) => {
		if (typeof node === "string" && node.startsWith("*.")) return ".." + node.substring(2);
		return node;
	});
	this.stopNodeExpressions = [];
	if (this.options.stopNodes && Array.isArray(this.options.stopNodes)) for (let i = 0; i < this.options.stopNodes.length; i++) {
		const node = this.options.stopNodes[i];
		if (typeof node === "string") this.stopNodeExpressions.push(new Expression(node));
		else if (node instanceof Expression) this.stopNodeExpressions.push(node);
	}
	if (this.options.ignoreAttributes === true || this.options.attributesGroupName) this.isAttribute = function() {
		return false;
	};
	else {
		this.ignoreAttributesFn = getIgnoreAttributesFn$1(this.options.ignoreAttributes);
		this.attrPrefixLen = this.options.attributeNamePrefix.length;
		this.isAttribute = isAttribute;
	}
	this.processTextOrObjNode = processTextOrObjNode;
	if (this.options.format) {
		this.indentate = indentate;
		this.tagEndChar = ">\n";
		this.newLine = "\n";
	} else {
		this.indentate = function() {
			return "";
		};
		this.tagEndChar = ">";
		this.newLine = "";
	}
}
/**
* Detect XML version from the ?xml declaration at the root of a plain-object input.
* Checks both attributesGroupName and flat attribute forms.
* Returns '1.0' if no declaration is found.
*/
function detectXmlVersionFromObj(jObj, options) {
	const decl = jObj["?xml"];
	if (decl && typeof decl === "object") {
		if (options.attributesGroupName && decl[options.attributesGroupName]) {
			const v = decl[options.attributesGroupName][options.attributeNamePrefix + "version"];
			if (v) return v;
		}
		const v = decl[options.attributeNamePrefix + "version"];
		if (v) return v;
	}
	return "1.0";
}
/**
* Resolve a tag or attribute name through sanitizeName if configured.
* Validation via xml-naming's qName is performed first; the sanitizeName
* callback is invoked only when the name is invalid. If sanitizeName is
* false (default), no validation occurs and the name is used as-is.
*
* @param {string}  name        - raw name from the JS object
* @param {boolean} isAttribute - true when resolving an attribute name
* @param {object}  options
* @param {Matcher} matcher     - current matcher state (readonly from callback perspective)
* @param {function} qNameValidator - function to validate tag names
*/
function resolveTagName(name, isAttribute, options, matcher, qNameValidator) {
	if (!options.sanitizeName) return name;
	if (qNameValidator(name)) return name;
	return options.sanitizeName(name, {
		isAttribute,
		matcher: matcher.readOnly()
	});
}
Builder.prototype.build = function(jObj) {
	if (this.options.preserveOrder) return toXml(jObj, this.options);
	else {
		if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) jObj = { [this.options.arrayNodeName]: jObj };
		const matcher = new Matcher();
		const qNameValidator = createValidator("qName", { xmlVersion: detectXmlVersionFromObj(jObj, this.options) });
		return this.j2x(jObj, 0, matcher, qNameValidator).val;
	}
};
Builder.prototype.j2x = function(jObj, level, matcher, qNameValidator) {
	let attrStr = "";
	let val = "";
	if (this.options.maxNestedTags && matcher.getDepth() >= this.options.maxNestedTags) throw new Error("Maximum nested tags exceeded");
	const jPath = this.options.jPath ? matcher.toString() : matcher;
	const isCurrentStopNode = this.checkStopNode(matcher);
	for (let key in jObj) {
		if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
		const resolvedKey = key === this.options.textNodeName || key === this.options.cdataPropName || key === this.options.commentPropName || this.options.attributesGroupName && key === this.options.attributesGroupName || this.isAttribute(key) || key[0] === "?" ? key : resolveTagName(key, false, this.options, matcher, qNameValidator);
		if (typeof jObj[key] === "undefined") {
			if (this.isAttribute(key)) val += "";
		} else if (jObj[key] === null) {
			if (this.isAttribute(key)) val += "";
			else if (resolvedKey === this.options.cdataPropName || resolvedKey === this.options.commentPropName) val += "";
			else if (resolvedKey[0] === "?") val += this.indentate(level) + "<" + resolvedKey + "?" + this.tagEndChar;
			else val += this.indentate(level) + "<" + resolvedKey + "/" + this.tagEndChar;
		} else if (jObj[key] instanceof Date) val += this.buildTextValNode(jObj[key], resolvedKey, "", level, matcher);
		else if (typeof jObj[key] !== "object") {
			const attr = this.isAttribute(key);
			if (attr && !this.ignoreAttributesFn(attr, jPath)) {
				const resolvedAttr = resolveTagName(attr, true, this.options, matcher, qNameValidator);
				attrStr += this.buildAttrPairStr(resolvedAttr, valToStr(jObj[key]), isCurrentStopNode);
			} else if (!attr) {
				if (key === this.options.textNodeName) {
					let newval = this.options.tagValueProcessor(key, valToStr(jObj[key]));
					val += this.replaceEntitiesValue(newval);
				} else {
					matcher.push(resolvedKey);
					const isStopNode = this.checkStopNode(matcher);
					matcher.pop();
					if (isStopNode) {
						const textValue = valToStr(jObj[key]);
						if (textValue === "") val += this.indentate(level) + "<" + resolvedKey + this.closeTag(resolvedKey) + this.tagEndChar;
						else val += this.indentate(level) + "<" + resolvedKey + ">" + textValue + "</" + resolvedKey + this.tagEndChar;
					} else val += this.buildTextValNode(jObj[key], resolvedKey, "", level, matcher);
				}
			}
		} else if (Array.isArray(jObj[key])) {
			const arrLen = jObj[key].length;
			let listTagVal = "";
			let listTagAttr = "";
			for (let j = 0; j < arrLen; j++) {
				const item = jObj[key][j];
				if (typeof item === "undefined") {} else if (item === null) {
					if (resolvedKey[0] === "?") val += this.indentate(level) + "<" + resolvedKey + "?" + this.tagEndChar;
					else val += this.indentate(level) + "<" + resolvedKey + "/" + this.tagEndChar;
				} else if (typeof item === "object") {
					if (this.options.oneListGroup) {
						matcher.push(resolvedKey);
						const result = this.j2x(item, level + 1, matcher, qNameValidator);
						matcher.pop();
						listTagVal += result.val;
						if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) listTagAttr += result.attrStr;
					} else listTagVal += this.processTextOrObjNode(item, resolvedKey, level, matcher, qNameValidator);
				} else if (this.options.oneListGroup) {
					let textValue = this.options.tagValueProcessor(resolvedKey, item);
					textValue = this.replaceEntitiesValue(textValue);
					textValue = valToStr(textValue);
					listTagVal += textValue;
				} else {
					matcher.push(resolvedKey);
					const isStopNode = this.checkStopNode(matcher);
					matcher.pop();
					if (isStopNode) {
						const textValue = valToStr(item);
						if (textValue === "") listTagVal += this.indentate(level) + "<" + resolvedKey + this.closeTag(resolvedKey) + this.tagEndChar;
						else listTagVal += this.indentate(level) + "<" + resolvedKey + ">" + textValue + "</" + resolvedKey + this.tagEndChar;
					} else listTagVal += this.buildTextValNode(item, resolvedKey, "", level, matcher);
				}
			}
			if (this.options.oneListGroup) listTagVal = this.buildObjectNode(listTagVal, resolvedKey, listTagAttr, level);
			val += listTagVal;
		} else if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
			const Ks = Object.keys(jObj[key]);
			const L = Ks.length;
			for (let j = 0; j < L; j++) {
				const resolvedAttr = resolveTagName(Ks[j], true, this.options, matcher, qNameValidator);
				attrStr += this.buildAttrPairStr(resolvedAttr, valToStr(jObj[key][Ks[j]]), isCurrentStopNode);
			}
		} else val += this.processTextOrObjNode(jObj[key], resolvedKey, level, matcher, qNameValidator);
	}
	return {
		attrStr,
		val
	};
};
Builder.prototype.buildAttrPairStr = function(attrName, val, isStopNode) {
	if (!isStopNode) {
		val = this.options.attributeValueProcessor(attrName, valToStr(val));
		val = this.replaceEntitiesValue(val);
	}
	if (this.options.suppressBooleanAttributes && val === "true") return " " + attrName;
	else return " " + attrName + "=\"" + escapeAttribute(val) + "\"";
};
function processTextOrObjNode(object, key, level, matcher, qNameValidator) {
	const attrValues = this.extractAttributes(object);
	matcher.push(key, attrValues);
	if (this.checkStopNode(matcher)) {
		const rawContent = this.buildRawContent(object);
		const attrStr = this.buildAttributesForStopNode(object);
		matcher.pop();
		return this.buildObjectNode(rawContent, key, attrStr, level);
	}
	const result = this.j2x(object, level + 1, matcher, qNameValidator);
	matcher.pop();
	if (key[0] === "?") return this.buildTextValNode("", key, result.attrStr, level, matcher);
	else if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level, matcher);
	else return this.buildObjectNode(result.val, key, result.attrStr, level);
}
Builder.prototype.extractAttributes = function(obj) {
	if (!obj || typeof obj !== "object") return null;
	const attrValues = {};
	let hasAttrs = false;
	if (this.options.attributesGroupName && obj[this.options.attributesGroupName]) {
		const attrGroup = obj[this.options.attributesGroupName];
		for (let attrKey in attrGroup) {
			if (!Object.prototype.hasOwnProperty.call(attrGroup, attrKey)) continue;
			const cleanKey = attrKey.startsWith(this.options.attributeNamePrefix) ? attrKey.substring(this.options.attributeNamePrefix.length) : attrKey;
			attrValues[cleanKey] = escapeAttribute(attrGroup[attrKey]);
			hasAttrs = true;
		}
	} else for (let key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
		const attr = this.isAttribute(key);
		if (attr) {
			attrValues[attr] = escapeAttribute(obj[key]);
			hasAttrs = true;
		}
	}
	return hasAttrs ? attrValues : null;
};
Builder.prototype.buildRawContent = function(obj) {
	if (typeof obj === "string") return obj;
	if (typeof obj !== "object" || obj === null) return String(obj);
	if (obj[this.options.textNodeName] !== void 0) return obj[this.options.textNodeName];
	let content = "";
	for (let key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
		if (this.isAttribute(key)) continue;
		if (this.options.attributesGroupName && key === this.options.attributesGroupName) continue;
		const value = obj[key];
		if (key === this.options.textNodeName) content += value;
		else if (Array.isArray(value)) {
			for (let item of value) if (typeof item === "string" || typeof item === "number") content += `<${key}>${item}</${key}>`;
			else if (typeof item === "object" && item !== null) {
				const nestedContent = this.buildRawContent(item);
				const nestedAttrs = this.buildAttributesForStopNode(item);
				if (nestedContent === "") content += `<${key}${nestedAttrs}/>`;
				else content += `<${key}${nestedAttrs}>${nestedContent}</${key}>`;
			}
		} else if (typeof value === "object" && value !== null) {
			const nestedContent = this.buildRawContent(value);
			const nestedAttrs = this.buildAttributesForStopNode(value);
			if (nestedContent === "") content += `<${key}${nestedAttrs}/>`;
			else content += `<${key}${nestedAttrs}>${nestedContent}</${key}>`;
		} else content += `<${key}>${value}</${key}>`;
	}
	return content;
};
Builder.prototype.buildAttributesForStopNode = function(obj) {
	if (!obj || typeof obj !== "object") return "";
	let attrStr = "";
	if (this.options.attributesGroupName && obj[this.options.attributesGroupName]) {
		const attrGroup = obj[this.options.attributesGroupName];
		for (let attrKey in attrGroup) {
			if (!Object.prototype.hasOwnProperty.call(attrGroup, attrKey)) continue;
			const cleanKey = attrKey.startsWith(this.options.attributeNamePrefix) ? attrKey.substring(this.options.attributeNamePrefix.length) : attrKey;
			const val = attrGroup[attrKey];
			if (val === true && this.options.suppressBooleanAttributes) attrStr += " " + cleanKey;
			else attrStr += " " + cleanKey + "=\"" + escapeAttribute(val) + "\"";
		}
	} else for (let key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
		const attr = this.isAttribute(key);
		if (attr) {
			const val = obj[key];
			if (val === true && this.options.suppressBooleanAttributes) attrStr += " " + attr;
			else attrStr += " " + attr + "=\"" + escapeAttribute(val) + "\"";
		}
	}
	return attrStr;
};
Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
	if (val === "") {
		if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
		else return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
	} else if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
	else {
		let tagEndExp = "</" + key + this.tagEndChar;
		let piClosingChar = "";
		if (key[0] === "?") {
			piClosingChar = "?";
			tagEndExp = "";
		}
		if ((attrStr || attrStr === "") && val.indexOf("<") === -1) return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
		else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) return this.indentate(level) + `<!--${safeComment(val)}-->` + this.newLine;
		else return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
	}
};
Builder.prototype.closeTag = function(key) {
	let closeTag = "";
	if (this.options.unpairedTags.indexOf(key) !== -1) {
		if (!this.options.suppressUnpairedNode) closeTag = "/";
	} else if (this.options.suppressEmptyNode) closeTag = "/";
	else closeTag = `></${key}`;
	return closeTag;
};
Builder.prototype.checkStopNode = function(matcher) {
	if (!this.stopNodeExpressions || this.stopNodeExpressions.length === 0) return false;
	for (let i = 0; i < this.stopNodeExpressions.length; i++) if (matcher.matches(this.stopNodeExpressions[i])) return true;
	return false;
};
Builder.prototype.buildTextValNode = function(val, key, attrStr, level, matcher) {
	if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
		const safeVal = safeCdata(val);
		return this.indentate(level) + `<![CDATA[${safeVal}]]>` + this.newLine;
	} else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
		const safeVal = safeComment(val);
		return this.indentate(level) + `<!--${safeVal}-->` + this.newLine;
	} else if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
	else {
		let textValue = this.options.tagValueProcessor(key, val);
		textValue = this.replaceEntitiesValue(textValue);
		textValue = valToStr(textValue);
		if (textValue === "") return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
		else return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
	}
};
Builder.prototype.replaceEntitiesValue = function(textValue) {
	if (textValue && textValue.length > 0 && this.options.processEntities) for (let i = 0; i < this.options.entities.length; i++) {
		const entity = this.options.entities[i];
		textValue = textValue.replace(entity.regex, entity.val);
	}
	return textValue;
};
function indentate(level) {
	return this.options.indentBy.repeat(level);
}
function isAttribute(name) {
	if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) return name.substr(this.attrPrefixLen);
	else return false;
}
//#endregion
//#region ../node_modules/fast-xml-parser/src/util.js
var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
"" + nameStartChar + nameChar;
var regexName = /* @__PURE__ */ new RegExp("^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
function getAllMatches(string, regex) {
	const matches = [];
	let match = regex.exec(string);
	while (match) {
		const allmatches = [];
		allmatches.startIndex = regex.lastIndex - match[0].length;
		const len = match.length;
		for (let index = 0; index < len; index++) allmatches.push(match[index]);
		matches.push(allmatches);
		match = regex.exec(string);
	}
	return matches;
}
var isName = function(string) {
	const match = regexName.exec(string);
	return !(match === null || typeof match === "undefined");
};
function isExist(v) {
	return typeof v !== "undefined";
}
/**
* Dangerous property names that could lead to prototype pollution or security issues
*/
var DANGEROUS_PROPERTY_NAMES = [
	"hasOwnProperty",
	"toString",
	"valueOf",
	"__defineGetter__",
	"__defineSetter__",
	"__lookupGetter__",
	"__lookupSetter__"
];
var criticalProperties = [
	"__proto__",
	"constructor",
	"prototype"
];
//#endregion
//#region ../node_modules/fast-xml-parser/src/validator.js
var defaultOptions$1 = {
	allowBooleanAttributes: false,
	unpairedTags: []
};
function validate(xmlData, options) {
	options = Object.assign({}, defaultOptions$1, options);
	const tags = [];
	let tagFound = false;
	let reachedRoot = false;
	if (xmlData[0] === "﻿") xmlData = xmlData.substr(1);
	for (let i = 0; i < xmlData.length; i++) if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
		i += 2;
		i = readPI(xmlData, i);
		if (i.err) return i;
	} else if (xmlData[i] === "<") {
		let tagStartPos = i;
		i++;
		if (xmlData[i] === "!") {
			i = readCommentAndCDATA(xmlData, i);
			continue;
		} else {
			let closingTag = false;
			if (xmlData[i] === "/") {
				closingTag = true;
				i++;
			}
			let tagName = "";
			for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) tagName += xmlData[i];
			tagName = tagName.trim();
			if (tagName[tagName.length - 1] === "/") {
				tagName = tagName.substring(0, tagName.length - 1);
				i--;
			}
			if (!validateTagName(tagName)) {
				let msg;
				if (tagName.trim().length === 0) msg = "Invalid space after '<'.";
				else msg = "Tag '" + tagName + "' is an invalid name.";
				return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
			}
			const result = readAttributeStr(xmlData, i);
			if (result === false) return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
			let attrStr = result.value;
			i = result.index;
			if (attrStr[attrStr.length - 1] === "/") {
				const attrStrStart = i - attrStr.length;
				attrStr = attrStr.substring(0, attrStr.length - 1);
				const isValid = validateAttributeString(attrStr, options);
				if (isValid === true) tagFound = true;
				else return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
			} else if (closingTag) {
				if (!result.tagClosed) return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
				else if (attrStr.trim().length > 0) return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
				else if (tags.length === 0) return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
				else {
					const otg = tags.pop();
					if (tagName !== otg.tagName) {
						let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
						return getErrorObject("InvalidTag", "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.", getLineNumberForPosition(xmlData, tagStartPos));
					}
					if (tags.length == 0) reachedRoot = true;
				}
			} else {
				const isValid = validateAttributeString(attrStr, options);
				if (isValid !== true) return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
				if (reachedRoot === true) return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
				else if (options.unpairedTags.indexOf(tagName) !== -1) {} else tags.push({
					tagName,
					tagStartPos
				});
				tagFound = true;
			}
			for (i++; i < xmlData.length; i++) if (xmlData[i] === "<") {
				if (xmlData[i + 1] === "!") {
					i++;
					i = readCommentAndCDATA(xmlData, i);
					continue;
				} else if (xmlData[i + 1] === "?") {
					i = readPI(xmlData, ++i);
					if (i.err) return i;
				} else break;
			} else if (xmlData[i] === "&") {
				const afterAmp = validateAmpersand(xmlData, i);
				if (afterAmp == -1) return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
				i = afterAmp;
			} else if (reachedRoot === true && !isWhiteSpace(xmlData[i])) return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
			if (xmlData[i] === "<") i--;
		}
	} else {
		if (isWhiteSpace(xmlData[i])) continue;
		return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
	}
	if (!tagFound) return getErrorObject("InvalidXml", "Start tag expected.", 1);
	else if (tags.length == 1) return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
	else if (tags.length > 0) return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
		line: 1,
		col: 1
	});
	return true;
}
function isWhiteSpace(char) {
	return char === " " || char === "	" || char === "\n" || char === "\r";
}
/**
* Read Processing insstructions and skip
* @param {*} xmlData
* @param {*} i
*/
function readPI(xmlData, i) {
	const start = i;
	for (; i < xmlData.length; i++) if (xmlData[i] == "?" || xmlData[i] == " ") {
		const tagname = xmlData.substr(start, i - start);
		if (i > 5 && tagname === "xml") return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
		else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
			i++;
			break;
		} else continue;
	}
	return i;
}
function readCommentAndCDATA(xmlData, i) {
	if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
		for (i += 3; i < xmlData.length; i++) if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
			i += 2;
			break;
		}
	} else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
		let angleBracketsCount = 1;
		for (i += 8; i < xmlData.length; i++) if (xmlData[i] === "<") angleBracketsCount++;
		else if (xmlData[i] === ">") {
			angleBracketsCount--;
			if (angleBracketsCount === 0) break;
		}
	} else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
		for (i += 8; i < xmlData.length; i++) if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
			i += 2;
			break;
		}
	}
	return i;
}
var doubleQuote = "\"";
var singleQuote = "'";
/**
* Keep reading xmlData until '<' is found outside the attribute value.
* @param {string} xmlData
* @param {number} i
*/
function readAttributeStr(xmlData, i) {
	let attrStr = "";
	let startChar = "";
	let tagClosed = false;
	for (; i < xmlData.length; i++) {
		if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
			if (startChar === "") startChar = xmlData[i];
			else if (startChar !== xmlData[i]) {} else startChar = "";
		} else if (xmlData[i] === ">") {
			if (startChar === "") {
				tagClosed = true;
				break;
			}
		}
		attrStr += xmlData[i];
	}
	if (startChar !== "") return false;
	return {
		value: attrStr,
		index: i,
		tagClosed
	};
}
/**
* Select all the attributes whether valid or invalid.
*/
var validAttrStrRegxp = /* @__PURE__ */ new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");
function validateAttributeString(attrStr, options) {
	const matches = getAllMatches(attrStr, validAttrStrRegxp);
	const attrNames = {};
	for (let i = 0; i < matches.length; i++) {
		if (matches[i][1].length === 0) return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
		else if (matches[i][3] !== void 0 && matches[i][4] === void 0) return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
		else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
		const attrName = matches[i][2];
		if (!validateAttrName(attrName)) return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
		if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) attrNames[attrName] = 1;
		else return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
	}
	return true;
}
function validateNumberAmpersand(xmlData, i) {
	let re = /\d/;
	if (xmlData[i] === "x") {
		i++;
		re = /[\da-fA-F]/;
	}
	for (; i < xmlData.length; i++) {
		if (xmlData[i] === ";") return i;
		if (!xmlData[i].match(re)) break;
	}
	return -1;
}
function validateAmpersand(xmlData, i) {
	i++;
	if (xmlData[i] === ";") return -1;
	if (xmlData[i] === "#") {
		i++;
		return validateNumberAmpersand(xmlData, i);
	}
	let count = 0;
	for (; i < xmlData.length; i++, count++) {
		if (xmlData[i].match(/\w/) && count < 20) continue;
		if (xmlData[i] === ";") break;
		return -1;
	}
	return i;
}
function getErrorObject(code, message, lineNumber) {
	return { err: {
		code,
		msg: message,
		line: lineNumber.line || lineNumber,
		col: lineNumber.col
	} };
}
function validateAttrName(attrName) {
	return isName(attrName);
}
function validateTagName(tagname) {
	return isName(tagname);
}
function getLineNumberForPosition(xmlData, index) {
	const lines = xmlData.substring(0, index).split(/\r?\n/);
	return {
		line: lines.length,
		col: lines[lines.length - 1].length + 1
	};
}
function getPositionFromMatch(match) {
	return match.startIndex + match[1].length;
}
//#endregion
//#region ../node_modules/@nodable/entities/src/entities.js
/**
* Currency Symbols
* @type {Record<string, string>}
*/
var CURRENCY = {
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
var XML = {
	amp: "&",
	apos: "'",
	gt: ">",
	lt: "<",
	quot: "\""
};
var COMMON_HTML = {
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
//#endregion
//#region ../node_modules/@nodable/entities/src/EntityDecoder.js
/**
* Action constants for `onExternalEntity` and `onInputEntity` hooks.
*
* Use these instead of raw strings to avoid typos:
*
* @example
* import EntityDecoder, { ENTITY_ACTION } from './EntityDecoder.js';
* const dec = new EntityDecoder({
*   onInputEntity: (name, value) => ENTITY_ACTION.BLOCK,
* });
*/
var ENTITY_ACTION = Object.freeze({
	/** Resolve and expand the entity normally. */
	ALLOW: "allow",
	/** Silently skip this entity — it will not be registered. */
	BLOCK: "block",
	/** Throw an error, aborting entity registration entirely. */
	THROW: "throw"
});
var SPECIAL_CHARS = /* @__PURE__ */ new Set("!?\\\\/[]$%{}^&*()<>|+");
/**
* Validate that an entity name contains no dangerous characters.
* @param {string} name
* @returns {string} the name, unchanged
* @throws {Error} on invalid characters
*/
function validateEntityName$1(name) {
	if (name[0] === "#") throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${name}"`);
	for (const ch of name) if (SPECIAL_CHARS.has(ch)) throw new Error(`[EntityReplacer] Invalid character '${ch}' in entity name: "${name}"`);
	return name;
}
/**
* Merge one or more entity maps into a flat name→string map.
* Accepts either:
*   - plain string values:             { amp: '&' }
*   - legacy {regex,val} / {regx,val}: { lt: { regex: /.../, val: '<' } }
*
* Values containing '&' are skipped (recursive expansion risk).
*
* @param {...object} maps
* @returns {Record<string, string>}
*/
function mergeEntityMaps(...maps) {
	const out = Object.create(null);
	for (const map of maps) {
		if (!map) continue;
		for (const key of Object.keys(map)) {
			const raw = map[key];
			if (typeof raw === "string") out[key] = raw;
			else if (raw && typeof raw === "object" && raw.val !== void 0) {
				const val = raw.val;
				if (typeof val === "string") out[key] = val;
			}
		}
	}
	return out;
}
var LIMIT_TIER_EXTERNAL = "external";
var LIMIT_TIER_BASE = "base";
var LIMIT_TIER_ALL = "all";
/**
* Resolve `applyLimitsTo` option into a normalised Set of tier strings.
* Accepted values: 'external' | 'base' | 'all' | string[]
* Default: 'external' (only untrusted injected entities are counted).
* @param {string|string[]|undefined} raw
* @returns {Set<string>}
*/
function parseLimitTiers(raw) {
	if (!raw || raw === LIMIT_TIER_EXTERNAL) return /* @__PURE__ */ new Set([LIMIT_TIER_EXTERNAL]);
	if (raw === LIMIT_TIER_ALL) return /* @__PURE__ */ new Set([LIMIT_TIER_ALL]);
	if (raw === LIMIT_TIER_BASE) return /* @__PURE__ */ new Set([LIMIT_TIER_BASE]);
	if (Array.isArray(raw)) return new Set(raw);
	return /* @__PURE__ */ new Set([LIMIT_TIER_EXTERNAL]);
}
var NCR_LEVEL = Object.freeze({
	allow: 0,
	leave: 1,
	remove: 2,
	throw: 3
});
var XML10_ALLOWED_C0 = /* @__PURE__ */ new Set([
	9,
	10,
	13
]);
/**
* Parse the `ncr` constructor option into flat, hot-path-friendly fields.
* @param {object|undefined} ncr
* @returns {{ xmlVersion: number, onLevel: number, nullLevel: number }}
*/
function parseNCRConfig(ncr) {
	if (!ncr) return {
		xmlVersion: 1,
		onLevel: NCR_LEVEL.allow,
		nullLevel: NCR_LEVEL.remove
	};
	const xmlVersion = ncr.xmlVersion === 1.1 ? 1.1 : 1;
	const onLevel = NCR_LEVEL[ncr.onNCR] ?? NCR_LEVEL.allow;
	const nullLevel = NCR_LEVEL[ncr.nullNCR] ?? NCR_LEVEL.remove;
	return {
		xmlVersion,
		onLevel,
		nullLevel: Math.max(nullLevel, NCR_LEVEL.remove)
	};
}
/**
* Single-pass, zero-regex entity replacer for XML/HTML content.
*
* Algorithm: scan the string once for '&', read to ';', resolve via map
* or direct codepoint conversion, build output chunks, join once at the end.
*
* Entity lookup priority (highest → lowest):
*   1. input / runtime  (DOCTYPE entities for current document)
*   2. persistent external (survive across documents)
*   3. base named map   (DEFAULT_XML_ENTITIES + user-supplied namedEntities)
*
* Both input and external resolve as the 'external' tier for limit purposes.
* Base map entities resolve as the 'base' tier.
*
* Numeric / hex references (&#NNN; / &#xHH;) are resolved directly via
* String.fromCodePoint() — no map needed. They count as 'base' tier.
*
* @example
* const replacer = new EntityReplacer({ namedEntities: COMMON_HTML });
* replacer.setExternalEntities({ brand: 'Acme' });
*
* const instance = replacer.reset();
* instance.addInputEntities({ version: '1.0' });
* instance.encode('&brand; v&version; &lt;'); // 'Acme v1.0 <'
*/
var EntityDecoder = class {
	/**
	* @param {object} [options]
	* @param {object|null}  [options.namedEntities]        — extra named entities merged into base map
	* @param {object}  [options.limit]                 — security limits
	* @param {number}       [options.limit.maxTotalExpansions=0]  — 0 = unlimited
	* @param {number}       [options.limit.maxExpandedLength=0]   — 0 = unlimited
	* @param {'external'|'base'|'all'|string[]} [options.limit.applyLimitsTo='external']
	*   Which entity tiers count against the security limits:
	*   - 'external' (default) — only input/runtime + persistent external entities
	*   - 'base'               — only DEFAULT_XML_ENTITIES + namedEntities
	*   - 'all'                — every entity regardless of tier
	*   - string[]             — explicit combination, e.g. ['external', 'base']
	* @param {((resolved: string, original: string) => string)|null} [options.postCheck=null]
	* @param {string[]} [options.remove=[]] — entity names (e.g. ['nbsp', '#13']) to delete (replace with empty string)
	* @param {string[]} [options.leave=[]]  — entity names to keep as literal (unchanged in output)
	* @param {object}   [options.ncr]       — Numeric Character Reference controls
	* @param {1.0|1.1}  [options.ncr.xmlVersion=1.0]
	*   XML version governing which codepoint ranges are restricted:
	*   - 1.0 — C0 controls U+0001–U+001F (except U+0009/000A/000D) are prohibited
	*   - 1.1 — C0 controls are allowed when written as NCRs; C1 (U+007F–U+009F) decoded as-is
	* @param {'allow'|'leave'|'remove'|'throw'} [options.ncr.onNCR='allow']
	*   Base action for numeric references. Severity order: allow < leave < remove < throw.
	*   For codepoint ranges that carry a minimum level (surrogates → remove, XML 1.0 C0 → remove),
	*   the effective action is max(onNCR, rangeMinimum).
	* @param {'remove'|'throw'} [options.ncr.nullNCR='remove']
	*   Action for U+0000 (null). 'allow' and 'leave' are clamped to 'remove' since null is never safe.
	* @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} [options.onExternalEntity=null]
	*   Hook called when an external entity is registered via `setExternalEntities()` or
	*   `addExternalEntity()`. Return `ENTITY_ACTION.ALLOW` to accept the entity,
	*   `ENTITY_ACTION.BLOCK` to silently skip it, or `ENTITY_ACTION.THROW` to abort with an error.
	* @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} [options.onInputEntity=null]
	*   Hook called when an input entity is registered via `addInputEntities()`. Return
	*   `ENTITY_ACTION.ALLOW` to accept, `ENTITY_ACTION.BLOCK` to silently skip, or
	*   `ENTITY_ACTION.THROW` to abort with an error.
	*/
	constructor(options = {}) {
		this._limit = options.limit || {};
		this._maxTotalExpansions = this._limit.maxTotalExpansions || 0;
		this._maxExpandedLength = this._limit.maxExpandedLength || 0;
		this._postCheck = typeof options.postCheck === "function" ? options.postCheck : (r) => r;
		this._limitTiers = parseLimitTiers(this._limit.applyLimitsTo ?? LIMIT_TIER_EXTERNAL);
		this._numericAllowed = options.numericAllowed ?? true;
		this._baseMap = mergeEntityMaps(XML, options.namedEntities || null);
		/** @type {Record<string, string>} */
		this._externalMap = Object.create(null);
		/** @type {Record<string, string>} */
		this._inputMap = Object.create(null);
		this._totalExpansions = 0;
		this._expandedLength = 0;
		/** @type {Set<string>} */
		this._removeSet = new Set(options.remove && Array.isArray(options.remove) ? options.remove : []);
		/** @type {Set<string>} */
		this._leaveSet = new Set(options.leave && Array.isArray(options.leave) ? options.leave : []);
		const ncrCfg = parseNCRConfig(options.ncr);
		this._ncrXmlVersion = ncrCfg.xmlVersion;
		this._ncrOnLevel = ncrCfg.onLevel;
		this._ncrNullLevel = ncrCfg.nullLevel;
		/** @type {((name: string, value: string) => 'allow'|'block'|'throw')|null} */
		this._onExternalEntity = typeof options.onExternalEntity === "function" ? options.onExternalEntity : null;
		/** @type {((name: string, value: string) => 'allow'|'block'|'throw')|null} */
		this._onInputEntity = typeof options.onInputEntity === "function" ? options.onInputEntity : null;
	}
	/**
	* Invoke a registration hook for a single entity name/value pair.
	* Returns true when the entity should be accepted, false when it should be
	* silently skipped (BLOCK), and throws when the hook returns THROW.
	*
	* @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} hook
	* @param {string} name
	* @param {string} value
	* @param {string} context  — used in error messages ('external' | 'input')
	* @returns {boolean}  true = accept, false = skip
	*/
	_applyRegistrationHook(hook, name, value, context) {
		if (!hook) return true;
		const action = hook(name, value);
		if (action === ENTITY_ACTION.BLOCK) return false;
		if (action === ENTITY_ACTION.THROW) throw new Error(`[EntityDecoder] Registration of ${context} entity "&${name};" was rejected by hook`);
		return true;
	}
	/**
	* Replace the full set of persistent external entities.
	* All keys are validated — throws on invalid characters.
	* If `onExternalEntity` is set, it is called once per entry; entries that
	* return `ENTITY_ACTION.BLOCK` are silently omitted, `ENTITY_ACTION.THROW`
	* aborts the whole call.
	* @param {Record<string, string | { regex?: RegExp, val: string }>} map
	*/
	setExternalEntities(map) {
		if (map) for (const key of Object.keys(map)) validateEntityName$1(key);
		if (!this._onExternalEntity) {
			this._externalMap = mergeEntityMaps(map);
			return;
		}
		const flat = mergeEntityMaps(map);
		const filtered = Object.create(null);
		for (const [name, value] of Object.entries(flat)) if (this._applyRegistrationHook(this._onExternalEntity, name, value, "external")) filtered[name] = value;
		this._externalMap = filtered;
	}
	/**
	* Add a single persistent external entity.
	* If `onExternalEntity` is set it is called before the entity is stored;
	* `ENTITY_ACTION.BLOCK` silently skips storage, `ENTITY_ACTION.THROW` raises.
	* @param {string} key
	* @param {string} value
	*/
	addExternalEntity(key, value) {
		validateEntityName$1(key);
		if (typeof value === "string" && value.indexOf("&") === -1) {
			if (this._applyRegistrationHook(this._onExternalEntity, key, value, "external")) this._externalMap[key] = value;
		}
	}
	/**
	* Inject DOCTYPE entities for the current document.
	* Also resets per-document expansion counters.
	* If `onInputEntity` is set it is called once per entry; entries returning
	* `ENTITY_ACTION.BLOCK` are silently omitted, `ENTITY_ACTION.THROW` aborts.
	* @param {Record<string, string | { regx?: RegExp, regex?: RegExp, val: string }>} map
	*/
	addInputEntities(map) {
		this._totalExpansions = 0;
		this._expandedLength = 0;
		if (!this._onInputEntity) {
			this._inputMap = mergeEntityMaps(map);
			return;
		}
		const flat = mergeEntityMaps(map);
		const filtered = Object.create(null);
		for (const [name, value] of Object.entries(flat)) if (this._applyRegistrationHook(this._onInputEntity, name, value, "input")) filtered[name] = value;
		this._inputMap = filtered;
	}
	/**
	* Wipe input/runtime entities and reset counters.
	* Call this before processing each new document.
	* @returns {this}
	*/
	reset() {
		this._inputMap = Object.create(null);
		this._totalExpansions = 0;
		this._expandedLength = 0;
		return this;
	}
	/**
	* Update the XML version used for NCR classification.
	* Call this as soon as the document's `<?xml version="...">` declaration is parsed.
	* @param {1.0|1.1|number} version
	*/
	setXmlVersion(version) {
		this._ncrXmlVersion = version === 1.1 ? 1.1 : 1;
	}
	/**
	* Replace all entity references in `str` in a single pass.
	*
	* @param {string} str
	* @returns {string}
	*/
	decode(str) {
		if (typeof str !== "string" || str.length === 0) return str;
		if (str.indexOf("&") === -1) return str;
		const original = str;
		const chunks = [];
		const len = str.length;
		let last = 0;
		let i = 0;
		const limitExpansions = this._maxTotalExpansions > 0;
		const limitLength = this._maxExpandedLength > 0;
		const checkLimits = limitExpansions || limitLength;
		while (i < len) {
			if (str.charCodeAt(i) !== 38) {
				i++;
				continue;
			}
			let j = i + 1;
			while (j < len && str.charCodeAt(j) !== 59 && j - i <= 32) j++;
			if (j >= len || str.charCodeAt(j) !== 59) {
				i++;
				continue;
			}
			const token = str.slice(i + 1, j);
			if (token.length === 0) {
				i++;
				continue;
			}
			let replacement;
			let tier;
			if (this._removeSet.has(token)) {
				replacement = "";
				if (tier === void 0) tier = LIMIT_TIER_EXTERNAL;
			} else if (this._leaveSet.has(token)) {
				i++;
				continue;
			} else if (token.charCodeAt(0) === 35) {
				const ncrResult = this._resolveNCR(token);
				if (ncrResult === void 0) {
					i++;
					continue;
				}
				replacement = ncrResult;
				tier = LIMIT_TIER_BASE;
			} else {
				const resolved = this._resolveName(token);
				replacement = resolved?.value;
				tier = resolved?.tier;
			}
			if (replacement === void 0) {
				i++;
				continue;
			}
			if (i > last) chunks.push(str.slice(last, i));
			chunks.push(replacement);
			last = j + 1;
			i = last;
			if (checkLimits && this._tierCounts(tier)) {
				if (limitExpansions) {
					this._totalExpansions++;
					if (this._totalExpansions > this._maxTotalExpansions) throw new Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);
				}
				if (limitLength) {
					const delta = replacement.length - (token.length + 2);
					if (delta > 0) {
						this._expandedLength += delta;
						if (this._expandedLength > this._maxExpandedLength) throw new Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`);
					}
				}
			}
		}
		if (last < len) chunks.push(str.slice(last));
		const result = chunks.length === 0 ? str : chunks.join("");
		return this._postCheck(result, original);
	}
	/**
	* Returns true if a resolved entity of the given tier should count
	* against the expansion/length limits.
	* @param {string} tier  — LIMIT_TIER_EXTERNAL | LIMIT_TIER_BASE
	* @returns {boolean}
	*/
	_tierCounts(tier) {
		if (this._limitTiers.has(LIMIT_TIER_ALL)) return true;
		return this._limitTiers.has(tier);
	}
	/**
	* Resolve a named entity token (without & and ;).
	* Priority: inputMap > externalMap > baseMap
	* Returns the resolved value tagged with its limit tier.
	*
	* @param {string} name
	* @returns {{ value: string, tier: string }|undefined}
	*/
	_resolveName(name) {
		if (name in this._inputMap) return {
			value: this._inputMap[name],
			tier: LIMIT_TIER_EXTERNAL
		};
		if (name in this._externalMap) return {
			value: this._externalMap[name],
			tier: LIMIT_TIER_EXTERNAL
		};
		if (name in this._baseMap) return {
			value: this._baseMap[name],
			tier: LIMIT_TIER_BASE
		};
	}
	/**
	* Classify a codepoint and return the minimum action level that must be applied.
	* Returns -1 when no minimum is imposed (normal allow path).
	*
	* Ranges checked (in priority order):
	*   1. U+0000            — null, governed by nullNCR (always ≥ remove)
	*   2. U+D800–U+DFFF     — surrogates, always prohibited (min: remove)
	*   3. U+0001–U+001F \ {0x09,0x0A,0x0D}  — XML 1.0 restricted C0 (min: remove)
	*      (skipped in XML 1.1 — C0 controls are allowed when written as NCRs)
	*
	* @param {number} cp  — codepoint
	* @returns {number}   — minimum NCR_LEVEL value, or -1 for no restriction
	*/
	_classifyNCR(cp) {
		if (cp === 0) return this._ncrNullLevel;
		if (cp >= 55296 && cp <= 57343) return NCR_LEVEL.remove;
		if (this._ncrXmlVersion === 1) {
			if (cp >= 1 && cp <= 31 && !XML10_ALLOWED_C0.has(cp)) return NCR_LEVEL.remove;
		}
		return -1;
	}
	/**
	* Execute a resolved NCR action.
	*
	* @param {number} action   — NCR_LEVEL value
	* @param {string} token    — raw token (e.g. '#38') for error messages
	* @param {number} cp       — codepoint, used only for error messages
	* @returns {string|undefined}
	*   - decoded character string  → 'allow'
	*   - ''                        → 'remove'
	*   - undefined                 → 'leave' (caller must skip past '&' only)
	*   - throws Error              → 'throw'
	*/
	_applyNCRAction(action, token, cp) {
		switch (action) {
			case NCR_LEVEL.allow: return String.fromCodePoint(cp);
			case NCR_LEVEL.remove: return "";
			case NCR_LEVEL.leave: return;
			case NCR_LEVEL.throw: throw new Error(`[EntityDecoder] Prohibited numeric character reference &${token}; (U+${cp.toString(16).toUpperCase().padStart(4, "0")})`);
			default: return String.fromCodePoint(cp);
		}
	}
	/**
	* Full NCR resolution pipeline for a numeric token.
	*
	* Steps:
	*   1. Parse the codepoint (decimal or hex).
	*   2. Validate the raw codepoint range (NaN, <0, >0x10FFFF).
	*   3. If numericAllowed is false and no minimum restriction applies → leave as-is.
	*   4. Classify the codepoint to find the minimum required action level.
	*   5. Resolve effective action = max(onNCR, minimum).
	*   6. Apply and return.
	*
	* @param {string} token  — e.g. '#38', '#x26', '#X26'
	* @returns {string|undefined}
	*   - string (incl. '')  — replacement ('' = remove)
	*   - undefined          — leave original &token; as-is
	*/
	_resolveNCR(token) {
		const second = token.charCodeAt(1);
		let cp;
		if (second === 120 || second === 88) cp = parseInt(token.slice(2), 16);
		else cp = parseInt(token.slice(1), 10);
		if (Number.isNaN(cp) || cp < 0 || cp > 1114111) return void 0;
		const minimum = this._classifyNCR(cp);
		if (!this._numericAllowed && minimum < NCR_LEVEL.remove) return void 0;
		const effective = minimum === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, minimum);
		return this._applyNCRAction(effective, token, cp);
	}
};
//#endregion
//#region ../node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var defaultOnDangerousProperty = (name) => {
	if (DANGEROUS_PROPERTY_NAMES.includes(name)) return "__" + name;
	return name;
};
var defaultOptions = {
	preserveOrder: false,
	attributeNamePrefix: "@_",
	attributesGroupName: false,
	textNodeName: "#text",
	ignoreAttributes: true,
	removeNSPrefix: false,
	allowBooleanAttributes: false,
	parseTagValue: true,
	parseAttributeValue: false,
	trimValues: true,
	cdataPropName: false,
	numberParseOptions: {
		hex: true,
		leadingZeros: true,
		eNotation: true,
		unicode: false
	},
	tagValueProcessor: function(tagName, val) {
		return val;
	},
	attributeValueProcessor: function(attrName, val) {
		return val;
	},
	stopNodes: [],
	alwaysCreateTextNode: false,
	isArray: () => false,
	commentPropName: false,
	unpairedTags: [],
	processEntities: true,
	htmlEntities: false,
	entityDecoder: null,
	ignoreDeclaration: false,
	ignorePiTags: false,
	transformTagName: false,
	transformAttributeName: false,
	updateTag: function(tagName, jPath, attrs) {
		return tagName;
	},
	captureMetaData: false,
	maxNestedTags: 100,
	strictReservedNames: true,
	jPath: true,
	onDangerousProperty: defaultOnDangerousProperty
};
/**
* Validates that a property name is safe to use
* @param {string} propertyName - The property name to validate
* @param {string} optionName - The option field name (for error message)
* @throws {Error} If property name is dangerous
*/
function validatePropertyName(propertyName, optionName) {
	if (typeof propertyName !== "string") return;
	const normalized = propertyName.toLowerCase();
	if (DANGEROUS_PROPERTY_NAMES.some((dangerous) => normalized === dangerous.toLowerCase())) throw new Error(`[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`);
	if (criticalProperties.some((dangerous) => normalized === dangerous.toLowerCase())) throw new Error(`[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`);
}
/**
* Normalizes processEntities option for backward compatibility
* @param {boolean|object} value 
* @returns {object} Always returns normalized object
*/
function normalizeProcessEntities(value, htmlEntities) {
	if (typeof value === "boolean") return {
		enabled: value,
		maxEntitySize: 1e4,
		maxExpansionDepth: 1e4,
		maxTotalExpansions: Infinity,
		maxExpandedLength: 1e5,
		maxEntityCount: 1e3,
		allowedTags: null,
		tagFilter: null,
		appliesTo: "all"
	};
	if (typeof value === "object" && value !== null) return {
		enabled: value.enabled !== false,
		maxEntitySize: Math.max(1, value.maxEntitySize ?? 1e4),
		maxExpansionDepth: Math.max(1, value.maxExpansionDepth ?? 1e4),
		maxTotalExpansions: Math.max(1, value.maxTotalExpansions ?? Infinity),
		maxExpandedLength: Math.max(1, value.maxExpandedLength ?? 1e5),
		maxEntityCount: Math.max(1, value.maxEntityCount ?? 1e3),
		allowedTags: value.allowedTags ?? null,
		tagFilter: value.tagFilter ?? null,
		appliesTo: value.appliesTo ?? "all"
	};
	return normalizeProcessEntities(true);
}
var buildOptions = function(options) {
	const built = Object.assign({}, defaultOptions, options);
	const propertyNameOptions = [
		{
			value: built.attributeNamePrefix,
			name: "attributeNamePrefix"
		},
		{
			value: built.attributesGroupName,
			name: "attributesGroupName"
		},
		{
			value: built.textNodeName,
			name: "textNodeName"
		},
		{
			value: built.cdataPropName,
			name: "cdataPropName"
		},
		{
			value: built.commentPropName,
			name: "commentPropName"
		}
	];
	for (const { value, name } of propertyNameOptions) if (value) validatePropertyName(value, name);
	if (built.onDangerousProperty === null) built.onDangerousProperty = defaultOnDangerousProperty;
	built.processEntities = normalizeProcessEntities(built.processEntities, built.htmlEntities);
	built.unpairedTagsSet = new Set(built.unpairedTags);
	if (built.stopNodes && Array.isArray(built.stopNodes)) built.stopNodes = built.stopNodes.map((node) => {
		if (typeof node === "string" && node.startsWith("*.")) return ".." + node.substring(2);
		return node;
	});
	return built;
};
//#endregion
//#region ../node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var METADATA_SYMBOL$1;
if (typeof Symbol !== "function") METADATA_SYMBOL$1 = "@@xmlMetadata";
else METADATA_SYMBOL$1 = Symbol("XML Node Metadata");
var XmlNode = class {
	constructor(tagname) {
		this.tagname = tagname;
		this.child = [];
		this[":@"] = Object.create(null);
	}
	add(key, val) {
		if (key === "__proto__") key = "#__proto__";
		this.child.push({ [key]: val });
	}
	addChild(node, startIndex) {
		if (node.tagname === "__proto__") node.tagname = "#__proto__";
		if (node[":@"] && Object.keys(node[":@"]).length > 0) this.child.push({
			[node.tagname]: node.child,
			[":@"]: node[":@"]
		});
		else this.child.push({ [node.tagname]: node.child });
		this.addStartIndex(startIndex);
	}
	addStartIndex(startIndex) {
		if (startIndex !== void 0) this.child[this.child.length - 1][METADATA_SYMBOL$1] = { startIndex };
	}
	addEndIndex(endIndex) {
		const lastChild = this.child[this.child.length - 1];
		if (lastChild !== void 0 && lastChild[METADATA_SYMBOL$1] !== void 0 && lastChild[METADATA_SYMBOL$1].endIndex === void 0) lastChild[METADATA_SYMBOL$1].endIndex = endIndex;
	}
	/** symbol used for metadata */
	static getMetaDataSymbol() {
		return METADATA_SYMBOL$1;
	}
};
//#endregion
//#region ../node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var DocTypeReader = class {
	constructor(options, xmlVersion) {
		this.suppressValidationErr = !options;
		this.options = options;
		this.xmlVersion = xmlVersion || 1;
	}
	setXmlVersion(xmlVersion = 1) {
		this.xmlVersion = xmlVersion;
	}
	readDocType(xmlData, i) {
		const entities = Object.create(null);
		let entityCount = 0;
		if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
			i = i + 9;
			let angleBracketsCount = 1;
			let hasBody = false, comment = false;
			let quoteChar = null;
			let exp = "";
			for (; i < xmlData.length; i++) {
				if (quoteChar !== null) {
					if (xmlData[i] === quoteChar) quoteChar = null;
					exp += xmlData[i];
					continue;
				}
				if (!hasBody && !comment && (xmlData[i] === "\"" || xmlData[i] === "'")) {
					quoteChar = xmlData[i];
					exp += xmlData[i];
					continue;
				}
				if (xmlData[i] === "<" && !comment) {
					if (hasBody && hasSeq(xmlData, "!ENTITY", i)) {
						i += 7;
						let entityName, val;
						[entityName, val, i] = this.readEntityExp(xmlData, i + 1, this.suppressValidationErr);
						if (val.indexOf("&") === -1) {
							if (this.options.enabled !== false && this.options.maxEntityCount != null && entityCount >= this.options.maxEntityCount) throw new Error(`Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
							entities[entityName] = val;
							entityCount++;
						}
					} else if (hasBody && hasSeq(xmlData, "!ELEMENT", i)) {
						i += 8;
						const { index } = this.readElementExp(xmlData, i + 1);
						i = index;
					} else if (hasBody && hasSeq(xmlData, "!ATTLIST", i)) i += 8;
					else if (hasBody && hasSeq(xmlData, "!NOTATION", i)) {
						i += 9;
						const { index } = this.readNotationExp(xmlData, i + 1, this.suppressValidationErr);
						i = index;
					} else if (hasSeq(xmlData, "!--", i)) comment = true;
					else throw new Error(`Invalid DOCTYPE`);
					angleBracketsCount++;
					exp = "";
				} else if (xmlData[i] === ">") {
					if (comment) {
						if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
							comment = false;
							angleBracketsCount--;
						}
					} else angleBracketsCount--;
					if (angleBracketsCount === 0) break;
				} else if (xmlData[i] === "[") hasBody = true;
				else exp += xmlData[i];
			}
			if (quoteChar !== null || angleBracketsCount !== 0) throw new Error(`Unclosed DOCTYPE`);
		} else throw new Error(`Invalid Tag instead of DOCTYPE`);
		return {
			entities,
			i
		};
	}
	readEntityExp(xmlData, i) {
		i = skipWhitespace(xmlData, i);
		const startIndex = i;
		while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== "\"" && xmlData[i] !== "'") i++;
		let entityName = xmlData.substring(startIndex, i);
		validateEntityName(entityName, { xmlVersion: this.xmlVersion });
		i = skipWhitespace(xmlData, i);
		if (!this.suppressValidationErr) {
			if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") throw new Error("External entities are not supported");
			else if (xmlData[i] === "%") throw new Error("Parameter entities are not supported");
		}
		let entityValue = "";
		[i, entityValue] = this.readIdentifierVal(xmlData, i, "entity");
		if (this.options.enabled !== false && this.options.maxEntitySize != null && entityValue.length > this.options.maxEntitySize) throw new Error(`Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
		i--;
		return [
			entityName,
			entityValue,
			i
		];
	}
	readNotationExp(xmlData, i) {
		i = skipWhitespace(xmlData, i);
		const startIndex = i;
		while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
		let notationName = xmlData.substring(startIndex, i);
		!this.suppressValidationErr && validateEntityName(notationName, { xmlVersion: this.xmlVersion });
		i = skipWhitespace(xmlData, i);
		const identifierType = xmlData.substring(i, i + 6).toUpperCase();
		if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
		i += identifierType.length;
		i = skipWhitespace(xmlData, i);
		let publicIdentifier = null;
		let systemIdentifier = null;
		if (identifierType === "PUBLIC") {
			[i, publicIdentifier] = this.readIdentifierVal(xmlData, i, "publicIdentifier");
			i = skipWhitespace(xmlData, i);
			if (xmlData[i] === "\"" || xmlData[i] === "'") [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
		} else if (identifierType === "SYSTEM") {
			[i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
			if (!this.suppressValidationErr && !systemIdentifier) throw new Error("Missing mandatory system identifier for SYSTEM notation");
		}
		return {
			notationName,
			publicIdentifier,
			systemIdentifier,
			index: --i
		};
	}
	readIdentifierVal(xmlData, i, type) {
		let identifierVal = "";
		const startChar = xmlData[i];
		if (startChar !== "\"" && startChar !== "'") throw new Error(`Expected quoted string, found "${startChar}"`);
		i++;
		const startIndex = i;
		while (i < xmlData.length && xmlData[i] !== startChar) i++;
		identifierVal = xmlData.substring(startIndex, i);
		if (xmlData[i] !== startChar) throw new Error(`Unterminated ${type} value`);
		i++;
		return [i, identifierVal];
	}
	readElementExp(xmlData, i) {
		i = skipWhitespace(xmlData, i);
		const startIndex = i;
		while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
		let elementName = xmlData.substring(startIndex, i);
		if (!this.suppressValidationErr && !qName(elementName, { xmlVersion: this.xmlVersion })) throw new Error(`Invalid element name: "${elementName}"`);
		i = skipWhitespace(xmlData, i);
		let contentModel = "";
		if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) i += 4;
		else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) i += 2;
		else if (xmlData[i] === "(") {
			i++;
			const startIndex = i;
			while (i < xmlData.length && xmlData[i] !== ")") i++;
			contentModel = xmlData.substring(startIndex, i);
			if (xmlData[i] !== ")") throw new Error("Unterminated content model");
		} else if (!this.suppressValidationErr) throw new Error(`Invalid Element Expression, found "${xmlData[i]}"`);
		return {
			elementName,
			contentModel: contentModel.trim(),
			index: i
		};
	}
	readAttlistExp(xmlData, i) {
		i = skipWhitespace(xmlData, i);
		let startIndex = i;
		while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
		let elementName = xmlData.substring(startIndex, i);
		validateEntityName(elementName, { xmlVersion: this.xmlVersion });
		i = skipWhitespace(xmlData, i);
		startIndex = i;
		while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
		let attributeName = xmlData.substring(startIndex, i);
		if (!validateEntityName(attributeName, { xmlVersion: this.xmlVersion })) throw new Error(`Invalid attribute name: "${attributeName}"`);
		i = skipWhitespace(xmlData, i);
		let attributeType = "";
		if (xmlData.substring(i, i + 8).toUpperCase() === "NOTATION") {
			attributeType = "NOTATION";
			i += 8;
			i = skipWhitespace(xmlData, i);
			if (xmlData[i] !== "(") throw new Error(`Expected '(', found "${xmlData[i]}"`);
			i++;
			let allowedNotations = [];
			while (i < xmlData.length && xmlData[i] !== ")") {
				const startIndex = i;
				while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") i++;
				let notation = xmlData.substring(startIndex, i);
				notation = notation.trim();
				if (!validateEntityName(notation, { xmlVersion: this.xmlVersion })) throw new Error(`Invalid notation name: "${notation}"`);
				allowedNotations.push(notation);
				if (xmlData[i] === "|") {
					i++;
					i = skipWhitespace(xmlData, i);
				}
			}
			if (xmlData[i] !== ")") throw new Error("Unterminated list of notations");
			i++;
			attributeType += " (" + allowedNotations.join("|") + ")";
		} else {
			const startIndex = i;
			while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
			attributeType += xmlData.substring(startIndex, i);
			if (!this.suppressValidationErr && ![
				"CDATA",
				"ID",
				"IDREF",
				"IDREFS",
				"ENTITY",
				"ENTITIES",
				"NMTOKEN",
				"NMTOKENS"
			].includes(attributeType.toUpperCase())) throw new Error(`Invalid attribute type: "${attributeType}"`);
		}
		i = skipWhitespace(xmlData, i);
		let defaultValue = "";
		if (xmlData.substring(i, i + 8).toUpperCase() === "#REQUIRED") {
			defaultValue = "#REQUIRED";
			i += 8;
		} else if (xmlData.substring(i, i + 7).toUpperCase() === "#IMPLIED") {
			defaultValue = "#IMPLIED";
			i += 7;
		} else [i, defaultValue] = this.readIdentifierVal(xmlData, i, "ATTLIST");
		return {
			elementName,
			attributeName,
			attributeType,
			defaultValue,
			index: i
		};
	}
};
var skipWhitespace = (data, index) => {
	while (index < data.length && /\s/.test(data[index])) index++;
	return index;
};
function hasSeq(data, seq, i) {
	for (let j = 0; j < seq.length; j++) if (seq[j] !== data[i + j + 1]) return false;
	return true;
}
function validateEntityName(name, xmlVersion) {
	if (qName(name, { xmlVersion })) return name;
	else throw new Error(`Invalid entity name ${name}`);
}
//#endregion
//#region ../node_modules/anynum/digitTable.js
/**
* Flat lookup table: maps Unicode code point → ASCII digit (0-9).
* Only decimal digit characters (Unicode category Nd) are included.
*
* Strategy: Int32Array of size (maxCodePoint - minCodePoint + 1).
* Value 0xFF means "not a digit". Value 0-9 is the ASCII digit value.
* This gives O(1) lookup with no branching, no bisect, no loop.
*
* Memory: range is 0x0660 to 0x1FBF0 → ~129,936 entries × 1 byte = ~127 KB.
* Acceptable for a one-time init; lookup is a single array index.
*/
var SCRIPT_ZEROS = [
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
var HIGH_MAP = /* @__PURE__ */ new Map();
var LOW_MAX = 65535;
var TABLE_OFFSET = 1632;
var TABLE = (/* @__PURE__ */ new Uint8Array(63904)).fill(255);
for (const zero of SCRIPT_ZEROS) for (let d = 0; d < 10; d++) {
	const cp = zero + d;
	if (cp <= LOW_MAX) TABLE[cp - TABLE_OFFSET] = d;
	else HIGH_MAP.set(cp, d);
}
//#endregion
//#region ../node_modules/anynum/anynum.js
var CHAR_0 = 48;
var CHAR_9 = 57;
var CHAR_MINUS = 45;
var MINUS_SET = /* @__PURE__ */ new Set([
	8722,
	65293,
	65123
]);
/**
* Normalize all Unicode decimal digit characters in a string to ASCII (0-9),
* and normalize Unicode minus variants to ASCII '-' (U+002D).
*
* Non-digit, non-minus characters are passed through unchanged.
*
* Performance design:
* - Fast path: if the string has no convertible characters, return it unchanged
*   (zero allocation).
* - BMP digits (0x0660..0xFFFF excl. surrogates): flat Uint8Array lookup (O(1)).
* - Supplementary plane digits (> 0xFFFF, encoded as surrogate pairs): Map lookup.
* - Minus variants: checked inline with a small fixed Set.
*
* @param {string} str
* @returns {string}
*/
function anynum(str) {
	if (typeof str !== "string") return str;
	const len = str.length;
	if (len === 0) return str;
	let firstHit = -1;
	for (let i = 0; i < len; i++) {
		const cc = str.charCodeAt(i);
		if (cc >= CHAR_0 && cc <= CHAR_9 || cc === CHAR_MINUS) continue;
		if (cc < 1632) {
			if (MINUS_SET.has(cc)) {
				firstHit = i;
				break;
			}
			continue;
		}
		if (cc >= 55296 && cc <= 56319) {
			if (i + 1 < len) {
				const low = str.charCodeAt(i + 1);
				if (low >= 56320 && low <= 57343) {
					const cp = 65536 + (cc - 55296 << 10) + (low - 56320);
					if (HIGH_MAP.has(cp)) {
						firstHit = i;
						break;
					}
				}
			}
			continue;
		}
		if (TABLE[cc - 1632] !== 255 || MINUS_SET.has(cc)) {
			firstHit = i;
			break;
		}
	}
	if (firstHit === -1) return str;
	const chars = [];
	if (firstHit > 0) chars.push(str.slice(0, firstHit));
	for (let i = firstHit; i < len; i++) {
		const cc = str.charCodeAt(i);
		if (cc >= CHAR_0 && cc <= CHAR_9 || cc === CHAR_MINUS) {
			chars.push(str[i]);
			continue;
		}
		if (cc < 1632) {
			chars.push(MINUS_SET.has(cc) ? "-" : str[i]);
			continue;
		}
		if (cc >= 55296 && cc <= 56319) {
			if (i + 1 < len) {
				const low = str.charCodeAt(i + 1);
				if (low >= 56320 && low <= 57343) {
					const cp = 65536 + (cc - 55296 << 10) + (low - 56320);
					const d = HIGH_MAP.get(cp);
					if (d !== void 0) {
						chars.push(String.fromCharCode(d + 48));
						i++;
						continue;
					}
				}
			}
			chars.push(str[i]);
			continue;
		}
		if (MINUS_SET.has(cc)) {
			chars.push("-");
			continue;
		}
		const d = TABLE[cc - TABLE_OFFSET];
		chars.push(d !== 255 ? String.fromCharCode(d + 48) : str[i]);
	}
	return chars.join("");
}
//#endregion
//#region ../node_modules/strnum/strnum.js
var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
var binRegex = /^0b[01]+$/;
var octRegex = /^0o[0-7]+$/;
var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
var consider = {
	hex: true,
	binary: false,
	octal: false,
	leadingZeros: true,
	decimalPoint: ".",
	eNotation: true,
	infinity: "original",
	unicode: false
};
function toNumber(str, options = {}) {
	options = Object.assign({}, consider, options);
	if (!str || typeof str !== "string") return str;
	let trimmedStr = str.trim();
	if (trimmedStr.length === 0) return str;
	else if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
	else if (trimmedStr === "0") return 0;
	if (options.unicode) {
		trimmedStr = anynum(trimmedStr);
		if (trimmedStr === "0") return 0;
	}
	if (options.hex && hexRegex.test(trimmedStr)) return parse_int(trimmedStr, 16);
	else if (options.binary && binRegex.test(trimmedStr)) return parse_int(trimmedStr, 2);
	else if (options.octal && octRegex.test(trimmedStr)) return parse_int(trimmedStr, 8);
	else if (!isFinite(trimmedStr)) return handleInfinity(str, Number(trimmedStr), options);
	else if (trimmedStr.includes("e") || trimmedStr.includes("E")) return resolveEnotation(str, trimmedStr, options);
	else {
		const match = numRegex.exec(trimmedStr);
		if (match) {
			const sign = match[1] || "";
			const leadingZeros = match[2];
			let numTrimmedByZeros = trimZeros(match[3]);
			const decimalAdjacentToLeadingZeros = sign ? str[leadingZeros.length + 1] === "." : str[leadingZeros.length] === ".";
			if (!options.leadingZeros && (leadingZeros.length > 1 || leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros)) return str;
			else {
				const num = Number(trimmedStr);
				const parsedStr = String(num);
				if (num === 0) return num;
				if (parsedStr.search(/[eE]/) !== -1) {
					if (options.eNotation) return num;
					else return str;
				} else if (trimmedStr.indexOf(".") !== -1) {
					if (parsedStr === "0") return num;
					else if (parsedStr === numTrimmedByZeros) return num;
					else if (parsedStr === `${sign}${numTrimmedByZeros}`) return num;
					else return str;
				}
				let n = leadingZeros ? numTrimmedByZeros : trimmedStr;
				if (leadingZeros) return n === parsedStr || sign + n === parsedStr ? num : str;
				else return n === parsedStr || n === sign + parsedStr ? num : str;
			}
		} else return str;
	}
}
var eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function resolveEnotation(str, trimmedStr, options) {
	if (!options.eNotation) return str;
	const notation = trimmedStr.match(eNotationRegx);
	if (notation) {
		let sign = notation[1] || "";
		const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
		const leadingZeros = notation[2];
		const eAdjacentToLeadingZeros = sign ? str[leadingZeros.length + 1] === eChar : str[leadingZeros.length] === eChar;
		if (leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str;
		else if (leadingZeros.length === 1 && (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)) return Number(trimmedStr);
		else if (leadingZeros.length > 0) {
			if (options.leadingZeros && !eAdjacentToLeadingZeros) {
				trimmedStr = (notation[1] || "") + notation[3];
				return Number(trimmedStr);
			} else return str;
		} else return Number(trimmedStr);
	} else return str;
}
/**
* 
* @param {string} numStr without leading zeros
* @returns 
*/
function trimZeros(numStr) {
	if (numStr && numStr.indexOf(".") !== -1) {
		let end = numStr.length;
		while (end > 0 && numStr.charCodeAt(end - 1) === 48) end--;
		numStr = numStr.slice(0, end);
		if (numStr === ".") numStr = "0";
		else if (numStr[0] === ".") numStr = "0" + numStr;
		else if (numStr[numStr.length - 1] === ".") numStr = numStr.substring(0, numStr.length - 1);
		return numStr;
	}
	return numStr;
}
function parse_int(numStr, base) {
	const str = numStr.trim();
	if (base === 2 || base === 8) numStr = str.substring(2);
	if (parseInt) return parseInt(numStr, base);
	else if (Number.parseInt) return Number.parseInt(numStr, base);
	else if (window && window.parseInt) return window.parseInt(numStr, base);
	else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
/**
* Handle infinite values based on user option
* @param {string} str - original input string
* @param {number} num - parsed number (Infinity or -Infinity)
* @param {object} options - user options
* @returns {string|number|null} based on infinity option
*/
function handleInfinity(str, num, options) {
	const isPositive = num === Infinity;
	switch (options.infinity.toLowerCase()) {
		case "null": return null;
		case "infinity": return num;
		case "string": return isPositive ? "Infinity" : "-Infinity";
		default: return str;
	}
}
//#endregion
//#region ../node_modules/fast-xml-parser/src/ignoreAttributes.js
function getIgnoreAttributesFn(ignoreAttributes) {
	if (typeof ignoreAttributes === "function") return ignoreAttributes;
	if (Array.isArray(ignoreAttributes)) return (attrName) => {
		for (const pattern of ignoreAttributes) {
			if (typeof pattern === "string" && attrName === pattern) return true;
			if (pattern instanceof RegExp && pattern.test(attrName)) return true;
		}
	};
	return () => false;
}
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/html.js
/**
* HTML context patterns.
*
* Detects XSS vectors that are dangerous when a string ends up rendered as HTML.
* All patterns use bounded quantifiers to ensure linear-time matching (ReDoS-safe).
*
* Each entry is { pattern: RegExp, id: string, description: string }
* so callers can inspect which rule fired if they need to.
*/
var HTML_PATTERNS = [
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
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/xml.js
/**
* XML context patterns.
*
* Detects injection vectors that are specifically dangerous when a string
* is inserted into an XML document (not HTML rendering context).
*
* Key distinction from HTML: these patterns target parser-level attacks —
* things that can confuse or subvert an XML parser, trigger external entity
* resolution, or inject DTD content. HTML rendering concerns (XSS) belong
* in the HTML context.
*/
var XML_PATTERNS = [
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
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/svg.js
/**
* SVG context patterns.
*
* SVG is XML-based but renders in browsers, giving it a unique attack surface
* that combines XML parser behaviour with browser rendering and JavaScript execution.
*
* Many of these vectors bypass HTML sanitizers that don't understand SVG semantics
* (DOMPurify has documented bypass vulnerabilities specifically in SVG/XML context).
*/
var SVG_PATTERNS = [
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
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/sql.js
/**
* SQL context patterns — high-precision rules only.
*
* These rules have very low false-positive risk and are safe to apply to
* general user text (names, descriptions, search queries, etc.).
* All patterns are ReDoS-safe — unlike the `sql-injection` npm package
* which has an active CVE on its own detection regexes.
*
* For exhaustive coverage including noisier heuristics (comment sequences,
* hex literals, stacked queries with semicolons), use 'SQL-STRICT' instead.
* Apply 'SQL-STRICT' only to strings that are specifically SQL fragments,
* not to general free-text fields.
*/
var SQL_PATTERNS = [
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
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/shell.js
/**
* SHELL context patterns.
*
* Detects shell injection vectors and path traversal patterns.
* Designed for use when a string will be passed to a shell command,
* used as a file path, or interpolated into OS-level operations.
*/
var SHELL_PATTERNS = [
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
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/redos.js
/**
* REDOS context patterns.
*
* Detects strings that, if used as regular expressions, could cause
* catastrophic backtracking (ReDoS — Regular Expression Denial of Service).
*
* These patterns detect the structural forms that lead to exponential or
* polynomial backtracking in NFA-based regex engines (V8, PCRE, Java, etc.).
*
* Use this context when user-supplied strings will be compiled into RegExp objects.
*/
var REDOS_PATTERNS = [
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
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/nosql.js
var sep = "[\"'\\s]*:";
var NOSQL_PATTERNS = [
	{
		id: "nosql-where-operator",
		description: "$where — executes arbitrary JavaScript server-side in MongoDB",
		pattern: new RegExp(`\\$where${sep}`, "i")
	},
	{
		id: "nosql-ne-operator",
		description: "$ne — \"not equal\" operator used to bypass equality checks",
		pattern: new RegExp(`\\$ne${sep}`, "i")
	},
	{
		id: "nosql-gt-operator",
		description: "$gt — \"greater than\" used to bypass password/value checks",
		pattern: new RegExp(`\\$gte?${sep}`, "i")
	},
	{
		id: "nosql-lt-operator",
		description: "$lt / $lte — \"less than\" bypass variants",
		pattern: new RegExp(`\\$lte?${sep}`, "i")
	},
	{
		id: "nosql-regex-operator",
		description: "$regex — can be used to extract data character by character (blind injection)",
		pattern: new RegExp(`\\$regex${sep}`, "i")
	},
	{
		id: "nosql-or-operator",
		description: "$or — logical OR; used to create always-true conditions",
		pattern: new RegExp(`\\$or${sep}\\s*\\[`, "i")
	},
	{
		id: "nosql-and-operator",
		description: "$and — logical AND operator injection",
		pattern: new RegExp(`\\$and${sep}\\s*\\[`, "i")
	},
	{
		id: "nosql-nor-operator",
		description: "$nor — logical NOR operator injection",
		pattern: new RegExp(`\\$nor${sep}\\s*\\[`, "i")
	},
	{
		id: "nosql-exists-operator",
		description: "$exists — can enumerate fields to determine schema",
		pattern: new RegExp(`\\$exists${sep}`, "i")
	},
	{
		id: "nosql-in-operator",
		description: "$in — matches any value in a list; can enumerate values",
		pattern: new RegExp(`\\$in${sep}\\s*\\[`, "i")
	},
	{
		id: "nosql-expr-operator",
		description: "$expr — allows aggregation expressions in queries (MongoDB 3.6+)",
		pattern: new RegExp(`\\$expr${sep}`, "i")
	},
	{
		id: "nosql-function-operator",
		description: "$function — executes arbitrary JavaScript in MongoDB 4.4+",
		pattern: new RegExp(`\\$function${sep}`, "i")
	},
	{
		id: "nosql-accumulator-operator",
		description: "$accumulator — custom aggregation with arbitrary JS execution",
		pattern: new RegExp(`\\$accumulator${sep}`, "i")
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
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/log.js
/**
* LOG context patterns.
*
* Detects injection vectors that are dangerous when a string is written
* to a log file, passed to a logging framework, or interpolated into
* a log message that will be parsed or displayed.
*
* Attack categories:
*   1. CRLF injection — injects fake log lines by embedding newlines
*   2. Log4Shell (CVE-2021-44228) — ${jndi:...} triggers JNDI lookup in Log4j
*   3. SSTI in log templates — {{...}}, #{...} trigger template evaluation
*      if the log message is passed through a template engine
*   4. Null byte injection — truncates log entries in some implementations
*   5. ANSI escape injection — manipulates terminal output when logs are
*      tailed in a terminal (colour codes, cursor movement, etc.)
*
* Note: Newline characters (\n, \r) will produce false positives for
* multi-line legitimate values. Use this context only for single-line
* log field values (usernames, IDs, request parameters, etc.).
*/
var LOG_PATTERNS = [
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
//#endregion
//#region ../node_modules/is-unsafe/src/contexts/sql-strict.js
/**
* SQL-STRICT context patterns.
*
* Extends the base 'SQL' context with three additional rules that are
* effective at detecting real injections but carry a higher false-positive
* risk on general free-text input.
*
* Use 'SQL-STRICT' when:
*   - The string is specifically a SQL fragment or database identifier
*   - You control the input domain (e.g. a dedicated SQL search field)
*   - You can tolerate occasional false positives in exchange for broader coverage
*
* Use 'SQL' (not STRICT) when:
*   - The field is general user text (names, descriptions, comments)
*   - False positives would block legitimate content (e.g. "see note -- above")
*
* Rules moved here from 'SQL' due to false-positive risk:
*
*   sql-line-comment   — "--" fires on "see note -- above", "value--", CSS var(--primary)
*   sql-stacked-query  — "; SELECT" fires on legitimate prose with semicolons + SQL words
*   sql-hex-encoding   — "0xDEAD" fires on hex values in technical docs and log output
*/
var SQL_STRICT_EXTRA = [
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
var SQL_STRICT_PATTERNS = [...SQL_PATTERNS, ...SQL_STRICT_EXTRA];
//#endregion
//#region ../node_modules/is-unsafe/src/index.js
HTML_PATTERNS.label = "HTML";
XML_PATTERNS.label = "XML";
SVG_PATTERNS.label = "SVG";
SQL_PATTERNS.label = "SQL";
SQL_STRICT_PATTERNS.label = "SQL-STRICT";
SHELL_PATTERNS.label = "SHELL";
REDOS_PATTERNS.label = "REDOS";
NOSQL_PATTERNS.label = "NOSQL";
LOG_PATTERNS.label = "LOG";
Object.freeze({
	HTML: HTML_PATTERNS,
	XML: XML_PATTERNS,
	SVG: SVG_PATTERNS,
	SQL: SQL_PATTERNS,
	"SQL-STRICT": SQL_STRICT_PATTERNS,
	SHELL: SHELL_PATTERNS,
	REDOS: REDOS_PATTERNS,
	NOSQL: NOSQL_PATTERNS,
	LOG: LOG_PATTERNS
});
/**
* @typedef {{ id: string, description: string, pattern: RegExp }} Rule
*/
/**
* @typedef {Rule[]} PatternList
*/
/**
* @typedef {Object} MatchResult
* @property {string} context     - Label identifying which context matched ('HTML', 'CUSTOM', etc.)
* @property {string} id          - Rule identifier
* @property {string} description - Human-readable description of what was matched
* @property {RegExp} pattern     - The pattern that matched
*/
/**
* @param {unknown} value
*/
function assertString(value) {
	if (typeof value !== "string") throw new TypeError(`is-unsafe: first argument must be a string, got ${typeof value}`);
}
/**
* @param {unknown} context
*/
function assertContext(context) {
	if (context instanceof RegExp) return;
	if (Array.isArray(context)) {
		if (context.length === 0) throw new TypeError("is-unsafe: context must not be an empty array");
		if (Array.isArray(context[0])) {
			for (const list of context) if (!Array.isArray(list) || list.length === 0) throw new TypeError("is-unsafe: each context in the array must be a non-empty pattern array (PatternList)");
		}
		return;
	}
	throw new TypeError(`is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof context}`);
}
/**
* Normalise any valid context arg into an array of PatternLists.
*
* @param {Rule[]|Rule[][]|RegExp} context
* @returns {{ lists: Rule[][]|null, regex: RegExp|null }}
*/
function normalise(context) {
	if (context instanceof RegExp) return {
		lists: null,
		regex: context
	};
	if (Array.isArray(context[0])) return {
		lists: context,
		regex: null
	};
	return {
		lists: [context],
		regex: null
	};
}
/**
* Test value against a single PatternList. Returns the first MatchResult or null.
*
* @param {string} value
* @param {Rule[]} list
* @returns {MatchResult|null}
*/
function matchList(value, list) {
	const label = list.label ?? "CUSTOM";
	for (const rule of list) if (rule.pattern.test(value)) return {
		context: label,
		id: rule.id,
		description: rule.description,
		pattern: rule.pattern
	};
	return null;
}
/**
* Returns `true` if `value` is unsafe in the given context(s), `false` otherwise.
*
* @param {string} value - The string to test
* @param {PatternList | PatternList[] | RegExp} context
*   - A PatternList imported from is-unsafe (e.g. `HTML`, `XML`)
*   - An array of PatternLists — returns true if unsafe in **any** of them
*   - A custom RegExp — returns true if the pattern matches
* @returns {boolean}
*
* @example
* import { isUnsafe, HTML, SQL } from 'is-unsafe';
*
* isUnsafe('<script>alert(1)<\/script>', HTML)       // true
* isUnsafe('hello world', HTML)                     // false
* isUnsafe('value', [HTML, SQL])                    // false
* isUnsafe('value', /my-pattern/i)                  // false
*/
function isUnsafe(value, context) {
	assertString(value);
	assertContext(context);
	const { lists, regex } = normalise(context);
	if (regex) return regex.test(value);
	for (const list of lists) if (matchList(value, list) !== null) return true;
	return false;
}
//#endregion
//#region ../node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
/**
* Extract raw attributes (without prefix) from prefixed attribute map
* @param {object} prefixedAttrs - Attributes with prefix from buildAttributesMap
* @param {object} options - Parser options containing attributeNamePrefix
* @returns {object} Raw attributes for matcher
*/
function extractRawAttributes(prefixedAttrs, options) {
	if (!prefixedAttrs) return {};
	const attrs = options.attributesGroupName ? prefixedAttrs[options.attributesGroupName] : prefixedAttrs;
	if (!attrs) return {};
	const rawAttrs = {};
	for (const key in attrs) if (key.startsWith(options.attributeNamePrefix)) {
		const rawName = key.substring(options.attributeNamePrefix.length);
		rawAttrs[rawName] = attrs[key];
	} else rawAttrs[key] = attrs[key];
	return rawAttrs;
}
/**
* Extract namespace from raw tag name
* @param {string} rawTagName - Tag name possibly with namespace (e.g., "soap:Envelope")
* @returns {string|undefined} Namespace or undefined
*/
function extractNamespace(rawTagName) {
	if (!rawTagName || typeof rawTagName !== "string") return void 0;
	const colonIndex = rawTagName.indexOf(":");
	if (colonIndex !== -1 && colonIndex > 0) {
		const ns = rawTagName.substring(0, colonIndex);
		if (ns !== "xmlns") return ns;
	}
}
var OrderedObjParser = class {
	constructor(options, externalEntities) {
		this.options = options;
		this.currentNode = null;
		this.tagsNodeStack = [];
		this.parseXml = parseXml;
		this.parseTextData = parseTextData;
		this.resolveNameSpace = resolveNameSpace;
		this.buildAttributesMap = buildAttributesMap;
		this.isItStopNode = isItStopNode;
		this.replaceEntitiesValue = replaceEntitiesValue;
		this.readStopNodeData = readStopNodeData;
		this.saveTextToParentTag = saveTextToParentTag;
		this.addChild = addChild;
		this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
		this.entityExpansionCount = 0;
		this.currentExpandedLength = 0;
		this.doctypefound = false;
		let namedEntities = { ...XML };
		if (this.options.entityDecoder) this.entityDecoder = this.options.entityDecoder;
		else {
			if (typeof this.options.htmlEntities === "object") namedEntities = this.options.htmlEntities;
			else if (this.options.htmlEntities === true) namedEntities = {
				...COMMON_HTML,
				...CURRENCY
			};
			this.entityDecoder = new EntityDecoder({
				namedEntities: {
					...namedEntities,
					...externalEntities
				},
				numericAllowed: this.options.htmlEntities,
				limit: {
					maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
					maxExpandedLength: this.options.processEntities.maxExpandedLength,
					applyLimitsTo: this.options.processEntities.appliesTo
				},
				onInputEntity: (name, value) => isUnsafe(value, [HTML_PATTERNS, XML_PATTERNS]) ? ENTITY_ACTION.BLOCK : ENTITY_ACTION.ALLOW
			});
		}
		this.matcher = new Matcher();
		this.readonlyMatcher = this.matcher.readOnly();
		this.isCurrentNodeStopNode = false;
		this.stopNodeExpressionsSet = new ExpressionSet();
		const stopNodesOpts = this.options.stopNodes;
		if (stopNodesOpts && stopNodesOpts.length > 0) {
			for (let i = 0; i < stopNodesOpts.length; i++) {
				const stopNodeExp = stopNodesOpts[i];
				if (typeof stopNodeExp === "string") this.stopNodeExpressionsSet.add(new Expression(stopNodeExp));
				else if (stopNodeExp instanceof Expression) this.stopNodeExpressionsSet.add(stopNodeExp);
			}
			this.stopNodeExpressionsSet.seal();
		}
	}
};
/**
* @param {string} val
* @param {string} tagName
* @param {string|Matcher} jPath - jPath string or Matcher instance based on options.jPath
* @param {boolean} dontTrim
* @param {boolean} hasAttributes
* @param {boolean} isLeafNode
* @param {boolean} escapeEntities
*/
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
	const options = this.options;
	if (val !== void 0) {
		if (options.trimValues && !dontTrim) val = val.trim();
		if (val.length > 0) {
			if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
			const jPathOrMatcher = options.jPath ? jPath.toString() : jPath;
			const newval = options.tagValueProcessor(tagName, val, jPathOrMatcher, hasAttributes, isLeafNode);
			if (newval === null || newval === void 0) return val;
			else if (typeof newval !== typeof val || newval !== val) return newval;
			else if (options.trimValues) return parseValue(val, options.parseTagValue, options.numberParseOptions);
			else if (val.trim() === val) return parseValue(val, options.parseTagValue, options.numberParseOptions);
			else return val;
		}
	}
}
function resolveNameSpace(tagname) {
	if (this.options.removeNSPrefix) {
		const tags = tagname.split(":");
		const prefix = tagname.charAt(0) === "/" ? "/" : "";
		if (tags[0] === "xmlns") return "";
		if (tags.length === 2) tagname = prefix + tags[1];
	}
	return tagname;
}
var attrsRegx = /* @__PURE__ */ new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?", "gm");
function buildAttributesMap(attrStr, jPath, tagName, force = false) {
	const options = this.options;
	if (force === true || options.ignoreAttributes !== true && typeof attrStr === "string") {
		const matches = getAllMatches(attrStr, attrsRegx);
		const len = matches.length;
		const attrs = {};
		const processedVals = new Array(len);
		let hasRawAttrs = false;
		const rawAttrsForMatcher = {};
		for (let i = 0; i < len; i++) {
			const attrName = this.resolveNameSpace(matches[i][1]);
			const oldVal = matches[i][4];
			if (attrName.length && oldVal !== void 0) {
				let val = oldVal;
				if (options.trimValues) val = val.trim();
				val = this.replaceEntitiesValue(val, tagName, this.readonlyMatcher);
				processedVals[i] = val;
				rawAttrsForMatcher[attrName] = val;
				hasRawAttrs = true;
			}
		}
		if (hasRawAttrs && typeof jPath === "object" && jPath.updateCurrent) jPath.updateCurrent(rawAttrsForMatcher);
		const jPathStr = options.jPath ? jPath.toString() : this.readonlyMatcher;
		let hasAttrs = false;
		for (let i = 0; i < len; i++) {
			const attrName = this.resolveNameSpace(matches[i][1]);
			if (this.ignoreAttributesFn(attrName, jPathStr)) continue;
			let aName = options.attributeNamePrefix + attrName;
			if (attrName.length) {
				if (options.transformAttributeName) aName = options.transformAttributeName(aName);
				aName = sanitizeName(aName, options);
				if (matches[i][4] !== void 0) {
					const oldVal = processedVals[i];
					const newVal = options.attributeValueProcessor(attrName, oldVal, jPathStr);
					if (newVal === null || newVal === void 0) attrs[aName] = oldVal;
					else if (typeof newVal !== typeof oldVal || newVal !== oldVal) attrs[aName] = newVal;
					else attrs[aName] = parseValue(oldVal, options.parseAttributeValue, options.numberParseOptions);
					hasAttrs = true;
				} else if (options.allowBooleanAttributes) {
					attrs[aName] = true;
					hasAttrs = true;
				}
			}
		}
		if (!hasAttrs) return;
		if (options.attributesGroupName && !options.preserveOrder) {
			const attrCollection = {};
			attrCollection[options.attributesGroupName] = attrs;
			return attrCollection;
		}
		return attrs;
	}
}
var parseXml = function(xmlData) {
	xmlData = xmlData.replace(/\r\n?/g, "\n");
	const xmlObj = new XmlNode("!xml");
	let currentNode = xmlObj;
	let textData = "";
	this.matcher.reset();
	this.entityDecoder.reset();
	this.entityExpansionCount = 0;
	this.currentExpandedLength = 0;
	this.doctypefound = false;
	const options = this.options;
	const docTypeReader = new DocTypeReader(options.processEntities);
	const xmlLen = xmlData.length;
	for (let i = 0; i < xmlLen; i++) if (xmlData[i] === "<") {
		const c1 = xmlData.charCodeAt(i + 1);
		if (c1 === 47) {
			const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
			let tagName = xmlData.substring(i + 2, closeIndex).trim();
			if (options.removeNSPrefix) {
				const colonIndex = tagName.indexOf(":");
				if (colonIndex !== -1) tagName = tagName.substr(colonIndex + 1);
			}
			tagName = transformTagName(options.transformTagName, tagName, "", options).tagName;
			if (currentNode) textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
			const lastTagName = this.matcher.getCurrentTag();
			if (tagName && options.unpairedTagsSet.has(tagName)) throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
			if (lastTagName && options.unpairedTagsSet.has(lastTagName)) {
				this.matcher.pop();
				this.tagsNodeStack.pop();
			}
			this.matcher.pop();
			this.isCurrentNodeStopNode = false;
			currentNode = this.tagsNodeStack.pop() || xmlObj;
			if (options.captureMetaData && currentNode) currentNode.addEndIndex(closeIndex + 1);
			textData = "";
			i = closeIndex;
		} else if (c1 === 63) {
			let tagData = readTagExp(xmlData, i, false, "?>");
			if (!tagData) throw new Error("Pi Tag is not closed.");
			textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
			const attsMap = this.buildAttributesMap(tagData.tagExp, this.matcher, tagData.tagName, true);
			if (attsMap) {
				const ver = attsMap[this.options.attributeNamePrefix + "version"];
				this.entityDecoder.setXmlVersion(Number(ver) || 1);
				docTypeReader.setXmlVersion(Number(ver) || 1);
			}
			if (options.ignoreDeclaration && tagData.tagName === "?xml" || options.ignorePiTags) {} else {
				const childNode = new XmlNode(tagData.tagName);
				childNode.add(options.textNodeName, "");
				if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent && options.ignoreAttributes !== true) childNode[":@"] = attsMap;
				this.addChild(currentNode, childNode, this.readonlyMatcher, i);
				if (options.captureMetaData) currentNode.addEndIndex(tagData.closeIndex + 2);
			}
			i = tagData.closeIndex + 1;
		} else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 45 && xmlData.charCodeAt(i + 3) === 45) {
			const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
			if (options.commentPropName) {
				const comment = xmlData.substring(i + 4, endIndex - 2);
				textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
				currentNode.add(options.commentPropName, [{ [options.textNodeName]: comment }]);
			}
			i = endIndex;
		} else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 68) {
			if (this.doctypefound) throw new Error("Multiple DOCTYPE declarations found.");
			this.doctypefound = true;
			const result = docTypeReader.readDocType(xmlData, i);
			this.entityDecoder.addInputEntities(result.entities);
			i = result.i;
		} else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 91) {
			const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
			const tagExp = xmlData.substring(i + 9, closeIndex);
			textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
			let val = this.parseTextData(tagExp, currentNode.tagname, this.readonlyMatcher, true, false, true, true);
			if (val == void 0) val = "";
			if (options.cdataPropName) currentNode.add(options.cdataPropName, [{ [options.textNodeName]: tagExp }]);
			else currentNode.add(options.textNodeName, val);
			i = closeIndex + 2;
		} else {
			let result = readTagExp(xmlData, i, options.removeNSPrefix);
			if (!result) {
				const context = xmlData.substring(Math.max(0, i - 50), Math.min(xmlLen, i + 50));
				throw new Error(`readTagExp returned undefined at position ${i}. Context: "${context}"`);
			}
			let tagName = result.tagName;
			const rawTagName = result.rawTagName;
			let tagExp = result.tagExp;
			let attrExpPresent = result.attrExpPresent;
			let closeIndex = result.closeIndex;
			({tagName, tagExp} = transformTagName(options.transformTagName, tagName, tagExp, options));
			if (options.strictReservedNames && (tagName === options.commentPropName || tagName === options.cdataPropName || tagName === options.textNodeName || tagName === options.attributesGroupName)) throw new Error(`Invalid tag name: ${tagName}`);
			if (currentNode && textData) {
				if (currentNode.tagname !== "!xml") textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher, false);
			}
			const lastTag = currentNode;
			if (lastTag && options.unpairedTagsSet.has(lastTag.tagname)) {
				currentNode = this.tagsNodeStack.pop();
				this.matcher.pop();
			}
			let isSelfClosing = false;
			if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
				isSelfClosing = true;
				if (tagName[tagName.length - 1] === "/") {
					tagName = tagName.substr(0, tagName.length - 1);
					tagExp = tagName;
				} else tagExp = tagExp.substr(0, tagExp.length - 1);
				attrExpPresent = tagName !== tagExp;
			}
			let prefixedAttrs = null;
			let namespace = void 0;
			namespace = extractNamespace(rawTagName);
			if (tagName !== xmlObj.tagname) this.matcher.push(tagName, {}, namespace);
			if (tagName !== tagExp && attrExpPresent) {
				prefixedAttrs = this.buildAttributesMap(tagExp, this.matcher, tagName);
				if (prefixedAttrs) extractRawAttributes(prefixedAttrs, options);
			}
			if (tagName !== xmlObj.tagname) this.isCurrentNodeStopNode = this.isItStopNode();
			const startIndex = i;
			if (this.isCurrentNodeStopNode) {
				let tagContent = "";
				if (isSelfClosing) i = result.closeIndex;
				else if (options.unpairedTagsSet.has(tagName)) i = result.closeIndex;
				else {
					const result = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
					if (!result) throw new Error(`Unexpected end of ${rawTagName}`);
					i = result.i;
					tagContent = result.tagContent;
				}
				const childNode = new XmlNode(tagName);
				if (prefixedAttrs) childNode[":@"] = prefixedAttrs;
				childNode.add(options.textNodeName, tagContent);
				this.matcher.pop();
				this.isCurrentNodeStopNode = false;
				this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
				if (options.captureMetaData) currentNode.addEndIndex(i + 1);
			} else {
				if (isSelfClosing) {
					({tagName, tagExp} = transformTagName(options.transformTagName, tagName, tagExp, options));
					const childNode = new XmlNode(tagName);
					if (prefixedAttrs) childNode[":@"] = prefixedAttrs;
					this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
					if (options.captureMetaData) currentNode.addEndIndex(closeIndex + 1);
					this.matcher.pop();
					this.isCurrentNodeStopNode = false;
				} else if (options.unpairedTagsSet.has(tagName)) {
					const childNode = new XmlNode(tagName);
					if (prefixedAttrs) childNode[":@"] = prefixedAttrs;
					this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
					if (options.captureMetaData) currentNode.addEndIndex(result.closeIndex + 1);
					this.matcher.pop();
					this.isCurrentNodeStopNode = false;
					i = result.closeIndex;
					continue;
				} else {
					const childNode = new XmlNode(tagName);
					if (this.tagsNodeStack.length > options.maxNestedTags) throw new Error("Maximum nested tags exceeded");
					this.tagsNodeStack.push(currentNode);
					if (prefixedAttrs) childNode[":@"] = prefixedAttrs;
					this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
					currentNode = childNode;
				}
				textData = "";
				i = closeIndex;
			}
		}
	} else textData += xmlData[i];
	return xmlObj.child;
};
function addChild(currentNode, childNode, matcher, startIndex) {
	if (!this.options.captureMetaData) startIndex = void 0;
	const jPathOrMatcher = this.options.jPath ? matcher.toString() : matcher;
	const result = this.options.updateTag(childNode.tagname, jPathOrMatcher, childNode[":@"]);
	if (result === false) {} else if (typeof result === "string") {
		childNode.tagname = result;
		currentNode.addChild(childNode, startIndex);
	} else currentNode.addChild(childNode, startIndex);
}
/**
* @param {object} val - Entity object with regex and val properties
* @param {string} tagName - Tag name
* @param {string|Matcher} jPath - jPath string or Matcher instance based on options.jPath
*/
function replaceEntitiesValue(val, tagName, jPath) {
	const entityConfig = this.options.processEntities;
	if (!entityConfig || !entityConfig.enabled) return val;
	if (entityConfig.allowedTags) {
		const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
		if (!(Array.isArray(entityConfig.allowedTags) ? entityConfig.allowedTags.includes(tagName) : entityConfig.allowedTags(tagName, jPathOrMatcher))) return val;
	}
	if (entityConfig.tagFilter) {
		const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
		if (!entityConfig.tagFilter(tagName, jPathOrMatcher)) return val;
	}
	return this.entityDecoder.decode(val);
}
function saveTextToParentTag(textData, parentNode, matcher, isLeafNode) {
	if (textData) {
		if (isLeafNode === void 0) isLeafNode = parentNode.child.length === 0;
		textData = this.parseTextData(textData, parentNode.tagname, matcher, false, parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false, isLeafNode);
		if (textData !== void 0 && textData !== "") parentNode.add(this.options.textNodeName, textData);
		textData = "";
	}
	return textData;
}
/**
* @param {Array<Expression>} stopNodeExpressions - Array of compiled Expression objects
* @param {Matcher} matcher - Current path matcher
*/
function isItStopNode() {
	if (this.stopNodeExpressionsSet.size === 0) return false;
	return this.matcher.matchesAny(this.stopNodeExpressionsSet);
}
/**
* Returns the tag Expression and where it is ending handling single-double quotes situation
* @param {string} xmlData 
* @param {number} i starting index
* @returns 
*/
function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
	let attrBoundary = 0;
	const len = xmlData.length;
	const closeCode0 = closingChar.charCodeAt(0);
	const closeCode1 = closingChar.length > 1 ? closingChar.charCodeAt(1) : -1;
	let result = "";
	let segmentStart = i;
	for (let index = i; index < len; index++) {
		const code = xmlData.charCodeAt(index);
		if (attrBoundary) {
			if (code === attrBoundary) attrBoundary = 0;
		} else if (code === 34 || code === 39) attrBoundary = code;
		else if (code === closeCode0) {
			if (closeCode1 !== -1) {
				if (xmlData.charCodeAt(index + 1) === closeCode1) {
					result += xmlData.substring(segmentStart, index);
					return {
						data: result,
						index
					};
				}
			} else {
				result += xmlData.substring(segmentStart, index);
				return {
					data: result,
					index
				};
			}
		} else if (code === 9 && !attrBoundary) {
			result += xmlData.substring(segmentStart, index) + " ";
			segmentStart = index + 1;
		}
	}
}
function findClosingIndex(xmlData, str, i, errMsg) {
	const closingIndex = xmlData.indexOf(str, i);
	if (closingIndex === -1) throw new Error(errMsg);
	else return closingIndex + str.length - 1;
}
function findClosingChar(xmlData, char, i, errMsg) {
	const closingIndex = xmlData.indexOf(char, i);
	if (closingIndex === -1) throw new Error(errMsg);
	return closingIndex;
}
function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
	const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
	if (!result) return;
	let tagExp = result.data;
	const closeIndex = result.index;
	const separatorIndex = tagExp.search(/\s/);
	let tagName = tagExp;
	let attrExpPresent = true;
	if (separatorIndex !== -1) {
		tagName = tagExp.substring(0, separatorIndex);
		tagExp = tagExp.substring(separatorIndex + 1).trimStart();
	}
	const rawTagName = tagName;
	if (removeNSPrefix) {
		const colonIndex = tagName.indexOf(":");
		if (colonIndex !== -1) {
			tagName = tagName.substr(colonIndex + 1);
			attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
		}
	}
	return {
		tagName,
		tagExp,
		closeIndex,
		attrExpPresent,
		rawTagName
	};
}
/**
* find paired tag for a stop node
* @param {string} xmlData 
* @param {string} tagName 
* @param {number} i 
*/
function readStopNodeData(xmlData, tagName, i) {
	const startIndex = i;
	let openTagCount = 1;
	const xmllen = xmlData.length;
	for (; i < xmllen; i++) if (xmlData[i] === "<") {
		const c1 = xmlData.charCodeAt(i + 1);
		if (c1 === 47) {
			const closeIndex = findClosingChar(xmlData, ">", i, `${tagName} is not closed`);
			if (xmlData.substring(i + 2, closeIndex).trim() === tagName) {
				openTagCount--;
				if (openTagCount === 0) return {
					tagContent: xmlData.substring(startIndex, i),
					i: closeIndex
				};
			}
			i = closeIndex;
		} else if (c1 === 63) i = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
		else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 45 && xmlData.charCodeAt(i + 3) === 45) i = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
		else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 91) i = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
		else {
			const tagData = readTagExp(xmlData, i, false);
			if (tagData) {
				if ((tagData && tagData.tagName) === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") openTagCount++;
				i = tagData.closeIndex;
			}
		}
	}
}
function parseValue(val, shouldParse, options) {
	if (shouldParse && typeof val === "string") {
		const newval = val.trim();
		if (newval === "true") return true;
		else if (newval === "false") return false;
		else return toNumber(val, options);
	} else if (isExist(val)) return val;
	else return "";
}
function transformTagName(fn, tagName, tagExp, options) {
	if (fn) {
		const newTagName = fn(tagName);
		if (tagExp === tagName) tagExp = newTagName;
		tagName = newTagName;
	}
	tagName = sanitizeName(tagName, options);
	return {
		tagName,
		tagExp
	};
}
function sanitizeName(name, options) {
	if (criticalProperties.includes(name)) throw new Error(`[SECURITY] Invalid name: "${name}" is a reserved JavaScript keyword that could cause prototype pollution`);
	else if (DANGEROUS_PROPERTY_NAMES.includes(name)) return options.onDangerousProperty(name);
	return name;
}
//#endregion
//#region ../node_modules/fast-xml-parser/src/xmlparser/node2json.js
var METADATA_SYMBOL = XmlNode.getMetaDataSymbol();
/**
* Helper function to strip attribute prefix from attribute map
* @param {object} attrs - Attributes with prefix (e.g., {"@_class": "code"})
* @param {string} prefix - Attribute prefix to remove (e.g., "@_")
* @returns {object} Attributes without prefix (e.g., {"class": "code"})
*/
function stripAttributePrefix(attrs, prefix) {
	if (!attrs || typeof attrs !== "object") return {};
	if (!prefix) return attrs;
	const rawAttrs = {};
	for (const key in attrs) if (key.startsWith(prefix)) {
		const rawName = key.substring(prefix.length);
		rawAttrs[rawName] = attrs[key];
	} else rawAttrs[key] = attrs[key];
	return rawAttrs;
}
/**
* 
* @param {array} node 
* @param {any} options 
* @param {Matcher} matcher - Path matcher instance
* @returns 
*/
function prettify(node, options, matcher, readonlyMatcher) {
	return compress(node, options, matcher, readonlyMatcher);
}
/**
* @param {array} arr 
* @param {object} options 
* @param {Matcher} matcher - Path matcher instance
* @returns object
*/
function compress(arr, options, matcher, readonlyMatcher) {
	let text;
	const compressedObj = {};
	for (let i = 0; i < arr.length; i++) {
		const tagObj = arr[i];
		const property = propName(tagObj);
		if (property !== void 0 && property !== options.textNodeName) {
			const rawAttrs = stripAttributePrefix(tagObj[":@"] || {}, options.attributeNamePrefix);
			matcher.push(property, rawAttrs);
		}
		if (property === options.textNodeName) {
			if (text === void 0) text = tagObj[property];
			else text += "" + tagObj[property];
		} else if (property === void 0) continue;
		else if (tagObj[property]) {
			let val = compress(tagObj[property], options, matcher, readonlyMatcher);
			const isLeaf = isLeafTag(val, options);
			if (Object.keys(val).length === 0 && options.alwaysCreateTextNode) val[options.textNodeName] = "";
			if (tagObj[":@"]) assignAttributes(val, tagObj[":@"], readonlyMatcher, options);
			else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) val = val[options.textNodeName];
			else if (Object.keys(val).length === 0) {
				if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
				else val = "";
			}
			if (tagObj[METADATA_SYMBOL] !== void 0 && typeof val === "object" && val !== null) val[METADATA_SYMBOL] = tagObj[METADATA_SYMBOL];
			if (compressedObj[property] !== void 0 && Object.prototype.hasOwnProperty.call(compressedObj, property)) {
				if (!Array.isArray(compressedObj[property])) compressedObj[property] = [compressedObj[property]];
				compressedObj[property].push(val);
			} else {
				const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() : readonlyMatcher;
				if (options.isArray(property, jPathOrMatcher, isLeaf)) compressedObj[property] = [val];
				else compressedObj[property] = val;
			}
			if (property !== void 0 && property !== options.textNodeName) matcher.pop();
		}
	}
	if (typeof text === "string") {
		if (text.length > 0) compressedObj[options.textNodeName] = text;
	} else if (text !== void 0) compressedObj[options.textNodeName] = text;
	return compressedObj;
}
function propName(obj) {
	const keys = Object.keys(obj);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (key !== ":@") return key;
	}
}
function assignAttributes(obj, attrMap, readonlyMatcher, options) {
	if (attrMap) {
		const keys = Object.keys(attrMap);
		const len = keys.length;
		for (let i = 0; i < len; i++) {
			const atrrName = keys[i];
			const rawAttrName = atrrName.startsWith(options.attributeNamePrefix) ? atrrName.substring(options.attributeNamePrefix.length) : atrrName;
			const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() + "." + rawAttrName : readonlyMatcher;
			if (options.isArray(atrrName, jPathOrMatcher, true, true)) obj[atrrName] = [attrMap[atrrName]];
			else obj[atrrName] = attrMap[atrrName];
		}
	}
}
function isLeafTag(obj, options) {
	const { textNodeName } = options;
	const propCount = Object.keys(obj).length;
	if (propCount === 0) return true;
	if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) return true;
	return false;
}
//#endregion
//#region ../node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var XMLParser = class {
	constructor(options) {
		this.externalEntities = {};
		this.options = buildOptions(options);
	}
	/**
	* Parse XML dats to JS object 
	* @param {string|Uint8Array} xmlData 
	* @param {boolean|Object} validationOption 
	*/
	parse(xmlData, validationOption) {
		if (typeof xmlData !== "string" && xmlData.toString) xmlData = xmlData.toString();
		else if (typeof xmlData !== "string") throw new Error("XML data is accepted in String or Bytes[] form.");
		if (validationOption) {
			if (validationOption === true) validationOption = {};
			const result = validate(xmlData, validationOption);
			if (result !== true) throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
		}
		const orderedObjParser = new OrderedObjParser(this.options, this.externalEntities);
		const orderedResult = orderedObjParser.parseXml(xmlData);
		if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
		else return prettify(orderedResult, this.options, orderedObjParser.matcher, orderedObjParser.readonlyMatcher);
	}
	/**
	* Add Entity which is not by default supported by this library
	* @param {string} key 
	* @param {string} value 
	*/
	addEntity(key, value) {
		if (value.indexOf("&") !== -1) throw new Error("Entity value can't have '&'");
		else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
		else if (value === "&") throw new Error("An entity with value '&' is not permitted");
		else this.externalEntities[key] = value;
	}
	/**
	* Returns a Symbol that can be used to access the metadata
	* property on a node.
	* 
	* If Symbol is not available in the environment, an ordinary property is used
	* and the name of the property is here returned.
	* 
	* The XMLMetaData property is only present when `captureMetaData`
	* is true in the options.
	*/
	static getMetaDataSymbol() {
		return XmlNode.getMetaDataSymbol();
	}
};
//#endregion
//#region ../node_modules/mutative/dist/mutative.esm.mjs
var Operation = {
	Remove: "remove",
	Replace: "replace",
	Add: "add"
};
var PROXY_DRAFT = Symbol.for("__MUTATIVE_PROXY_DRAFT__");
var RAW_RETURN_SYMBOL = Symbol("__MUTATIVE_RAW_RETURN_SYMBOL__");
var iteratorSymbol = Symbol.iterator;
var dataTypes = {
	mutable: "mutable",
	immutable: "immutable"
};
var internal = {};
function has(target, key) {
	return target instanceof Map ? target.has(key) : Object.prototype.hasOwnProperty.call(target, key);
}
function getDescriptor(target, key) {
	if (key in target) {
		let prototype = Reflect.getPrototypeOf(target);
		while (prototype) {
			const descriptor = Reflect.getOwnPropertyDescriptor(prototype, key);
			if (descriptor) return descriptor;
			prototype = Reflect.getPrototypeOf(prototype);
		}
	}
}
function isBaseSetInstance(obj) {
	return Object.getPrototypeOf(obj) === Set.prototype;
}
function isBaseMapInstance(obj) {
	return Object.getPrototypeOf(obj) === Map.prototype;
}
function latest(proxyDraft) {
	var _a;
	return (_a = proxyDraft.copy) !== null && _a !== void 0 ? _a : proxyDraft.original;
}
/**
* Check if the value is a draft
*/
function isDraft(target) {
	return !!getProxyDraft(target);
}
function getProxyDraft(value) {
	if (typeof value !== "object") return null;
	return value === null || value === void 0 ? void 0 : value[PROXY_DRAFT];
}
function getValue(value) {
	var _a;
	const proxyDraft = getProxyDraft(value);
	return proxyDraft ? (_a = proxyDraft.copy) !== null && _a !== void 0 ? _a : proxyDraft.original : value;
}
/**
* Check if a value is draftable
*/
function isDraftable(value, options) {
	if (!value || typeof value !== "object") return false;
	let markResult;
	return Object.getPrototypeOf(value) === Object.prototype || Array.isArray(value) || value instanceof Map || value instanceof Set || !!(options === null || options === void 0 ? void 0 : options.mark) && ((markResult = options.mark(value, dataTypes)) === dataTypes.immutable || typeof markResult === "function");
}
function getPath(target, path = []) {
	if (Object.hasOwnProperty.call(target, "key")) {
		const parentCopy = target.parent.copy;
		const proxyDraft = getProxyDraft(get$2(parentCopy, target.key));
		if (proxyDraft !== null && (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== target.original) return null;
		const isSet = target.parent.type === 3;
		const key = isSet ? Array.from(target.parent.setMap.keys()).indexOf(target.key) : target.key;
		if (!(isSet && parentCopy.size > key || has(parentCopy, key))) return null;
		path.push(key);
	}
	if (target.parent) return getPath(target.parent, path);
	path.reverse();
	try {
		resolvePath(target.copy, path);
	} catch (e) {
		return null;
	}
	return path;
}
function getType(target) {
	if (Array.isArray(target)) return 1;
	if (target instanceof Map) return 2;
	if (target instanceof Set) return 3;
	return 0;
}
function get$2(target, key) {
	return getType(target) === 2 ? target.get(key) : target[key];
}
function set$2(target, key, value) {
	if (getType(target) === 2) target.set(key, value);
	else target[key] = value;
}
function peek(target, key) {
	const state = getProxyDraft(target);
	return (state ? latest(state) : target)[key];
}
function isEqual(x, y) {
	if (x === y) return x !== 0 || 1 / x === 1 / y;
	else return x !== x && y !== y;
}
function revokeProxy(proxyDraft) {
	if (!proxyDraft) return;
	while (proxyDraft.finalities.revoke.length > 0) proxyDraft.finalities.revoke.pop()();
}
function escapePath(path, pathAsArray) {
	return pathAsArray ? path : [""].concat(path).map((_item) => {
		const item = `${_item}`;
		if (item.indexOf("/") === -1 && item.indexOf("~") === -1) return item;
		return item.replace(/~/g, "~0").replace(/\//g, "~1");
	}).join("/");
}
function resolvePath(base, path) {
	for (let index = 0; index < path.length - 1; index += 1) {
		const key = path[index];
		base = get$2(getType(base) === 3 ? Array.from(base) : base, key);
		if (typeof base !== "object") throw new Error(`Cannot resolve patch at '${path.join("/")}'.`);
	}
	return base;
}
function strictCopy(target) {
	const copy = Object.create(Object.getPrototypeOf(target));
	Reflect.ownKeys(target).forEach((key) => {
		let desc = Reflect.getOwnPropertyDescriptor(target, key);
		if (desc.enumerable && desc.configurable && desc.writable) {
			copy[key] = target[key];
			return;
		}
		if (!desc.writable) {
			desc.writable = true;
			desc.configurable = true;
		}
		if (desc.get || desc.set) desc = {
			configurable: true,
			writable: true,
			enumerable: desc.enumerable,
			value: target[key]
		};
		Reflect.defineProperty(copy, key, desc);
	});
	return copy;
}
var propIsEnum = Object.prototype.propertyIsEnumerable;
function shallowCopy(original, options) {
	let markResult;
	if (Array.isArray(original)) return Array.prototype.concat.call(original);
	else if (original instanceof Set) {
		if (!isBaseSetInstance(original)) {
			const SubClass = Object.getPrototypeOf(original).constructor;
			return new SubClass(original.values());
		}
		return Set.prototype.difference ? Set.prototype.difference.call(original, /* @__PURE__ */ new Set()) : new Set(original.values());
	} else if (original instanceof Map) {
		if (!isBaseMapInstance(original)) {
			const SubClass = Object.getPrototypeOf(original).constructor;
			return new SubClass(original);
		}
		return new Map(original);
	} else if ((options === null || options === void 0 ? void 0 : options.mark) && (markResult = options.mark(original, dataTypes), markResult !== void 0) && markResult !== dataTypes.mutable) {
		if (markResult === dataTypes.immutable) return strictCopy(original);
		else if (typeof markResult === "function") {
			if (options.enablePatches || options.enableAutoFreeze) throw new Error(`You can't use mark and patches or auto freeze together.`);
			return markResult();
		}
		throw new Error(`Unsupported mark result: ${markResult}`);
	} else if (typeof original === "object" && Object.getPrototypeOf(original) === Object.prototype) {
		const copy = {};
		Object.keys(original).forEach((key) => {
			copy[key] = original[key];
		});
		Object.getOwnPropertySymbols(original).forEach((key) => {
			if (propIsEnum.call(original, key)) copy[key] = original[key];
		});
		return copy;
	} else throw new Error(`Please check mark() to ensure that it is a stable marker draftable function.`);
}
function ensureShallowCopy(target) {
	if (target.copy) return;
	target.copy = shallowCopy(target.original, target.options);
}
function deepClone(target) {
	if (!isDraftable(target)) return getValue(target);
	if (Array.isArray(target)) return target.map(deepClone);
	if (target instanceof Map) {
		const iterable = Array.from(target.entries()).map(([k, v]) => [k, deepClone(v)]);
		if (!isBaseMapInstance(target)) {
			const SubClass = Object.getPrototypeOf(target).constructor;
			return new SubClass(iterable);
		}
		return new Map(iterable);
	}
	if (target instanceof Set) {
		const iterable = Array.from(target).map(deepClone);
		if (!isBaseSetInstance(target)) {
			const SubClass = Object.getPrototypeOf(target).constructor;
			return new SubClass(iterable);
		}
		return new Set(iterable);
	}
	const copy = Object.create(Object.getPrototypeOf(target));
	for (const key in target) copy[key] = deepClone(target[key]);
	return copy;
}
function cloneIfNeeded(target) {
	return isDraft(target) ? deepClone(target) : target;
}
function markChanged(proxyDraft) {
	var _a;
	proxyDraft.assignedMap = (_a = proxyDraft.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
	if (!proxyDraft.operated) {
		proxyDraft.operated = true;
		if (proxyDraft.parent) markChanged(proxyDraft.parent);
	}
}
function throwFrozenError() {
	throw new Error("Cannot modify frozen object");
}
function deepFreeze(target, subKey, updatedValues, stack, keys) {
	{
		updatedValues = updatedValues !== null && updatedValues !== void 0 ? updatedValues : /* @__PURE__ */ new WeakMap();
		stack = stack !== null && stack !== void 0 ? stack : [];
		keys = keys !== null && keys !== void 0 ? keys : [];
		const value = updatedValues.has(target) ? updatedValues.get(target) : target;
		if (stack.length > 0) {
			const index = stack.indexOf(value);
			if (value && typeof value === "object" && index !== -1) {
				if (stack[0] === value) throw new Error(`Forbids circular reference`);
				throw new Error(`Forbids circular reference: ~/${keys.slice(0, index).map((key, index) => {
					if (typeof key === "symbol") return `[${key.toString()}]`;
					const parent = stack[index];
					if (typeof key === "object" && (parent instanceof Map || parent instanceof Set)) return Array.from(parent.keys()).indexOf(key);
					return key;
				}).join("/")}`);
			}
			stack.push(value);
			keys.push(subKey);
		} else stack.push(value);
	}
	if (Object.isFrozen(target) || isDraft(target)) {
		stack.pop();
		keys.pop();
		return;
	}
	switch (getType(target)) {
		case 2:
			for (const [key, value] of target) {
				deepFreeze(key, key, updatedValues, stack, keys);
				deepFreeze(value, key, updatedValues, stack, keys);
			}
			target.set = target.clear = target.delete = throwFrozenError;
			break;
		case 3:
			for (const value of target) deepFreeze(value, value, updatedValues, stack, keys);
			target.add = target.clear = target.delete = throwFrozenError;
			break;
		case 1:
			Object.freeze(target);
			let index = 0;
			for (const value of target) {
				deepFreeze(value, index, updatedValues, stack, keys);
				index += 1;
			}
			break;
		default:
			Object.freeze(target);
			Object.keys(target).forEach((name) => {
				const value = target[name];
				deepFreeze(value, name, updatedValues, stack, keys);
			});
	}
	stack.pop();
	keys.pop();
}
function forEach(target, iter) {
	const type = getType(target);
	if (type === 0) Reflect.ownKeys(target).forEach((key) => {
		iter(key, target[key], target);
	});
	else if (type === 1) {
		let index = 0;
		for (const entry of target) {
			iter(index, entry, target);
			index += 1;
		}
	} else target.forEach((entry, index) => iter(index, entry, target));
}
function handleValue(target, handledSet, options) {
	if (isDraft(target) || !isDraftable(target, options) || handledSet.has(target) || Object.isFrozen(target)) return;
	const isSet = target instanceof Set;
	const setMap = isSet ? /* @__PURE__ */ new Map() : void 0;
	handledSet.add(target);
	forEach(target, (key, value) => {
		var _a;
		if (isDraft(value)) {
			const proxyDraft = getProxyDraft(value);
			ensureShallowCopy(proxyDraft);
			const updatedValue = ((_a = proxyDraft.assignedMap) === null || _a === void 0 ? void 0 : _a.size) || proxyDraft.operated ? proxyDraft.copy : proxyDraft.original;
			set$2(isSet ? setMap : target, key, updatedValue);
		} else handleValue(value, handledSet, options);
	});
	if (setMap) {
		const set = target;
		const values = Array.from(set);
		set.clear();
		values.forEach((value) => {
			set.add(setMap.has(value) ? setMap.get(value) : value);
		});
	}
}
function finalizeAssigned(proxyDraft, key) {
	const copy = proxyDraft.type === 3 ? proxyDraft.setMap : proxyDraft.copy;
	if (proxyDraft.finalities.revoke.length > 1 && proxyDraft.assignedMap.get(key) && copy) handleValue(get$2(copy, key), proxyDraft.finalities.handledSet, proxyDraft.options);
}
function finalizeSetValue(target) {
	if (target.type === 3 && target.copy) {
		target.copy.clear();
		target.setMap.forEach((value) => {
			target.copy.add(getValue(value));
		});
	}
}
function finalizePatches(target, generatePatches, patches, inversePatches) {
	if (target.operated && target.assignedMap && target.assignedMap.size > 0 && !target.finalized) {
		if (patches && inversePatches) {
			const basePath = getPath(target);
			if (basePath) generatePatches(target, basePath, patches, inversePatches);
		}
		target.finalized = true;
	}
}
function markFinalization(target, key, value, generatePatches) {
	const proxyDraft = getProxyDraft(value);
	if (proxyDraft) {
		if (!proxyDraft.callbacks) proxyDraft.callbacks = [];
		proxyDraft.callbacks.push((patches, inversePatches) => {
			var _a;
			const copy = target.type === 3 ? target.setMap : target.copy;
			if (isEqual(get$2(copy, key), value)) {
				let updatedValue = proxyDraft.original;
				if (proxyDraft.copy) updatedValue = proxyDraft.copy;
				finalizeSetValue(target);
				finalizePatches(target, generatePatches, patches, inversePatches);
				if (target.options.enableAutoFreeze) {
					target.options.updatedValues = (_a = target.options.updatedValues) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new WeakMap();
					target.options.updatedValues.set(updatedValue, proxyDraft.original);
				}
				set$2(copy, key, updatedValue);
			}
		});
		if (target.options.enableAutoFreeze) {
			if (proxyDraft.finalities !== target.finalities) target.options.enableAutoFreeze = false;
		}
	}
	if (isDraftable(value, target.options)) target.finalities.draft.push(() => {
		if (isEqual(get$2(target.type === 3 ? target.setMap : target.copy, key), value)) finalizeAssigned(target, key);
	});
}
function generateArrayPatches(proxyState, basePath, patches, inversePatches, pathAsArray) {
	let { original, assignedMap, options } = proxyState;
	let copy = proxyState.copy;
	if (copy.length < original.length) {
		[original, copy] = [copy, original];
		[patches, inversePatches] = [inversePatches, patches];
	}
	for (let index = 0; index < original.length; index += 1) if (assignedMap.get(index.toString()) && copy[index] !== original[index]) {
		const path = escapePath(basePath.concat([index]), pathAsArray);
		patches.push({
			op: Operation.Replace,
			path,
			value: cloneIfNeeded(copy[index])
		});
		inversePatches.push({
			op: Operation.Replace,
			path,
			value: cloneIfNeeded(original[index])
		});
	}
	for (let index = original.length; index < copy.length; index += 1) {
		const path = escapePath(basePath.concat([index]), pathAsArray);
		patches.push({
			op: Operation.Add,
			path,
			value: cloneIfNeeded(copy[index])
		});
	}
	if (original.length < copy.length) {
		const { arrayLengthAssignment = true } = options.enablePatches;
		if (arrayLengthAssignment) {
			const path = escapePath(basePath.concat(["length"]), pathAsArray);
			inversePatches.push({
				op: Operation.Replace,
				path,
				value: original.length
			});
		} else for (let index = copy.length; original.length < index; index -= 1) {
			const path = escapePath(basePath.concat([index - 1]), pathAsArray);
			inversePatches.push({
				op: Operation.Remove,
				path
			});
		}
	}
}
function generatePatchesFromAssigned({ original, copy, assignedMap }, basePath, patches, inversePatches, pathAsArray) {
	assignedMap.forEach((assignedValue, key) => {
		const originalValue = get$2(original, key);
		const value = cloneIfNeeded(get$2(copy, key));
		const op = !assignedValue ? Operation.Remove : has(original, key) ? Operation.Replace : Operation.Add;
		if (isEqual(originalValue, value) && op === Operation.Replace) return;
		const path = escapePath(basePath.concat(key), pathAsArray);
		patches.push(op === Operation.Remove ? {
			op,
			path
		} : {
			op,
			path,
			value
		});
		inversePatches.push(op === Operation.Add ? {
			op: Operation.Remove,
			path
		} : op === Operation.Remove ? {
			op: Operation.Add,
			path,
			value: originalValue
		} : {
			op: Operation.Replace,
			path,
			value: originalValue
		});
	});
}
function generateSetPatches({ original, copy }, basePath, patches, inversePatches, pathAsArray) {
	let index = 0;
	original.forEach((value) => {
		if (!copy.has(value)) {
			const path = escapePath(basePath.concat([index]), pathAsArray);
			patches.push({
				op: Operation.Remove,
				path,
				value
			});
			inversePatches.unshift({
				op: Operation.Add,
				path,
				value
			});
		}
		index += 1;
	});
	index = 0;
	copy.forEach((value) => {
		if (!original.has(value)) {
			const path = escapePath(basePath.concat([index]), pathAsArray);
			patches.push({
				op: Operation.Add,
				path,
				value
			});
			inversePatches.unshift({
				op: Operation.Remove,
				path,
				value
			});
		}
		index += 1;
	});
}
function generatePatches(proxyState, basePath, patches, inversePatches) {
	const { pathAsArray = true } = proxyState.options.enablePatches;
	switch (proxyState.type) {
		case 0:
		case 2: return generatePatchesFromAssigned(proxyState, basePath, patches, inversePatches, pathAsArray);
		case 1: return generateArrayPatches(proxyState, basePath, patches, inversePatches, pathAsArray);
		case 3: return generateSetPatches(proxyState, basePath, patches, inversePatches, pathAsArray);
	}
}
var readable = false;
var checkReadable = (value, options, ignoreCheckDraftable = false) => {
	if (typeof value === "object" && value !== null && (!isDraftable(value, options) || ignoreCheckDraftable) && !readable) throw new Error(`Strict mode: Mutable data cannot be accessed directly, please use 'unsafe(callback)' wrap.`);
};
var mapHandler = {
	get size() {
		return latest(getProxyDraft(this)).size;
	},
	has(key) {
		return latest(getProxyDraft(this)).has(key);
	},
	set(key, value) {
		const target = getProxyDraft(this);
		const source = latest(target);
		if (!source.has(key) || !isEqual(source.get(key), value)) {
			ensureShallowCopy(target);
			markChanged(target);
			target.assignedMap.set(key, true);
			target.copy.set(key, value);
			markFinalization(target, key, value, generatePatches);
		}
		return this;
	},
	delete(key) {
		if (!this.has(key)) return false;
		const target = getProxyDraft(this);
		ensureShallowCopy(target);
		markChanged(target);
		if (target.original.has(key)) target.assignedMap.set(key, false);
		else target.assignedMap.delete(key);
		target.copy.delete(key);
		return true;
	},
	clear() {
		const target = getProxyDraft(this);
		if (!this.size) return;
		ensureShallowCopy(target);
		markChanged(target);
		target.assignedMap = /* @__PURE__ */ new Map();
		for (const [key] of target.original) target.assignedMap.set(key, false);
		target.copy.clear();
	},
	forEach(callback, thisArg) {
		latest(getProxyDraft(this)).forEach((_value, _key) => {
			callback.call(thisArg, this.get(_key), _key, this);
		});
	},
	get(key) {
		var _a, _b;
		const target = getProxyDraft(this);
		const value = latest(target).get(key);
		const mutable = ((_b = (_a = target.options).mark) === null || _b === void 0 ? void 0 : _b.call(_a, value, dataTypes)) === dataTypes.mutable;
		if (target.options.strict) checkReadable(value, target.options, mutable);
		if (mutable) return value;
		if (target.finalized || !isDraftable(value, target.options)) return value;
		if (value !== target.original.get(key)) return value;
		const draft = internal.createDraft({
			original: value,
			parentDraft: target,
			key,
			finalities: target.finalities,
			options: target.options
		});
		ensureShallowCopy(target);
		target.copy.set(key, draft);
		return draft;
	},
	keys() {
		return latest(getProxyDraft(this)).keys();
	},
	values() {
		const iterator = this.keys();
		return {
			[iteratorSymbol]: () => this.values(),
			next: () => {
				const result = iterator.next();
				if (result.done) return result;
				return {
					done: false,
					value: this.get(result.value)
				};
			}
		};
	},
	entries() {
		const iterator = this.keys();
		return {
			[iteratorSymbol]: () => this.entries(),
			next: () => {
				const result = iterator.next();
				if (result.done) return result;
				const value = this.get(result.value);
				return {
					done: false,
					value: [result.value, value]
				};
			}
		};
	},
	[iteratorSymbol]() {
		return this.entries();
	}
};
var mapHandlerKeys = Reflect.ownKeys(mapHandler);
var getNextIterator = (target, iterator, { isValuesIterator }) => () => {
	var _a, _b;
	const result = iterator.next();
	if (result.done) return result;
	const key = result.value;
	let value = target.setMap.get(key);
	const currentDraft = getProxyDraft(value);
	const mutable = ((_b = (_a = target.options).mark) === null || _b === void 0 ? void 0 : _b.call(_a, value, dataTypes)) === dataTypes.mutable;
	if (target.options.strict) checkReadable(key, target.options, mutable);
	if (!mutable && !currentDraft && isDraftable(key, target.options) && !target.finalized && target.original.has(key)) {
		const proxy = internal.createDraft({
			original: key,
			parentDraft: target,
			key,
			finalities: target.finalities,
			options: target.options
		});
		target.setMap.set(key, proxy);
		value = proxy;
	} else if (currentDraft) value = currentDraft.proxy;
	return {
		done: false,
		value: isValuesIterator ? value : [value, value]
	};
};
var setHandler = {
	get size() {
		return getProxyDraft(this).setMap.size;
	},
	has(value) {
		const target = getProxyDraft(this);
		if (target.setMap.has(value)) return true;
		ensureShallowCopy(target);
		const valueProxyDraft = getProxyDraft(value);
		if (valueProxyDraft && target.setMap.has(valueProxyDraft.original)) return true;
		return false;
	},
	add(value) {
		const target = getProxyDraft(this);
		if (!this.has(value)) {
			ensureShallowCopy(target);
			markChanged(target);
			target.assignedMap.set(value, true);
			target.setMap.set(value, value);
			markFinalization(target, value, value, generatePatches);
		}
		return this;
	},
	delete(value) {
		if (!this.has(value)) return false;
		const target = getProxyDraft(this);
		ensureShallowCopy(target);
		markChanged(target);
		const valueProxyDraft = getProxyDraft(value);
		if (valueProxyDraft && target.setMap.has(valueProxyDraft.original)) {
			target.assignedMap.set(valueProxyDraft.original, false);
			return target.setMap.delete(valueProxyDraft.original);
		}
		if (!valueProxyDraft && target.setMap.has(value)) target.assignedMap.set(value, false);
		else target.assignedMap.delete(value);
		return target.setMap.delete(value);
	},
	clear() {
		if (!this.size) return;
		const target = getProxyDraft(this);
		ensureShallowCopy(target);
		markChanged(target);
		for (const value of target.original) target.assignedMap.set(value, false);
		target.setMap.clear();
	},
	values() {
		const target = getProxyDraft(this);
		ensureShallowCopy(target);
		const iterator = target.setMap.keys();
		return {
			[Symbol.iterator]: () => this.values(),
			next: getNextIterator(target, iterator, { isValuesIterator: true })
		};
	},
	entries() {
		const target = getProxyDraft(this);
		ensureShallowCopy(target);
		const iterator = target.setMap.keys();
		return {
			[Symbol.iterator]: () => this.entries(),
			next: getNextIterator(target, iterator, { isValuesIterator: false })
		};
	},
	keys() {
		return this.values();
	},
	[iteratorSymbol]() {
		return this.values();
	},
	forEach(callback, thisArg) {
		const iterator = this.values();
		let result = iterator.next();
		while (!result.done) {
			callback.call(thisArg, result.value, result.value, this);
			result = iterator.next();
		}
	}
};
if (Set.prototype.difference) Object.assign(setHandler, {
	intersection(other) {
		return Set.prototype.intersection.call(new Set(this.values()), other);
	},
	union(other) {
		return Set.prototype.union.call(new Set(this.values()), other);
	},
	difference(other) {
		return Set.prototype.difference.call(new Set(this.values()), other);
	},
	symmetricDifference(other) {
		return Set.prototype.symmetricDifference.call(new Set(this.values()), other);
	},
	isSubsetOf(other) {
		return Set.prototype.isSubsetOf.call(new Set(this.values()), other);
	},
	isSupersetOf(other) {
		return Set.prototype.isSupersetOf.call(new Set(this.values()), other);
	},
	isDisjointFrom(other) {
		return Set.prototype.isDisjointFrom.call(new Set(this.values()), other);
	}
});
var setHandlerKeys = Reflect.ownKeys(setHandler);
var proxyHandler = {
	get(target, key, receiver) {
		var _a, _b;
		const copy = (_a = target.copy) === null || _a === void 0 ? void 0 : _a[key];
		if (copy && target.finalities.draftsCache.has(copy)) return copy;
		if (key === PROXY_DRAFT) return target;
		let markResult;
		if (target.options.mark) {
			const value = key === "size" && (target.original instanceof Map || target.original instanceof Set) ? Reflect.get(target.original, key) : Reflect.get(target.original, key, receiver);
			markResult = target.options.mark(value, dataTypes);
			if (markResult === dataTypes.mutable) {
				if (target.options.strict) checkReadable(value, target.options, true);
				return value;
			}
		}
		const source = latest(target);
		if (source instanceof Map && mapHandlerKeys.includes(key)) {
			if (key === "size") return Object.getOwnPropertyDescriptor(mapHandler, "size").get.call(target.proxy);
			return mapHandler[key].bind(target.proxy);
		}
		if (source instanceof Set && setHandlerKeys.includes(key)) {
			if (key === "size") return Object.getOwnPropertyDescriptor(setHandler, "size").get.call(target.proxy);
			return setHandler[key].bind(target.proxy);
		}
		if (!has(source, key)) {
			const desc = getDescriptor(source, key);
			return desc ? `value` in desc ? desc.value : (_b = desc.get) === null || _b === void 0 ? void 0 : _b.call(target.proxy) : void 0;
		}
		const value = source[key];
		if (target.options.strict) checkReadable(value, target.options);
		if (target.finalized || !isDraftable(value, target.options)) return value;
		if (value === peek(target.original, key)) {
			ensureShallowCopy(target);
			target.copy[key] = createDraft({
				original: target.original[key],
				parentDraft: target,
				key: target.type === 1 ? Number(key) : key,
				finalities: target.finalities,
				options: target.options
			});
			if (typeof markResult === "function") {
				const subProxyDraft = getProxyDraft(target.copy[key]);
				ensureShallowCopy(subProxyDraft);
				markChanged(subProxyDraft);
				return subProxyDraft.copy;
			}
			return target.copy[key];
		}
		if (isDraft(value)) target.finalities.draftsCache.add(value);
		return value;
	},
	set(target, key, value) {
		var _a;
		if (target.type === 3 || target.type === 2) throw new Error(`Map/Set draft does not support any property assignment.`);
		let _key;
		if (target.type === 1 && key !== "length" && !(Number.isInteger(_key = Number(key)) && _key >= 0 && (key === 0 || _key === 0 || String(_key) === String(key)))) throw new Error(`Only supports setting array indices and the 'length' property.`);
		const desc = getDescriptor(latest(target), key);
		if (desc === null || desc === void 0 ? void 0 : desc.set) {
			desc.set.call(target.proxy, value);
			return true;
		}
		const current = peek(latest(target), key);
		const currentProxyDraft = getProxyDraft(current);
		if (currentProxyDraft && isEqual(currentProxyDraft.original, value)) {
			target.copy[key] = value;
			target.assignedMap = (_a = target.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
			target.assignedMap.set(key, false);
			return true;
		}
		if (isEqual(value, current) && (value !== void 0 || has(target.original, key))) return true;
		ensureShallowCopy(target);
		markChanged(target);
		if (has(target.original, key) && isEqual(value, target.original[key])) target.assignedMap.delete(key);
		else target.assignedMap.set(key, true);
		target.copy[key] = value;
		markFinalization(target, key, value, generatePatches);
		return true;
	},
	has(target, key) {
		return key in latest(target);
	},
	ownKeys(target) {
		return Reflect.ownKeys(latest(target));
	},
	getOwnPropertyDescriptor(target, key) {
		const source = latest(target);
		const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
		if (!descriptor) return descriptor;
		return {
			writable: true,
			configurable: target.type !== 1 || key !== "length",
			enumerable: descriptor.enumerable,
			value: source[key]
		};
	},
	getPrototypeOf(target) {
		return Reflect.getPrototypeOf(target.original);
	},
	setPrototypeOf() {
		throw new Error(`Cannot call 'setPrototypeOf()' on drafts`);
	},
	defineProperty() {
		throw new Error(`Cannot call 'defineProperty()' on drafts`);
	},
	deleteProperty(target, key) {
		var _a;
		if (target.type === 1) return proxyHandler.set.call(this, target, key, void 0, target.proxy);
		if (peek(target.original, key) !== void 0 || key in target.original) {
			ensureShallowCopy(target);
			markChanged(target);
			target.assignedMap.set(key, false);
		} else {
			target.assignedMap = (_a = target.assignedMap) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Map();
			target.assignedMap.delete(key);
		}
		if (target.copy) delete target.copy[key];
		return true;
	}
};
function createDraft(createDraftOptions) {
	const { original, parentDraft, key, finalities, options } = createDraftOptions;
	const type = getType(original);
	const proxyDraft = {
		type,
		finalized: false,
		parent: parentDraft,
		original,
		copy: null,
		proxy: null,
		finalities,
		options,
		setMap: type === 3 ? new Map(original.entries()) : void 0
	};
	if (key || "key" in createDraftOptions) proxyDraft.key = key;
	const { proxy, revoke } = Proxy.revocable(type === 1 ? Object.assign([], proxyDraft) : proxyDraft, proxyHandler);
	finalities.revoke.push(revoke);
	proxyDraft.proxy = proxy;
	if (parentDraft) {
		const target = parentDraft;
		target.finalities.draft.push((patches, inversePatches) => {
			var _a, _b;
			const oldProxyDraft = getProxyDraft(proxy);
			let copy = target.type === 3 ? target.setMap : target.copy;
			const draft = get$2(copy, key);
			const proxyDraft = getProxyDraft(draft);
			if (proxyDraft) {
				let updatedValue = proxyDraft.original;
				if (proxyDraft.operated) updatedValue = getValue(draft);
				finalizeSetValue(proxyDraft);
				finalizePatches(proxyDraft, generatePatches, patches, inversePatches);
				if (target.options.enableAutoFreeze) {
					target.options.updatedValues = (_a = target.options.updatedValues) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new WeakMap();
					target.options.updatedValues.set(updatedValue, proxyDraft.original);
				}
				set$2(copy, key, updatedValue);
			}
			(_b = oldProxyDraft.callbacks) === null || _b === void 0 || _b.forEach((callback) => {
				callback(patches, inversePatches);
			});
		});
	} else {
		const target = getProxyDraft(proxy);
		target.finalities.draft.push((patches, inversePatches) => {
			finalizeSetValue(target);
			finalizePatches(target, generatePatches, patches, inversePatches);
		});
	}
	return proxy;
}
internal.createDraft = createDraft;
function finalizeDraft(result, returnedValue, patches, inversePatches, enableAutoFreeze) {
	var _a;
	const proxyDraft = getProxyDraft(result);
	const original = (_a = proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== null && _a !== void 0 ? _a : result;
	const hasReturnedValue = !!returnedValue.length;
	if (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.operated) while (proxyDraft.finalities.draft.length > 0) proxyDraft.finalities.draft.pop()(patches, inversePatches);
	const state = hasReturnedValue ? returnedValue[0] : proxyDraft ? proxyDraft.operated ? proxyDraft.copy : proxyDraft.original : result;
	if (proxyDraft) revokeProxy(proxyDraft);
	if (enableAutoFreeze) deepFreeze(state, state, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options.updatedValues);
	return [
		state,
		patches && hasReturnedValue ? [{
			op: Operation.Replace,
			path: [],
			value: returnedValue[0]
		}] : patches,
		inversePatches && hasReturnedValue ? [{
			op: Operation.Replace,
			path: [],
			value: original
		}] : inversePatches
	];
}
function draftify(baseState, options) {
	var _a;
	const finalities = {
		draft: [],
		revoke: [],
		handledSet: /* @__PURE__ */ new WeakSet(),
		draftsCache: /* @__PURE__ */ new WeakSet()
	};
	let patches;
	let inversePatches;
	if (options.enablePatches) {
		patches = [];
		inversePatches = [];
	}
	const draft = ((_a = options.mark) === null || _a === void 0 ? void 0 : _a.call(options, baseState, dataTypes)) === dataTypes.mutable || !isDraftable(baseState, options) ? baseState : createDraft({
		original: baseState,
		parentDraft: null,
		finalities,
		options
	});
	return [draft, (returnedValue = []) => {
		const [finalizedState, finalizedPatches, finalizedInversePatches] = finalizeDraft(draft, returnedValue, patches, inversePatches, options.enableAutoFreeze);
		return options.enablePatches ? [
			finalizedState,
			finalizedPatches,
			finalizedInversePatches
		] : finalizedState;
	}];
}
function handleReturnValue(options) {
	const { rootDraft, value, useRawReturn = false, isRoot = true } = options;
	forEach(value, (key, item, source) => {
		const proxyDraft = getProxyDraft(item);
		if (proxyDraft && rootDraft && proxyDraft.finalities === rootDraft.finalities) {
			options.isContainDraft = true;
			const currentValue = proxyDraft.original;
			if (source instanceof Set) {
				const arr = Array.from(source);
				source.clear();
				arr.forEach((_item) => source.add(key === _item ? currentValue : _item));
			} else set$2(source, key, currentValue);
		} else if (typeof item === "object" && item !== null) {
			options.value = item;
			options.isRoot = false;
			handleReturnValue(options);
		}
	});
	if (isRoot) {
		if (!options.isContainDraft) console.warn(`The return value does not contain any draft, please use 'rawReturn()' to wrap the return value to improve performance.`);
		if (useRawReturn) console.warn(`The return value contains drafts, please don't use 'rawReturn()' to wrap the return value.`);
	}
}
function getCurrent(target) {
	var _a;
	const proxyDraft = getProxyDraft(target);
	if (!isDraftable(target, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options)) return target;
	const type = getType(target);
	if (proxyDraft && !proxyDraft.operated) return proxyDraft.original;
	let currentValue;
	function ensureShallowCopy() {
		currentValue = type === 2 ? !isBaseMapInstance(target) ? new (Object.getPrototypeOf(target)).constructor(target) : new Map(target) : type === 3 ? Array.from(proxyDraft.setMap.values()) : shallowCopy(target, proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.options);
	}
	if (proxyDraft) {
		proxyDraft.finalized = true;
		try {
			ensureShallowCopy();
		} finally {
			proxyDraft.finalized = false;
		}
	} else currentValue = target;
	forEach(currentValue, (key, value) => {
		if (proxyDraft && isEqual(get$2(proxyDraft.original, key), value)) return;
		const newValue = getCurrent(value);
		if (newValue !== value) {
			if (currentValue === target) ensureShallowCopy();
			set$2(currentValue, key, newValue);
		}
	});
	if (type === 3) {
		const value = (_a = proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.original) !== null && _a !== void 0 ? _a : currentValue;
		return !isBaseSetInstance(value) ? new (Object.getPrototypeOf(value)).constructor(currentValue) : new Set(currentValue);
	}
	return currentValue;
}
function current(target) {
	if (!isDraft(target)) throw new Error(`current() is only used for Draft, parameter: ${target}`);
	return getCurrent(target);
}
/**
* `makeCreator(options)` to make a creator function.
*
* ## Example
*
* ```ts
* import { makeCreator } from '../index';
*
* const baseState = { foo: { bar: 'str' }, arr: [] };
* const create = makeCreator({ enableAutoFreeze: true });
* const state = create(
*   baseState,
*   (draft) => {
*     draft.foo.bar = 'str2';
*   },
* );
*
* expect(state).toEqual({ foo: { bar: 'str2' }, arr: [] });
* expect(state).not.toBe(baseState);
* expect(state.foo).not.toBe(baseState.foo);
* expect(state.arr).toBe(baseState.arr);
* expect(Object.isFrozen(state)).toBeTruthy();
* ```
*/
var makeCreator = (arg) => {
	if (arg !== void 0 && Object.prototype.toString.call(arg) !== "[object Object]") throw new Error(`Invalid options: ${String(arg)}, 'options' should be an object.`);
	return function create(arg0, arg1, arg2) {
		var _a, _b, _c;
		if (typeof arg0 === "function" && typeof arg1 !== "function") return function(base, ...args) {
			return create(base, (draft) => arg0.call(this, draft, ...args), arg1);
		};
		const base = arg0;
		const mutate = arg1;
		let options = arg2;
		if (typeof arg1 !== "function") options = arg1;
		if (options !== void 0 && Object.prototype.toString.call(options) !== "[object Object]") throw new Error(`Invalid options: ${options}, 'options' should be an object.`);
		options = Object.assign(Object.assign({}, arg), options);
		const state = isDraft(base) ? current(base) : base;
		const mark = Array.isArray(options.mark) ? ((value, types) => {
			for (const mark of options.mark) {
				if (typeof mark !== "function") throw new Error(`Invalid mark: ${mark}, 'mark' should be a function.`);
				const result = mark(value, types);
				if (result) return result;
			}
		}) : options.mark;
		const enablePatches = (_a = options.enablePatches) !== null && _a !== void 0 ? _a : false;
		const strict = (_b = options.strict) !== null && _b !== void 0 ? _b : false;
		const _options = {
			enableAutoFreeze: (_c = options.enableAutoFreeze) !== null && _c !== void 0 ? _c : false,
			mark,
			strict,
			enablePatches
		};
		if (!isDraftable(state, _options) && typeof state === "object" && state !== null) throw new Error(`Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.`);
		const [draft, finalize] = draftify(state, _options);
		if (typeof arg1 !== "function") {
			if (!isDraftable(state, _options)) throw new Error(`Invalid base state: create() only supports plain objects, arrays, Set, Map or using mark() to mark the state as immutable.`);
			return [draft, finalize];
		}
		let result;
		try {
			result = mutate(draft);
		} catch (error) {
			revokeProxy(getProxyDraft(draft));
			throw error;
		}
		const returnValue = (value) => {
			const proxyDraft = getProxyDraft(draft);
			if (!isDraft(value)) {
				if (value !== void 0 && !isEqual(value, draft) && (proxyDraft === null || proxyDraft === void 0 ? void 0 : proxyDraft.operated)) throw new Error(`Either the value is returned as a new non-draft value, or only the draft is modified without returning any value.`);
				const rawReturnValue = value === null || value === void 0 ? void 0 : value[RAW_RETURN_SYMBOL];
				if (rawReturnValue) {
					const _value = rawReturnValue[0];
					if (_options.strict && typeof value === "object" && value !== null) handleReturnValue({
						rootDraft: proxyDraft,
						value,
						useRawReturn: true
					});
					return finalize([_value]);
				}
				if (value !== void 0) {
					if (typeof value === "object" && value !== null) handleReturnValue({
						rootDraft: proxyDraft,
						value
					});
					return finalize([value]);
				}
			}
			if (value === draft || value === void 0) return finalize([]);
			const returnedProxyDraft = getProxyDraft(value);
			if (_options === returnedProxyDraft.options) {
				if (returnedProxyDraft.operated) throw new Error(`Cannot return a modified child draft.`);
				return finalize([current(value)]);
			}
			return finalize([value]);
		};
		if (result instanceof Promise) return result.then(returnValue, (error) => {
			revokeProxy(getProxyDraft(draft));
			throw error;
		});
		return returnValue(result);
	};
};
/**
* `create(baseState, callback, options)` to create the next state
*
* ## Example
*
* ```ts
* import { create } from '../index';
*
* const baseState = { foo: { bar: 'str' }, arr: [] };
* const state = create(
*   baseState,
*   (draft) => {
*     draft.foo.bar = 'str2';
*   },
* );
*
* expect(state).toEqual({ foo: { bar: 'str2' }, arr: [] });
* expect(state).not.toBe(baseState);
* expect(state.foo).not.toBe(baseState.foo);
* expect(state.arr).toBe(baseState.arr);
* ```
*/
var create$1 = makeCreator();
Object.prototype.constructor.toString();
//#endregion
//#region ../node_modules/classcat/index.js
function cc(names) {
	if (typeof names === "string" || typeof names === "number") return "" + names;
	let out = "";
	if (Array.isArray(names)) {
		for (let i = 0, tmp; i < names.length; i++) if ((tmp = cc(names[i])) !== "") out += (out && " ") + tmp;
	} else for (let k in names) if (names[k]) out += (out && " ") + k;
	return out;
}
//#endregion
//#region ../node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
/**
* @license React
* use-sync-external-store-shim.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var useState = React.useState;
	var useEffect = React.useEffect;
	var useLayoutEffect = React.useLayoutEffect;
	var useDebugValue = React.useDebugValue;
	function useSyncExternalStore$2(subscribe, getSnapshot) {
		var value = getSnapshot(), _useState = useState({ inst: {
			value,
			getSnapshot
		} }), inst = _useState[0].inst, forceUpdate = _useState[1];
		useLayoutEffect(function() {
			inst.value = value;
			inst.getSnapshot = getSnapshot;
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
		}, [
			subscribe,
			value,
			getSnapshot
		]);
		useEffect(function() {
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			return subscribe(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			});
		}, [subscribe]);
		useDebugValue(value);
		return value;
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function useSyncExternalStore$1(subscribe, getSnapshot) {
		return getSnapshot();
	}
	var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
	exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
}));
//#endregion
//#region ../node_modules/use-sync-external-store/shim/index.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_shim_production();
}));
//#endregion
//#region ../node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js
/**
* @license React
* use-sync-external-store-shim/with-selector.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_with_selector_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	var shim = require_shim();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var useSyncExternalStore = shim.useSyncExternalStore;
	var useRef = React.useRef;
	var useEffect = React.useEffect;
	var useMemo = React.useMemo;
	var useDebugValue = React.useDebugValue;
	exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
		var instRef = useRef(null);
		if (null === instRef.current) {
			var inst = {
				hasValue: !1,
				value: null
			};
			instRef.current = inst;
		} else inst = instRef.current;
		instRef = useMemo(function() {
			function memoizedSelector(nextSnapshot) {
				if (!hasMemo) {
					hasMemo = !0;
					memoizedSnapshot = nextSnapshot;
					nextSnapshot = selector(nextSnapshot);
					if (void 0 !== isEqual && inst.hasValue) {
						var currentSelection = inst.value;
						if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
					}
					return memoizedSelection = nextSnapshot;
				}
				currentSelection = memoizedSelection;
				if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
				var nextSelection = selector(nextSnapshot);
				if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
				memoizedSnapshot = nextSnapshot;
				return memoizedSelection = nextSelection;
			}
			var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
			return [function() {
				return memoizedSelector(getSnapshot());
			}, null === maybeGetServerSnapshot ? void 0 : function() {
				return memoizedSelector(maybeGetServerSnapshot());
			}];
		}, [
			getSnapshot,
			getServerSnapshot,
			selector,
			isEqual
		]);
		var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
		useEffect(function() {
			inst.hasValue = !0;
			inst.value = value;
		}, [value]);
		useDebugValue(value);
		return value;
	};
}));
//#endregion
//#region ../node_modules/zustand/esm/vanilla.mjs
var import_with_selector = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_with_selector_production();
})))(), 1);
var createStoreImpl = (createState) => {
	let state;
	const listeners = /* @__PURE__ */ new Set();
	const setState = (partial, replace) => {
		const nextState = typeof partial === "function" ? partial(state) : partial;
		if (!Object.is(nextState, state)) {
			const previousState = state;
			state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
			listeners.forEach((listener) => listener(state, previousState));
		}
	};
	const getState = () => state;
	const getInitialState = () => initialState;
	const subscribe = (listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};
	const destroy = () => {
		listeners.clear();
	};
	const api = {
		setState,
		getState,
		getInitialState,
		subscribe,
		destroy
	};
	const initialState = state = createState(setState, getState, api);
	return api;
};
var createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
//#endregion
//#region ../node_modules/zustand/esm/traditional.mjs
var { useDebugValue } = import_react.default;
var { useSyncExternalStoreWithSelector } = import_with_selector.default;
var identity$2 = (arg) => arg;
function useStoreWithEqualityFn(api, selector = identity$2, equalityFn) {
	const slice = useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getServerState || api.getInitialState, selector, equalityFn);
	useDebugValue(slice);
	return slice;
}
var createWithEqualityFnImpl = (createState, defaultEqualityFn) => {
	const api = createStore(createState);
	const useBoundStoreWithEqualityFn = (selector, equalityFn = defaultEqualityFn) => useStoreWithEqualityFn(api, selector, equalityFn);
	Object.assign(useBoundStoreWithEqualityFn, api);
	return useBoundStoreWithEqualityFn;
};
var createWithEqualityFn = (createState, defaultEqualityFn) => createState ? createWithEqualityFnImpl(createState, defaultEqualityFn) : createWithEqualityFnImpl;
//#endregion
//#region ../node_modules/zustand/esm/shallow.mjs
function shallow$1(objA, objB) {
	if (Object.is(objA, objB)) return true;
	if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
	if (objA instanceof Map && objB instanceof Map) {
		if (objA.size !== objB.size) return false;
		for (const [key, value] of objA) if (!Object.is(value, objB.get(key))) return false;
		return true;
	}
	if (objA instanceof Set && objB instanceof Set) {
		if (objA.size !== objB.size) return false;
		for (const value of objA) if (!objB.has(value)) return false;
		return true;
	}
	const keysA = Object.keys(objA);
	if (keysA.length !== Object.keys(objB).length) return false;
	for (const keyA of keysA) if (!Object.prototype.hasOwnProperty.call(objB, keyA) || !Object.is(objA[keyA], objB[keyA])) return false;
	return true;
}
//#endregion
//#region ../node_modules/d3-dispatch/src/dispatch.js
var noop$1 = { value: () => {} };
function dispatch() {
	for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
		if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
		_[t] = [];
	}
	return new Dispatch(_);
}
function Dispatch(_) {
	this._ = _;
}
function parseTypenames$1(typenames, types) {
	return typenames.trim().split(/^|\s+/).map(function(t) {
		var name = "", i = t.indexOf(".");
		if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
		if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
		return {
			type: t,
			name
		};
	});
}
Dispatch.prototype = dispatch.prototype = {
	constructor: Dispatch,
	on: function(typename, callback) {
		var _ = this._, T = parseTypenames$1(typename + "", _), t, i = -1, n = T.length;
		if (arguments.length < 2) {
			while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
			return;
		}
		if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
		while (++i < n) if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
		else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
		return this;
	},
	copy: function() {
		var copy = {}, _ = this._;
		for (var t in _) copy[t] = _[t].slice();
		return new Dispatch(copy);
	},
	call: function(type, that) {
		if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
		if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
		for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	},
	apply: function(type, that, args) {
		if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
		for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	}
};
function get$1(type, name) {
	for (var i = 0, n = type.length, c; i < n; ++i) if ((c = type[i]).name === name) return c.value;
}
function set$1(type, name, callback) {
	for (var i = 0, n = type.length; i < n; ++i) if (type[i].name === name) {
		type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
		break;
	}
	if (callback != null) type.push({
		name,
		value: callback
	});
	return type;
}
var namespaces_default = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region ../node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
	var prefix = name += "", i = prefix.indexOf(":");
	if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	return namespaces_default.hasOwnProperty(prefix) ? {
		space: namespaces_default[prefix],
		local: name
	} : name;
}
//#endregion
//#region ../node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
	return function() {
		var document = this.ownerDocument, uri = this.namespaceURI;
		return uri === "http://www.w3.org/1999/xhtml" && document.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? document.createElement(name) : document.createElementNS(uri, name);
	};
}
function creatorFixed(fullname) {
	return function() {
		return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	};
}
function creator_default(name) {
	var fullname = namespace_default(name);
	return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
//#endregion
//#region ../node_modules/d3-selection/src/selector.js
function none() {}
function selector_default(selector) {
	return selector == null ? none : function() {
		return this.querySelector(selector);
	};
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/select.js
function select_default$2(select) {
	if (typeof select !== "function") select = selector_default(select);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
		if ("__data__" in node) subnode.__data__ = node.__data__;
		subgroup[i] = subnode;
	}
	return new Selection$1(subgroups, this._parents);
}
//#endregion
//#region ../node_modules/d3-selection/src/array.js
function array(x) {
	return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}
//#endregion
//#region ../node_modules/d3-selection/src/selectorAll.js
function empty() {
	return [];
}
function selectorAll_default(selector) {
	return selector == null ? empty : function() {
		return this.querySelectorAll(selector);
	};
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
	return function() {
		return array(select.apply(this, arguments));
	};
}
function selectAll_default$1(select) {
	if (typeof select === "function") select = arrayAll(select);
	else select = selectorAll_default(select);
	for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		subgroups.push(select.call(node, node.__data__, i, group));
		parents.push(node);
	}
	return new Selection$1(subgroups, parents);
}
//#endregion
//#region ../node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
	return function() {
		return this.matches(selector);
	};
}
function childMatcher(selector) {
	return function(node) {
		return node.matches(selector);
	};
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
	return function() {
		return find.call(this.children, match);
	};
}
function childFirst() {
	return this.firstElementChild;
}
function selectChild_default(match) {
	return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
	return Array.from(this.children);
}
function childrenFilter(match) {
	return function() {
		return filter.call(this.children, match);
	};
}
function selectChildren_default(match) {
	return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/filter.js
function filter_default$1(match) {
	if (typeof match !== "function") match = matcher_default(match);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
	return new Selection$1(subgroups, this._parents);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
	return new Array(update.length);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/enter.js
function enter_default() {
	return new Selection$1(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum) {
	this.ownerDocument = parent.ownerDocument;
	this.namespaceURI = parent.namespaceURI;
	this._next = null;
	this._parent = parent;
	this.__data__ = datum;
}
EnterNode.prototype = {
	constructor: EnterNode,
	appendChild: function(child) {
		return this._parent.insertBefore(child, this._next);
	},
	insertBefore: function(child, next) {
		return this._parent.insertBefore(child, next);
	},
	querySelector: function(selector) {
		return this._parent.querySelector(selector);
	},
	querySelectorAll: function(selector) {
		return this._parent.querySelectorAll(selector);
	}
};
//#endregion
//#region ../node_modules/d3-selection/src/constant.js
function constant_default$3(x) {
	return function() {
		return x;
	};
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
	var i = 0, node, groupLength = group.length, dataLength = data.length;
	for (; i < dataLength; ++i) if (node = group[i]) {
		node.__data__ = data[i];
		update[i] = node;
	} else enter[i] = new EnterNode(parent, data[i]);
	for (; i < groupLength; ++i) if (node = group[i]) exit[i] = node;
}
function bindKey(parent, group, enter, update, exit, data, key) {
	var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
	for (i = 0; i < groupLength; ++i) if (node = group[i]) {
		keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
		if (nodeByKeyValue.has(keyValue)) exit[i] = node;
		else nodeByKeyValue.set(keyValue, node);
	}
	for (i = 0; i < dataLength; ++i) {
		keyValue = key.call(parent, data[i], i, data) + "";
		if (node = nodeByKeyValue.get(keyValue)) {
			update[i] = node;
			node.__data__ = data[i];
			nodeByKeyValue.delete(keyValue);
		} else enter[i] = new EnterNode(parent, data[i]);
	}
	for (i = 0; i < groupLength; ++i) if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) exit[i] = node;
}
function datum(node) {
	return node.__data__;
}
function data_default(value, key) {
	if (!arguments.length) return Array.from(this, datum);
	var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
	if (typeof value !== "function") value = constant_default$3(value);
	for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
		var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength);
		bind(parent, group, enterGroup, updateGroup, exit[j] = new Array(groupLength), data, key);
		for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) if (previous = enterGroup[i0]) {
			if (i0 >= i1) i1 = i0 + 1;
			while (!(next = updateGroup[i1]) && ++i1 < dataLength);
			previous._next = next || null;
		}
	}
	update = new Selection$1(update, parents);
	update._enter = enter;
	update._exit = exit;
	return update;
}
function arraylike(data) {
	return typeof data === "object" && "length" in data ? data : Array.from(data);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/exit.js
function exit_default() {
	return new Selection$1(this._exit || this._groups.map(sparse_default), this._parents);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
	var enter = this.enter(), update = this, exit = this.exit();
	if (typeof onenter === "function") {
		enter = onenter(enter);
		if (enter) enter = enter.selection();
	} else enter = enter.append(onenter + "");
	if (onupdate != null) {
		update = onupdate(update);
		if (update) update = update.selection();
	}
	if (onexit == null) exit.remove();
	else onexit(exit);
	return enter && update ? enter.merge(update).order() : update;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/merge.js
function merge_default$1(context) {
	var selection = context.selection ? context.selection() : context;
	for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group0[i] || group1[i]) merge[i] = node;
	for (; j < m0; ++j) merges[j] = groups0[j];
	return new Selection$1(merges, this._parents);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/order.js
function order_default() {
	for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) if (node = group[i]) {
		if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
		next = node;
	}
	return this;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
	if (!compare) compare = ascending;
	function compareNode(a, b) {
		return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	}
	for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
		for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group[i]) sortgroup[i] = node;
		sortgroup.sort(compareNode);
	}
	return new Selection$1(sortgroups, this._parents).order();
}
function ascending(a, b) {
	return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/call.js
function call_default() {
	var callback = arguments[0];
	arguments[0] = this;
	callback.apply(null, arguments);
	return this;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
	return Array.from(this);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/node.js
function node_default() {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
		var node = group[i];
		if (node) return node;
	}
	return null;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/size.js
function size_default() {
	let size = 0;
	for (const node of this) ++size;
	return size;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/empty.js
function empty_default() {
	return !this.node();
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) if (node = group[i]) callback.call(node, node.__data__, i, group);
	return this;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/attr.js
function attrRemove$1(name) {
	return function() {
		this.removeAttribute(name);
	};
}
function attrRemoveNS$1(fullname) {
	return function() {
		this.removeAttributeNS(fullname.space, fullname.local);
	};
}
function attrConstant$1(name, value) {
	return function() {
		this.setAttribute(name, value);
	};
}
function attrConstantNS$1(fullname, value) {
	return function() {
		this.setAttributeNS(fullname.space, fullname.local, value);
	};
}
function attrFunction$1(name, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.removeAttribute(name);
		else this.setAttribute(name, v);
	};
}
function attrFunctionNS$1(fullname, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
		else this.setAttributeNS(fullname.space, fullname.local, v);
	};
}
function attr_default$1(name, value) {
	var fullname = namespace_default(name);
	if (arguments.length < 2) {
		var node = this.node();
		return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
	}
	return this.each((value == null ? fullname.local ? attrRemoveNS$1 : attrRemove$1 : typeof value === "function" ? fullname.local ? attrFunctionNS$1 : attrFunction$1 : fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, value));
}
//#endregion
//#region ../node_modules/d3-selection/src/window.js
function window_default(node) {
	return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/style.js
function styleRemove$1(name) {
	return function() {
		this.style.removeProperty(name);
	};
}
function styleConstant$1(name, value, priority) {
	return function() {
		this.style.setProperty(name, value, priority);
	};
}
function styleFunction$1(name, value, priority) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.style.removeProperty(name);
		else this.style.setProperty(name, v, priority);
	};
}
function style_default$1(name, value, priority) {
	return arguments.length > 1 ? this.each((value == null ? styleRemove$1 : typeof value === "function" ? styleFunction$1 : styleConstant$1)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
	return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
	return function() {
		delete this[name];
	};
}
function propertyConstant(name, value) {
	return function() {
		this[name] = value;
	};
}
function propertyFunction(name, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) delete this[name];
		else this[name] = v;
	};
}
function property_default(name, value) {
	return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
	return string.trim().split(/^|\s+/);
}
function classList(node) {
	return node.classList || new ClassList(node);
}
function ClassList(node) {
	this._node = node;
	this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
	add: function(name) {
		if (this._names.indexOf(name) < 0) {
			this._names.push(name);
			this._node.setAttribute("class", this._names.join(" "));
		}
	},
	remove: function(name) {
		var i = this._names.indexOf(name);
		if (i >= 0) {
			this._names.splice(i, 1);
			this._node.setAttribute("class", this._names.join(" "));
		}
	},
	contains: function(name) {
		return this._names.indexOf(name) >= 0;
	}
};
function classedAdd(node, names) {
	var list = classList(node), i = -1, n = names.length;
	while (++i < n) list.add(names[i]);
}
function classedRemove(node, names) {
	var list = classList(node), i = -1, n = names.length;
	while (++i < n) list.remove(names[i]);
}
function classedTrue(names) {
	return function() {
		classedAdd(this, names);
	};
}
function classedFalse(names) {
	return function() {
		classedRemove(this, names);
	};
}
function classedFunction(names, value) {
	return function() {
		(value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	};
}
function classed_default(name, value) {
	var names = classArray(name + "");
	if (arguments.length < 2) {
		var list = classList(this.node()), i = -1, n = names.length;
		while (++i < n) if (!list.contains(names[i])) return false;
		return true;
	}
	return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/text.js
function textRemove() {
	this.textContent = "";
}
function textConstant$1(value) {
	return function() {
		this.textContent = value;
	};
}
function textFunction$1(value) {
	return function() {
		var v = value.apply(this, arguments);
		this.textContent = v == null ? "" : v;
	};
}
function text_default$1(value) {
	return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction$1 : textConstant$1)(value)) : this.node().textContent;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
	this.innerHTML = "";
}
function htmlConstant(value) {
	return function() {
		this.innerHTML = value;
	};
}
function htmlFunction(value) {
	return function() {
		var v = value.apply(this, arguments);
		this.innerHTML = v == null ? "" : v;
	};
}
function html_default(value) {
	return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/raise.js
function raise() {
	if (this.nextSibling) this.parentNode.appendChild(this);
}
function raise_default() {
	return this.each(raise);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/lower.js
function lower() {
	if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
	return this.each(lower);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/append.js
function append_default(name) {
	var create = typeof name === "function" ? name : creator_default(name);
	return this.select(function() {
		return this.appendChild(create.apply(this, arguments));
	});
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/insert.js
function constantNull() {
	return null;
}
function insert_default(name, before) {
	var create = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
	return this.select(function() {
		return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	});
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/remove.js
function remove() {
	var parent = this.parentNode;
	if (parent) parent.removeChild(this);
}
function remove_default$1() {
	return this.each(remove);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
	var clone = this.cloneNode(false), parent = this.parentNode;
	return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
	var clone = this.cloneNode(true), parent = this.parentNode;
	return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
	return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
	return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
	return function(event) {
		listener.call(this, event, this.__data__);
	};
}
function parseTypenames(typenames) {
	return typenames.trim().split(/^|\s+/).map(function(t) {
		var name = "", i = t.indexOf(".");
		if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
		return {
			type: t,
			name
		};
	});
}
function onRemove(typename) {
	return function() {
		var on = this.__on;
		if (!on) return;
		for (var j = 0, i = -1, m = on.length, o; j < m; ++j) if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) this.removeEventListener(o.type, o.listener, o.options);
		else on[++i] = o;
		if (++i) on.length = i;
		else delete this.__on;
	};
}
function onAdd(typename, value, options) {
	return function() {
		var on = this.__on, o, listener = contextListener(value);
		if (on) {
			for (var j = 0, m = on.length; j < m; ++j) if ((o = on[j]).type === typename.type && o.name === typename.name) {
				this.removeEventListener(o.type, o.listener, o.options);
				this.addEventListener(o.type, o.listener = listener, o.options = options);
				o.value = value;
				return;
			}
		}
		this.addEventListener(typename.type, listener, options);
		o = {
			type: typename.type,
			name: typename.name,
			value,
			listener,
			options
		};
		if (!on) this.__on = [o];
		else on.push(o);
	};
}
function on_default$1(typename, value, options) {
	var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
	if (arguments.length < 2) {
		var on = this.node().__on;
		if (on) {
			for (var j = 0, m = on.length, o; j < m; ++j) for (i = 0, o = on[j]; i < n; ++i) if ((t = typenames[i]).type === o.type && t.name === o.name) return o.value;
		}
		return;
	}
	on = value ? onAdd : onRemove;
	for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
	return this;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type, params) {
	var window = window_default(node), event = window.CustomEvent;
	if (typeof event === "function") event = new event(type, params);
	else {
		event = window.document.createEvent("Event");
		if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
		else event.initEvent(type, false, false);
	}
	node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
	return function() {
		return dispatchEvent(this, type, params);
	};
}
function dispatchFunction(type, params) {
	return function() {
		return dispatchEvent(this, type, params.apply(this, arguments));
	};
}
function dispatch_default(type, params) {
	return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) if (node = group[i]) yield node;
}
//#endregion
//#region ../node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection$1(groups, parents) {
	this._groups = groups;
	this._parents = parents;
}
function selection() {
	return new Selection$1([[document.documentElement]], root);
}
function selection_selection() {
	return this;
}
Selection$1.prototype = selection.prototype = {
	constructor: Selection$1,
	select: select_default$2,
	selectAll: selectAll_default$1,
	selectChild: selectChild_default,
	selectChildren: selectChildren_default,
	filter: filter_default$1,
	data: data_default,
	enter: enter_default,
	exit: exit_default,
	join: join_default,
	merge: merge_default$1,
	selection: selection_selection,
	order: order_default,
	sort: sort_default,
	call: call_default,
	nodes: nodes_default,
	node: node_default,
	size: size_default,
	empty: empty_default,
	each: each_default,
	attr: attr_default$1,
	style: style_default$1,
	property: property_default,
	classed: classed_default,
	text: text_default$1,
	html: html_default,
	raise: raise_default,
	lower: lower_default,
	append: append_default,
	insert: insert_default,
	remove: remove_default$1,
	clone: clone_default,
	datum: datum_default,
	on: on_default$1,
	dispatch: dispatch_default,
	[Symbol.iterator]: iterator_default
};
//#endregion
//#region ../node_modules/d3-selection/src/select.js
function select_default$1(selector) {
	return typeof selector === "string" ? new Selection$1([[document.querySelector(selector)]], [document.documentElement]) : new Selection$1([[selector]], root);
}
//#endregion
//#region ../node_modules/d3-selection/src/sourceEvent.js
function sourceEvent_default(event) {
	let sourceEvent;
	while (sourceEvent = event.sourceEvent) event = sourceEvent;
	return event;
}
//#endregion
//#region ../node_modules/d3-selection/src/pointer.js
function pointer_default(event, node) {
	event = sourceEvent_default(event);
	if (node === void 0) node = event.currentTarget;
	if (node) {
		var svg = node.ownerSVGElement || node;
		if (svg.createSVGPoint) {
			var point = svg.createSVGPoint();
			point.x = event.clientX, point.y = event.clientY;
			point = point.matrixTransform(node.getScreenCTM().inverse());
			return [point.x, point.y];
		}
		if (node.getBoundingClientRect) {
			var rect = node.getBoundingClientRect();
			return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
		}
	}
	return [event.pageX, event.pageY];
}
//#endregion
//#region ../node_modules/d3-drag/src/noevent.js
var nonpassive = { passive: false };
var nonpassivecapture = {
	capture: true,
	passive: false
};
function nopropagation$1(event) {
	event.stopImmediatePropagation();
}
function noevent_default$1(event) {
	event.preventDefault();
	event.stopImmediatePropagation();
}
//#endregion
//#region ../node_modules/d3-drag/src/nodrag.js
function nodrag_default(view) {
	var root = view.document.documentElement, selection = select_default$1(view).on("dragstart.drag", noevent_default$1, nonpassivecapture);
	if ("onselectstart" in root) selection.on("selectstart.drag", noevent_default$1, nonpassivecapture);
	else {
		root.__noselect = root.style.MozUserSelect;
		root.style.MozUserSelect = "none";
	}
}
function yesdrag(view, noclick) {
	var root = view.document.documentElement, selection = select_default$1(view).on("dragstart.drag", null);
	if (noclick) {
		selection.on("click.drag", noevent_default$1, nonpassivecapture);
		setTimeout(function() {
			selection.on("click.drag", null);
		}, 0);
	}
	if ("onselectstart" in root) selection.on("selectstart.drag", null);
	else {
		root.style.MozUserSelect = root.__noselect;
		delete root.__noselect;
	}
}
//#endregion
//#region ../node_modules/d3-drag/src/constant.js
var constant_default$2 = (x) => () => x;
//#endregion
//#region ../node_modules/d3-drag/src/event.js
function DragEvent(type, { sourceEvent, subject, target, identifier, active, x, y, dx, dy, dispatch }) {
	Object.defineProperties(this, {
		type: {
			value: type,
			enumerable: true,
			configurable: true
		},
		sourceEvent: {
			value: sourceEvent,
			enumerable: true,
			configurable: true
		},
		subject: {
			value: subject,
			enumerable: true,
			configurable: true
		},
		target: {
			value: target,
			enumerable: true,
			configurable: true
		},
		identifier: {
			value: identifier,
			enumerable: true,
			configurable: true
		},
		active: {
			value: active,
			enumerable: true,
			configurable: true
		},
		x: {
			value: x,
			enumerable: true,
			configurable: true
		},
		y: {
			value: y,
			enumerable: true,
			configurable: true
		},
		dx: {
			value: dx,
			enumerable: true,
			configurable: true
		},
		dy: {
			value: dy,
			enumerable: true,
			configurable: true
		},
		_: { value: dispatch }
	});
}
DragEvent.prototype.on = function() {
	var value = this._.on.apply(this._, arguments);
	return value === this._ ? this : value;
};
//#endregion
//#region ../node_modules/d3-drag/src/drag.js
function defaultFilter$1(event) {
	return !event.ctrlKey && !event.button;
}
function defaultContainer() {
	return this.parentNode;
}
function defaultSubject(event, d) {
	return d == null ? {
		x: event.x,
		y: event.y
	} : d;
}
function defaultTouchable$1() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag_default() {
	var filter = defaultFilter$1, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable$1, gestures = {}, listeners = dispatch("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
	function drag(selection) {
		selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function mousedowned(event, d) {
		if (touchending || !filter.call(this, event, d)) return;
		var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
		if (!gesture) return;
		select_default$1(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
		nodrag_default(event.view);
		nopropagation$1(event);
		mousemoving = false;
		mousedownx = event.clientX;
		mousedowny = event.clientY;
		gesture("start", event);
	}
	function mousemoved(event) {
		noevent_default$1(event);
		if (!mousemoving) {
			var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
			mousemoving = dx * dx + dy * dy > clickDistance2;
		}
		gestures.mouse("drag", event);
	}
	function mouseupped(event) {
		select_default$1(event.view).on("mousemove.drag mouseup.drag", null);
		yesdrag(event.view, mousemoving);
		noevent_default$1(event);
		gestures.mouse("end", event);
	}
	function touchstarted(event, d) {
		if (!filter.call(this, event, d)) return;
		var touches = event.changedTouches, c = container.call(this, event, d), n = touches.length, i, gesture;
		for (i = 0; i < n; ++i) if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
			nopropagation$1(event);
			gesture("start", event, touches[i]);
		}
	}
	function touchmoved(event) {
		var touches = event.changedTouches, n = touches.length, i, gesture;
		for (i = 0; i < n; ++i) if (gesture = gestures[touches[i].identifier]) {
			noevent_default$1(event);
			gesture("drag", event, touches[i]);
		}
	}
	function touchended(event) {
		var touches = event.changedTouches, n = touches.length, i, gesture;
		if (touchending) clearTimeout(touchending);
		touchending = setTimeout(function() {
			touchending = null;
		}, 500);
		for (i = 0; i < n; ++i) if (gesture = gestures[touches[i].identifier]) {
			nopropagation$1(event);
			gesture("end", event, touches[i]);
		}
	}
	function beforestart(that, container, event, d, identifier, touch) {
		var dispatch = listeners.copy(), p = pointer_default(touch || event, container), dx, dy, s;
		if ((s = subject.call(that, new DragEvent("beforestart", {
			sourceEvent: event,
			target: drag,
			identifier,
			active,
			x: p[0],
			y: p[1],
			dx: 0,
			dy: 0,
			dispatch
		}), d)) == null) return;
		dx = s.x - p[0] || 0;
		dy = s.y - p[1] || 0;
		return function gesture(type, event, touch) {
			var p0 = p, n;
			switch (type) {
				case "start":
					gestures[identifier] = gesture, n = active++;
					break;
				case "end": delete gestures[identifier], --active;
				case "drag": p = pointer_default(touch || event, container), n = active;
			}
			dispatch.call(type, that, new DragEvent(type, {
				sourceEvent: event,
				subject: s,
				target: drag,
				identifier,
				active: n,
				x: p[0] + dx,
				y: p[1] + dy,
				dx: p[0] - p0[0],
				dy: p[1] - p0[1],
				dispatch
			}), d);
		};
	}
	drag.filter = function(_) {
		return arguments.length ? (filter = typeof _ === "function" ? _ : constant_default$2(!!_), drag) : filter;
	};
	drag.container = function(_) {
		return arguments.length ? (container = typeof _ === "function" ? _ : constant_default$2(_), drag) : container;
	};
	drag.subject = function(_) {
		return arguments.length ? (subject = typeof _ === "function" ? _ : constant_default$2(_), drag) : subject;
	};
	drag.touchable = function(_) {
		return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default$2(!!_), drag) : touchable;
	};
	drag.on = function() {
		var value = listeners.on.apply(listeners, arguments);
		return value === listeners ? drag : value;
	};
	drag.clickDistance = function(_) {
		return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
	};
	return drag;
}
//#endregion
//#region ../node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
	constructor.prototype = factory.prototype = prototype;
	prototype.constructor = constructor;
}
function extend(parent, definition) {
	var prototype = Object.create(parent.prototype);
	for (var key in definition) prototype[key] = definition[key];
	return prototype;
}
//#endregion
//#region ../node_modules/d3-color/src/color.js
function Color() {}
var darker = .7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
define_default(Color, color, {
	copy(channels) {
		return Object.assign(new this.constructor(), this, channels);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: color_formatHex,
	formatHex: color_formatHex,
	formatHex8: color_formatHex8,
	formatHsl: color_formatHsl,
	formatRgb: color_formatRgb,
	toString: color_formatRgb
});
function color_formatHex() {
	return this.rgb().formatHex();
}
function color_formatHex8() {
	return this.rgb().formatHex8();
}
function color_formatHsl() {
	return hslConvert(this).formatHsl();
}
function color_formatRgb() {
	return this.rgb().formatRgb();
}
function color(format) {
	var m, l;
	format = (format + "").trim().toLowerCase();
	return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
	return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
	if (a <= 0) r = g = b = NaN;
	return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
	if (!(o instanceof Color)) o = color(o);
	if (!o) return new Rgb();
	o = o.rgb();
	return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
	return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
	this.r = +r;
	this.g = +g;
	this.b = +b;
	this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
	brighter(k) {
		k = k == null ? brighter : Math.pow(brighter, k);
		return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	},
	darker(k) {
		k = k == null ? darker : Math.pow(darker, k);
		return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: rgb_formatHex,
	formatHex: rgb_formatHex,
	formatHex8: rgb_formatHex8,
	formatRgb: rgb_formatRgb,
	toString: rgb_formatRgb
}));
function rgb_formatHex() {
	return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
	return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
	const a = clampa(this.opacity);
	return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
	return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
	return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
	value = clampi(value);
	return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
	if (a <= 0) h = s = l = NaN;
	else if (l <= 0 || l >= 1) h = s = NaN;
	else if (s <= 0) h = NaN;
	return new Hsl(h, s, l, a);
}
function hslConvert(o) {
	if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	if (!(o instanceof Color)) o = color(o);
	if (!o) return new Hsl();
	if (o instanceof Hsl) return o;
	o = o.rgb();
	var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
	if (s) {
		if (r === max) h = (g - b) / s + (g < b) * 6;
		else if (g === max) h = (b - r) / s + 2;
		else h = (r - g) / s + 4;
		s /= l < .5 ? max + min : 2 - max - min;
		h *= 60;
	} else s = l > 0 && l < 1 ? 0 : h;
	return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
	return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
	this.h = +h;
	this.s = +s;
	this.l = +l;
	this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
	brighter(k) {
		k = k == null ? brighter : Math.pow(brighter, k);
		return new Hsl(this.h, this.s, this.l * k, this.opacity);
	},
	darker(k) {
		k = k == null ? darker : Math.pow(darker, k);
		return new Hsl(this.h, this.s, this.l * k, this.opacity);
	},
	rgb() {
		var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < .5 ? l : 1 - l) * s, m1 = 2 * l - m2;
		return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
	},
	clamp() {
		return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		const a = clampa(this.opacity);
		return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
	}
}));
function clamph(value) {
	value = (value || 0) % 360;
	return value < 0 ? value + 360 : value;
}
function clampt(value) {
	return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
	return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
//#endregion
//#region ../node_modules/d3-interpolate/src/constant.js
var constant_default$1 = (x) => () => x;
//#endregion
//#region ../node_modules/d3-interpolate/src/color.js
function linear(a, d) {
	return function(t) {
		return a + t * d;
	};
}
function exponential(a, b, y) {
	return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
		return Math.pow(a + t * b, y);
	};
}
function gamma(y) {
	return (y = +y) === 1 ? nogamma : function(a, b) {
		return b - a ? exponential(a, b, y) : constant_default$1(isNaN(a) ? b : a);
	};
}
function nogamma(a, b) {
	var d = b - a;
	return d ? linear(a, d) : constant_default$1(isNaN(a) ? b : a);
}
//#endregion
//#region ../node_modules/d3-interpolate/src/rgb.js
var rgb_default = (function rgbGamma(y) {
	var color = gamma(y);
	function rgb$1(start, end) {
		var r = color((start = rgb(start)).r, (end = rgb(end)).r), g = color(start.g, end.g), b = color(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
		return function(t) {
			start.r = r(t);
			start.g = g(t);
			start.b = b(t);
			start.opacity = opacity(t);
			return start + "";
		};
	}
	rgb$1.gamma = rgbGamma;
	return rgb$1;
})(1);
//#endregion
//#region ../node_modules/d3-interpolate/src/number.js
function number_default(a, b) {
	return a = +a, b = +b, function(t) {
		return a * (1 - t) + b * t;
	};
}
//#endregion
//#region ../node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
	return function() {
		return b;
	};
}
function one(b) {
	return function(t) {
		return b(t) + "";
	};
}
function string_default(a, b) {
	var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
	a = a + "", b = b + "";
	while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
		if ((bs = bm.index) > bi) {
			bs = b.slice(bi, bs);
			if (s[i]) s[i] += bs;
			else s[++i] = bs;
		}
		if ((am = am[0]) === (bm = bm[0])) {
			if (s[i]) s[i] += bm;
			else s[++i] = bm;
		} else {
			s[++i] = null;
			q.push({
				i,
				x: number_default(am, bm)
			});
		}
		bi = reB.lastIndex;
	}
	if (bi < b.length) {
		bs = b.slice(bi);
		if (s[i]) s[i] += bs;
		else s[++i] = bs;
	}
	return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
		for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
		return s.join("");
	});
}
//#endregion
//#region ../node_modules/d3-interpolate/src/transform/decompose.js
var degrees = 180 / Math.PI;
var identity$1 = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function decompose_default(a, b, c, d, e, f) {
	var scaleX, scaleY, skewX;
	if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	return {
		translateX: e,
		translateY: f,
		rotate: Math.atan2(b, a) * degrees,
		skewX: Math.atan(skewX) * degrees,
		scaleX,
		scaleY
	};
}
//#endregion
//#region ../node_modules/d3-interpolate/src/transform/parse.js
var svgNode;
function parseCss(value) {
	const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
	return m.isIdentity ? identity$1 : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
	if (value == null) return identity$1;
	if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	svgNode.setAttribute("transform", value);
	if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
	value = value.matrix;
	return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
}
//#endregion
//#region ../node_modules/d3-interpolate/src/transform/index.js
function interpolateTransform(parse, pxComma, pxParen, degParen) {
	function pop(s) {
		return s.length ? s.pop() + " " : "";
	}
	function translate(xa, ya, xb, yb, s, q) {
		if (xa !== xb || ya !== yb) {
			var i = s.push("translate(", null, pxComma, null, pxParen);
			q.push({
				i: i - 4,
				x: number_default(xa, xb)
			}, {
				i: i - 2,
				x: number_default(ya, yb)
			});
		} else if (xb || yb) s.push("translate(" + xb + pxComma + yb + pxParen);
	}
	function rotate(a, b, s, q) {
		if (a !== b) {
			if (a - b > 180) b += 360;
			else if (b - a > 180) a += 360;
			q.push({
				i: s.push(pop(s) + "rotate(", null, degParen) - 2,
				x: number_default(a, b)
			});
		} else if (b) s.push(pop(s) + "rotate(" + b + degParen);
	}
	function skewX(a, b, s, q) {
		if (a !== b) q.push({
			i: s.push(pop(s) + "skewX(", null, degParen) - 2,
			x: number_default(a, b)
		});
		else if (b) s.push(pop(s) + "skewX(" + b + degParen);
	}
	function scale(xa, ya, xb, yb, s, q) {
		if (xa !== xb || ya !== yb) {
			var i = s.push(pop(s) + "scale(", null, ",", null, ")");
			q.push({
				i: i - 4,
				x: number_default(xa, xb)
			}, {
				i: i - 2,
				x: number_default(ya, yb)
			});
		} else if (xb !== 1 || yb !== 1) s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	}
	return function(a, b) {
		var s = [], q = [];
		a = parse(a), b = parse(b);
		translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
		rotate(a.rotate, b.rotate, s, q);
		skewX(a.skewX, b.skewX, s, q);
		scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
		a = b = null;
		return function(t) {
			var i = -1, n = q.length, o;
			while (++i < n) s[(o = q[i]).i] = o.x(t);
			return s.join("");
		};
	};
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
//#endregion
//#region ../node_modules/d3-interpolate/src/zoom.js
var epsilon2 = 1e-12;
function cosh(x) {
	return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
	return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
	return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
var zoom_default$1 = (function zoomRho(rho, rho2, rho4) {
	function zoom(p0, p1) {
		var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
		if (d2 < epsilon2) {
			S = Math.log(w1 / w0) / rho;
			i = function(t) {
				return [
					ux0 + t * dx,
					uy0 + t * dy,
					w0 * Math.exp(rho * t * S)
				];
			};
		} else {
			var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
			S = (Math.log(Math.sqrt(b1 * b1 + 1) - b1) - r0) / rho;
			i = function(t) {
				var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
				return [
					ux0 + u * dx,
					uy0 + u * dy,
					w0 * coshr0 / cosh(rho * s + r0)
				];
			};
		}
		i.duration = S * 1e3 * rho / Math.SQRT2;
		return i;
	}
	zoom.rho = function(_) {
		var _1 = Math.max(.001, +_), _2 = _1 * _1;
		return zoomRho(_1, _2, _2 * _2);
	};
	return zoom;
})(Math.SQRT2, 2, 4);
//#endregion
//#region ../node_modules/d3-timer/src/timer.js
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
	setTimeout(f, 17);
};
function now() {
	return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
	clockNow = 0;
}
function Timer() {
	this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
	constructor: Timer,
	restart: function(callback, delay, time) {
		if (typeof callback !== "function") throw new TypeError("callback is not a function");
		time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
		if (!this._next && taskTail !== this) {
			if (taskTail) taskTail._next = this;
			else taskHead = this;
			taskTail = this;
		}
		this._call = callback;
		this._time = time;
		sleep();
	},
	stop: function() {
		if (this._call) {
			this._call = null;
			this._time = Infinity;
			sleep();
		}
	}
};
function timer(callback, delay, time) {
	var t = new Timer();
	t.restart(callback, delay, time);
	return t;
}
function timerFlush() {
	now();
	++frame;
	var t = taskHead, e;
	while (t) {
		if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
		t = t._next;
	}
	--frame;
}
function wake() {
	clockNow = (clockLast = clock.now()) + clockSkew;
	frame = timeout = 0;
	try {
		timerFlush();
	} finally {
		frame = 0;
		nap();
		clockNow = 0;
	}
}
function poke() {
	var now = clock.now(), delay = now - clockLast;
	if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}
function nap() {
	var t0, t1 = taskHead, t2, time = Infinity;
	while (t1) if (t1._call) {
		if (time > t1._time) time = t1._time;
		t0 = t1, t1 = t1._next;
	} else {
		t2 = t1._next, t1._next = null;
		t1 = t0 ? t0._next = t2 : taskHead = t2;
	}
	taskTail = t0;
	sleep(time);
}
function sleep(time) {
	if (frame) return;
	if (timeout) timeout = clearTimeout(timeout);
	if (time - clockNow > 24) {
		if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
		if (interval) interval = clearInterval(interval);
	} else {
		if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
		frame = 1, setFrame(wake);
	}
}
//#endregion
//#region ../node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
	var t = new Timer();
	delay = delay == null ? 0 : +delay;
	t.restart((elapsed) => {
		t.stop();
		callback(elapsed + delay);
	}, delay, time);
	return t;
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/schedule.js
var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];
function schedule_default(node, name, id, index, group, timing) {
	var schedules = node.__transition;
	if (!schedules) node.__transition = {};
	else if (id in schedules) return;
	create(node, id, {
		name,
		index,
		group,
		on: emptyOn,
		tween: emptyTween,
		time: timing.time,
		delay: timing.delay,
		duration: timing.duration,
		ease: timing.ease,
		timer: null,
		state: 0
	});
}
function init(node, id) {
	var schedule = get(node, id);
	if (schedule.state > 0) throw new Error("too late; already scheduled");
	return schedule;
}
function set(node, id) {
	var schedule = get(node, id);
	if (schedule.state > 3) throw new Error("too late; already running");
	return schedule;
}
function get(node, id) {
	var schedule = node.__transition;
	if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
	return schedule;
}
function create(node, id, self) {
	var schedules = node.__transition, tween;
	schedules[id] = self;
	self.timer = timer(schedule, 0, self.time);
	function schedule(elapsed) {
		self.state = 1;
		self.timer.restart(start, self.delay, self.time);
		if (self.delay <= elapsed) start(elapsed - self.delay);
	}
	function start(elapsed) {
		var i, j, n, o;
		if (self.state !== 1) return stop();
		for (i in schedules) {
			o = schedules[i];
			if (o.name !== self.name) continue;
			if (o.state === 3) return timeout_default(start);
			if (o.state === 4) {
				o.state = 6;
				o.timer.stop();
				o.on.call("interrupt", node, node.__data__, o.index, o.group);
				delete schedules[i];
			} else if (+i < id) {
				o.state = 6;
				o.timer.stop();
				o.on.call("cancel", node, node.__data__, o.index, o.group);
				delete schedules[i];
			}
		}
		timeout_default(function() {
			if (self.state === 3) {
				self.state = 4;
				self.timer.restart(tick, self.delay, self.time);
				tick(elapsed);
			}
		});
		self.state = 2;
		self.on.call("start", node, node.__data__, self.index, self.group);
		if (self.state !== 2) return;
		self.state = 3;
		tween = new Array(n = self.tween.length);
		for (i = 0, j = -1; i < n; ++i) if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) tween[++j] = o;
		tween.length = j + 1;
	}
	function tick(elapsed) {
		var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = 5, 1), i = -1, n = tween.length;
		while (++i < n) tween[i].call(node, t);
		if (self.state === 5) {
			self.on.call("end", node, node.__data__, self.index, self.group);
			stop();
		}
	}
	function stop() {
		self.state = 6;
		self.timer.stop();
		delete schedules[id];
		for (var i in schedules) return;
		delete node.__transition;
	}
}
//#endregion
//#region ../node_modules/d3-transition/src/interrupt.js
function interrupt_default$1(node, name) {
	var schedules = node.__transition, schedule, active, empty = true, i;
	if (!schedules) return;
	name = name == null ? null : name + "";
	for (i in schedules) {
		if ((schedule = schedules[i]).name !== name) {
			empty = false;
			continue;
		}
		active = schedule.state > 2 && schedule.state < 5;
		schedule.state = 6;
		schedule.timer.stop();
		schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
		delete schedules[i];
	}
	if (empty) delete node.__transition;
}
//#endregion
//#region ../node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default(name) {
	return this.each(function() {
		interrupt_default$1(this, name);
	});
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/tween.js
function tweenRemove(id, name) {
	var tween0, tween1;
	return function() {
		var schedule = set(this, id), tween = schedule.tween;
		if (tween !== tween0) {
			tween1 = tween0 = tween;
			for (var i = 0, n = tween1.length; i < n; ++i) if (tween1[i].name === name) {
				tween1 = tween1.slice();
				tween1.splice(i, 1);
				break;
			}
		}
		schedule.tween = tween1;
	};
}
function tweenFunction(id, name, value) {
	var tween0, tween1;
	if (typeof value !== "function") throw new Error();
	return function() {
		var schedule = set(this, id), tween = schedule.tween;
		if (tween !== tween0) {
			tween1 = (tween0 = tween).slice();
			for (var t = {
				name,
				value
			}, i = 0, n = tween1.length; i < n; ++i) if (tween1[i].name === name) {
				tween1[i] = t;
				break;
			}
			if (i === n) tween1.push(t);
		}
		schedule.tween = tween1;
	};
}
function tween_default(name, value) {
	var id = this._id;
	name += "";
	if (arguments.length < 2) {
		var tween = get(this.node(), id).tween;
		for (var i = 0, n = tween.length, t; i < n; ++i) if ((t = tween[i]).name === name) return t.value;
		return null;
	}
	return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}
function tweenValue(transition, name, value) {
	var id = transition._id;
	transition.each(function() {
		var schedule = set(this, id);
		(schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
	});
	return function(node) {
		return get(node, id).value[name];
	};
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a, b) {
	var c;
	return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/attr.js
function attrRemove(name) {
	return function() {
		this.removeAttribute(name);
	};
}
function attrRemoveNS(fullname) {
	return function() {
		this.removeAttributeNS(fullname.space, fullname.local);
	};
}
function attrConstant(name, interpolate, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = this.getAttribute(name);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	};
}
function attrConstantNS(fullname, interpolate, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = this.getAttributeNS(fullname.space, fullname.local);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	};
}
function attrFunction(name, interpolate, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0, value1 = value(this), string1;
		if (value1 == null) return void this.removeAttribute(name);
		string0 = this.getAttribute(name);
		string1 = value1 + "";
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	};
}
function attrFunctionNS(fullname, interpolate, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0, value1 = value(this), string1;
		if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
		string0 = this.getAttributeNS(fullname.space, fullname.local);
		string1 = value1 + "";
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	};
}
function attr_default(name, value) {
	var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
	return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/attrTween.js
function attrInterpolate(name, i) {
	return function(t) {
		this.setAttribute(name, i.call(this, t));
	};
}
function attrInterpolateNS(fullname, i) {
	return function(t) {
		this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
	};
}
function attrTweenNS(fullname, value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function attrTween(name, value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function attrTween_default(name, value) {
	var key = "attr." + name;
	if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	var fullname = namespace_default(name);
	return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/delay.js
function delayFunction(id, value) {
	return function() {
		init(this, id).delay = +value.apply(this, arguments);
	};
}
function delayConstant(id, value) {
	return value = +value, function() {
		init(this, id).delay = value;
	};
}
function delay_default(value) {
	var id = this._id;
	return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get(this.node(), id).delay;
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/duration.js
function durationFunction(id, value) {
	return function() {
		set(this, id).duration = +value.apply(this, arguments);
	};
}
function durationConstant(id, value) {
	return value = +value, function() {
		set(this, id).duration = value;
	};
}
function duration_default(value) {
	var id = this._id;
	return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get(this.node(), id).duration;
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/ease.js
function easeConstant(id, value) {
	if (typeof value !== "function") throw new Error();
	return function() {
		set(this, id).ease = value;
	};
}
function ease_default(value) {
	var id = this._id;
	return arguments.length ? this.each(easeConstant(id, value)) : get(this.node(), id).ease;
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/easeVarying.js
function easeVarying(id, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (typeof v !== "function") throw new Error();
		set(this, id).ease = v;
	};
}
function easeVarying_default(value) {
	if (typeof value !== "function") throw new Error();
	return this.each(easeVarying(this._id, value));
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/filter.js
function filter_default(match) {
	if (typeof match !== "function") match = matcher_default(match);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
	return new Transition(subgroups, this._parents, this._name, this._id);
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/merge.js
function merge_default(transition) {
	if (transition._id !== this._id) throw new Error();
	for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group0[i] || group1[i]) merge[i] = node;
	for (; j < m0; ++j) merges[j] = groups0[j];
	return new Transition(merges, this._parents, this._name, this._id);
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/on.js
function start(name) {
	return (name + "").trim().split(/^|\s+/).every(function(t) {
		var i = t.indexOf(".");
		if (i >= 0) t = t.slice(0, i);
		return !t || t === "start";
	});
}
function onFunction(id, name, listener) {
	var on0, on1, sit = start(name) ? init : set;
	return function() {
		var schedule = sit(this, id), on = schedule.on;
		if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
		schedule.on = on1;
	};
}
function on_default(name, listener) {
	var id = this._id;
	return arguments.length < 2 ? get(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/remove.js
function removeFunction(id) {
	return function() {
		var parent = this.parentNode;
		for (var i in this.__transition) if (+i !== id) return;
		if (parent) parent.removeChild(this);
	};
}
function remove_default() {
	return this.on("end.remove", removeFunction(this._id));
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/select.js
function select_default(select) {
	var name = this._name, id = this._id;
	if (typeof select !== "function") select = selector_default(select);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
		if ("__data__" in node) subnode.__data__ = node.__data__;
		subgroup[i] = subnode;
		schedule_default(subgroup[i], name, id, i, subgroup, get(node, id));
	}
	return new Transition(subgroups, this._parents, name, id);
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default(select) {
	var name = this._name, id = this._id;
	if (typeof select !== "function") select = selectorAll_default(select);
	for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) if (child = children[k]) schedule_default(child, name, id, k, children, inherit);
		subgroups.push(children);
		parents.push(node);
	}
	return new Transition(subgroups, parents, name, id);
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/selection.js
var Selection = selection.prototype.constructor;
function selection_default() {
	return new Selection(this._groups, this._parents);
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/style.js
function styleNull(name, interpolate) {
	var string00, string10, interpolate0;
	return function() {
		var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
	};
}
function styleRemove(name) {
	return function() {
		this.style.removeProperty(name);
	};
}
function styleConstant(name, interpolate, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = styleValue(this, name);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	};
}
function styleFunction(name, interpolate, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
		if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	};
}
function styleMaybeRemove(id, name) {
	var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
	return function() {
		var schedule = set(this, id), on = schedule.on, listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : void 0;
		if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
		schedule.on = on1;
	};
}
function style_default(name, value, priority) {
	var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
	return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
	return function(t) {
		this.style.setProperty(name, i.call(this, t), priority);
	};
}
function styleTween(name, value, priority) {
	var t, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
		return t;
	}
	tween._value = value;
	return tween;
}
function styleTween_default(name, value, priority) {
	var key = "style." + (name += "");
	if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/text.js
function textConstant(value) {
	return function() {
		this.textContent = value;
	};
}
function textFunction(value) {
	return function() {
		var value1 = value(this);
		this.textContent = value1 == null ? "" : value1;
	};
}
function text_default(value) {
	return this.tween("text", typeof value === "function" ? textFunction(tweenValue(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
	return function(t) {
		this.textContent = i.call(this, t);
	};
}
function textTween(value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function textTween_default(value) {
	var key = "text";
	if (arguments.length < 1) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	return this.tween(key, textTween(value));
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/transition.js
function transition_default$1() {
	var name = this._name, id0 = this._id, id1 = newId();
	for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		var inherit = get(node, id0);
		schedule_default(node, name, id1, i, group, {
			time: inherit.time + inherit.delay + inherit.duration,
			delay: 0,
			duration: inherit.duration,
			ease: inherit.ease
		});
	}
	return new Transition(groups, this._parents, name, id1);
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/end.js
function end_default() {
	var on0, on1, that = this, id = that._id, size = that.size();
	return new Promise(function(resolve, reject) {
		var cancel = { value: reject }, end = { value: function() {
			if (--size === 0) resolve();
		} };
		that.each(function() {
			var schedule = set(this, id), on = schedule.on;
			if (on !== on0) {
				on1 = (on0 = on).copy();
				on1._.cancel.push(cancel);
				on1._.interrupt.push(cancel);
				on1._.end.push(end);
			}
			schedule.on = on1;
		});
		if (size === 0) resolve();
	});
}
//#endregion
//#region ../node_modules/d3-transition/src/transition/index.js
var id = 0;
function Transition(groups, parents, name, id) {
	this._groups = groups;
	this._parents = parents;
	this._name = name;
	this._id = id;
}
function transition(name) {
	return selection().transition(name);
}
function newId() {
	return ++id;
}
var selection_prototype = selection.prototype;
Transition.prototype = transition.prototype = {
	constructor: Transition,
	select: select_default,
	selectAll: selectAll_default,
	selectChild: selection_prototype.selectChild,
	selectChildren: selection_prototype.selectChildren,
	filter: filter_default,
	merge: merge_default,
	selection: selection_default,
	transition: transition_default$1,
	call: selection_prototype.call,
	nodes: selection_prototype.nodes,
	node: selection_prototype.node,
	size: selection_prototype.size,
	empty: selection_prototype.empty,
	each: selection_prototype.each,
	on: on_default,
	attr: attr_default,
	attrTween: attrTween_default,
	style: style_default,
	styleTween: styleTween_default,
	text: text_default,
	textTween: textTween_default,
	remove: remove_default,
	tween: tween_default,
	delay: delay_default,
	duration: duration_default,
	ease: ease_default,
	easeVarying: easeVarying_default,
	end: end_default,
	[Symbol.iterator]: selection_prototype[Symbol.iterator]
};
//#endregion
//#region ../node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
	return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
//#endregion
//#region ../node_modules/d3-transition/src/selection/transition.js
var defaultTiming = {
	time: null,
	delay: 0,
	duration: 250,
	ease: cubicInOut
};
function inherit(node, id) {
	var timing;
	while (!(timing = node.__transition) || !(timing = timing[id])) if (!(node = node.parentNode)) throw new Error(`transition ${id} not found`);
	return timing;
}
function transition_default(name) {
	var id, timing;
	if (name instanceof Transition) id = name._id, name = name._name;
	else id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
	for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) schedule_default(node, name, id, i, group, timing || inherit(node, id));
	return new Transition(groups, this._parents, name, id);
}
//#endregion
//#region ../node_modules/d3-transition/src/selection/index.js
selection.prototype.interrupt = interrupt_default;
selection.prototype.transition = transition_default;
//#endregion
//#region ../node_modules/d3-zoom/src/constant.js
var constant_default = (x) => () => x;
//#endregion
//#region ../node_modules/d3-zoom/src/event.js
function ZoomEvent(type, { sourceEvent, target, transform, dispatch }) {
	Object.defineProperties(this, {
		type: {
			value: type,
			enumerable: true,
			configurable: true
		},
		sourceEvent: {
			value: sourceEvent,
			enumerable: true,
			configurable: true
		},
		target: {
			value: target,
			enumerable: true,
			configurable: true
		},
		transform: {
			value: transform,
			enumerable: true,
			configurable: true
		},
		_: { value: dispatch }
	});
}
//#endregion
//#region ../node_modules/d3-zoom/src/transform.js
function Transform(k, x, y) {
	this.k = k;
	this.x = x;
	this.y = y;
}
Transform.prototype = {
	constructor: Transform,
	scale: function(k) {
		return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
	},
	translate: function(x, y) {
		return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
	},
	apply: function(point) {
		return [point[0] * this.k + this.x, point[1] * this.k + this.y];
	},
	applyX: function(x) {
		return x * this.k + this.x;
	},
	applyY: function(y) {
		return y * this.k + this.y;
	},
	invert: function(location) {
		return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
	},
	invertX: function(x) {
		return (x - this.x) / this.k;
	},
	invertY: function(y) {
		return (y - this.y) / this.k;
	},
	rescaleX: function(x) {
		return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
	},
	rescaleY: function(y) {
		return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var identity = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
	while (!node.__zoom) if (!(node = node.parentNode)) return identity;
	return node.__zoom;
}
//#endregion
//#region ../node_modules/d3-zoom/src/noevent.js
function nopropagation(event) {
	event.stopImmediatePropagation();
}
function noevent_default(event) {
	event.preventDefault();
	event.stopImmediatePropagation();
}
//#endregion
//#region ../node_modules/d3-zoom/src/zoom.js
function defaultFilter(event) {
	return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
	var e = this;
	if (e instanceof SVGElement) {
		e = e.ownerSVGElement || e;
		if (e.hasAttribute("viewBox")) {
			e = e.viewBox.baseVal;
			return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
		}
		return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
	}
	return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
	return this.__zoom || identity;
}
function defaultWheelDelta(event) {
	return -event.deltaY * (event.deltaMode === 1 ? .05 : event.deltaMode ? 1 : .002) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform, extent, translateExtent) {
	var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
	return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}
function zoom_default() {
	var filter = defaultFilter, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = zoom_default$1, listeners = dispatch("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
	function zoom(selection) {
		selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	zoom.transform = function(collection, transform, point, event) {
		var selection = collection.selection ? collection.selection() : collection;
		selection.property("__zoom", defaultTransform);
		if (collection !== selection) schedule(collection, transform, point, event);
		else selection.interrupt().each(function() {
			gesture(this, arguments).event(event).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
		});
	};
	zoom.scaleBy = function(selection, k, p, event) {
		zoom.scaleTo(selection, function() {
			return this.__zoom.k * (typeof k === "function" ? k.apply(this, arguments) : k);
		}, p, event);
	};
	zoom.scaleTo = function(selection, k, p, event) {
		zoom.transform(selection, function() {
			var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
			return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
		}, p, event);
	};
	zoom.translateBy = function(selection, x, y, event) {
		zoom.transform(selection, function() {
			return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
		}, null, event);
	};
	zoom.translateTo = function(selection, x, y, p, event) {
		zoom.transform(selection, function() {
			var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
			return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
		}, p, event);
	};
	function scale(transform, k) {
		k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
		return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
	}
	function translate(transform, p0, p1) {
		var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
		return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
	}
	function centroid(extent) {
		return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
	}
	function schedule(transition, transform, point, event) {
		transition.on("start.zoom", function() {
			gesture(this, arguments).event(event).start();
		}).on("interrupt.zoom end.zoom", function() {
			gesture(this, arguments).event(event).end();
		}).tween("zoom", function() {
			var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform === "function" ? transform.apply(that, args) : transform, i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
			return function(t) {
				if (t === 1) t = b;
				else {
					var l = i(t), k = w / l[2];
					t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
				}
				g.zoom(null, t);
			};
		});
	}
	function gesture(that, args, clean) {
		return !clean && that.__zooming || new Gesture(that, args);
	}
	function Gesture(that, args) {
		this.that = that;
		this.args = args;
		this.active = 0;
		this.sourceEvent = null;
		this.extent = extent.apply(that, args);
		this.taps = 0;
	}
	Gesture.prototype = {
		event: function(event) {
			if (event) this.sourceEvent = event;
			return this;
		},
		start: function() {
			if (++this.active === 1) {
				this.that.__zooming = this;
				this.emit("start");
			}
			return this;
		},
		zoom: function(key, transform) {
			if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
			if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
			if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
			this.that.__zoom = transform;
			this.emit("zoom");
			return this;
		},
		end: function() {
			if (--this.active === 0) {
				delete this.that.__zooming;
				this.emit("end");
			}
			return this;
		},
		emit: function(type) {
			var d = select_default$1(this.that).datum();
			listeners.call(type, this.that, new ZoomEvent(type, {
				sourceEvent: this.sourceEvent,
				target: zoom,
				type,
				transform: this.that.__zoom,
				dispatch: listeners
			}), d);
		}
	};
	function wheeled(event, ...args) {
		if (!filter.apply(this, arguments)) return;
		var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = pointer_default(event);
		if (g.wheel) {
			if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) g.mouse[1] = t.invert(g.mouse[0] = p);
			clearTimeout(g.wheel);
		} else if (t.k === k) return;
		else {
			g.mouse = [p, t.invert(p)];
			interrupt_default$1(this);
			g.start();
		}
		noevent_default(event);
		g.wheel = setTimeout(wheelidled, wheelDelay);
		g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
		function wheelidled() {
			g.wheel = null;
			g.end();
		}
	}
	function mousedowned(event, ...args) {
		if (touchending || !filter.apply(this, arguments)) return;
		var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select_default$1(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer_default(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
		nodrag_default(event.view);
		nopropagation(event);
		g.mouse = [p, this.__zoom.invert(p)];
		interrupt_default$1(this);
		g.start();
		function mousemoved(event) {
			noevent_default(event);
			if (!g.moved) {
				var dx = event.clientX - x0, dy = event.clientY - y0;
				g.moved = dx * dx + dy * dy > clickDistance2;
			}
			g.event(event).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer_default(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
		}
		function mouseupped(event) {
			v.on("mousemove.zoom mouseup.zoom", null);
			yesdrag(event.view, g.moved);
			noevent_default(event);
			g.event(event).end();
		}
	}
	function dblclicked(event, ...args) {
		if (!filter.apply(this, arguments)) return;
		var t0 = this.__zoom, p0 = pointer_default(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? .5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
		noevent_default(event);
		if (duration > 0) select_default$1(this).transition().duration(duration).call(schedule, t1, p0, event);
		else select_default$1(this).call(zoom.transform, t1, p0, event);
	}
	function touchstarted(event, ...args) {
		if (!filter.apply(this, arguments)) return;
		var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
		nopropagation(event);
		for (i = 0; i < n; ++i) {
			t = touches[i], p = pointer_default(t, this);
			p = [
				p,
				this.__zoom.invert(p),
				t.identifier
			];
			if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
			else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
		}
		if (touchstarting) touchstarting = clearTimeout(touchstarting);
		if (started) {
			if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
				touchstarting = null;
			}, touchDelay);
			interrupt_default$1(this);
			g.start();
		}
	}
	function touchmoved(event, ...args) {
		if (!this.__zooming) return;
		var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
		noevent_default(event);
		for (i = 0; i < n; ++i) {
			t = touches[i], p = pointer_default(t, this);
			if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
			else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
		}
		t = g.that.__zoom;
		if (g.touch1) {
			var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
			t = scale(t, Math.sqrt(dp / dl));
			p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
			l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
		} else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
		else return;
		g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
	}
	function touchended(event, ...args) {
		if (!this.__zooming) return;
		var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
		nopropagation(event);
		if (touchending) clearTimeout(touchending);
		touchending = setTimeout(function() {
			touchending = null;
		}, touchDelay);
		for (i = 0; i < n; ++i) {
			t = touches[i];
			if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
			else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
		}
		if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
		if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
		else {
			g.end();
			if (g.taps === 2) {
				t = pointer_default(t, this);
				if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
					var p = select_default$1(this).on("dblclick.zoom");
					if (p) p.apply(this, arguments);
				}
			}
		}
	}
	zoom.wheelDelta = function(_) {
		return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant_default(+_), zoom) : wheelDelta;
	};
	zoom.filter = function(_) {
		return arguments.length ? (filter = typeof _ === "function" ? _ : constant_default(!!_), zoom) : filter;
	};
	zoom.touchable = function(_) {
		return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default(!!_), zoom) : touchable;
	};
	zoom.extent = function(_) {
		return arguments.length ? (extent = typeof _ === "function" ? _ : constant_default([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
	};
	zoom.scaleExtent = function(_) {
		return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
	};
	zoom.translateExtent = function(_) {
		return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
	};
	zoom.constrain = function(_) {
		return arguments.length ? (constrain = _, zoom) : constrain;
	};
	zoom.duration = function(_) {
		return arguments.length ? (duration = +_, zoom) : duration;
	};
	zoom.interpolate = function(_) {
		return arguments.length ? (interpolate = _, zoom) : interpolate;
	};
	zoom.on = function() {
		var value = listeners.on.apply(listeners, arguments);
		return value === listeners ? zoom : value;
	};
	zoom.clickDistance = function(_) {
		return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
	};
	zoom.tapDistance = function(_) {
		return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
	};
	return zoom;
}
//#endregion
//#region ../node_modules/@reactflow/core/dist/esm/index.mjs
var StoreContext = (0, import_react.createContext)(null);
var Provider$1 = StoreContext.Provider;
var errorMessages = {
	error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
	error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
	error003: (nodeType) => `Node type "${nodeType}" not found. Using fallback type "default".`,
	error004: () => "The React Flow parent container needs a width and a height to render the graph.",
	error005: () => "Only child nodes can use a parent extent.",
	error006: () => "Can't create edge. An edge needs a source and a target.",
	error007: (id) => `The old edge with id=${id} does not exist.`,
	error009: (type) => `Marker type "${type}" doesn't exist.`,
	error008: (sourceHandle, edge) => `Couldn't create edge for ${!sourceHandle ? "source" : "target"} handle id: "${!sourceHandle ? edge.sourceHandle : edge.targetHandle}", edge id: ${edge.id}.`,
	error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
	error011: (edgeType) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
	error012: (id) => `Node with id "${id}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`
};
var zustandErrorMessage = errorMessages["error001"]();
function useStore(selector, equalityFn) {
	const store = (0, import_react.useContext)(StoreContext);
	if (store === null) throw new Error(zustandErrorMessage);
	return useStoreWithEqualityFn(store, selector, equalityFn);
}
var useStoreApi = () => {
	const store = (0, import_react.useContext)(StoreContext);
	if (store === null) throw new Error(zustandErrorMessage);
	return (0, import_react.useMemo)(() => ({
		getState: store.getState,
		setState: store.setState,
		subscribe: store.subscribe,
		destroy: store.destroy
	}), [store]);
};
var selector$g = (s) => s.userSelectionActive ? "none" : "all";
function Panel({ position, children, className, style, ...rest }) {
	const pointerEvents = useStore(selector$g);
	const positionClasses = `${position}`.split("-");
	return import_react.createElement("div", {
		className: cc([
			"react-flow__panel",
			className,
			...positionClasses
		]),
		style: {
			...style,
			pointerEvents
		},
		...rest
	}, children);
}
function Attribution({ proOptions, position = "bottom-right" }) {
	if (proOptions?.hideAttribution) return null;
	return import_react.createElement(Panel, {
		position,
		className: "react-flow__attribution",
		"data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://reactflow.dev/pro"
	}, import_react.createElement("a", {
		href: "https://reactflow.dev",
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": "React Flow attribution"
	}, "React Flow"));
}
var EdgeText = ({ x, y, label, labelStyle = {}, labelShowBg = true, labelBgStyle = {}, labelBgPadding = [2, 4], labelBgBorderRadius = 2, children, className, ...rest }) => {
	const edgeRef = (0, import_react.useRef)(null);
	const [edgeTextBbox, setEdgeTextBbox] = (0, import_react.useState)({
		x: 0,
		y: 0,
		width: 0,
		height: 0
	});
	const edgeTextClasses = cc(["react-flow__edge-textwrapper", className]);
	(0, import_react.useEffect)(() => {
		if (edgeRef.current) {
			const textBbox = edgeRef.current.getBBox();
			setEdgeTextBbox({
				x: textBbox.x,
				y: textBbox.y,
				width: textBbox.width,
				height: textBbox.height
			});
		}
	}, [label]);
	if (typeof label === "undefined" || !label) return null;
	return import_react.createElement("g", {
		transform: `translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`,
		className: edgeTextClasses,
		visibility: edgeTextBbox.width ? "visible" : "hidden",
		...rest
	}, labelShowBg && import_react.createElement("rect", {
		width: edgeTextBbox.width + 2 * labelBgPadding[0],
		x: -labelBgPadding[0],
		y: -labelBgPadding[1],
		height: edgeTextBbox.height + 2 * labelBgPadding[1],
		className: "react-flow__edge-textbg",
		style: labelBgStyle,
		rx: labelBgBorderRadius,
		ry: labelBgBorderRadius
	}), import_react.createElement("text", {
		className: "react-flow__edge-text",
		y: edgeTextBbox.height / 2,
		dy: "0.3em",
		ref: edgeRef,
		style: labelStyle
	}, label), children);
};
var EdgeText$1 = (0, import_react.memo)(EdgeText);
var getDimensions = (node) => ({
	width: node.offsetWidth,
	height: node.offsetHeight
});
var clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
var clampPosition = (position = {
	x: 0,
	y: 0
}, extent) => ({
	x: clamp(position.x, extent[0][0], extent[1][0]),
	y: clamp(position.y, extent[0][1], extent[1][1])
});
var calcAutoPanVelocity = (value, min, max) => {
	if (value < min) return clamp(Math.abs(value - min), 1, 50) / 50;
	else if (value > max) return -clamp(Math.abs(value - max), 1, 50) / 50;
	return 0;
};
var calcAutoPan = (pos, bounds) => {
	return [calcAutoPanVelocity(pos.x, 35, bounds.width - 35) * 20, calcAutoPanVelocity(pos.y, 35, bounds.height - 35) * 20];
};
var getHostForElement = (element) => element.getRootNode?.() || window?.document;
var getBoundsOfBoxes = (box1, box2) => ({
	x: Math.min(box1.x, box2.x),
	y: Math.min(box1.y, box2.y),
	x2: Math.max(box1.x2, box2.x2),
	y2: Math.max(box1.y2, box2.y2)
});
var rectToBox = ({ x, y, width, height }) => ({
	x,
	y,
	x2: x + width,
	y2: y + height
});
var boxToRect = ({ x, y, x2, y2 }) => ({
	x,
	y,
	width: x2 - x,
	height: y2 - y
});
var nodeToRect = (node) => ({
	...node.positionAbsolute || {
		x: 0,
		y: 0
	},
	width: node.width || 0,
	height: node.height || 0
});
var getOverlappingArea = (rectA, rectB) => {
	const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
	const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
	return Math.ceil(xOverlap * yOverlap);
};
var isRectObject = (obj) => isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
var isNumeric = (n) => !isNaN(n) && isFinite(n);
var internalsSymbol = Symbol.for("internals");
var elementSelectionKeys = [
	"Enter",
	" ",
	"Escape"
];
var devWarn = (id, message) => {};
var isReactKeyboardEvent = (event) => "nativeEvent" in event;
function isInputDOMNode(event) {
	const target = (isReactKeyboardEvent(event) ? event.nativeEvent : event).composedPath?.()?.[0] || event.target;
	return [
		"INPUT",
		"SELECT",
		"TEXTAREA"
	].includes(target?.nodeName) || target?.hasAttribute("contenteditable") || !!target?.closest(".nokey");
}
var isMouseEvent = (event) => "clientX" in event;
var getEventPosition = (event, bounds) => {
	const isMouseTriggered = isMouseEvent(event);
	const evtX = isMouseTriggered ? event.clientX : event.touches?.[0].clientX;
	const evtY = isMouseTriggered ? event.clientY : event.touches?.[0].clientY;
	return {
		x: evtX - (bounds?.left ?? 0),
		y: evtY - (bounds?.top ?? 0)
	};
};
var isMacOs = () => typeof navigator !== "undefined" && navigator?.userAgent?.indexOf("Mac") >= 0;
var BaseEdge = ({ id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth = 20 }) => {
	return import_react.createElement(import_react.Fragment, null, import_react.createElement("path", {
		id,
		style,
		d: path,
		fill: "none",
		className: "react-flow__edge-path",
		markerEnd,
		markerStart
	}), interactionWidth && import_react.createElement("path", {
		d: path,
		fill: "none",
		strokeOpacity: 0,
		strokeWidth: interactionWidth,
		className: "react-flow__edge-interaction"
	}), label && isNumeric(labelX) && isNumeric(labelY) ? import_react.createElement(EdgeText$1, {
		x: labelX,
		y: labelY,
		label,
		labelStyle,
		labelShowBg,
		labelBgStyle,
		labelBgPadding,
		labelBgBorderRadius
	}) : null);
};
BaseEdge.displayName = "BaseEdge";
function getMouseHandler$1(id, getState, handler) {
	return handler === void 0 ? handler : (event) => {
		const edge = getState().edges.find((e) => e.id === id);
		if (edge) handler(event, { ...edge });
	};
}
function getEdgeCenter({ sourceX, sourceY, targetX, targetY }) {
	const xOffset = Math.abs(targetX - sourceX) / 2;
	const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
	const yOffset = Math.abs(targetY - sourceY) / 2;
	return [
		centerX,
		targetY < sourceY ? targetY + yOffset : targetY - yOffset,
		xOffset,
		yOffset
	];
}
function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY }) {
	const centerX = sourceX * .125 + sourceControlX * .375 + targetControlX * .375 + targetX * .125;
	const centerY = sourceY * .125 + sourceControlY * .375 + targetControlY * .375 + targetY * .125;
	return [
		centerX,
		centerY,
		Math.abs(centerX - sourceX),
		Math.abs(centerY - sourceY)
	];
}
var ConnectionMode;
(function(ConnectionMode) {
	ConnectionMode["Strict"] = "strict";
	ConnectionMode["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));
var PanOnScrollMode;
(function(PanOnScrollMode) {
	PanOnScrollMode["Free"] = "free";
	PanOnScrollMode["Vertical"] = "vertical";
	PanOnScrollMode["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));
var SelectionMode;
(function(SelectionMode) {
	SelectionMode["Partial"] = "partial";
	SelectionMode["Full"] = "full";
})(SelectionMode || (SelectionMode = {}));
var ConnectionLineType;
(function(ConnectionLineType) {
	ConnectionLineType["Bezier"] = "default";
	ConnectionLineType["Straight"] = "straight";
	ConnectionLineType["Step"] = "step";
	ConnectionLineType["SmoothStep"] = "smoothstep";
	ConnectionLineType["SimpleBezier"] = "simplebezier";
})(ConnectionLineType || (ConnectionLineType = {}));
var MarkerType;
(function(MarkerType) {
	MarkerType["Arrow"] = "arrow";
	MarkerType["ArrowClosed"] = "arrowclosed";
})(MarkerType || (MarkerType = {}));
var Position;
(function(Position) {
	Position["Left"] = "left";
	Position["Top"] = "top";
	Position["Right"] = "right";
	Position["Bottom"] = "bottom";
})(Position || (Position = {}));
function getControl({ pos, x1, y1, x2, y2 }) {
	if (pos === Position.Left || pos === Position.Right) return [.5 * (x1 + x2), y1];
	return [x1, .5 * (y1 + y2)];
}
function getSimpleBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top }) {
	const [sourceControlX, sourceControlY] = getControl({
		pos: sourcePosition,
		x1: sourceX,
		y1: sourceY,
		x2: targetX,
		y2: targetY
	});
	const [targetControlX, targetControlY] = getControl({
		pos: targetPosition,
		x1: targetX,
		y1: targetY,
		x2: sourceX,
		y2: sourceY
	});
	const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourceControlX,
		sourceControlY,
		targetControlX,
		targetControlY
	});
	return [
		`M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
		labelX,
		labelY,
		offsetX,
		offsetY
	];
}
var SimpleBezierEdge = (0, import_react.memo)(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth }) => {
	const [path, labelX, labelY] = getSimpleBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition
	});
	return import_react.createElement(BaseEdge, {
		path,
		labelX,
		labelY,
		label,
		labelStyle,
		labelShowBg,
		labelBgStyle,
		labelBgPadding,
		labelBgBorderRadius,
		style,
		markerEnd,
		markerStart,
		interactionWidth
	});
});
SimpleBezierEdge.displayName = "SimpleBezierEdge";
var handleDirections = {
	[Position.Left]: {
		x: -1,
		y: 0
	},
	[Position.Right]: {
		x: 1,
		y: 0
	},
	[Position.Top]: {
		x: 0,
		y: -1
	},
	[Position.Bottom]: {
		x: 0,
		y: 1
	}
};
var getDirection = ({ source, sourcePosition = Position.Bottom, target }) => {
	if (sourcePosition === Position.Left || sourcePosition === Position.Right) return source.x < target.x ? {
		x: 1,
		y: 0
	} : {
		x: -1,
		y: 0
	};
	return source.y < target.y ? {
		x: 0,
		y: 1
	} : {
		x: 0,
		y: -1
	};
};
var distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
function getPoints({ source, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset }) {
	const sourceDir = handleDirections[sourcePosition];
	const targetDir = handleDirections[targetPosition];
	const sourceGapped = {
		x: source.x + sourceDir.x * offset,
		y: source.y + sourceDir.y * offset
	};
	const targetGapped = {
		x: target.x + targetDir.x * offset,
		y: target.y + targetDir.y * offset
	};
	const dir = getDirection({
		source: sourceGapped,
		sourcePosition,
		target: targetGapped
	});
	const dirAccessor = dir.x !== 0 ? "x" : "y";
	const currDir = dir[dirAccessor];
	let points = [];
	let centerX, centerY;
	const sourceGapOffset = {
		x: 0,
		y: 0
	};
	const targetGapOffset = {
		x: 0,
		y: 0
	};
	const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getEdgeCenter({
		sourceX: source.x,
		sourceY: source.y,
		targetX: target.x,
		targetY: target.y
	});
	if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
		centerX = center.x ?? defaultCenterX;
		centerY = center.y ?? defaultCenterY;
		const verticalSplit = [{
			x: centerX,
			y: sourceGapped.y
		}, {
			x: centerX,
			y: targetGapped.y
		}];
		const horizontalSplit = [{
			x: sourceGapped.x,
			y: centerY
		}, {
			x: targetGapped.x,
			y: centerY
		}];
		if (sourceDir[dirAccessor] === currDir) points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
		else points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
	} else {
		const sourceTarget = [{
			x: sourceGapped.x,
			y: targetGapped.y
		}];
		const targetSource = [{
			x: targetGapped.x,
			y: sourceGapped.y
		}];
		if (dirAccessor === "x") points = sourceDir.x === currDir ? targetSource : sourceTarget;
		else points = sourceDir.y === currDir ? sourceTarget : targetSource;
		if (sourcePosition === targetPosition) {
			const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
			if (diff <= offset) {
				const gapOffset = Math.min(offset - 1, offset - diff);
				if (sourceDir[dirAccessor] === currDir) sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
				else targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
			}
		}
		if (sourcePosition !== targetPosition) {
			const dirAccessorOpposite = dirAccessor === "x" ? "y" : "x";
			const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
			const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
			const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
			if (sourceDir[dirAccessor] === 1 && (!isSameDir && sourceGtTargetOppo || isSameDir && sourceLtTargetOppo) || sourceDir[dirAccessor] !== 1 && (!isSameDir && sourceLtTargetOppo || isSameDir && sourceGtTargetOppo)) points = dirAccessor === "x" ? sourceTarget : targetSource;
		}
		const sourceGapPoint = {
			x: sourceGapped.x + sourceGapOffset.x,
			y: sourceGapped.y + sourceGapOffset.y
		};
		const targetGapPoint = {
			x: targetGapped.x + targetGapOffset.x,
			y: targetGapped.y + targetGapOffset.y
		};
		if (Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x)) >= Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y))) {
			centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
			centerY = points[0].y;
		} else {
			centerX = points[0].x;
			centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
		}
	}
	return [
		[
			source,
			{
				x: sourceGapped.x + sourceGapOffset.x,
				y: sourceGapped.y + sourceGapOffset.y
			},
			...points,
			{
				x: targetGapped.x + targetGapOffset.x,
				y: targetGapped.y + targetGapOffset.y
			},
			target
		],
		centerX,
		centerY,
		defaultOffsetX,
		defaultOffsetY
	];
}
function getBend(a, b, c, size) {
	const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
	const { x, y } = b;
	if (a.x === x && x === c.x || a.y === y && y === c.y) return `L${x} ${y}`;
	if (a.y === y) {
		const xDir = a.x < c.x ? -1 : 1;
		const yDir = a.y < c.y ? 1 : -1;
		return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
	}
	const xDir = a.x < c.x ? 1 : -1;
	return `L ${x},${y + bendSize * (a.y < c.y ? -1 : 1)}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}
function getSmoothStepPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20 }) {
	const [points, labelX, labelY, offsetX, offsetY] = getPoints({
		source: {
			x: sourceX,
			y: sourceY
		},
		sourcePosition,
		target: {
			x: targetX,
			y: targetY
		},
		targetPosition,
		center: {
			x: centerX,
			y: centerY
		},
		offset
	});
	return [
		points.reduce((res, p, i) => {
			let segment = "";
			if (i > 0 && i < points.length - 1) segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
			else segment = `${i === 0 ? "M" : "L"}${p.x} ${p.y}`;
			res += segment;
			return res;
		}, ""),
		labelX,
		labelY,
		offsetX,
		offsetY
	];
}
var SmoothStepEdge = (0, import_react.memo)(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, sourcePosition = Position.Bottom, targetPosition = Position.Top, markerEnd, markerStart, pathOptions, interactionWidth }) => {
	const [path, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		borderRadius: pathOptions?.borderRadius,
		offset: pathOptions?.offset
	});
	return import_react.createElement(BaseEdge, {
		path,
		labelX,
		labelY,
		label,
		labelStyle,
		labelShowBg,
		labelBgStyle,
		labelBgPadding,
		labelBgBorderRadius,
		style,
		markerEnd,
		markerStart,
		interactionWidth
	});
});
SmoothStepEdge.displayName = "SmoothStepEdge";
var StepEdge = (0, import_react.memo)((props) => import_react.createElement(SmoothStepEdge, {
	...props,
	pathOptions: (0, import_react.useMemo)(() => ({
		borderRadius: 0,
		offset: props.pathOptions?.offset
	}), [props.pathOptions?.offset])
}));
StepEdge.displayName = "StepEdge";
function getStraightPath({ sourceX, sourceY, targetX, targetY }) {
	const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
		sourceX,
		sourceY,
		targetX,
		targetY
	});
	return [
		`M ${sourceX},${sourceY}L ${targetX},${targetY}`,
		labelX,
		labelY,
		offsetX,
		offsetY
	];
}
var StraightEdge = (0, import_react.memo)(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, interactionWidth }) => {
	const [path, labelX, labelY] = getStraightPath({
		sourceX,
		sourceY,
		targetX,
		targetY
	});
	return import_react.createElement(BaseEdge, {
		path,
		labelX,
		labelY,
		label,
		labelStyle,
		labelShowBg,
		labelBgStyle,
		labelBgPadding,
		labelBgBorderRadius,
		style,
		markerEnd,
		markerStart,
		interactionWidth
	});
});
StraightEdge.displayName = "StraightEdge";
function calculateControlOffset(distance, curvature) {
	if (distance >= 0) return .5 * distance;
	return curvature * 25 * Math.sqrt(-distance);
}
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
	switch (pos) {
		case Position.Left: return [x1 - calculateControlOffset(x1 - x2, c), y1];
		case Position.Right: return [x1 + calculateControlOffset(x2 - x1, c), y1];
		case Position.Top: return [x1, y1 - calculateControlOffset(y1 - y2, c)];
		case Position.Bottom: return [x1, y1 + calculateControlOffset(y2 - y1, c)];
	}
}
function getBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = .25 }) {
	const [sourceControlX, sourceControlY] = getControlWithCurvature({
		pos: sourcePosition,
		x1: sourceX,
		y1: sourceY,
		x2: targetX,
		y2: targetY,
		c: curvature
	});
	const [targetControlX, targetControlY] = getControlWithCurvature({
		pos: targetPosition,
		x1: targetX,
		y1: targetY,
		x2: sourceX,
		y2: sourceY,
		c: curvature
	});
	const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourceControlX,
		sourceControlY,
		targetControlX,
		targetControlY
	});
	return [
		`M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
		labelX,
		labelY,
		offsetX,
		offsetY
	];
}
var BezierEdge = (0, import_react.memo)(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, markerEnd, markerStart, pathOptions, interactionWidth }) => {
	const [path, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		curvature: pathOptions?.curvature
	});
	return import_react.createElement(BaseEdge, {
		path,
		labelX,
		labelY,
		label,
		labelStyle,
		labelShowBg,
		labelBgStyle,
		labelBgPadding,
		labelBgBorderRadius,
		style,
		markerEnd,
		markerStart,
		interactionWidth
	});
});
BezierEdge.displayName = "BezierEdge";
var NodeIdContext = (0, import_react.createContext)(null);
var Provider = NodeIdContext.Provider;
NodeIdContext.Consumer;
var useNodeId = () => {
	return (0, import_react.useContext)(NodeIdContext);
};
var isEdge = (element) => "id" in element && "source" in element && "target" in element;
var getEdgeId = ({ source, sourceHandle, target, targetHandle }) => `reactflow__edge-${source}${sourceHandle || ""}-${target}${targetHandle || ""}`;
var getMarkerId = (marker, rfId) => {
	if (typeof marker === "undefined") return "";
	if (typeof marker === "string") return marker;
	return `${rfId ? `${rfId}__` : ""}${Object.keys(marker).sort().map((key) => `${key}=${marker[key]}`).join("&")}`;
};
var connectionExists = (edge, edges) => {
	return edges.some((el) => el.source === edge.source && el.target === edge.target && (el.sourceHandle === edge.sourceHandle || !el.sourceHandle && !edge.sourceHandle) && (el.targetHandle === edge.targetHandle || !el.targetHandle && !edge.targetHandle));
};
var addEdge = (edgeParams, edges) => {
	if (!edgeParams.source || !edgeParams.target) {
		errorMessages["error006"]();
		return edges;
	}
	let edge;
	if (isEdge(edgeParams)) edge = { ...edgeParams };
	else edge = {
		...edgeParams,
		id: getEdgeId(edgeParams)
	};
	if (connectionExists(edge, edges)) return edges;
	return edges.concat(edge);
};
var pointToRendererPoint = ({ x, y }, [tx, ty, tScale], snapToGrid, [snapX, snapY]) => {
	const position = {
		x: (x - tx) / tScale,
		y: (y - ty) / tScale
	};
	if (snapToGrid) return {
		x: snapX * Math.round(position.x / snapX),
		y: snapY * Math.round(position.y / snapY)
	};
	return position;
};
var rendererPointToPoint = ({ x, y }, [tx, ty, tScale]) => {
	return {
		x: x * tScale + tx,
		y: y * tScale + ty
	};
};
var getNodePositionWithOrigin = (node, nodeOrigin = [0, 0]) => {
	if (!node) return {
		x: 0,
		y: 0,
		positionAbsolute: {
			x: 0,
			y: 0
		}
	};
	const offsetX = (node.width ?? 0) * nodeOrigin[0];
	const offsetY = (node.height ?? 0) * nodeOrigin[1];
	const position = {
		x: node.position.x - offsetX,
		y: node.position.y - offsetY
	};
	return {
		...position,
		positionAbsolute: node.positionAbsolute ? {
			x: node.positionAbsolute.x - offsetX,
			y: node.positionAbsolute.y - offsetY
		} : position
	};
};
var getNodesBounds = (nodes, nodeOrigin = [0, 0]) => {
	if (nodes.length === 0) return {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	return boxToRect(nodes.reduce((currBox, node) => {
		const { x, y } = getNodePositionWithOrigin(node, nodeOrigin).positionAbsolute;
		return getBoundsOfBoxes(currBox, rectToBox({
			x,
			y,
			width: node.width || 0,
			height: node.height || 0
		}));
	}, {
		x: Infinity,
		y: Infinity,
		x2: -Infinity,
		y2: -Infinity
	}));
};
var getNodesInside = (nodeInternals, rect, [tx, ty, tScale] = [
	0,
	0,
	1
], partially = false, excludeNonSelectableNodes = false, nodeOrigin = [0, 0]) => {
	const paneRect = {
		x: (rect.x - tx) / tScale,
		y: (rect.y - ty) / tScale,
		width: rect.width / tScale,
		height: rect.height / tScale
	};
	const visibleNodes = [];
	nodeInternals.forEach((node) => {
		const { width, height, selectable = true, hidden = false } = node;
		if (excludeNonSelectableNodes && !selectable || hidden) return false;
		const { positionAbsolute } = getNodePositionWithOrigin(node, nodeOrigin);
		const nodeRect = {
			x: positionAbsolute.x,
			y: positionAbsolute.y,
			width: width || 0,
			height: height || 0
		};
		const overlappingArea = getOverlappingArea(paneRect, nodeRect);
		const notInitialized = typeof width === "undefined" || typeof height === "undefined" || width === null || height === null;
		const partiallyVisible = partially && overlappingArea > 0;
		const area = (width || 0) * (height || 0);
		if (notInitialized || partiallyVisible || overlappingArea >= area || node.dragging) visibleNodes.push(node);
	});
	return visibleNodes;
};
var getConnectedEdges = (nodes, edges) => {
	const nodeIds = nodes.map((node) => node.id);
	return edges.filter((edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target));
};
var getViewportForBounds = (bounds, width, height, minZoom, maxZoom, padding = .1) => {
	const xZoom = width / (bounds.width * (1 + padding));
	const yZoom = height / (bounds.height * (1 + padding));
	const clampedZoom = clamp(Math.min(xZoom, yZoom), minZoom, maxZoom);
	const boundsCenterX = bounds.x + bounds.width / 2;
	const boundsCenterY = bounds.y + bounds.height / 2;
	return {
		x: width / 2 - boundsCenterX * clampedZoom,
		y: height / 2 - boundsCenterY * clampedZoom,
		zoom: clampedZoom
	};
};
var getD3Transition = (selection, duration = 0) => {
	return selection.transition().duration(duration);
};
function getHandles(node, handleBounds, type, currentHandle) {
	return (handleBounds[type] || []).reduce((res, h) => {
		if (`${node.id}-${h.id}-${type}` !== currentHandle) res.push({
			id: h.id || null,
			type,
			nodeId: node.id,
			x: (node.positionAbsolute?.x ?? 0) + h.x + h.width / 2,
			y: (node.positionAbsolute?.y ?? 0) + h.y + h.height / 2
		});
		return res;
	}, []);
}
function getClosestHandle(event, doc, pos, connectionRadius, handles, validator) {
	const { x, y } = getEventPosition(event);
	const handleBelow = doc.elementsFromPoint(x, y).find((el) => el.classList.contains("react-flow__handle"));
	if (handleBelow) {
		const handleNodeId = handleBelow.getAttribute("data-nodeid");
		if (handleNodeId) {
			const handleType = getHandleType(void 0, handleBelow);
			const handleId = handleBelow.getAttribute("data-handleid");
			const validHandleResult = validator({
				nodeId: handleNodeId,
				id: handleId,
				type: handleType
			});
			if (validHandleResult) {
				const handle = handles.find((h) => h.nodeId === handleNodeId && h.type === handleType && h.id === handleId);
				return {
					handle: {
						id: handleId,
						type: handleType,
						nodeId: handleNodeId,
						x: handle?.x || pos.x,
						y: handle?.y || pos.y
					},
					validHandleResult
				};
			}
		}
	}
	let closestHandles = [];
	let minDistance = Infinity;
	handles.forEach((handle) => {
		const distance = Math.sqrt((handle.x - pos.x) ** 2 + (handle.y - pos.y) ** 2);
		if (distance <= connectionRadius) {
			const validHandleResult = validator(handle);
			if (distance <= minDistance) {
				if (distance < minDistance) closestHandles = [{
					handle,
					validHandleResult
				}];
				else if (distance === minDistance) closestHandles.push({
					handle,
					validHandleResult
				});
				minDistance = distance;
			}
		}
	});
	if (!closestHandles.length) return {
		handle: null,
		validHandleResult: defaultResult()
	};
	if (closestHandles.length === 1) return closestHandles[0];
	const hasValidHandle = closestHandles.some(({ validHandleResult }) => validHandleResult.isValid);
	const hasTargetHandle = closestHandles.some(({ handle }) => handle.type === "target");
	return closestHandles.find(({ handle, validHandleResult }) => hasTargetHandle ? handle.type === "target" : hasValidHandle ? validHandleResult.isValid : true) || closestHandles[0];
}
var nullConnection = {
	source: null,
	target: null,
	sourceHandle: null,
	targetHandle: null
};
var defaultResult = () => ({
	handleDomNode: null,
	isValid: false,
	connection: nullConnection,
	endHandle: null
});
function isValidHandle(handle, connectionMode, fromNodeId, fromHandleId, fromType, isValidConnection, doc) {
	const isTarget = fromType === "target";
	const handleToCheck = doc.querySelector(`.react-flow__handle[data-id="${handle?.nodeId}-${handle?.id}-${handle?.type}"]`);
	const result = {
		...defaultResult(),
		handleDomNode: handleToCheck
	};
	if (handleToCheck) {
		const handleType = getHandleType(void 0, handleToCheck);
		const handleNodeId = handleToCheck.getAttribute("data-nodeid");
		const handleId = handleToCheck.getAttribute("data-handleid");
		const connectable = handleToCheck.classList.contains("connectable");
		const connectableEnd = handleToCheck.classList.contains("connectableend");
		const connection = {
			source: isTarget ? handleNodeId : fromNodeId,
			sourceHandle: isTarget ? handleId : fromHandleId,
			target: isTarget ? fromNodeId : handleNodeId,
			targetHandle: isTarget ? fromHandleId : handleId
		};
		result.connection = connection;
		if (connectable && connectableEnd && (connectionMode === ConnectionMode.Strict ? isTarget && handleType === "source" || !isTarget && handleType === "target" : handleNodeId !== fromNodeId || handleId !== fromHandleId)) {
			result.endHandle = {
				nodeId: handleNodeId,
				handleId,
				type: handleType
			};
			result.isValid = isValidConnection(connection);
		}
	}
	return result;
}
function getHandleLookup({ nodes, nodeId, handleId, handleType }) {
	return nodes.reduce((res, node) => {
		if (node[internalsSymbol]) {
			const { handleBounds } = node[internalsSymbol];
			let sourceHandles = [];
			let targetHandles = [];
			if (handleBounds) {
				sourceHandles = getHandles(node, handleBounds, "source", `${nodeId}-${handleId}-${handleType}`);
				targetHandles = getHandles(node, handleBounds, "target", `${nodeId}-${handleId}-${handleType}`);
			}
			res.push(...sourceHandles, ...targetHandles);
		}
		return res;
	}, []);
}
function getHandleType(edgeUpdaterType, handleDomNode) {
	if (edgeUpdaterType) return edgeUpdaterType;
	else if (handleDomNode?.classList.contains("target")) return "target";
	else if (handleDomNode?.classList.contains("source")) return "source";
	return null;
}
function resetRecentHandle(handleDomNode) {
	handleDomNode?.classList.remove("valid", "connecting", "react-flow__handle-valid", "react-flow__handle-connecting");
}
function getConnectionStatus(isInsideConnectionRadius, isHandleValid) {
	let connectionStatus = null;
	if (isHandleValid) connectionStatus = "valid";
	else if (isInsideConnectionRadius && !isHandleValid) connectionStatus = "invalid";
	return connectionStatus;
}
function handlePointerDown({ event, handleId, nodeId, onConnect, isTarget, getState, setState, isValidConnection, edgeUpdaterType, onReconnectEnd }) {
	const doc = getHostForElement(event.target);
	const { connectionMode, domNode, autoPanOnConnect, connectionRadius, onConnectStart, panBy, getNodes, cancelConnection } = getState();
	let autoPanId = 0;
	let closestHandle;
	const { x, y } = getEventPosition(event);
	const clickedHandle = doc?.elementFromPoint(x, y);
	const handleType = getHandleType(edgeUpdaterType, clickedHandle);
	const containerBounds = domNode?.getBoundingClientRect();
	if (!containerBounds || !handleType) return;
	let prevActiveHandle;
	let connectionPosition = getEventPosition(event, containerBounds);
	let autoPanStarted = false;
	let connection = null;
	let isValid = false;
	let handleDomNode = null;
	const handleLookup = getHandleLookup({
		nodes: getNodes(),
		nodeId,
		handleId,
		handleType
	});
	const autoPan = () => {
		if (!autoPanOnConnect) return;
		const [xMovement, yMovement] = calcAutoPan(connectionPosition, containerBounds);
		panBy({
			x: xMovement,
			y: yMovement
		});
		autoPanId = requestAnimationFrame(autoPan);
	};
	setState({
		connectionPosition,
		connectionStatus: null,
		connectionNodeId: nodeId,
		connectionHandleId: handleId,
		connectionHandleType: handleType,
		connectionStartHandle: {
			nodeId,
			handleId,
			type: handleType
		},
		connectionEndHandle: null
	});
	onConnectStart?.(event, {
		nodeId,
		handleId,
		handleType
	});
	function onPointerMove(event) {
		const { transform } = getState();
		connectionPosition = getEventPosition(event, containerBounds);
		const { handle, validHandleResult } = getClosestHandle(event, doc, pointToRendererPoint(connectionPosition, transform, false, [1, 1]), connectionRadius, handleLookup, (handle) => isValidHandle(handle, connectionMode, nodeId, handleId, isTarget ? "target" : "source", isValidConnection, doc));
		closestHandle = handle;
		if (!autoPanStarted) {
			autoPan();
			autoPanStarted = true;
		}
		handleDomNode = validHandleResult.handleDomNode;
		connection = validHandleResult.connection;
		isValid = validHandleResult.isValid;
		setState({
			connectionPosition: closestHandle && isValid ? rendererPointToPoint({
				x: closestHandle.x,
				y: closestHandle.y
			}, transform) : connectionPosition,
			connectionStatus: getConnectionStatus(!!closestHandle, isValid),
			connectionEndHandle: validHandleResult.endHandle
		});
		if (!closestHandle && !isValid && !handleDomNode) return resetRecentHandle(prevActiveHandle);
		if (connection.source !== connection.target && handleDomNode) {
			resetRecentHandle(prevActiveHandle);
			prevActiveHandle = handleDomNode;
			handleDomNode.classList.add("connecting", "react-flow__handle-connecting");
			handleDomNode.classList.toggle("valid", isValid);
			handleDomNode.classList.toggle("react-flow__handle-valid", isValid);
		}
	}
	function onPointerUp(event) {
		if ((closestHandle || handleDomNode) && connection && isValid) onConnect?.(connection);
		getState().onConnectEnd?.(event);
		if (edgeUpdaterType) onReconnectEnd?.(event);
		resetRecentHandle(prevActiveHandle);
		cancelConnection();
		cancelAnimationFrame(autoPanId);
		autoPanStarted = false;
		isValid = false;
		connection = null;
		handleDomNode = null;
		doc.removeEventListener("mousemove", onPointerMove);
		doc.removeEventListener("mouseup", onPointerUp);
		doc.removeEventListener("touchmove", onPointerMove);
		doc.removeEventListener("touchend", onPointerUp);
	}
	doc.addEventListener("mousemove", onPointerMove);
	doc.addEventListener("mouseup", onPointerUp);
	doc.addEventListener("touchmove", onPointerMove);
	doc.addEventListener("touchend", onPointerUp);
}
var alwaysValid = () => true;
var selector$f = (s) => ({
	connectionStartHandle: s.connectionStartHandle,
	connectOnClick: s.connectOnClick,
	noPanClassName: s.noPanClassName
});
var connectingSelector = (nodeId, handleId, type) => (state) => {
	const { connectionStartHandle: startHandle, connectionEndHandle: endHandle, connectionClickStartHandle: clickHandle } = state;
	return {
		connecting: startHandle?.nodeId === nodeId && startHandle?.handleId === handleId && startHandle?.type === type || endHandle?.nodeId === nodeId && endHandle?.handleId === handleId && endHandle?.type === type,
		clickConnecting: clickHandle?.nodeId === nodeId && clickHandle?.handleId === handleId && clickHandle?.type === type
	};
};
var Handle = (0, import_react.forwardRef)(({ type = "source", position = Position.Top, isValidConnection, isConnectable = true, isConnectableStart = true, isConnectableEnd = true, id, onConnect, children, className, onMouseDown, onTouchStart, ...rest }, ref) => {
	const handleId = id || null;
	const isTarget = type === "target";
	const store = useStoreApi();
	const nodeId = useNodeId();
	const { connectOnClick, noPanClassName } = useStore(selector$f, shallow$1);
	const { connecting, clickConnecting } = useStore(connectingSelector(nodeId, handleId, type), shallow$1);
	if (!nodeId) store.getState().onError?.("010", errorMessages["error010"]());
	const onConnectExtended = (params) => {
		const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();
		const edgeParams = {
			...defaultEdgeOptions,
			...params
		};
		if (hasDefaultEdges) {
			const { edges, setEdges } = store.getState();
			setEdges(addEdge(edgeParams, edges));
		}
		onConnectAction?.(edgeParams);
		onConnect?.(edgeParams);
	};
	const onPointerDown = (event) => {
		if (!nodeId) return;
		const isMouseTriggered = isMouseEvent(event);
		if (isConnectableStart && (isMouseTriggered && event.button === 0 || !isMouseTriggered)) handlePointerDown({
			event,
			handleId,
			nodeId,
			onConnect: onConnectExtended,
			isTarget,
			getState: store.getState,
			setState: store.setState,
			isValidConnection: isValidConnection || store.getState().isValidConnection || alwaysValid
		});
		if (isMouseTriggered) onMouseDown?.(event);
		else onTouchStart?.(event);
	};
	const onClick = (event) => {
		const { onClickConnectStart, onClickConnectEnd, connectionClickStartHandle, connectionMode, isValidConnection: isValidConnectionStore } = store.getState();
		if (!nodeId || !connectionClickStartHandle && !isConnectableStart) return;
		if (!connectionClickStartHandle) {
			onClickConnectStart?.(event, {
				nodeId,
				handleId,
				handleType: type
			});
			store.setState({ connectionClickStartHandle: {
				nodeId,
				type,
				handleId
			} });
			return;
		}
		const doc = getHostForElement(event.target);
		const isValidConnectionHandler = isValidConnection || isValidConnectionStore || alwaysValid;
		const { connection, isValid } = isValidHandle({
			nodeId,
			id: handleId,
			type
		}, connectionMode, connectionClickStartHandle.nodeId, connectionClickStartHandle.handleId || null, connectionClickStartHandle.type, isValidConnectionHandler, doc);
		if (isValid) onConnectExtended(connection);
		onClickConnectEnd?.(event);
		store.setState({ connectionClickStartHandle: null });
	};
	return import_react.createElement("div", {
		"data-handleid": handleId,
		"data-nodeid": nodeId,
		"data-handlepos": position,
		"data-id": `${nodeId}-${handleId}-${type}`,
		className: cc([
			"react-flow__handle",
			`react-flow__handle-${position}`,
			"nodrag",
			noPanClassName,
			className,
			{
				source: !isTarget,
				target: isTarget,
				connectable: isConnectable,
				connectablestart: isConnectableStart,
				connectableend: isConnectableEnd,
				connecting: clickConnecting,
				connectionindicator: isConnectable && (isConnectableStart && !connecting || isConnectableEnd && connecting)
			}
		]),
		onMouseDown: onPointerDown,
		onTouchStart: onPointerDown,
		onClick: connectOnClick ? onClick : void 0,
		ref,
		...rest
	}, children);
});
Handle.displayName = "Handle";
var Handle$1 = (0, import_react.memo)(Handle);
var DefaultNode = ({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }) => {
	return import_react.createElement(import_react.Fragment, null, import_react.createElement(Handle$1, {
		type: "target",
		position: targetPosition,
		isConnectable
	}), data?.label, import_react.createElement(Handle$1, {
		type: "source",
		position: sourcePosition,
		isConnectable
	}));
};
DefaultNode.displayName = "DefaultNode";
var DefaultNode$1 = (0, import_react.memo)(DefaultNode);
var InputNode = ({ data, isConnectable, sourcePosition = Position.Bottom }) => import_react.createElement(import_react.Fragment, null, data?.label, import_react.createElement(Handle$1, {
	type: "source",
	position: sourcePosition,
	isConnectable
}));
InputNode.displayName = "InputNode";
var InputNode$1 = (0, import_react.memo)(InputNode);
var OutputNode = ({ data, isConnectable, targetPosition = Position.Top }) => import_react.createElement(import_react.Fragment, null, import_react.createElement(Handle$1, {
	type: "target",
	position: targetPosition,
	isConnectable
}), data?.label);
OutputNode.displayName = "OutputNode";
var OutputNode$1 = (0, import_react.memo)(OutputNode);
var GroupNode = () => null;
GroupNode.displayName = "GroupNode";
var selector$e = (s) => ({
	selectedNodes: s.getNodes().filter((n) => n.selected),
	selectedEdges: s.edges.filter((e) => e.selected).map((e) => ({ ...e }))
});
var selectId = (obj) => obj.id;
function areEqual(a, b) {
	return shallow$1(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) && shallow$1(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId));
}
var SelectionListener = (0, import_react.memo)(({ onSelectionChange }) => {
	const store = useStoreApi();
	const { selectedNodes, selectedEdges } = useStore(selector$e, areEqual);
	(0, import_react.useEffect)(() => {
		const params = {
			nodes: selectedNodes,
			edges: selectedEdges
		};
		onSelectionChange?.(params);
		store.getState().onSelectionChange.forEach((fn) => fn(params));
	}, [
		selectedNodes,
		selectedEdges,
		onSelectionChange
	]);
	return null;
});
SelectionListener.displayName = "SelectionListener";
var changeSelector = (s) => !!s.onSelectionChange;
function Wrapper$1({ onSelectionChange }) {
	const storeHasSelectionChange = useStore(changeSelector);
	if (onSelectionChange || storeHasSelectionChange) return import_react.createElement(SelectionListener, { onSelectionChange });
	return null;
}
var selector$d = (s) => ({
	setNodes: s.setNodes,
	setEdges: s.setEdges,
	setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
	setMinZoom: s.setMinZoom,
	setMaxZoom: s.setMaxZoom,
	setTranslateExtent: s.setTranslateExtent,
	setNodeExtent: s.setNodeExtent,
	reset: s.reset
});
function useStoreUpdater(value, setStoreState) {
	(0, import_react.useEffect)(() => {
		if (typeof value !== "undefined") setStoreState(value);
	}, [value]);
}
function useDirectStoreUpdater(key, value, setState) {
	(0, import_react.useEffect)(() => {
		if (typeof value !== "undefined") setState({ [key]: value });
	}, [value]);
}
var StoreUpdater = ({ nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, nodesConnectable, nodesFocusable, edgesFocusable, edgesUpdatable, elevateNodesOnSelect, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, elementsSelectable, connectionMode, snapGrid, snapToGrid, translateExtent, connectOnClick, defaultEdgeOptions, fitView, fitViewOptions, onNodesDelete, onEdgesDelete, onNodeDrag, onNodeDragStart, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, noPanClassName, nodeOrigin, rfId, autoPanOnConnect, autoPanOnNodeDrag, onError, connectionRadius, isValidConnection, nodeDragThreshold }) => {
	const { setNodes, setEdges, setDefaultNodesAndEdges, setMinZoom, setMaxZoom, setTranslateExtent, setNodeExtent, reset } = useStore(selector$d, shallow$1);
	const store = useStoreApi();
	(0, import_react.useEffect)(() => {
		const edgesWithDefaults = defaultEdges?.map((e) => ({
			...e,
			...defaultEdgeOptions
		}));
		setDefaultNodesAndEdges(defaultNodes, edgesWithDefaults);
		return () => {
			reset();
		};
	}, []);
	useDirectStoreUpdater("defaultEdgeOptions", defaultEdgeOptions, store.setState);
	useDirectStoreUpdater("connectionMode", connectionMode, store.setState);
	useDirectStoreUpdater("onConnect", onConnect, store.setState);
	useDirectStoreUpdater("onConnectStart", onConnectStart, store.setState);
	useDirectStoreUpdater("onConnectEnd", onConnectEnd, store.setState);
	useDirectStoreUpdater("onClickConnectStart", onClickConnectStart, store.setState);
	useDirectStoreUpdater("onClickConnectEnd", onClickConnectEnd, store.setState);
	useDirectStoreUpdater("nodesDraggable", nodesDraggable, store.setState);
	useDirectStoreUpdater("nodesConnectable", nodesConnectable, store.setState);
	useDirectStoreUpdater("nodesFocusable", nodesFocusable, store.setState);
	useDirectStoreUpdater("edgesFocusable", edgesFocusable, store.setState);
	useDirectStoreUpdater("edgesUpdatable", edgesUpdatable, store.setState);
	useDirectStoreUpdater("elementsSelectable", elementsSelectable, store.setState);
	useDirectStoreUpdater("elevateNodesOnSelect", elevateNodesOnSelect, store.setState);
	useDirectStoreUpdater("snapToGrid", snapToGrid, store.setState);
	useDirectStoreUpdater("snapGrid", snapGrid, store.setState);
	useDirectStoreUpdater("onNodesChange", onNodesChange, store.setState);
	useDirectStoreUpdater("onEdgesChange", onEdgesChange, store.setState);
	useDirectStoreUpdater("connectOnClick", connectOnClick, store.setState);
	useDirectStoreUpdater("fitViewOnInit", fitView, store.setState);
	useDirectStoreUpdater("fitViewOnInitOptions", fitViewOptions, store.setState);
	useDirectStoreUpdater("onNodesDelete", onNodesDelete, store.setState);
	useDirectStoreUpdater("onEdgesDelete", onEdgesDelete, store.setState);
	useDirectStoreUpdater("onNodeDrag", onNodeDrag, store.setState);
	useDirectStoreUpdater("onNodeDragStart", onNodeDragStart, store.setState);
	useDirectStoreUpdater("onNodeDragStop", onNodeDragStop, store.setState);
	useDirectStoreUpdater("onSelectionDrag", onSelectionDrag, store.setState);
	useDirectStoreUpdater("onSelectionDragStart", onSelectionDragStart, store.setState);
	useDirectStoreUpdater("onSelectionDragStop", onSelectionDragStop, store.setState);
	useDirectStoreUpdater("noPanClassName", noPanClassName, store.setState);
	useDirectStoreUpdater("nodeOrigin", nodeOrigin, store.setState);
	useDirectStoreUpdater("rfId", rfId, store.setState);
	useDirectStoreUpdater("autoPanOnConnect", autoPanOnConnect, store.setState);
	useDirectStoreUpdater("autoPanOnNodeDrag", autoPanOnNodeDrag, store.setState);
	useDirectStoreUpdater("onError", onError, store.setState);
	useDirectStoreUpdater("connectionRadius", connectionRadius, store.setState);
	useDirectStoreUpdater("isValidConnection", isValidConnection, store.setState);
	useDirectStoreUpdater("nodeDragThreshold", nodeDragThreshold, store.setState);
	useStoreUpdater(nodes, setNodes);
	useStoreUpdater(edges, setEdges);
	useStoreUpdater(minZoom, setMinZoom);
	useStoreUpdater(maxZoom, setMaxZoom);
	useStoreUpdater(translateExtent, setTranslateExtent);
	useStoreUpdater(nodeExtent, setNodeExtent);
	return null;
};
var style = { display: "none" };
var ariaLiveStyle = {
	position: "absolute",
	width: 1,
	height: 1,
	margin: -1,
	border: 0,
	padding: 0,
	overflow: "hidden",
	clip: "rect(0px, 0px, 0px, 0px)",
	clipPath: "inset(100%)"
};
var ARIA_NODE_DESC_KEY = "react-flow__node-desc";
var ARIA_EDGE_DESC_KEY = "react-flow__edge-desc";
var ARIA_LIVE_MESSAGE = "react-flow__aria-live";
var selector$c = (s) => s.ariaLiveMessage;
function AriaLiveMessage({ rfId }) {
	const ariaLiveMessage = useStore(selector$c);
	return import_react.createElement("div", {
		id: `${ARIA_LIVE_MESSAGE}-${rfId}`,
		"aria-live": "assertive",
		"aria-atomic": "true",
		style: ariaLiveStyle
	}, ariaLiveMessage);
}
function A11yDescriptions({ rfId, disableKeyboardA11y }) {
	return import_react.createElement(import_react.Fragment, null, import_react.createElement("div", {
		id: `${ARIA_NODE_DESC_KEY}-${rfId}`,
		style
	}, "Press enter or space to select a node.", !disableKeyboardA11y && "You can then use the arrow keys to move the node around.", " Press delete to remove it and escape to cancel.", " "), import_react.createElement("div", {
		id: `${ARIA_EDGE_DESC_KEY}-${rfId}`,
		style
	}, "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel."), !disableKeyboardA11y && import_react.createElement(AriaLiveMessage, { rfId }));
}
var useKeyPress = (keyCode = null, options = { actInsideInputWithModifier: true }) => {
	const [keyPressed, setKeyPressed] = (0, import_react.useState)(false);
	const modifierPressed = (0, import_react.useRef)(false);
	const pressedKeys = (0, import_react.useRef)(/* @__PURE__ */ new Set([]));
	const [keyCodes, keysToWatch] = (0, import_react.useMemo)(() => {
		if (keyCode !== null) {
			const keys = (Array.isArray(keyCode) ? keyCode : [keyCode]).filter((kc) => typeof kc === "string").map((kc) => kc.split("+"));
			return [keys, keys.reduce((res, item) => res.concat(...item), [])];
		}
		return [[], []];
	}, [keyCode]);
	(0, import_react.useEffect)(() => {
		const doc = typeof document !== "undefined" ? document : null;
		const target = options?.target || doc;
		if (keyCode !== null) {
			const downHandler = (event) => {
				modifierPressed.current = event.ctrlKey || event.metaKey || event.shiftKey;
				if ((!modifierPressed.current || modifierPressed.current && !options.actInsideInputWithModifier) && isInputDOMNode(event)) return false;
				const keyOrCode = useKeyOrCode(event.code, keysToWatch);
				pressedKeys.current.add(event[keyOrCode]);
				if (isMatchingKey(keyCodes, pressedKeys.current, false)) {
					event.preventDefault();
					setKeyPressed(true);
				}
			};
			const upHandler = (event) => {
				if ((!modifierPressed.current || modifierPressed.current && !options.actInsideInputWithModifier) && isInputDOMNode(event)) return false;
				const keyOrCode = useKeyOrCode(event.code, keysToWatch);
				if (isMatchingKey(keyCodes, pressedKeys.current, true)) {
					setKeyPressed(false);
					pressedKeys.current.clear();
				} else pressedKeys.current.delete(event[keyOrCode]);
				if (event.key === "Meta") pressedKeys.current.clear();
				modifierPressed.current = false;
			};
			const resetHandler = () => {
				pressedKeys.current.clear();
				setKeyPressed(false);
			};
			target?.addEventListener("keydown", downHandler);
			target?.addEventListener("keyup", upHandler);
			window.addEventListener("blur", resetHandler);
			return () => {
				target?.removeEventListener("keydown", downHandler);
				target?.removeEventListener("keyup", upHandler);
				window.removeEventListener("blur", resetHandler);
			};
		}
	}, [keyCode, setKeyPressed]);
	return keyPressed;
};
function isMatchingKey(keyCodes, pressedKeys, isUp) {
	return keyCodes.filter((keys) => isUp || keys.length === pressedKeys.size).some((keys) => keys.every((k) => pressedKeys.has(k)));
}
function useKeyOrCode(eventCode, keysToWatch) {
	return keysToWatch.includes(eventCode) ? "code" : "key";
}
function calculateXYZPosition(node, nodeInternals, result, nodeOrigin) {
	const parentId = node.parentNode || node.parentId;
	if (!parentId) return result;
	const parentNode = nodeInternals.get(parentId);
	const parentNodePosition = getNodePositionWithOrigin(parentNode, nodeOrigin);
	return calculateXYZPosition(parentNode, nodeInternals, {
		x: (result.x ?? 0) + parentNodePosition.x,
		y: (result.y ?? 0) + parentNodePosition.y,
		z: (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0) ? parentNode[internalsSymbol]?.z ?? 0 : result.z ?? 0
	}, nodeOrigin);
}
function updateAbsoluteNodePositions(nodeInternals, nodeOrigin, parentNodes) {
	nodeInternals.forEach((node) => {
		const parentId = node.parentNode || node.parentId;
		if (parentId && !nodeInternals.has(parentId)) throw new Error(`Parent node ${parentId} not found`);
		if (parentId || parentNodes?.[node.id]) {
			const { x, y, z } = calculateXYZPosition(node, nodeInternals, {
				...node.position,
				z: node[internalsSymbol]?.z ?? 0
			}, nodeOrigin);
			node.positionAbsolute = {
				x,
				y
			};
			node[internalsSymbol].z = z;
			if (parentNodes?.[node.id]) node[internalsSymbol].isParent = true;
		}
	});
}
function createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect) {
	const nextNodeInternals = /* @__PURE__ */ new Map();
	const parentNodes = {};
	const selectedNodeZ = elevateNodesOnSelect ? 1e3 : 0;
	nodes.forEach((node) => {
		const z = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0);
		const currInternals = nodeInternals.get(node.id);
		const internals = {
			...node,
			positionAbsolute: {
				x: node.position.x,
				y: node.position.y
			}
		};
		const parentId = node.parentNode || node.parentId;
		if (parentId) parentNodes[parentId] = true;
		const resetHandleBounds = currInternals?.type && currInternals?.type !== node.type;
		Object.defineProperty(internals, internalsSymbol, {
			enumerable: false,
			value: {
				handleBounds: resetHandleBounds ? void 0 : currInternals?.[internalsSymbol]?.handleBounds,
				z
			}
		});
		nextNodeInternals.set(node.id, internals);
	});
	updateAbsoluteNodePositions(nextNodeInternals, nodeOrigin, parentNodes);
	return nextNodeInternals;
}
function fitView(get, options = {}) {
	const { getNodes, width, height, minZoom, maxZoom, d3Zoom, d3Selection, fitViewOnInitDone, fitViewOnInit, nodeOrigin } = get();
	const isInitialFitView = options.initial && !fitViewOnInitDone && fitViewOnInit;
	if (d3Zoom && d3Selection && (isInitialFitView || !options.initial)) {
		const nodes = getNodes().filter((n) => {
			const isVisible = options.includeHiddenNodes ? n.width && n.height : !n.hidden;
			if (options.nodes?.length) return isVisible && options.nodes.some((optionNode) => optionNode.id === n.id);
			return isVisible;
		});
		const nodesInitialized = nodes.every((n) => n.width && n.height);
		if (nodes.length > 0 && nodesInitialized) {
			const { x, y, zoom } = getViewportForBounds(getNodesBounds(nodes, nodeOrigin), width, height, options.minZoom ?? minZoom, options.maxZoom ?? maxZoom, options.padding ?? .1);
			const nextTransform = identity.translate(x, y).scale(zoom);
			if (typeof options.duration === "number" && options.duration > 0) d3Zoom.transform(getD3Transition(d3Selection, options.duration), nextTransform);
			else d3Zoom.transform(d3Selection, nextTransform);
			return true;
		}
	}
	return false;
}
function handleControlledNodeSelectionChange(nodeChanges, nodeInternals) {
	nodeChanges.forEach((change) => {
		const node = nodeInternals.get(change.id);
		if (node) nodeInternals.set(node.id, {
			...node,
			[internalsSymbol]: node[internalsSymbol],
			selected: change.selected
		});
	});
	return new Map(nodeInternals);
}
function handleControlledEdgeSelectionChange(edgeChanges, edges) {
	return edges.map((e) => {
		const change = edgeChanges.find((change) => change.id === e.id);
		if (change) e.selected = change.selected;
		return e;
	});
}
function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get, set }) {
	const { nodeInternals, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get();
	if (changedNodes?.length) {
		if (hasDefaultNodes) set({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
		onNodesChange?.(changedNodes);
	}
	if (changedEdges?.length) {
		if (hasDefaultEdges) set({ edges: handleControlledEdgeSelectionChange(changedEdges, edges) });
		onEdgesChange?.(changedEdges);
	}
}
var noop = () => {};
var initialViewportHelper = {
	zoomIn: noop,
	zoomOut: noop,
	zoomTo: noop,
	getZoom: () => 1,
	setViewport: noop,
	getViewport: () => ({
		x: 0,
		y: 0,
		zoom: 1
	}),
	fitView: () => false,
	setCenter: noop,
	fitBounds: noop,
	project: (position) => position,
	screenToFlowPosition: (position) => position,
	flowToScreenPosition: (position) => position,
	viewportInitialized: false
};
var selector$b = (s) => ({
	d3Zoom: s.d3Zoom,
	d3Selection: s.d3Selection
});
var useViewportHelper = () => {
	const store = useStoreApi();
	const { d3Zoom, d3Selection } = useStore(selector$b, shallow$1);
	return (0, import_react.useMemo)(() => {
		if (d3Selection && d3Zoom) return {
			zoomIn: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1.2),
			zoomOut: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1 / 1.2),
			zoomTo: (zoomLevel, options) => d3Zoom.scaleTo(getD3Transition(d3Selection, options?.duration), zoomLevel),
			getZoom: () => store.getState().transform[2],
			setViewport: (transform, options) => {
				const [x, y, zoom] = store.getState().transform;
				const nextTransform = identity.translate(transform.x ?? x, transform.y ?? y).scale(transform.zoom ?? zoom);
				d3Zoom.transform(getD3Transition(d3Selection, options?.duration), nextTransform);
			},
			getViewport: () => {
				const [x, y, zoom] = store.getState().transform;
				return {
					x,
					y,
					zoom
				};
			},
			fitView: (options) => fitView(store.getState, options),
			setCenter: (x, y, options) => {
				const { width, height, maxZoom } = store.getState();
				const nextZoom = typeof options?.zoom !== "undefined" ? options.zoom : maxZoom;
				const centerX = width / 2 - x * nextZoom;
				const centerY = height / 2 - y * nextZoom;
				const transform = identity.translate(centerX, centerY).scale(nextZoom);
				d3Zoom.transform(getD3Transition(d3Selection, options?.duration), transform);
			},
			fitBounds: (bounds, options) => {
				const { width, height, minZoom, maxZoom } = store.getState();
				const { x, y, zoom } = getViewportForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? .1);
				const transform = identity.translate(x, y).scale(zoom);
				d3Zoom.transform(getD3Transition(d3Selection, options?.duration), transform);
			},
			project: (position) => {
				const { transform, snapToGrid, snapGrid } = store.getState();
				console.warn("[DEPRECATED] `project` is deprecated. Instead use `screenToFlowPosition`. There is no need to subtract the react flow bounds anymore! https://reactflow.dev/api-reference/types/react-flow-instance#screen-to-flow-position");
				return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
			},
			screenToFlowPosition: (position) => {
				const { transform, snapToGrid, snapGrid, domNode } = store.getState();
				if (!domNode) return position;
				const { x: domX, y: domY } = domNode.getBoundingClientRect();
				return pointToRendererPoint({
					x: position.x - domX,
					y: position.y - domY
				}, transform, snapToGrid, snapGrid);
			},
			flowToScreenPosition: (position) => {
				const { transform, domNode } = store.getState();
				if (!domNode) return position;
				const { x: domX, y: domY } = domNode.getBoundingClientRect();
				const rendererPosition = rendererPointToPoint(position, transform);
				return {
					x: rendererPosition.x + domX,
					y: rendererPosition.y + domY
				};
			},
			viewportInitialized: true
		};
		return initialViewportHelper;
	}, [d3Zoom, d3Selection]);
};
function useReactFlow() {
	const viewportHelper = useViewportHelper();
	const store = useStoreApi();
	const getNodes = (0, import_react.useCallback)(() => {
		return store.getState().getNodes().map((n) => ({ ...n }));
	}, []);
	const getNode = (0, import_react.useCallback)((id) => {
		return store.getState().nodeInternals.get(id);
	}, []);
	const getEdges = (0, import_react.useCallback)(() => {
		const { edges = [] } = store.getState();
		return edges.map((e) => ({ ...e }));
	}, []);
	const getEdge = (0, import_react.useCallback)((id) => {
		const { edges = [] } = store.getState();
		return edges.find((e) => e.id === id);
	}, []);
	const setNodes = (0, import_react.useCallback)((payload) => {
		const { getNodes, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
		const nodes = getNodes();
		const nextNodes = typeof payload === "function" ? payload(nodes) : payload;
		if (hasDefaultNodes) setNodes(nextNodes);
		else if (onNodesChange) onNodesChange(nextNodes.length === 0 ? nodes.map((node) => ({
			type: "remove",
			id: node.id
		})) : nextNodes.map((node) => ({
			item: node,
			type: "reset"
		})));
	}, []);
	const setEdges = (0, import_react.useCallback)((payload) => {
		const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();
		const nextEdges = typeof payload === "function" ? payload(edges) : payload;
		if (hasDefaultEdges) setEdges(nextEdges);
		else if (onEdgesChange) onEdgesChange(nextEdges.length === 0 ? edges.map((edge) => ({
			type: "remove",
			id: edge.id
		})) : nextEdges.map((edge) => ({
			item: edge,
			type: "reset"
		})));
	}, []);
	const addNodes = (0, import_react.useCallback)((payload) => {
		const nodes = Array.isArray(payload) ? payload : [payload];
		const { getNodes, setNodes, hasDefaultNodes, onNodesChange } = store.getState();
		if (hasDefaultNodes) setNodes([...getNodes(), ...nodes]);
		else if (onNodesChange) onNodesChange(nodes.map((node) => ({
			item: node,
			type: "add"
		})));
	}, []);
	const addEdges = (0, import_react.useCallback)((payload) => {
		const nextEdges = Array.isArray(payload) ? payload : [payload];
		const { edges = [], setEdges, hasDefaultEdges, onEdgesChange } = store.getState();
		if (hasDefaultEdges) setEdges([...edges, ...nextEdges]);
		else if (onEdgesChange) onEdgesChange(nextEdges.map((edge) => ({
			item: edge,
			type: "add"
		})));
	}, []);
	const toObject = (0, import_react.useCallback)(() => {
		const { getNodes, edges = [], transform } = store.getState();
		const [x, y, zoom] = transform;
		return {
			nodes: getNodes().map((n) => ({ ...n })),
			edges: edges.map((e) => ({ ...e })),
			viewport: {
				x,
				y,
				zoom
			}
		};
	}, []);
	const deleteElements = (0, import_react.useCallback)(({ nodes: nodesDeleted, edges: edgesDeleted }) => {
		const { nodeInternals, getNodes, edges, hasDefaultNodes, hasDefaultEdges, onNodesDelete, onEdgesDelete, onNodesChange, onEdgesChange } = store.getState();
		const nodeIds = (nodesDeleted || []).map((node) => node.id);
		const edgeIds = (edgesDeleted || []).map((edge) => edge.id);
		const nodesToRemove = getNodes().reduce((res, node) => {
			const parentId = node.parentNode || node.parentId;
			const parentHit = !nodeIds.includes(node.id) && parentId && res.find((n) => n.id === parentId);
			if ((typeof node.deletable === "boolean" ? node.deletable : true) && (nodeIds.includes(node.id) || parentHit)) res.push(node);
			return res;
		}, []);
		const deletableEdges = edges.filter((e) => typeof e.deletable === "boolean" ? e.deletable : true);
		const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));
		if (nodesToRemove || initialHitEdges) {
			const connectedEdges = getConnectedEdges(nodesToRemove, deletableEdges);
			const edgesToRemove = [...initialHitEdges, ...connectedEdges];
			const edgeIdsToRemove = edgesToRemove.reduce((res, edge) => {
				if (!res.includes(edge.id)) res.push(edge.id);
				return res;
			}, []);
			if (hasDefaultEdges || hasDefaultNodes) {
				if (hasDefaultEdges) store.setState({ edges: edges.filter((e) => !edgeIdsToRemove.includes(e.id)) });
				if (hasDefaultNodes) {
					nodesToRemove.forEach((node) => {
						nodeInternals.delete(node.id);
					});
					store.setState({ nodeInternals: new Map(nodeInternals) });
				}
			}
			if (edgeIdsToRemove.length > 0) {
				onEdgesDelete?.(edgesToRemove);
				if (onEdgesChange) onEdgesChange(edgeIdsToRemove.map((id) => ({
					id,
					type: "remove"
				})));
			}
			if (nodesToRemove.length > 0) {
				onNodesDelete?.(nodesToRemove);
				if (onNodesChange) onNodesChange(nodesToRemove.map((n) => ({
					id: n.id,
					type: "remove"
				})));
			}
		}
	}, []);
	const getNodeRect = (0, import_react.useCallback)((nodeOrRect) => {
		const isRect = isRectObject(nodeOrRect);
		const node = isRect ? null : store.getState().nodeInternals.get(nodeOrRect.id);
		if (!isRect && !node) return [
			null,
			null,
			isRect
		];
		return [
			isRect ? nodeOrRect : nodeToRect(node),
			node,
			isRect
		];
	}, []);
	const getIntersectingNodes = (0, import_react.useCallback)((nodeOrRect, partially = true, nodes) => {
		const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);
		if (!nodeRect) return [];
		return (nodes || store.getState().getNodes()).filter((n) => {
			if (!isRect && (n.id === node.id || !n.positionAbsolute)) return false;
			const overlappingArea = getOverlappingArea(nodeToRect(n), nodeRect);
			return partially && overlappingArea > 0 || overlappingArea >= nodeRect.width * nodeRect.height;
		});
	}, []);
	const isNodeIntersecting = (0, import_react.useCallback)((nodeOrRect, area, partially = true) => {
		const [nodeRect] = getNodeRect(nodeOrRect);
		if (!nodeRect) return false;
		const overlappingArea = getOverlappingArea(nodeRect, area);
		return partially && overlappingArea > 0 || overlappingArea >= nodeRect.width * nodeRect.height;
	}, []);
	return (0, import_react.useMemo)(() => {
		return {
			...viewportHelper,
			getNodes,
			getNode,
			getEdges,
			getEdge,
			setNodes,
			setEdges,
			addNodes,
			addEdges,
			toObject,
			deleteElements,
			getIntersectingNodes,
			isNodeIntersecting
		};
	}, [
		viewportHelper,
		getNodes,
		getNode,
		getEdges,
		getEdge,
		setNodes,
		setEdges,
		addNodes,
		addEdges,
		toObject,
		deleteElements,
		getIntersectingNodes,
		isNodeIntersecting
	]);
}
var deleteKeyOptions = { actInsideInputWithModifier: false };
var useGlobalKeyHandler = ({ deleteKeyCode, multiSelectionKeyCode }) => {
	const store = useStoreApi();
	const { deleteElements } = useReactFlow();
	const deleteKeyPressed = useKeyPress(deleteKeyCode, deleteKeyOptions);
	const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);
	(0, import_react.useEffect)(() => {
		if (deleteKeyPressed) {
			const { edges, getNodes } = store.getState();
			const selectedNodes = getNodes().filter((node) => node.selected);
			const selectedEdges = edges.filter((edge) => edge.selected);
			deleteElements({
				nodes: selectedNodes,
				edges: selectedEdges
			});
			store.setState({ nodesSelectionActive: false });
		}
	}, [deleteKeyPressed]);
	(0, import_react.useEffect)(() => {
		store.setState({ multiSelectionActive: multiSelectionKeyPressed });
	}, [multiSelectionKeyPressed]);
};
function useResizeHandler(rendererNode) {
	const store = useStoreApi();
	(0, import_react.useEffect)(() => {
		let resizeObserver;
		const updateDimensions = () => {
			if (!rendererNode.current) return;
			const size = getDimensions(rendererNode.current);
			if (size.height === 0 || size.width === 0) store.getState().onError?.("004", errorMessages["error004"]());
			store.setState({
				width: size.width || 500,
				height: size.height || 500
			});
		};
		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		if (rendererNode.current) {
			resizeObserver = new ResizeObserver(() => updateDimensions());
			resizeObserver.observe(rendererNode.current);
		}
		return () => {
			window.removeEventListener("resize", updateDimensions);
			if (resizeObserver && rendererNode.current) resizeObserver.unobserve(rendererNode.current);
		};
	}, []);
}
var containerStyle = {
	position: "absolute",
	width: "100%",
	height: "100%",
	top: 0,
	left: 0
};
var viewChanged = (prevViewport, eventTransform) => prevViewport.x !== eventTransform.x || prevViewport.y !== eventTransform.y || prevViewport.zoom !== eventTransform.k;
var eventToFlowTransform = (eventTransform) => ({
	x: eventTransform.x,
	y: eventTransform.y,
	zoom: eventTransform.k
});
var isWrappedWithClass = (event, className) => event.target.closest(`.${className}`);
var isRightClickPan = (panOnDrag, usedButton) => usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
var wheelDelta = (event) => {
	const factor = event.ctrlKey && isMacOs() ? 10 : 1;
	return -event.deltaY * (event.deltaMode === 1 ? .05 : event.deltaMode ? 1 : .002) * factor;
};
var selector$a = (s) => ({
	d3Zoom: s.d3Zoom,
	d3Selection: s.d3Selection,
	d3ZoomHandler: s.d3ZoomHandler,
	userSelectionActive: s.userSelectionActive
});
var ZoomPane = ({ onMove, onMoveStart, onMoveEnd, onPaneContextMenu, zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = .5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, elementsSelectable, panOnDrag = true, defaultViewport, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling = true, children, noWheelClassName, noPanClassName }) => {
	const timerId = (0, import_react.useRef)();
	const store = useStoreApi();
	const isZoomingOrPanning = (0, import_react.useRef)(false);
	const zoomedWithRightMouseButton = (0, import_react.useRef)(false);
	const zoomPane = (0, import_react.useRef)(null);
	const prevTransform = (0, import_react.useRef)({
		x: 0,
		y: 0,
		zoom: 0
	});
	const { d3Zoom, d3Selection, d3ZoomHandler, userSelectionActive } = useStore(selector$a, shallow$1);
	const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
	const mouseButton = (0, import_react.useRef)(0);
	const isPanScrolling = (0, import_react.useRef)(false);
	const panScrollTimeout = (0, import_react.useRef)();
	useResizeHandler(zoomPane);
	(0, import_react.useEffect)(() => {
		if (zoomPane.current) {
			const bbox = zoomPane.current.getBoundingClientRect();
			const d3ZoomInstance = zoom_default().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
			const selection = select_default$1(zoomPane.current).call(d3ZoomInstance);
			const updatedTransform = identity.translate(defaultViewport.x, defaultViewport.y).scale(clamp(defaultViewport.zoom, minZoom, maxZoom));
			const extent = [[0, 0], [bbox.width, bbox.height]];
			const constrainedTransform = d3ZoomInstance.constrain()(updatedTransform, extent, translateExtent);
			d3ZoomInstance.transform(selection, constrainedTransform);
			d3ZoomInstance.wheelDelta(wheelDelta);
			store.setState({
				d3Zoom: d3ZoomInstance,
				d3Selection: selection,
				d3ZoomHandler: selection.on("wheel.zoom"),
				transform: [
					constrainedTransform.x,
					constrainedTransform.y,
					constrainedTransform.k
				],
				domNode: zoomPane.current.closest(".react-flow")
			});
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (d3Selection && d3Zoom) {
			if (panOnScroll && !zoomActivationKeyPressed && !userSelectionActive) d3Selection.on("wheel.zoom", (event) => {
				if (isWrappedWithClass(event, noWheelClassName)) return false;
				event.preventDefault();
				event.stopImmediatePropagation();
				const currentZoom = d3Selection.property("__zoom").k || 1;
				if (event.ctrlKey && zoomOnPinch) {
					const point = pointer_default(event);
					const pinchDelta = wheelDelta(event);
					const zoom = currentZoom * Math.pow(2, pinchDelta);
					d3Zoom.scaleTo(d3Selection, zoom, point, event);
					return;
				}
				const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
				let deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
				let deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
				if (!isMacOs() && event.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
					deltaX = event.deltaY * deltaNormalize;
					deltaY = 0;
				}
				d3Zoom.translateBy(d3Selection, -(deltaX / currentZoom) * panOnScrollSpeed, -(deltaY / currentZoom) * panOnScrollSpeed, { internal: true });
				const nextViewport = eventToFlowTransform(d3Selection.property("__zoom"));
				const { onViewportChangeStart, onViewportChange, onViewportChangeEnd } = store.getState();
				clearTimeout(panScrollTimeout.current);
				if (!isPanScrolling.current) {
					isPanScrolling.current = true;
					onMoveStart?.(event, nextViewport);
					onViewportChangeStart?.(nextViewport);
				}
				if (isPanScrolling.current) {
					onMove?.(event, nextViewport);
					onViewportChange?.(nextViewport);
					panScrollTimeout.current = setTimeout(() => {
						onMoveEnd?.(event, nextViewport);
						onViewportChangeEnd?.(nextViewport);
						isPanScrolling.current = false;
					}, 150);
				}
			}, { passive: false });
			else if (typeof d3ZoomHandler !== "undefined") d3Selection.on("wheel.zoom", function(event, d) {
				if (!preventScrolling && event.type === "wheel" && !event.ctrlKey || isWrappedWithClass(event, noWheelClassName)) return null;
				event.preventDefault();
				d3ZoomHandler.call(this, event, d);
			}, { passive: false });
		}
	}, [
		userSelectionActive,
		panOnScroll,
		panOnScrollMode,
		d3Selection,
		d3Zoom,
		d3ZoomHandler,
		zoomActivationKeyPressed,
		zoomOnPinch,
		preventScrolling,
		noWheelClassName,
		onMoveStart,
		onMove,
		onMoveEnd
	]);
	(0, import_react.useEffect)(() => {
		if (d3Zoom) d3Zoom.on("start", (event) => {
			if (!event.sourceEvent || event.sourceEvent.internal) return null;
			mouseButton.current = event.sourceEvent?.button;
			const { onViewportChangeStart } = store.getState();
			const flowTransform = eventToFlowTransform(event.transform);
			isZoomingOrPanning.current = true;
			prevTransform.current = flowTransform;
			if (event.sourceEvent?.type === "mousedown") store.setState({ paneDragging: true });
			onViewportChangeStart?.(flowTransform);
			onMoveStart?.(event.sourceEvent, flowTransform);
		});
	}, [d3Zoom, onMoveStart]);
	(0, import_react.useEffect)(() => {
		if (d3Zoom) {
			if (userSelectionActive && !isZoomingOrPanning.current) d3Zoom.on("zoom", null);
			else if (!userSelectionActive) d3Zoom.on("zoom", (event) => {
				const { onViewportChange } = store.getState();
				store.setState({ transform: [
					event.transform.x,
					event.transform.y,
					event.transform.k
				] });
				zoomedWithRightMouseButton.current = !!(onPaneContextMenu && isRightClickPan(panOnDrag, mouseButton.current ?? 0));
				if ((onMove || onViewportChange) && !event.sourceEvent?.internal) {
					const flowTransform = eventToFlowTransform(event.transform);
					onViewportChange?.(flowTransform);
					onMove?.(event.sourceEvent, flowTransform);
				}
			});
		}
	}, [
		userSelectionActive,
		d3Zoom,
		onMove,
		panOnDrag,
		onPaneContextMenu
	]);
	(0, import_react.useEffect)(() => {
		if (d3Zoom) d3Zoom.on("end", (event) => {
			if (!event.sourceEvent || event.sourceEvent.internal) return null;
			const { onViewportChangeEnd } = store.getState();
			isZoomingOrPanning.current = false;
			store.setState({ paneDragging: false });
			if (onPaneContextMenu && isRightClickPan(panOnDrag, mouseButton.current ?? 0) && !zoomedWithRightMouseButton.current) onPaneContextMenu(event.sourceEvent);
			zoomedWithRightMouseButton.current = false;
			if ((onMoveEnd || onViewportChangeEnd) && viewChanged(prevTransform.current, event.transform)) {
				const flowTransform = eventToFlowTransform(event.transform);
				prevTransform.current = flowTransform;
				clearTimeout(timerId.current);
				timerId.current = setTimeout(() => {
					onViewportChangeEnd?.(flowTransform);
					onMoveEnd?.(event.sourceEvent, flowTransform);
				}, panOnScroll ? 150 : 0);
			}
		});
	}, [
		d3Zoom,
		panOnScroll,
		panOnDrag,
		onMoveEnd,
		onPaneContextMenu
	]);
	(0, import_react.useEffect)(() => {
		if (d3Zoom) d3Zoom.filter((event) => {
			const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
			const pinchZoom = zoomOnPinch && event.ctrlKey;
			if ((panOnDrag === true || Array.isArray(panOnDrag) && panOnDrag.includes(1)) && event.button === 1 && event.type === "mousedown" && (isWrappedWithClass(event, "react-flow__node") || isWrappedWithClass(event, "react-flow__edge"))) return true;
			if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) return false;
			if (userSelectionActive) return false;
			if (!zoomOnDoubleClick && event.type === "dblclick") return false;
			if (isWrappedWithClass(event, noWheelClassName) && event.type === "wheel") return false;
			if (isWrappedWithClass(event, noPanClassName) && (event.type !== "wheel" || panOnScroll && event.type === "wheel" && !zoomActivationKeyPressed)) return false;
			if (!zoomOnPinch && event.ctrlKey && event.type === "wheel") return false;
			if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === "wheel") return false;
			if (!panOnDrag && (event.type === "mousedown" || event.type === "touchstart")) return false;
			if (Array.isArray(panOnDrag) && !panOnDrag.includes(event.button) && event.type === "mousedown") return false;
			const buttonAllowed = Array.isArray(panOnDrag) && panOnDrag.includes(event.button) || !event.button || event.button <= 1;
			return (!event.ctrlKey || event.type === "wheel") && buttonAllowed;
		});
	}, [
		userSelectionActive,
		d3Zoom,
		zoomOnScroll,
		zoomOnPinch,
		panOnScroll,
		zoomOnDoubleClick,
		panOnDrag,
		elementsSelectable,
		zoomActivationKeyPressed
	]);
	return import_react.createElement("div", {
		className: "react-flow__renderer",
		ref: zoomPane,
		style: containerStyle
	}, children);
};
var selector$9 = (s) => ({
	userSelectionActive: s.userSelectionActive,
	userSelectionRect: s.userSelectionRect
});
function UserSelection() {
	const { userSelectionActive, userSelectionRect } = useStore(selector$9, shallow$1);
	if (!(userSelectionActive && userSelectionRect)) return null;
	return import_react.createElement("div", {
		className: "react-flow__selection react-flow__container",
		style: {
			width: userSelectionRect.width,
			height: userSelectionRect.height,
			transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`
		}
	});
}
function handleParentExpand(res, updateItem) {
	const parentId = updateItem.parentNode || updateItem.parentId;
	const parent = res.find((e) => e.id === parentId);
	if (parent) {
		const extendWidth = updateItem.position.x + updateItem.width - parent.width;
		const extendHeight = updateItem.position.y + updateItem.height - parent.height;
		if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
			parent.style = { ...parent.style };
			parent.style.width = parent.style.width ?? parent.width;
			parent.style.height = parent.style.height ?? parent.height;
			if (extendWidth > 0) parent.style.width += extendWidth;
			if (extendHeight > 0) parent.style.height += extendHeight;
			if (updateItem.position.x < 0) {
				const xDiff = Math.abs(updateItem.position.x);
				parent.position.x = parent.position.x - xDiff;
				parent.style.width += xDiff;
				updateItem.position.x = 0;
			}
			if (updateItem.position.y < 0) {
				const yDiff = Math.abs(updateItem.position.y);
				parent.position.y = parent.position.y - yDiff;
				parent.style.height += yDiff;
				updateItem.position.y = 0;
			}
			parent.width = parent.style.width;
			parent.height = parent.style.height;
		}
	}
}
function applyChanges(changes, elements) {
	if (changes.some((c) => c.type === "reset")) return changes.filter((c) => c.type === "reset").map((c) => c.item);
	const initElements = changes.filter((c) => c.type === "add").map((c) => c.item);
	return elements.reduce((res, item) => {
		const currentChanges = changes.filter((c) => c.id === item.id);
		if (currentChanges.length === 0) {
			res.push(item);
			return res;
		}
		const updateItem = { ...item };
		for (const currentChange of currentChanges) if (currentChange) switch (currentChange.type) {
			case "select":
				updateItem.selected = currentChange.selected;
				break;
			case "position":
				if (typeof currentChange.position !== "undefined") updateItem.position = currentChange.position;
				if (typeof currentChange.positionAbsolute !== "undefined") updateItem.positionAbsolute = currentChange.positionAbsolute;
				if (typeof currentChange.dragging !== "undefined") updateItem.dragging = currentChange.dragging;
				if (updateItem.expandParent) handleParentExpand(res, updateItem);
				break;
			case "dimensions":
				if (typeof currentChange.dimensions !== "undefined") {
					updateItem.width = currentChange.dimensions.width;
					updateItem.height = currentChange.dimensions.height;
				}
				if (typeof currentChange.updateStyle !== "undefined") updateItem.style = {
					...updateItem.style || {},
					...currentChange.dimensions
				};
				if (typeof currentChange.resizing === "boolean") updateItem.resizing = currentChange.resizing;
				if (updateItem.expandParent) handleParentExpand(res, updateItem);
				break;
			case "remove": return res;
		}
		res.push(updateItem);
		return res;
	}, initElements);
}
function applyNodeChanges(changes, nodes) {
	return applyChanges(changes, nodes);
}
var createSelectionChange = (id, selected) => ({
	id,
	type: "select",
	selected
});
function getSelectionChanges(items, selectedIds) {
	return items.reduce((res, item) => {
		const willBeSelected = selectedIds.includes(item.id);
		if (!item.selected && willBeSelected) {
			item.selected = true;
			res.push(createSelectionChange(item.id, true));
		} else if (item.selected && !willBeSelected) {
			item.selected = false;
			res.push(createSelectionChange(item.id, false));
		}
		return res;
	}, []);
}
/**
* The user selection rectangle gets displayed when a user drags the mouse while pressing shift
*/
var wrapHandler = (handler, containerRef) => {
	return (event) => {
		if (event.target !== containerRef.current) return;
		handler?.(event);
	};
};
var selector$8 = (s) => ({
	userSelectionActive: s.userSelectionActive,
	elementsSelectable: s.elementsSelectable,
	dragging: s.paneDragging
});
var Pane = (0, import_react.memo)(({ isSelecting, selectionMode = SelectionMode.Full, panOnDrag, onSelectionStart, onSelectionEnd, onPaneClick, onPaneContextMenu, onPaneScroll, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, children }) => {
	const container = (0, import_react.useRef)(null);
	const store = useStoreApi();
	const prevSelectedNodesCount = (0, import_react.useRef)(0);
	const prevSelectedEdgesCount = (0, import_react.useRef)(0);
	const containerBounds = (0, import_react.useRef)();
	const { userSelectionActive, elementsSelectable, dragging } = useStore(selector$8, shallow$1);
	const resetUserSelection = () => {
		store.setState({
			userSelectionActive: false,
			userSelectionRect: null
		});
		prevSelectedNodesCount.current = 0;
		prevSelectedEdgesCount.current = 0;
	};
	const onClick = (event) => {
		onPaneClick?.(event);
		store.getState().resetSelectedElements();
		store.setState({ nodesSelectionActive: false });
	};
	const onContextMenu = (event) => {
		if (Array.isArray(panOnDrag) && panOnDrag?.includes(2)) {
			event.preventDefault();
			return;
		}
		onPaneContextMenu?.(event);
	};
	const onWheel = onPaneScroll ? (event) => onPaneScroll(event) : void 0;
	const onMouseDown = (event) => {
		const { resetSelectedElements, domNode } = store.getState();
		containerBounds.current = domNode?.getBoundingClientRect();
		if (!elementsSelectable || !isSelecting || event.button !== 0 || event.target !== container.current || !containerBounds.current) return;
		const { x, y } = getEventPosition(event, containerBounds.current);
		resetSelectedElements();
		store.setState({ userSelectionRect: {
			width: 0,
			height: 0,
			startX: x,
			startY: y,
			x,
			y
		} });
		onSelectionStart?.(event);
	};
	const onMouseMove = (event) => {
		const { userSelectionRect, nodeInternals, edges, transform, onNodesChange, onEdgesChange, nodeOrigin, getNodes } = store.getState();
		if (!isSelecting || !containerBounds.current || !userSelectionRect) return;
		store.setState({
			userSelectionActive: true,
			nodesSelectionActive: false
		});
		const mousePos = getEventPosition(event, containerBounds.current);
		const startX = userSelectionRect.startX ?? 0;
		const startY = userSelectionRect.startY ?? 0;
		const nextUserSelectRect = {
			...userSelectionRect,
			x: mousePos.x < startX ? mousePos.x : startX,
			y: mousePos.y < startY ? mousePos.y : startY,
			width: Math.abs(mousePos.x - startX),
			height: Math.abs(mousePos.y - startY)
		};
		const nodes = getNodes();
		const selectedNodes = getNodesInside(nodeInternals, nextUserSelectRect, transform, selectionMode === SelectionMode.Partial, true, nodeOrigin);
		const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
		const selectedNodeIds = selectedNodes.map((n) => n.id);
		if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
			prevSelectedNodesCount.current = selectedNodeIds.length;
			const changes = getSelectionChanges(nodes, selectedNodeIds);
			if (changes.length) onNodesChange?.(changes);
		}
		if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
			prevSelectedEdgesCount.current = selectedEdgeIds.length;
			const changes = getSelectionChanges(edges, selectedEdgeIds);
			if (changes.length) onEdgesChange?.(changes);
		}
		store.setState({ userSelectionRect: nextUserSelectRect });
	};
	const onMouseUp = (event) => {
		if (event.button !== 0) return;
		const { userSelectionRect } = store.getState();
		if (!userSelectionActive && userSelectionRect && event.target === container.current) onClick?.(event);
		store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
		resetUserSelection();
		onSelectionEnd?.(event);
	};
	const onMouseLeave = (event) => {
		if (userSelectionActive) {
			store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
			onSelectionEnd?.(event);
		}
		resetUserSelection();
	};
	const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);
	return import_react.createElement("div", {
		className: cc(["react-flow__pane", {
			dragging,
			selection: isSelecting
		}]),
		onClick: hasActiveSelection ? void 0 : wrapHandler(onClick, container),
		onContextMenu: wrapHandler(onContextMenu, container),
		onWheel: wrapHandler(onWheel, container),
		onMouseEnter: hasActiveSelection ? void 0 : onPaneMouseEnter,
		onMouseDown: hasActiveSelection ? onMouseDown : void 0,
		onMouseMove: hasActiveSelection ? onMouseMove : onPaneMouseMove,
		onMouseUp: hasActiveSelection ? onMouseUp : void 0,
		onMouseLeave: hasActiveSelection ? onMouseLeave : onPaneMouseLeave,
		ref: container,
		style: containerStyle
	}, children, import_react.createElement(UserSelection, null));
});
Pane.displayName = "Pane";
function isParentSelected(node, nodeInternals) {
	const parentId = node.parentNode || node.parentId;
	if (!parentId) return false;
	const parentNode = nodeInternals.get(parentId);
	if (!parentNode) return false;
	if (parentNode.selected) return true;
	return isParentSelected(parentNode, nodeInternals);
}
function hasSelector(target, selector, nodeRef) {
	let current = target;
	do {
		if (current?.matches(selector)) return true;
		if (current === nodeRef.current) return false;
		current = current.parentElement;
	} while (current);
	return false;
}
function getDragItems(nodeInternals, nodesDraggable, mousePos, nodeId) {
	return Array.from(nodeInternals.values()).filter((n) => (n.selected || n.id === nodeId) && (!n.parentNode || n.parentId || !isParentSelected(n, nodeInternals)) && (n.draggable || nodesDraggable && typeof n.draggable === "undefined")).map((n) => ({
		id: n.id,
		position: n.position || {
			x: 0,
			y: 0
		},
		positionAbsolute: n.positionAbsolute || {
			x: 0,
			y: 0
		},
		distance: {
			x: mousePos.x - (n.positionAbsolute?.x ?? 0),
			y: mousePos.y - (n.positionAbsolute?.y ?? 0)
		},
		delta: {
			x: 0,
			y: 0
		},
		extent: n.extent,
		parentNode: n.parentNode || n.parentId,
		parentId: n.parentNode || n.parentId,
		width: n.width,
		height: n.height,
		expandParent: n.expandParent
	}));
}
function clampNodeExtent(node, extent) {
	if (!extent || extent === "parent") return extent;
	return [extent[0], [extent[1][0] - (node.width || 0), extent[1][1] - (node.height || 0)]];
}
function calcNextPosition(node, nextPosition, nodeInternals, nodeExtent, nodeOrigin = [0, 0], onError) {
	const clampedNodeExtent = clampNodeExtent(node, node.extent || nodeExtent);
	let currentExtent = clampedNodeExtent;
	const parentId = node.parentNode || node.parentId;
	if (node.extent === "parent" && !node.expandParent) {
		if (parentId && node.width && node.height) {
			const parent = nodeInternals.get(parentId);
			const { x: parentX, y: parentY } = getNodePositionWithOrigin(parent, nodeOrigin).positionAbsolute;
			currentExtent = parent && isNumeric(parentX) && isNumeric(parentY) && isNumeric(parent.width) && isNumeric(parent.height) ? [[parentX + node.width * nodeOrigin[0], parentY + node.height * nodeOrigin[1]], [parentX + parent.width - node.width + node.width * nodeOrigin[0], parentY + parent.height - node.height + node.height * nodeOrigin[1]]] : currentExtent;
		} else {
			onError?.("005", errorMessages["error005"]());
			currentExtent = clampedNodeExtent;
		}
	} else if (node.extent && parentId && node.extent !== "parent") {
		const { x: parentX, y: parentY } = getNodePositionWithOrigin(nodeInternals.get(parentId), nodeOrigin).positionAbsolute;
		currentExtent = [[node.extent[0][0] + parentX, node.extent[0][1] + parentY], [node.extent[1][0] + parentX, node.extent[1][1] + parentY]];
	}
	let parentPosition = {
		x: 0,
		y: 0
	};
	if (parentId) parentPosition = getNodePositionWithOrigin(nodeInternals.get(parentId), nodeOrigin).positionAbsolute;
	const positionAbsolute = currentExtent && currentExtent !== "parent" ? clampPosition(nextPosition, currentExtent) : nextPosition;
	return {
		position: {
			x: positionAbsolute.x - parentPosition.x,
			y: positionAbsolute.y - parentPosition.y
		},
		positionAbsolute
	};
}
function getEventHandlerParams({ nodeId, dragItems, nodeInternals }) {
	const extentedDragItems = dragItems.map((n) => {
		return {
			...nodeInternals.get(n.id),
			position: n.position,
			positionAbsolute: n.positionAbsolute
		};
	});
	return [nodeId ? extentedDragItems.find((n) => n.id === nodeId) : extentedDragItems[0], extentedDragItems];
}
var getHandleBounds = (selector, nodeElement, zoom, nodeOrigin) => {
	const handles = nodeElement.querySelectorAll(selector);
	if (!handles || !handles.length) return null;
	const handlesArray = Array.from(handles);
	const nodeBounds = nodeElement.getBoundingClientRect();
	const nodeOffset = {
		x: nodeBounds.width * nodeOrigin[0],
		y: nodeBounds.height * nodeOrigin[1]
	};
	return handlesArray.map((handle) => {
		const handleBounds = handle.getBoundingClientRect();
		return {
			id: handle.getAttribute("data-handleid"),
			position: handle.getAttribute("data-handlepos"),
			x: (handleBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
			y: (handleBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
			...getDimensions(handle)
		};
	});
};
function getMouseHandler(id, getState, handler) {
	return handler === void 0 ? handler : (event) => {
		const node = getState().nodeInternals.get(id);
		if (node) handler(event, { ...node });
	};
}
function handleNodeClick({ id, store, unselect = false, nodeRef }) {
	const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeInternals, onError } = store.getState();
	const node = nodeInternals.get(id);
	if (!node) {
		onError?.("012", errorMessages["error012"](id));
		return;
	}
	store.setState({ nodesSelectionActive: false });
	if (!node.selected) addSelectedNodes([id]);
	else if (unselect || node.selected && multiSelectionActive) {
		unselectNodesAndEdges({
			nodes: [node],
			edges: []
		});
		requestAnimationFrame(() => nodeRef?.current?.blur());
	}
}
function useGetPointerPosition() {
	const store = useStoreApi();
	return (0, import_react.useCallback)(({ sourceEvent }) => {
		const { transform, snapGrid, snapToGrid } = store.getState();
		const x = sourceEvent.touches ? sourceEvent.touches[0].clientX : sourceEvent.clientX;
		const y = sourceEvent.touches ? sourceEvent.touches[0].clientY : sourceEvent.clientY;
		const pointerPos = {
			x: (x - transform[0]) / transform[2],
			y: (y - transform[1]) / transform[2]
		};
		return {
			xSnapped: snapToGrid ? snapGrid[0] * Math.round(pointerPos.x / snapGrid[0]) : pointerPos.x,
			ySnapped: snapToGrid ? snapGrid[1] * Math.round(pointerPos.y / snapGrid[1]) : pointerPos.y,
			...pointerPos
		};
	}, []);
}
function wrapSelectionDragFunc(selectionFunc) {
	return (event, _, nodes) => selectionFunc?.(event, nodes);
}
function useDrag({ nodeRef, disabled = false, noDragClassName, handleSelector, nodeId, isSelectable, selectNodesOnDrag }) {
	const store = useStoreApi();
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const dragItems = (0, import_react.useRef)([]);
	const lastPos = (0, import_react.useRef)({
		x: null,
		y: null
	});
	const autoPanId = (0, import_react.useRef)(0);
	const containerBounds = (0, import_react.useRef)(null);
	const mousePosition = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const dragEvent = (0, import_react.useRef)(null);
	const autoPanStarted = (0, import_react.useRef)(false);
	const dragStarted = (0, import_react.useRef)(false);
	const abortDrag = (0, import_react.useRef)(false);
	const getPointerPosition = useGetPointerPosition();
	(0, import_react.useEffect)(() => {
		if (nodeRef?.current) {
			const selection = select_default$1(nodeRef.current);
			const updateNodes = ({ x, y }) => {
				const { nodeInternals, onNodeDrag, onSelectionDrag, updateNodePositions, nodeExtent, snapGrid, snapToGrid, nodeOrigin, onError } = store.getState();
				lastPos.current = {
					x,
					y
				};
				let hasChange = false;
				let nodesBox = {
					x: 0,
					y: 0,
					x2: 0,
					y2: 0
				};
				if (dragItems.current.length > 1 && nodeExtent) nodesBox = rectToBox(getNodesBounds(dragItems.current, nodeOrigin));
				dragItems.current = dragItems.current.map((n) => {
					const nextPosition = {
						x: x - n.distance.x,
						y: y - n.distance.y
					};
					if (snapToGrid) {
						nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
						nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
					}
					const adjustedNodeExtent = [[nodeExtent[0][0], nodeExtent[0][1]], [nodeExtent[1][0], nodeExtent[1][1]]];
					if (dragItems.current.length > 1 && nodeExtent && !n.extent) {
						adjustedNodeExtent[0][0] = n.positionAbsolute.x - nodesBox.x + nodeExtent[0][0];
						adjustedNodeExtent[1][0] = n.positionAbsolute.x + (n.width ?? 0) - nodesBox.x2 + nodeExtent[1][0];
						adjustedNodeExtent[0][1] = n.positionAbsolute.y - nodesBox.y + nodeExtent[0][1];
						adjustedNodeExtent[1][1] = n.positionAbsolute.y + (n.height ?? 0) - nodesBox.y2 + nodeExtent[1][1];
					}
					const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, adjustedNodeExtent, nodeOrigin, onError);
					hasChange = hasChange || n.position.x !== updatedPos.position.x || n.position.y !== updatedPos.position.y;
					n.position = updatedPos.position;
					n.positionAbsolute = updatedPos.positionAbsolute;
					return n;
				});
				if (!hasChange) return;
				updateNodePositions(dragItems.current, true, true);
				setDragging(true);
				const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);
				if (onDrag && dragEvent.current) {
					const [currentNode, nodes] = getEventHandlerParams({
						nodeId,
						dragItems: dragItems.current,
						nodeInternals
					});
					onDrag(dragEvent.current, currentNode, nodes);
				}
			};
			const autoPan = () => {
				if (!containerBounds.current) return;
				const [xMovement, yMovement] = calcAutoPan(mousePosition.current, containerBounds.current);
				if (xMovement !== 0 || yMovement !== 0) {
					const { transform, panBy } = store.getState();
					lastPos.current.x = (lastPos.current.x ?? 0) - xMovement / transform[2];
					lastPos.current.y = (lastPos.current.y ?? 0) - yMovement / transform[2];
					if (panBy({
						x: xMovement,
						y: yMovement
					})) updateNodes(lastPos.current);
				}
				autoPanId.current = requestAnimationFrame(autoPan);
			};
			const startDrag = (event) => {
				const { nodeInternals, multiSelectionActive, nodesDraggable, unselectNodesAndEdges, onNodeDragStart, onSelectionDragStart } = store.getState();
				dragStarted.current = true;
				const onStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);
				if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
					if (!nodeInternals.get(nodeId)?.selected) unselectNodesAndEdges();
				}
				if (nodeId && isSelectable && selectNodesOnDrag) handleNodeClick({
					id: nodeId,
					store,
					nodeRef
				});
				const pointerPos = getPointerPosition(event);
				lastPos.current = pointerPos;
				dragItems.current = getDragItems(nodeInternals, nodesDraggable, pointerPos, nodeId);
				if (onStart && dragItems.current) {
					const [currentNode, nodes] = getEventHandlerParams({
						nodeId,
						dragItems: dragItems.current,
						nodeInternals
					});
					onStart(event.sourceEvent, currentNode, nodes);
				}
			};
			if (disabled) selection.on(".drag", null);
			else {
				const dragHandler = drag_default().on("start", (event) => {
					const { domNode, nodeDragThreshold } = store.getState();
					if (nodeDragThreshold === 0) startDrag(event);
					abortDrag.current = false;
					const pointerPos = getPointerPosition(event);
					lastPos.current = pointerPos;
					containerBounds.current = domNode?.getBoundingClientRect() || null;
					mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current);
				}).on("drag", (event) => {
					const pointerPos = getPointerPosition(event);
					const { autoPanOnNodeDrag, nodeDragThreshold } = store.getState();
					if (event.sourceEvent.type === "touchmove" && event.sourceEvent.touches.length > 1) abortDrag.current = true;
					if (abortDrag.current) return;
					if (!autoPanStarted.current && dragStarted.current && autoPanOnNodeDrag) {
						autoPanStarted.current = true;
						autoPan();
					}
					if (!dragStarted.current) {
						const x = pointerPos.xSnapped - (lastPos?.current?.x ?? 0);
						const y = pointerPos.ySnapped - (lastPos?.current?.y ?? 0);
						if (Math.sqrt(x * x + y * y) > nodeDragThreshold) startDrag(event);
					}
					if ((lastPos.current.x !== pointerPos.xSnapped || lastPos.current.y !== pointerPos.ySnapped) && dragItems.current && dragStarted.current) {
						dragEvent.current = event.sourceEvent;
						mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current);
						updateNodes(pointerPos);
					}
				}).on("end", (event) => {
					if (!dragStarted.current || abortDrag.current) return;
					setDragging(false);
					autoPanStarted.current = false;
					dragStarted.current = false;
					cancelAnimationFrame(autoPanId.current);
					if (dragItems.current) {
						const { updateNodePositions, nodeInternals, onNodeDragStop, onSelectionDragStop } = store.getState();
						const onStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);
						updateNodePositions(dragItems.current, false, false);
						if (onStop) {
							const [currentNode, nodes] = getEventHandlerParams({
								nodeId,
								dragItems: dragItems.current,
								nodeInternals
							});
							onStop(event.sourceEvent, currentNode, nodes);
						}
					}
				}).filter((event) => {
					const target = event.target;
					return !event.button && (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, nodeRef)) && (!handleSelector || hasSelector(target, handleSelector, nodeRef));
				});
				selection.call(dragHandler);
				return () => {
					selection.on(".drag", null);
				};
			}
		}
	}, [
		nodeRef,
		disabled,
		noDragClassName,
		handleSelector,
		isSelectable,
		store,
		nodeId,
		selectNodesOnDrag,
		getPointerPosition
	]);
	return dragging;
}
function useUpdateNodePositions() {
	const store = useStoreApi();
	return (0, import_react.useCallback)((params) => {
		const { nodeInternals, nodeExtent, updateNodePositions, getNodes, snapToGrid, snapGrid, onError, nodesDraggable } = store.getState();
		const selectedNodes = getNodes().filter((n) => n.selected && (n.draggable || nodesDraggable && typeof n.draggable === "undefined"));
		const xVelo = snapToGrid ? snapGrid[0] : 5;
		const yVelo = snapToGrid ? snapGrid[1] : 5;
		const factor = params.isShiftPressed ? 4 : 1;
		const positionDiffX = params.x * xVelo * factor;
		const positionDiffY = params.y * yVelo * factor;
		updateNodePositions(selectedNodes.map((n) => {
			if (n.positionAbsolute) {
				const nextPosition = {
					x: n.positionAbsolute.x + positionDiffX,
					y: n.positionAbsolute.y + positionDiffY
				};
				if (snapToGrid) {
					nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
					nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
				}
				const { positionAbsolute, position } = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent, void 0, onError);
				n.position = position;
				n.positionAbsolute = positionAbsolute;
			}
			return n;
		}), true, false);
	}, []);
}
var arrowKeyDiffs = {
	ArrowUp: {
		x: 0,
		y: -1
	},
	ArrowDown: {
		x: 0,
		y: 1
	},
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowRight: {
		x: 1,
		y: 0
	}
};
var wrapNode = (NodeComponent) => {
	const NodeWrapper = ({ id, type, data, xPos, yPos, xPosOrigin, yPosOrigin, selected, onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onDoubleClick, style, className, isDraggable, isSelectable, isConnectable, isFocusable, selectNodesOnDrag, sourcePosition, targetPosition, hidden, resizeObserver, dragHandle, zIndex, isParent, noDragClassName, noPanClassName, initialized, disableKeyboardA11y, ariaLabel, rfId, hasHandleBounds }) => {
		const store = useStoreApi();
		const nodeRef = (0, import_react.useRef)(null);
		const prevNodeRef = (0, import_react.useRef)(null);
		const prevSourcePosition = (0, import_react.useRef)(sourcePosition);
		const prevTargetPosition = (0, import_react.useRef)(targetPosition);
		const prevType = (0, import_react.useRef)(type);
		const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
		const updatePositions = useUpdateNodePositions();
		const onMouseEnterHandler = getMouseHandler(id, store.getState, onMouseEnter);
		const onMouseMoveHandler = getMouseHandler(id, store.getState, onMouseMove);
		const onMouseLeaveHandler = getMouseHandler(id, store.getState, onMouseLeave);
		const onContextMenuHandler = getMouseHandler(id, store.getState, onContextMenu);
		const onDoubleClickHandler = getMouseHandler(id, store.getState, onDoubleClick);
		const onSelectNodeHandler = (event) => {
			const { nodeDragThreshold } = store.getState();
			if (isSelectable && (!selectNodesOnDrag || !isDraggable || nodeDragThreshold > 0)) handleNodeClick({
				id,
				store,
				nodeRef
			});
			if (onClick) {
				const node = store.getState().nodeInternals.get(id);
				if (node) onClick(event, { ...node });
			}
		};
		const onKeyDown = (event) => {
			if (isInputDOMNode(event)) return;
			if (disableKeyboardA11y) return;
			if (elementSelectionKeys.includes(event.key) && isSelectable) {
				const unselect = event.key === "Escape";
				handleNodeClick({
					id,
					store,
					unselect,
					nodeRef
				});
			} else if (isDraggable && selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
				store.setState({ ariaLiveMessage: `Moved selected node ${event.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~xPos}, y: ${~~yPos}` });
				updatePositions({
					x: arrowKeyDiffs[event.key].x,
					y: arrowKeyDiffs[event.key].y,
					isShiftPressed: event.shiftKey
				});
			}
		};
		(0, import_react.useEffect)(() => {
			return () => {
				if (prevNodeRef.current) {
					resizeObserver?.unobserve(prevNodeRef.current);
					prevNodeRef.current = null;
				}
			};
		}, []);
		(0, import_react.useEffect)(() => {
			if (nodeRef.current && !hidden) {
				const currNode = nodeRef.current;
				if (!initialized || !hasHandleBounds || prevNodeRef.current !== currNode) {
					if (prevNodeRef.current) resizeObserver?.unobserve(prevNodeRef.current);
					resizeObserver?.observe(currNode);
					prevNodeRef.current = currNode;
				}
			}
		}, [
			hidden,
			initialized,
			hasHandleBounds
		]);
		(0, import_react.useEffect)(() => {
			const typeChanged = prevType.current !== type;
			const sourcePosChanged = prevSourcePosition.current !== sourcePosition;
			const targetPosChanged = prevTargetPosition.current !== targetPosition;
			if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
				if (typeChanged) prevType.current = type;
				if (sourcePosChanged) prevSourcePosition.current = sourcePosition;
				if (targetPosChanged) prevTargetPosition.current = targetPosition;
				store.getState().updateNodeDimensions([{
					id,
					nodeElement: nodeRef.current,
					forceUpdate: true
				}]);
			}
		}, [
			id,
			type,
			sourcePosition,
			targetPosition
		]);
		const dragging = useDrag({
			nodeRef,
			disabled: hidden || !isDraggable,
			noDragClassName,
			handleSelector: dragHandle,
			nodeId: id,
			isSelectable,
			selectNodesOnDrag
		});
		if (hidden) return null;
		return import_react.createElement("div", {
			className: cc([
				"react-flow__node",
				`react-flow__node-${type}`,
				{ [noPanClassName]: isDraggable },
				className,
				{
					selected,
					selectable: isSelectable,
					parent: isParent,
					dragging
				}
			]),
			ref: nodeRef,
			style: {
				zIndex,
				transform: `translate(${xPosOrigin}px,${yPosOrigin}px)`,
				pointerEvents: hasPointerEvents ? "all" : "none",
				visibility: initialized ? "visible" : "hidden",
				...style
			},
			"data-id": id,
			"data-testid": `rf__node-${id}`,
			onMouseEnter: onMouseEnterHandler,
			onMouseMove: onMouseMoveHandler,
			onMouseLeave: onMouseLeaveHandler,
			onContextMenu: onContextMenuHandler,
			onClick: onSelectNodeHandler,
			onDoubleClick: onDoubleClickHandler,
			onKeyDown: isFocusable ? onKeyDown : void 0,
			tabIndex: isFocusable ? 0 : void 0,
			role: isFocusable ? "button" : void 0,
			"aria-describedby": disableKeyboardA11y ? void 0 : `${ARIA_NODE_DESC_KEY}-${rfId}`,
			"aria-label": ariaLabel
		}, import_react.createElement(Provider, { value: id }, import_react.createElement(NodeComponent, {
			id,
			data,
			type,
			xPos,
			yPos,
			selected,
			isConnectable,
			sourcePosition,
			targetPosition,
			dragging,
			dragHandle,
			zIndex
		})));
	};
	NodeWrapper.displayName = "NodeWrapper";
	return (0, import_react.memo)(NodeWrapper);
};
/**
* The nodes selection rectangle gets displayed when a user
* made a selection with on or several nodes
*/
var selector$7 = (s) => {
	return {
		...getNodesBounds(s.getNodes().filter((n) => n.selected), s.nodeOrigin),
		transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`,
		userSelectionActive: s.userSelectionActive
	};
};
function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }) {
	const store = useStoreApi();
	const { width, height, x: left, y: top, transformString, userSelectionActive } = useStore(selector$7, shallow$1);
	const updatePositions = useUpdateNodePositions();
	const nodeRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!disableKeyboardA11y) nodeRef.current?.focus({ preventScroll: true });
	}, [disableKeyboardA11y]);
	useDrag({ nodeRef });
	if (userSelectionActive || !width || !height) return null;
	const onContextMenu = onSelectionContextMenu ? (event) => {
		onSelectionContextMenu(event, store.getState().getNodes().filter((n) => n.selected));
	} : void 0;
	const onKeyDown = (event) => {
		if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) updatePositions({
			x: arrowKeyDiffs[event.key].x,
			y: arrowKeyDiffs[event.key].y,
			isShiftPressed: event.shiftKey
		});
	};
	return import_react.createElement("div", {
		className: cc([
			"react-flow__nodesselection",
			"react-flow__container",
			noPanClassName
		]),
		style: { transform: transformString }
	}, import_react.createElement("div", {
		ref: nodeRef,
		className: "react-flow__nodesselection-rect",
		onContextMenu,
		tabIndex: disableKeyboardA11y ? void 0 : -1,
		onKeyDown: disableKeyboardA11y ? void 0 : onKeyDown,
		style: {
			width,
			height,
			top,
			left
		}
	}));
}
var NodesSelection$1 = (0, import_react.memo)(NodesSelection);
var selector$6 = (s) => s.nodesSelectionActive;
var FlowRenderer = ({ children, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, deleteKeyCode, onMove, onMoveStart, onMoveEnd, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll: _panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: _panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, onSelectionContextMenu, noWheelClassName, noPanClassName, disableKeyboardA11y }) => {
	const nodesSelectionActive = useStore(selector$6);
	const selectionKeyPressed = useKeyPress(selectionKeyCode);
	const panActivationKeyPressed = useKeyPress(panActivationKeyCode);
	const panOnDrag = panActivationKeyPressed || _panOnDrag;
	const panOnScroll = panActivationKeyPressed || _panOnScroll;
	const isSelecting = selectionKeyPressed || selectionOnDrag && panOnDrag !== true;
	useGlobalKeyHandler({
		deleteKeyCode,
		multiSelectionKeyCode
	});
	return import_react.createElement(ZoomPane, {
		onMove,
		onMoveStart,
		onMoveEnd,
		onPaneContextMenu,
		elementsSelectable,
		zoomOnScroll,
		zoomOnPinch,
		panOnScroll,
		panOnScrollSpeed,
		panOnScrollMode,
		zoomOnDoubleClick,
		panOnDrag: !selectionKeyPressed && panOnDrag,
		defaultViewport,
		translateExtent,
		minZoom,
		maxZoom,
		zoomActivationKeyCode,
		preventScrolling,
		noWheelClassName,
		noPanClassName
	}, import_react.createElement(Pane, {
		onSelectionStart,
		onSelectionEnd,
		onPaneClick,
		onPaneMouseEnter,
		onPaneMouseMove,
		onPaneMouseLeave,
		onPaneContextMenu,
		onPaneScroll,
		panOnDrag,
		isSelecting: !!isSelecting,
		selectionMode
	}, children, nodesSelectionActive && import_react.createElement(NodesSelection$1, {
		onSelectionContextMenu,
		noPanClassName,
		disableKeyboardA11y
	})));
};
FlowRenderer.displayName = "FlowRenderer";
var FlowRenderer$1 = (0, import_react.memo)(FlowRenderer);
function useVisibleNodes(onlyRenderVisible) {
	return useStore((0, import_react.useCallback)((s) => onlyRenderVisible ? getNodesInside(s.nodeInternals, {
		x: 0,
		y: 0,
		width: s.width,
		height: s.height
	}, s.transform, true) : s.getNodes(), [onlyRenderVisible]));
}
function createNodeTypes(nodeTypes) {
	const standardTypes = {
		input: wrapNode(nodeTypes.input || InputNode$1),
		default: wrapNode(nodeTypes.default || DefaultNode$1),
		output: wrapNode(nodeTypes.output || OutputNode$1),
		group: wrapNode(nodeTypes.group || GroupNode)
	};
	const specialTypes = Object.keys(nodeTypes).filter((k) => ![
		"input",
		"default",
		"output",
		"group"
	].includes(k)).reduce((res, key) => {
		res[key] = wrapNode(nodeTypes[key] || DefaultNode$1);
		return res;
	}, {});
	return {
		...standardTypes,
		...specialTypes
	};
}
var getPositionWithOrigin = ({ x, y, width, height, origin }) => {
	if (!width || !height) return {
		x,
		y
	};
	if (origin[0] < 0 || origin[1] < 0 || origin[0] > 1 || origin[1] > 1) return {
		x,
		y
	};
	return {
		x: x - width * origin[0],
		y: y - height * origin[1]
	};
};
var selector$5 = (s) => ({
	nodesDraggable: s.nodesDraggable,
	nodesConnectable: s.nodesConnectable,
	nodesFocusable: s.nodesFocusable,
	elementsSelectable: s.elementsSelectable,
	updateNodeDimensions: s.updateNodeDimensions,
	onError: s.onError
});
var NodeRenderer = (props) => {
	const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, updateNodeDimensions, onError } = useStore(selector$5, shallow$1);
	const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
	const resizeObserverRef = (0, import_react.useRef)();
	const resizeObserver = (0, import_react.useMemo)(() => {
		if (typeof ResizeObserver === "undefined") return null;
		const observer = new ResizeObserver((entries) => {
			const updates = entries.map((entry) => ({
				id: entry.target.getAttribute("data-id"),
				nodeElement: entry.target,
				forceUpdate: true
			}));
			updateNodeDimensions(updates);
		});
		resizeObserverRef.current = observer;
		return observer;
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			resizeObserverRef?.current?.disconnect();
		};
	}, []);
	return import_react.createElement("div", {
		className: "react-flow__nodes",
		style: containerStyle
	}, nodes.map((node) => {
		let nodeType = node.type || "default";
		if (!props.nodeTypes[nodeType]) {
			onError?.("003", errorMessages["error003"](nodeType));
			nodeType = "default";
		}
		const NodeComponent = props.nodeTypes[nodeType] || props.nodeTypes.default;
		const isDraggable = !!(node.draggable || nodesDraggable && typeof node.draggable === "undefined");
		const isSelectable = !!(node.selectable || elementsSelectable && typeof node.selectable === "undefined");
		const isConnectable = !!(node.connectable || nodesConnectable && typeof node.connectable === "undefined");
		const isFocusable = !!(node.focusable || nodesFocusable && typeof node.focusable === "undefined");
		const clampedPosition = props.nodeExtent ? clampPosition(node.positionAbsolute, props.nodeExtent) : node.positionAbsolute;
		const posX = clampedPosition?.x ?? 0;
		const posY = clampedPosition?.y ?? 0;
		const posOrigin = getPositionWithOrigin({
			x: posX,
			y: posY,
			width: node.width ?? 0,
			height: node.height ?? 0,
			origin: props.nodeOrigin
		});
		return import_react.createElement(NodeComponent, {
			key: node.id,
			id: node.id,
			className: node.className,
			style: node.style,
			type: nodeType,
			data: node.data,
			sourcePosition: node.sourcePosition || Position.Bottom,
			targetPosition: node.targetPosition || Position.Top,
			hidden: node.hidden,
			xPos: posX,
			yPos: posY,
			xPosOrigin: posOrigin.x,
			yPosOrigin: posOrigin.y,
			selectNodesOnDrag: props.selectNodesOnDrag,
			onClick: props.onNodeClick,
			onMouseEnter: props.onNodeMouseEnter,
			onMouseMove: props.onNodeMouseMove,
			onMouseLeave: props.onNodeMouseLeave,
			onContextMenu: props.onNodeContextMenu,
			onDoubleClick: props.onNodeDoubleClick,
			selected: !!node.selected,
			isDraggable,
			isSelectable,
			isConnectable,
			isFocusable,
			resizeObserver,
			dragHandle: node.dragHandle,
			zIndex: node[internalsSymbol]?.z ?? 0,
			isParent: !!node[internalsSymbol]?.isParent,
			noDragClassName: props.noDragClassName,
			noPanClassName: props.noPanClassName,
			initialized: !!node.width && !!node.height,
			rfId: props.rfId,
			disableKeyboardA11y: props.disableKeyboardA11y,
			ariaLabel: node.ariaLabel,
			hasHandleBounds: !!node[internalsSymbol]?.handleBounds
		});
	}));
};
NodeRenderer.displayName = "NodeRenderer";
var NodeRenderer$1 = (0, import_react.memo)(NodeRenderer);
var shiftX = (x, shift, position) => {
	if (position === Position.Left) return x - shift;
	if (position === Position.Right) return x + shift;
	return x;
};
var shiftY = (y, shift, position) => {
	if (position === Position.Top) return y - shift;
	if (position === Position.Bottom) return y + shift;
	return y;
};
var EdgeUpdaterClassName = "react-flow__edgeupdater";
var EdgeAnchor = ({ position, centerX, centerY, radius = 10, onMouseDown, onMouseEnter, onMouseOut, type }) => import_react.createElement("circle", {
	onMouseDown,
	onMouseEnter,
	onMouseOut,
	className: cc([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${type}`]),
	cx: shiftX(centerX, radius, position),
	cy: shiftY(centerY, radius, position),
	r: radius,
	stroke: "transparent",
	fill: "transparent"
});
var alwaysValidConnection = () => true;
var wrapEdge = (EdgeComponent) => {
	const EdgeWrapper = ({ id, className, type, data, onClick, onEdgeDoubleClick, selected, animated, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, elementsSelectable, hidden, sourceHandleId, targetHandleId, onContextMenu, onMouseEnter, onMouseMove, onMouseLeave, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, markerEnd, markerStart, rfId, ariaLabel, isFocusable, isReconnectable, pathOptions, interactionWidth, disableKeyboardA11y }) => {
		const edgeRef = (0, import_react.useRef)(null);
		const [updateHover, setUpdateHover] = (0, import_react.useState)(false);
		const [updating, setUpdating] = (0, import_react.useState)(false);
		const store = useStoreApi();
		const markerStartUrl = (0, import_react.useMemo)(() => `url('#${getMarkerId(markerStart, rfId)}')`, [markerStart, rfId]);
		const markerEndUrl = (0, import_react.useMemo)(() => `url('#${getMarkerId(markerEnd, rfId)}')`, [markerEnd, rfId]);
		if (hidden) return null;
		const onEdgeClick = (event) => {
			const { edges, addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();
			const edge = edges.find((e) => e.id === id);
			if (!edge) return;
			if (elementsSelectable) {
				store.setState({ nodesSelectionActive: false });
				if (edge.selected && multiSelectionActive) {
					unselectNodesAndEdges({
						nodes: [],
						edges: [edge]
					});
					edgeRef.current?.blur();
				} else addSelectedEdges([id]);
			}
			if (onClick) onClick(event, edge);
		};
		const onEdgeDoubleClickHandler = getMouseHandler$1(id, store.getState, onEdgeDoubleClick);
		const onEdgeContextMenu = getMouseHandler$1(id, store.getState, onContextMenu);
		const onEdgeMouseEnter = getMouseHandler$1(id, store.getState, onMouseEnter);
		const onEdgeMouseMove = getMouseHandler$1(id, store.getState, onMouseMove);
		const onEdgeMouseLeave = getMouseHandler$1(id, store.getState, onMouseLeave);
		const handleEdgeUpdater = (event, isSourceHandle) => {
			if (event.button !== 0) return;
			const { edges, isValidConnection: isValidConnectionStore } = store.getState();
			const nodeId = isSourceHandle ? target : source;
			const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
			const handleType = isSourceHandle ? "target" : "source";
			const isValidConnection = isValidConnectionStore || alwaysValidConnection;
			const isTarget = isSourceHandle;
			const edge = edges.find((e) => e.id === id);
			setUpdating(true);
			onReconnectStart?.(event, edge, handleType);
			const _onReconnectEnd = (evt) => {
				setUpdating(false);
				onReconnectEnd?.(evt, edge, handleType);
			};
			const onConnectEdge = (connection) => onReconnect?.(edge, connection);
			handlePointerDown({
				event,
				handleId,
				nodeId,
				onConnect: onConnectEdge,
				isTarget,
				getState: store.getState,
				setState: store.setState,
				isValidConnection,
				edgeUpdaterType: handleType,
				onReconnectEnd: _onReconnectEnd
			});
		};
		const onEdgeUpdaterSourceMouseDown = (event) => handleEdgeUpdater(event, true);
		const onEdgeUpdaterTargetMouseDown = (event) => handleEdgeUpdater(event, false);
		const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
		const onEdgeUpdaterMouseOut = () => setUpdateHover(false);
		const inactive = !elementsSelectable && !onClick;
		const onKeyDown = (event) => {
			if (!disableKeyboardA11y && elementSelectionKeys.includes(event.key) && elementsSelectable) {
				const { unselectNodesAndEdges, addSelectedEdges, edges } = store.getState();
				if (event.key === "Escape") {
					edgeRef.current?.blur();
					unselectNodesAndEdges({ edges: [edges.find((e) => e.id === id)] });
				} else addSelectedEdges([id]);
			}
		};
		return import_react.createElement("g", {
			className: cc([
				"react-flow__edge",
				`react-flow__edge-${type}`,
				className,
				{
					selected,
					animated,
					inactive,
					updating: updateHover
				}
			]),
			onClick: onEdgeClick,
			onDoubleClick: onEdgeDoubleClickHandler,
			onContextMenu: onEdgeContextMenu,
			onMouseEnter: onEdgeMouseEnter,
			onMouseMove: onEdgeMouseMove,
			onMouseLeave: onEdgeMouseLeave,
			onKeyDown: isFocusable ? onKeyDown : void 0,
			tabIndex: isFocusable ? 0 : void 0,
			role: isFocusable ? "button" : "img",
			"data-testid": `rf__edge-${id}`,
			"aria-label": ariaLabel === null ? void 0 : ariaLabel ? ariaLabel : `Edge from ${source} to ${target}`,
			"aria-describedby": isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : void 0,
			ref: edgeRef
		}, !updating && import_react.createElement(EdgeComponent, {
			id,
			source,
			target,
			selected,
			animated,
			label,
			labelStyle,
			labelShowBg,
			labelBgStyle,
			labelBgPadding,
			labelBgBorderRadius,
			data,
			style,
			sourceX,
			sourceY,
			targetX,
			targetY,
			sourcePosition,
			targetPosition,
			sourceHandleId,
			targetHandleId,
			markerStart: markerStartUrl,
			markerEnd: markerEndUrl,
			pathOptions,
			interactionWidth
		}), isReconnectable && import_react.createElement(import_react.Fragment, null, (isReconnectable === "source" || isReconnectable === true) && import_react.createElement(EdgeAnchor, {
			position: sourcePosition,
			centerX: sourceX,
			centerY: sourceY,
			radius: reconnectRadius,
			onMouseDown: onEdgeUpdaterSourceMouseDown,
			onMouseEnter: onEdgeUpdaterMouseEnter,
			onMouseOut: onEdgeUpdaterMouseOut,
			type: "source"
		}), (isReconnectable === "target" || isReconnectable === true) && import_react.createElement(EdgeAnchor, {
			position: targetPosition,
			centerX: targetX,
			centerY: targetY,
			radius: reconnectRadius,
			onMouseDown: onEdgeUpdaterTargetMouseDown,
			onMouseEnter: onEdgeUpdaterMouseEnter,
			onMouseOut: onEdgeUpdaterMouseOut,
			type: "target"
		})));
	};
	EdgeWrapper.displayName = "EdgeWrapper";
	return (0, import_react.memo)(EdgeWrapper);
};
function createEdgeTypes(edgeTypes) {
	const standardTypes = {
		default: wrapEdge(edgeTypes.default || BezierEdge),
		straight: wrapEdge(edgeTypes.bezier || StraightEdge),
		step: wrapEdge(edgeTypes.step || StepEdge),
		smoothstep: wrapEdge(edgeTypes.step || SmoothStepEdge),
		simplebezier: wrapEdge(edgeTypes.simplebezier || SimpleBezierEdge)
	};
	const specialTypes = Object.keys(edgeTypes).filter((k) => !["default", "bezier"].includes(k)).reduce((res, key) => {
		res[key] = wrapEdge(edgeTypes[key] || BezierEdge);
		return res;
	}, {});
	return {
		...standardTypes,
		...specialTypes
	};
}
function getHandlePosition(position, nodeRect, handle = null) {
	const x = (handle?.x || 0) + nodeRect.x;
	const y = (handle?.y || 0) + nodeRect.y;
	const width = handle?.width || nodeRect.width;
	const height = handle?.height || nodeRect.height;
	switch (position) {
		case Position.Top: return {
			x: x + width / 2,
			y
		};
		case Position.Right: return {
			x: x + width,
			y: y + height / 2
		};
		case Position.Bottom: return {
			x: x + width / 2,
			y: y + height
		};
		case Position.Left: return {
			x,
			y: y + height / 2
		};
	}
}
function getHandle(bounds, handleId) {
	if (!bounds) return null;
	if (bounds.length === 1 || !handleId) return bounds[0];
	else if (handleId) return bounds.find((d) => d.id === handleId) || null;
	return null;
}
var getEdgePositions = (sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition) => {
	const sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
	const targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);
	return {
		sourceX: sourceHandlePos.x,
		sourceY: sourceHandlePos.y,
		targetX: targetHandlePos.x,
		targetY: targetHandlePos.y
	};
};
function isEdgeVisible({ sourcePos, targetPos, sourceWidth, sourceHeight, targetWidth, targetHeight, width, height, transform }) {
	const edgeBox = {
		x: Math.min(sourcePos.x, targetPos.x),
		y: Math.min(sourcePos.y, targetPos.y),
		x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
		y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight)
	};
	if (edgeBox.x === edgeBox.x2) edgeBox.x2 += 1;
	if (edgeBox.y === edgeBox.y2) edgeBox.y2 += 1;
	const viewBox = rectToBox({
		x: (0 - transform[0]) / transform[2],
		y: (0 - transform[1]) / transform[2],
		width: width / transform[2],
		height: height / transform[2]
	});
	const xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
	const yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
	return Math.ceil(xOverlap * yOverlap) > 0;
}
function getNodeData(node) {
	const handleBounds = node?.[internalsSymbol]?.handleBounds || null;
	const isValid = handleBounds && node?.width && node?.height && typeof node?.positionAbsolute?.x !== "undefined" && typeof node?.positionAbsolute?.y !== "undefined";
	return [
		{
			x: node?.positionAbsolute?.x || 0,
			y: node?.positionAbsolute?.y || 0,
			width: node?.width || 0,
			height: node?.height || 0
		},
		handleBounds,
		!!isValid
	];
}
var defaultEdgeTree = [{
	level: 0,
	isMaxLevel: true,
	edges: []
}];
function groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect = false) {
	let maxLevel = -1;
	const levelLookup = edges.reduce((tree, edge) => {
		const hasZIndex = isNumeric(edge.zIndex);
		let z = hasZIndex ? edge.zIndex : 0;
		if (elevateEdgesOnSelect) {
			const targetNode = nodeInternals.get(edge.target);
			const sourceNode = nodeInternals.get(edge.source);
			const edgeOrConnectedNodeSelected = edge.selected || targetNode?.selected || sourceNode?.selected;
			const selectedZIndex = Math.max(sourceNode?.[internalsSymbol]?.z || 0, targetNode?.[internalsSymbol]?.z || 0, 1e3);
			z = (hasZIndex ? edge.zIndex : 0) + (edgeOrConnectedNodeSelected ? selectedZIndex : 0);
		}
		if (tree[z]) tree[z].push(edge);
		else tree[z] = [edge];
		maxLevel = z > maxLevel ? z : maxLevel;
		return tree;
	}, {});
	const edgeTree = Object.entries(levelLookup).map(([key, edges]) => {
		const level = +key;
		return {
			edges,
			level,
			isMaxLevel: level === maxLevel
		};
	});
	if (edgeTree.length === 0) return defaultEdgeTree;
	return edgeTree;
}
function useVisibleEdges(onlyRenderVisible, nodeInternals, elevateEdgesOnSelect) {
	return groupEdgesByZLevel(useStore((0, import_react.useCallback)((s) => {
		if (!onlyRenderVisible) return s.edges;
		return s.edges.filter((e) => {
			const sourceNode = nodeInternals.get(e.source);
			const targetNode = nodeInternals.get(e.target);
			return sourceNode?.width && sourceNode?.height && targetNode?.width && targetNode?.height && isEdgeVisible({
				sourcePos: sourceNode.positionAbsolute || {
					x: 0,
					y: 0
				},
				targetPos: targetNode.positionAbsolute || {
					x: 0,
					y: 0
				},
				sourceWidth: sourceNode.width,
				sourceHeight: sourceNode.height,
				targetWidth: targetNode.width,
				targetHeight: targetNode.height,
				width: s.width,
				height: s.height,
				transform: s.transform
			});
		});
	}, [onlyRenderVisible, nodeInternals])), nodeInternals, elevateEdgesOnSelect);
}
var ArrowSymbol = ({ color = "none", strokeWidth = 1 }) => {
	return import_react.createElement("polyline", {
		style: {
			stroke: color,
			strokeWidth
		},
		strokeLinecap: "round",
		strokeLinejoin: "round",
		fill: "none",
		points: "-5,-4 0,0 -5,4"
	});
};
var ArrowClosedSymbol = ({ color = "none", strokeWidth = 1 }) => {
	return import_react.createElement("polyline", {
		style: {
			stroke: color,
			fill: color,
			strokeWidth
		},
		strokeLinecap: "round",
		strokeLinejoin: "round",
		points: "-5,-4 0,0 -5,4 -5,-4"
	});
};
var MarkerSymbols = {
	[MarkerType.Arrow]: ArrowSymbol,
	[MarkerType.ArrowClosed]: ArrowClosedSymbol
};
function useMarkerSymbol(type) {
	const store = useStoreApi();
	return (0, import_react.useMemo)(() => {
		if (!Object.prototype.hasOwnProperty.call(MarkerSymbols, type)) {
			store.getState().onError?.("009", errorMessages["error009"](type));
			return null;
		}
		return MarkerSymbols[type];
	}, [type]);
}
var Marker = ({ id, type, color, width = 12.5, height = 12.5, markerUnits = "strokeWidth", strokeWidth, orient = "auto-start-reverse" }) => {
	const Symbol = useMarkerSymbol(type);
	if (!Symbol) return null;
	return import_react.createElement("marker", {
		className: "react-flow__arrowhead",
		id,
		markerWidth: `${width}`,
		markerHeight: `${height}`,
		viewBox: "-10 -10 20 20",
		markerUnits,
		orient,
		refX: "0",
		refY: "0"
	}, import_react.createElement(Symbol, {
		color,
		strokeWidth
	}));
};
var markerSelector = ({ defaultColor, rfId }) => (s) => {
	const ids = [];
	return s.edges.reduce((markers, edge) => {
		[edge.markerStart, edge.markerEnd].forEach((marker) => {
			if (marker && typeof marker === "object") {
				const markerId = getMarkerId(marker, rfId);
				if (!ids.includes(markerId)) {
					markers.push({
						id: markerId,
						color: marker.color || defaultColor,
						...marker
					});
					ids.push(markerId);
				}
			}
		});
		return markers;
	}, []).sort((a, b) => a.id.localeCompare(b.id));
};
var MarkerDefinitions = ({ defaultColor, rfId }) => {
	const markers = useStore((0, import_react.useCallback)(markerSelector({
		defaultColor,
		rfId
	}), [defaultColor, rfId]), (a, b) => !(a.length !== b.length || a.some((m, i) => m.id !== b[i].id)));
	return import_react.createElement("defs", null, markers.map((marker) => import_react.createElement(Marker, {
		id: marker.id,
		key: marker.id,
		type: marker.type,
		color: marker.color,
		width: marker.width,
		height: marker.height,
		markerUnits: marker.markerUnits,
		strokeWidth: marker.strokeWidth,
		orient: marker.orient
	})));
};
MarkerDefinitions.displayName = "MarkerDefinitions";
var MarkerDefinitions$1 = (0, import_react.memo)(MarkerDefinitions);
var selector$4 = (s) => ({
	nodesConnectable: s.nodesConnectable,
	edgesFocusable: s.edgesFocusable,
	edgesUpdatable: s.edgesUpdatable,
	elementsSelectable: s.elementsSelectable,
	width: s.width,
	height: s.height,
	connectionMode: s.connectionMode,
	nodeInternals: s.nodeInternals,
	onError: s.onError
});
var EdgeRenderer = ({ defaultMarkerColor, onlyRenderVisibleElements, elevateEdgesOnSelect, rfId, edgeTypes, noPanClassName, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeClick, onEdgeDoubleClick, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius, children, disableKeyboardA11y }) => {
	const { edgesFocusable, edgesUpdatable, elementsSelectable, width, height, connectionMode, nodeInternals, onError } = useStore(selector$4, shallow$1);
	const edgeTree = useVisibleEdges(onlyRenderVisibleElements, nodeInternals, elevateEdgesOnSelect);
	if (!width) return null;
	return import_react.createElement(import_react.Fragment, null, edgeTree.map(({ level, edges, isMaxLevel }) => import_react.createElement("svg", {
		key: level,
		style: { zIndex: level },
		width,
		height,
		className: "react-flow__edges react-flow__container"
	}, isMaxLevel && import_react.createElement(MarkerDefinitions$1, {
		defaultColor: defaultMarkerColor,
		rfId
	}), import_react.createElement("g", null, edges.map((edge) => {
		const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(nodeInternals.get(edge.source));
		const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(nodeInternals.get(edge.target));
		if (!sourceIsValid || !targetIsValid) return null;
		let edgeType = edge.type || "default";
		if (!edgeTypes[edgeType]) {
			onError?.("011", errorMessages["error011"](edgeType));
			edgeType = "default";
		}
		const EdgeComponent = edgeTypes[edgeType] || edgeTypes.default;
		const targetNodeHandles = connectionMode === ConnectionMode.Strict ? targetHandleBounds.target : (targetHandleBounds.target ?? []).concat(targetHandleBounds.source ?? []);
		const sourceHandle = getHandle(sourceHandleBounds.source, edge.sourceHandle);
		const targetHandle = getHandle(targetNodeHandles, edge.targetHandle);
		const sourcePosition = sourceHandle?.position || Position.Bottom;
		const targetPosition = targetHandle?.position || Position.Top;
		const isFocusable = !!(edge.focusable || edgesFocusable && typeof edge.focusable === "undefined");
		const edgeReconnectable = edge.reconnectable || edge.updatable;
		const isReconnectable = typeof onReconnect !== "undefined" && (edgeReconnectable || edgesUpdatable && typeof edgeReconnectable === "undefined");
		if (!sourceHandle || !targetHandle) {
			onError?.("008", errorMessages["error008"](sourceHandle, edge));
			return null;
		}
		const { sourceX, sourceY, targetX, targetY } = getEdgePositions(sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition);
		return import_react.createElement(EdgeComponent, {
			key: edge.id,
			id: edge.id,
			className: cc([edge.className, noPanClassName]),
			type: edgeType,
			data: edge.data,
			selected: !!edge.selected,
			animated: !!edge.animated,
			hidden: !!edge.hidden,
			label: edge.label,
			labelStyle: edge.labelStyle,
			labelShowBg: edge.labelShowBg,
			labelBgStyle: edge.labelBgStyle,
			labelBgPadding: edge.labelBgPadding,
			labelBgBorderRadius: edge.labelBgBorderRadius,
			style: edge.style,
			source: edge.source,
			target: edge.target,
			sourceHandleId: edge.sourceHandle,
			targetHandleId: edge.targetHandle,
			markerEnd: edge.markerEnd,
			markerStart: edge.markerStart,
			sourceX,
			sourceY,
			targetX,
			targetY,
			sourcePosition,
			targetPosition,
			elementsSelectable,
			onContextMenu: onEdgeContextMenu,
			onMouseEnter: onEdgeMouseEnter,
			onMouseMove: onEdgeMouseMove,
			onMouseLeave: onEdgeMouseLeave,
			onClick: onEdgeClick,
			onEdgeDoubleClick,
			onReconnect,
			onReconnectStart,
			onReconnectEnd,
			reconnectRadius,
			rfId,
			ariaLabel: edge.ariaLabel,
			isFocusable,
			isReconnectable,
			pathOptions: "pathOptions" in edge ? edge.pathOptions : void 0,
			interactionWidth: edge.interactionWidth,
			disableKeyboardA11y
		});
	})))), children);
};
EdgeRenderer.displayName = "EdgeRenderer";
var EdgeRenderer$1 = (0, import_react.memo)(EdgeRenderer);
var selector$3 = (s) => `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;
function Viewport({ children }) {
	const transform = useStore(selector$3);
	return import_react.createElement("div", {
		className: "react-flow__viewport react-flow__container",
		style: { transform }
	}, children);
}
function useOnInitHandler(onInit) {
	const rfInstance = useReactFlow();
	const isInitialized = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
			setTimeout(() => onInit(rfInstance), 1);
			isInitialized.current = true;
		}
	}, [onInit, rfInstance.viewportInitialized]);
}
var oppositePosition = {
	[Position.Left]: Position.Right,
	[Position.Right]: Position.Left,
	[Position.Top]: Position.Bottom,
	[Position.Bottom]: Position.Top
};
var ConnectionLine = ({ nodeId, handleType, style, type = ConnectionLineType.Bezier, CustomComponent, connectionStatus }) => {
	const { fromNode, handleId, toX, toY, connectionMode } = useStore((0, import_react.useCallback)((s) => ({
		fromNode: s.nodeInternals.get(nodeId),
		handleId: s.connectionHandleId,
		toX: (s.connectionPosition.x - s.transform[0]) / s.transform[2],
		toY: (s.connectionPosition.y - s.transform[1]) / s.transform[2],
		connectionMode: s.connectionMode
	}), [nodeId]), shallow$1);
	const fromHandleBounds = fromNode?.[internalsSymbol]?.handleBounds;
	let handleBounds = fromHandleBounds?.[handleType];
	if (connectionMode === ConnectionMode.Loose) handleBounds = handleBounds ? handleBounds : fromHandleBounds?.[handleType === "source" ? "target" : "source"];
	if (!fromNode || !handleBounds) return null;
	const fromHandle = handleId ? handleBounds.find((d) => d.id === handleId) : handleBounds[0];
	const fromHandleX = fromHandle ? fromHandle.x + fromHandle.width / 2 : (fromNode.width ?? 0) / 2;
	const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode.height ?? 0;
	const fromX = (fromNode.positionAbsolute?.x ?? 0) + fromHandleX;
	const fromY = (fromNode.positionAbsolute?.y ?? 0) + fromHandleY;
	const fromPosition = fromHandle?.position;
	const toPosition = fromPosition ? oppositePosition[fromPosition] : null;
	if (!fromPosition || !toPosition) return null;
	if (CustomComponent) return import_react.createElement(CustomComponent, {
		connectionLineType: type,
		connectionLineStyle: style,
		fromNode,
		fromHandle,
		fromX,
		fromY,
		toX,
		toY,
		fromPosition,
		toPosition,
		connectionStatus
	});
	let dAttr = "";
	const pathParams = {
		sourceX: fromX,
		sourceY: fromY,
		sourcePosition: fromPosition,
		targetX: toX,
		targetY: toY,
		targetPosition: toPosition
	};
	if (type === ConnectionLineType.Bezier) [dAttr] = getBezierPath(pathParams);
	else if (type === ConnectionLineType.Step) [dAttr] = getSmoothStepPath({
		...pathParams,
		borderRadius: 0
	});
	else if (type === ConnectionLineType.SmoothStep) [dAttr] = getSmoothStepPath(pathParams);
	else if (type === ConnectionLineType.SimpleBezier) [dAttr] = getSimpleBezierPath(pathParams);
	else dAttr = `M${fromX},${fromY} ${toX},${toY}`;
	return import_react.createElement("path", {
		d: dAttr,
		fill: "none",
		className: "react-flow__connection-path",
		style
	});
};
ConnectionLine.displayName = "ConnectionLine";
var selector$2 = (s) => ({
	nodeId: s.connectionNodeId,
	handleType: s.connectionHandleType,
	nodesConnectable: s.nodesConnectable,
	connectionStatus: s.connectionStatus,
	width: s.width,
	height: s.height
});
function ConnectionLineWrapper({ containerStyle, style, type, component }) {
	const { nodeId, handleType, nodesConnectable, width, height, connectionStatus } = useStore(selector$2, shallow$1);
	if (!!!(nodeId && handleType && width && nodesConnectable)) return null;
	return import_react.createElement("svg", {
		style: containerStyle,
		width,
		height,
		className: "react-flow__edges react-flow__connectionline react-flow__container"
	}, import_react.createElement("g", { className: cc(["react-flow__connection", connectionStatus]) }, import_react.createElement(ConnectionLine, {
		nodeId,
		handleType,
		style,
		type,
		CustomComponent: component,
		connectionStatus
	})));
}
function useNodeOrEdgeTypes(nodeOrEdgeTypes, createTypes) {
	(0, import_react.useRef)(null);
	useStoreApi();
	return (0, import_react.useMemo)(() => {
		return createTypes(nodeOrEdgeTypes);
	}, [nodeOrEdgeTypes]);
}
var GraphView = ({ nodeTypes, edgeTypes, onMove, onMoveStart, onMoveEnd, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId }) => {
	const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
	const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);
	useOnInitHandler(onInit);
	return import_react.createElement(FlowRenderer$1, {
		onPaneClick,
		onPaneMouseEnter,
		onPaneMouseMove,
		onPaneMouseLeave,
		onPaneContextMenu,
		onPaneScroll,
		deleteKeyCode,
		selectionKeyCode,
		selectionOnDrag,
		selectionMode,
		onSelectionStart,
		onSelectionEnd,
		multiSelectionKeyCode,
		panActivationKeyCode,
		zoomActivationKeyCode,
		elementsSelectable,
		onMove,
		onMoveStart,
		onMoveEnd,
		zoomOnScroll,
		zoomOnPinch,
		zoomOnDoubleClick,
		panOnScroll,
		panOnScrollSpeed,
		panOnScrollMode,
		panOnDrag,
		defaultViewport,
		translateExtent,
		minZoom,
		maxZoom,
		onSelectionContextMenu,
		preventScrolling,
		noDragClassName,
		noWheelClassName,
		noPanClassName,
		disableKeyboardA11y
	}, import_react.createElement(Viewport, null, import_react.createElement(EdgeRenderer$1, {
		edgeTypes: edgeTypesWrapped,
		onEdgeClick,
		onEdgeDoubleClick,
		onlyRenderVisibleElements,
		onEdgeContextMenu,
		onEdgeMouseEnter,
		onEdgeMouseMove,
		onEdgeMouseLeave,
		onReconnect,
		onReconnectStart,
		onReconnectEnd,
		reconnectRadius,
		defaultMarkerColor,
		noPanClassName,
		elevateEdgesOnSelect: !!elevateEdgesOnSelect,
		disableKeyboardA11y,
		rfId
	}, import_react.createElement(ConnectionLineWrapper, {
		style: connectionLineStyle,
		type: connectionLineType,
		component: connectionLineComponent,
		containerStyle: connectionLineContainerStyle
	})), import_react.createElement("div", { className: "react-flow__edgelabel-renderer" }), import_react.createElement(NodeRenderer$1, {
		nodeTypes: nodeTypesWrapped,
		onNodeClick,
		onNodeDoubleClick,
		onNodeMouseEnter,
		onNodeMouseMove,
		onNodeMouseLeave,
		onNodeContextMenu,
		selectNodesOnDrag,
		onlyRenderVisibleElements,
		noPanClassName,
		noDragClassName,
		disableKeyboardA11y,
		nodeOrigin,
		nodeExtent,
		rfId
	})));
};
GraphView.displayName = "GraphView";
var GraphView$1 = (0, import_react.memo)(GraphView);
var infiniteExtent = [[Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY], [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]];
var initialState = {
	rfId: "1",
	width: 0,
	height: 0,
	transform: [
		0,
		0,
		1
	],
	nodeInternals: /* @__PURE__ */ new Map(),
	edges: [],
	onNodesChange: null,
	onEdgesChange: null,
	hasDefaultNodes: false,
	hasDefaultEdges: false,
	d3Zoom: null,
	d3Selection: null,
	d3ZoomHandler: void 0,
	minZoom: .5,
	maxZoom: 2,
	translateExtent: infiniteExtent,
	nodeExtent: infiniteExtent,
	nodesSelectionActive: false,
	userSelectionActive: false,
	userSelectionRect: null,
	connectionNodeId: null,
	connectionHandleId: null,
	connectionHandleType: "source",
	connectionPosition: {
		x: 0,
		y: 0
	},
	connectionStatus: null,
	connectionMode: ConnectionMode.Strict,
	domNode: null,
	paneDragging: false,
	noPanClassName: "nopan",
	nodeOrigin: [0, 0],
	nodeDragThreshold: 0,
	snapGrid: [15, 15],
	snapToGrid: false,
	nodesDraggable: true,
	nodesConnectable: true,
	nodesFocusable: true,
	edgesFocusable: true,
	edgesUpdatable: true,
	elementsSelectable: true,
	elevateNodesOnSelect: true,
	fitViewOnInit: false,
	fitViewOnInitDone: false,
	fitViewOnInitOptions: void 0,
	onSelectionChange: [],
	multiSelectionActive: false,
	connectionStartHandle: null,
	connectionEndHandle: null,
	connectionClickStartHandle: null,
	connectOnClick: true,
	ariaLiveMessage: "",
	autoPanOnConnect: true,
	autoPanOnNodeDrag: true,
	connectionRadius: 20,
	onError: devWarn,
	isValidConnection: void 0
};
var createRFStore = () => createWithEqualityFn((set, get) => ({
	...initialState,
	setNodes: (nodes) => {
		const { nodeInternals, nodeOrigin, elevateNodesOnSelect } = get();
		set({ nodeInternals: createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect) });
	},
	getNodes: () => {
		return Array.from(get().nodeInternals.values());
	},
	setEdges: (edges) => {
		const { defaultEdgeOptions = {} } = get();
		set({ edges: edges.map((e) => ({
			...defaultEdgeOptions,
			...e
		})) });
	},
	setDefaultNodesAndEdges: (nodes, edges) => {
		const hasDefaultNodes = typeof nodes !== "undefined";
		const hasDefaultEdges = typeof edges !== "undefined";
		set({
			nodeInternals: hasDefaultNodes ? createNodeInternals(nodes, /* @__PURE__ */ new Map(), get().nodeOrigin, get().elevateNodesOnSelect) : /* @__PURE__ */ new Map(),
			edges: hasDefaultEdges ? edges : [],
			hasDefaultNodes,
			hasDefaultEdges
		});
	},
	updateNodeDimensions: (updates) => {
		const { onNodesChange, nodeInternals, fitViewOnInit, fitViewOnInitDone, fitViewOnInitOptions, domNode, nodeOrigin } = get();
		const viewportNode = domNode?.querySelector(".react-flow__viewport");
		if (!viewportNode) return;
		const style = window.getComputedStyle(viewportNode);
		const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
		const changes = updates.reduce((res, update) => {
			const node = nodeInternals.get(update.id);
			if (node?.hidden) nodeInternals.set(node.id, {
				...node,
				[internalsSymbol]: {
					...node[internalsSymbol],
					handleBounds: void 0
				}
			});
			else if (node) {
				const dimensions = getDimensions(update.nodeElement);
				if (!!(dimensions.width && dimensions.height && (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate))) {
					nodeInternals.set(node.id, {
						...node,
						[internalsSymbol]: {
							...node[internalsSymbol],
							handleBounds: {
								source: getHandleBounds(".source", update.nodeElement, zoom, nodeOrigin),
								target: getHandleBounds(".target", update.nodeElement, zoom, nodeOrigin)
							}
						},
						...dimensions
					});
					res.push({
						id: node.id,
						type: "dimensions",
						dimensions
					});
				}
			}
			return res;
		}, []);
		updateAbsoluteNodePositions(nodeInternals, nodeOrigin);
		const nextFitViewOnInitDone = fitViewOnInitDone || fitViewOnInit && !fitViewOnInitDone && fitView(get, {
			initial: true,
			...fitViewOnInitOptions
		});
		set({
			nodeInternals: new Map(nodeInternals),
			fitViewOnInitDone: nextFitViewOnInitDone
		});
		if (changes?.length > 0) onNodesChange?.(changes);
	},
	updateNodePositions: (nodeDragItems, positionChanged = true, dragging = false) => {
		const { triggerNodeChanges } = get();
		triggerNodeChanges(nodeDragItems.map((node) => {
			const change = {
				id: node.id,
				type: "position",
				dragging
			};
			if (positionChanged) {
				change.positionAbsolute = node.positionAbsolute;
				change.position = node.position;
			}
			return change;
		}));
	},
	triggerNodeChanges: (changes) => {
		const { onNodesChange, nodeInternals, hasDefaultNodes, nodeOrigin, getNodes, elevateNodesOnSelect } = get();
		if (changes?.length) {
			if (hasDefaultNodes) set({ nodeInternals: createNodeInternals(applyNodeChanges(changes, getNodes()), nodeInternals, nodeOrigin, elevateNodesOnSelect) });
			onNodesChange?.(changes);
		}
	},
	addSelectedNodes: (selectedNodeIds) => {
		const { multiSelectionActive, edges, getNodes } = get();
		let changedNodes;
		let changedEdges = null;
		if (multiSelectionActive) changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
		else {
			changedNodes = getSelectionChanges(getNodes(), selectedNodeIds);
			changedEdges = getSelectionChanges(edges, []);
		}
		updateNodesAndEdgesSelections({
			changedNodes,
			changedEdges,
			get,
			set
		});
	},
	addSelectedEdges: (selectedEdgeIds) => {
		const { multiSelectionActive, edges, getNodes } = get();
		let changedEdges;
		let changedNodes = null;
		if (multiSelectionActive) changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
		else {
			changedEdges = getSelectionChanges(edges, selectedEdgeIds);
			changedNodes = getSelectionChanges(getNodes(), []);
		}
		updateNodesAndEdgesSelections({
			changedNodes,
			changedEdges,
			get,
			set
		});
	},
	unselectNodesAndEdges: ({ nodes, edges } = {}) => {
		const { edges: storeEdges, getNodes } = get();
		const nodesToUnselect = nodes ? nodes : getNodes();
		const edgesToUnselect = edges ? edges : storeEdges;
		updateNodesAndEdgesSelections({
			changedNodes: nodesToUnselect.map((n) => {
				n.selected = false;
				return createSelectionChange(n.id, false);
			}),
			changedEdges: edgesToUnselect.map((edge) => createSelectionChange(edge.id, false)),
			get,
			set
		});
	},
	setMinZoom: (minZoom) => {
		const { d3Zoom, maxZoom } = get();
		d3Zoom?.scaleExtent([minZoom, maxZoom]);
		set({ minZoom });
	},
	setMaxZoom: (maxZoom) => {
		const { d3Zoom, minZoom } = get();
		d3Zoom?.scaleExtent([minZoom, maxZoom]);
		set({ maxZoom });
	},
	setTranslateExtent: (translateExtent) => {
		get().d3Zoom?.translateExtent(translateExtent);
		set({ translateExtent });
	},
	resetSelectedElements: () => {
		const { edges, getNodes } = get();
		updateNodesAndEdgesSelections({
			changedNodes: getNodes().filter((e) => e.selected).map((n) => createSelectionChange(n.id, false)),
			changedEdges: edges.filter((e) => e.selected).map((e) => createSelectionChange(e.id, false)),
			get,
			set
		});
	},
	setNodeExtent: (nodeExtent) => {
		const { nodeInternals } = get();
		nodeInternals.forEach((node) => {
			node.positionAbsolute = clampPosition(node.position, nodeExtent);
		});
		set({
			nodeExtent,
			nodeInternals: new Map(nodeInternals)
		});
	},
	panBy: (delta) => {
		const { transform, width, height, d3Zoom, d3Selection, translateExtent } = get();
		if (!d3Zoom || !d3Selection || !delta.x && !delta.y) return false;
		const nextTransform = identity.translate(transform[0] + delta.x, transform[1] + delta.y).scale(transform[2]);
		const extent = [[0, 0], [width, height]];
		const constrainedTransform = d3Zoom?.constrain()(nextTransform, extent, translateExtent);
		d3Zoom.transform(d3Selection, constrainedTransform);
		return transform[0] !== constrainedTransform.x || transform[1] !== constrainedTransform.y || transform[2] !== constrainedTransform.k;
	},
	cancelConnection: () => set({
		connectionNodeId: initialState.connectionNodeId,
		connectionHandleId: initialState.connectionHandleId,
		connectionHandleType: initialState.connectionHandleType,
		connectionStatus: initialState.connectionStatus,
		connectionStartHandle: initialState.connectionStartHandle,
		connectionEndHandle: initialState.connectionEndHandle
	}),
	reset: () => set({ ...initialState })
}), Object.is);
var ReactFlowProvider = ({ children }) => {
	const storeRef = (0, import_react.useRef)(null);
	if (!storeRef.current) storeRef.current = createRFStore();
	return import_react.createElement(Provider$1, { value: storeRef.current }, children);
};
ReactFlowProvider.displayName = "ReactFlowProvider";
var Wrapper = ({ children }) => {
	if ((0, import_react.useContext)(StoreContext)) return import_react.createElement(import_react.Fragment, null, children);
	return import_react.createElement(ReactFlowProvider, null, children);
};
Wrapper.displayName = "ReactFlowWrapper";
var defaultNodeTypes = {
	input: InputNode$1,
	default: DefaultNode$1,
	output: OutputNode$1,
	group: GroupNode
};
var defaultEdgeTypes = {
	default: BezierEdge,
	straight: StraightEdge,
	step: StepEdge,
	smoothstep: SmoothStepEdge,
	simplebezier: SimpleBezierEdge
};
var initNodeOrigin = [0, 0];
var initSnapGrid = [15, 15];
var initDefaultViewport = {
	x: 0,
	y: 0,
	zoom: 1
};
var wrapperStyle = {
	width: "100%",
	height: "100%",
	overflow: "hidden",
	position: "relative",
	zIndex: 0
};
var ReactFlow = (0, import_react.forwardRef)(({ nodes, edges, defaultNodes, defaultEdges, className, nodeTypes = defaultNodeTypes, edgeTypes = defaultEdgeTypes, onNodeClick, onEdgeClick, onInit, onMove, onMoveStart, onMoveEnd, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, onNodeDragStart, onNodeDrag, onNodeDragStop, onNodesDelete, onEdgesDelete, onSelectionChange, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionMode = ConnectionMode.Strict, connectionLineType = ConnectionLineType.Bezier, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, deleteKeyCode = "Backspace", selectionKeyCode = "Shift", selectionOnDrag = false, selectionMode = SelectionMode.Full, panActivationKeyCode = "Space", multiSelectionKeyCode = isMacOs() ? "Meta" : "Control", zoomActivationKeyCode = isMacOs() ? "Meta" : "Control", snapToGrid = false, snapGrid = initSnapGrid, onlyRenderVisibleElements = false, selectNodesOnDrag = true, nodesDraggable, nodesConnectable, nodesFocusable, nodeOrigin = initNodeOrigin, edgesFocusable, edgesUpdatable, elementsSelectable, defaultViewport = initDefaultViewport, minZoom = .5, maxZoom = 2, translateExtent = infiniteExtent, preventScrolling = true, nodeExtent, defaultMarkerColor = "#b1b1b7", zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = .5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, children, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeUpdate, onEdgeUpdateStart, onEdgeUpdateEnd, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius = 10, edgeUpdaterRadius = 10, onNodesChange, onEdgesChange, noDragClassName = "nodrag", noWheelClassName = "nowheel", noPanClassName = "nopan", fitView = false, fitViewOptions, connectOnClick = true, attributionPosition, proOptions, defaultEdgeOptions, elevateNodesOnSelect = true, elevateEdgesOnSelect = false, disableKeyboardA11y = false, autoPanOnConnect = true, autoPanOnNodeDrag = true, connectionRadius = 20, isValidConnection, onError, style, id, nodeDragThreshold, ...rest }, ref) => {
	const rfId = id || "1";
	return import_react.createElement("div", {
		...rest,
		style: {
			...style,
			...wrapperStyle
		},
		ref,
		className: cc(["react-flow", className]),
		"data-testid": "rf__wrapper",
		id
	}, import_react.createElement(Wrapper, null, import_react.createElement(GraphView$1, {
		onInit,
		onMove,
		onMoveStart,
		onMoveEnd,
		onNodeClick,
		onEdgeClick,
		onNodeMouseEnter,
		onNodeMouseMove,
		onNodeMouseLeave,
		onNodeContextMenu,
		onNodeDoubleClick,
		nodeTypes,
		edgeTypes,
		connectionLineType,
		connectionLineStyle,
		connectionLineComponent,
		connectionLineContainerStyle,
		selectionKeyCode,
		selectionOnDrag,
		selectionMode,
		deleteKeyCode,
		multiSelectionKeyCode,
		panActivationKeyCode,
		zoomActivationKeyCode,
		onlyRenderVisibleElements,
		selectNodesOnDrag,
		defaultViewport,
		translateExtent,
		minZoom,
		maxZoom,
		preventScrolling,
		zoomOnScroll,
		zoomOnPinch,
		zoomOnDoubleClick,
		panOnScroll,
		panOnScrollSpeed,
		panOnScrollMode,
		panOnDrag,
		onPaneClick,
		onPaneMouseEnter,
		onPaneMouseMove,
		onPaneMouseLeave,
		onPaneScroll,
		onPaneContextMenu,
		onSelectionContextMenu,
		onSelectionStart,
		onSelectionEnd,
		onEdgeContextMenu,
		onEdgeDoubleClick,
		onEdgeMouseEnter,
		onEdgeMouseMove,
		onEdgeMouseLeave,
		onReconnect: onReconnect ?? onEdgeUpdate,
		onReconnectStart: onReconnectStart ?? onEdgeUpdateStart,
		onReconnectEnd: onReconnectEnd ?? onEdgeUpdateEnd,
		reconnectRadius: reconnectRadius ?? edgeUpdaterRadius,
		defaultMarkerColor,
		noDragClassName,
		noWheelClassName,
		noPanClassName,
		elevateEdgesOnSelect,
		rfId,
		disableKeyboardA11y,
		nodeOrigin,
		nodeExtent
	}), import_react.createElement(StoreUpdater, {
		nodes,
		edges,
		defaultNodes,
		defaultEdges,
		onConnect,
		onConnectStart,
		onConnectEnd,
		onClickConnectStart,
		onClickConnectEnd,
		nodesDraggable,
		nodesConnectable,
		nodesFocusable,
		edgesFocusable,
		edgesUpdatable,
		elementsSelectable,
		elevateNodesOnSelect,
		minZoom,
		maxZoom,
		nodeExtent,
		onNodesChange,
		onEdgesChange,
		snapToGrid,
		snapGrid,
		connectionMode,
		translateExtent,
		connectOnClick,
		defaultEdgeOptions,
		fitView,
		fitViewOptions,
		onNodesDelete,
		onEdgesDelete,
		onNodeDragStart,
		onNodeDrag,
		onNodeDragStop,
		onSelectionDrag,
		onSelectionDragStart,
		onSelectionDragStop,
		noPanClassName,
		nodeOrigin,
		rfId,
		autoPanOnConnect,
		autoPanOnNodeDrag,
		onError,
		connectionRadius,
		isValidConnection,
		nodeDragThreshold
	}), import_react.createElement(Wrapper$1, { onSelectionChange }), children, import_react.createElement(Attribution, {
		proOptions,
		position: attributionPosition
	}), import_react.createElement(A11yDescriptions, {
		rfId,
		disableKeyboardA11y
	})));
});
ReactFlow.displayName = "ReactFlow";
//#endregion
//#region ../node_modules/reactflow/dist/style.css
var import_jsx_runtime = require_jsx_runtime();
//#endregion
//#region ../node_modules/@baseflow/flow-react/out/index.js
var T = Object.create;
var E = Object.defineProperty;
var ee = Object.getOwnPropertyDescriptor;
var D = Object.getOwnPropertyNames;
var te = Object.getPrototypeOf;
var O = Object.prototype.hasOwnProperty;
var k = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports);
var A = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = D(t), a = 0, o = i.length, s; a < o; a++) s = i[a], !O.call(e, s) && s !== n && E(e, s, {
		get: ((e) => t[e]).bind(null, s),
		enumerable: !(r = ee(t, s)) || r.enumerable
	});
	return e;
};
var ne = (e, t, n) => (n = e == null ? {} : T(te(e)), A(t || !e || !e.__esModule || !O.call(e, "default") ? E(n, "default", {
	value: e,
	enumerable: !0
}) : n, e));
var j = {
	Flow: "Flow",
	Start: "Start",
	End: "End",
	Return: "Return",
	Task: "Task",
	Variable: "Variable",
	VariableUpdate: "VariableUpdate",
	Choice: "Choice",
	Branch: "Branch",
	Parallel: "Parallel",
	Thread: "Thread",
	Loop: "Loop",
	Break: "Break",
	Group: "Group",
	Trigger: "Trigger"
};
var re = {
	[j.Flow]: !0,
	[j.Choice]: !0,
	[j.Branch]: !0,
	[j.Parallel]: !0,
	[j.Thread]: !0,
	[j.Loop]: !0,
	[j.Group]: !0
};
var M = {
	isFork(e) {
		return e === j.Branch || e === j.Thread;
	},
	isRoute(e) {
		return e === j.Choice || e === j.Parallel;
	},
	isContainer(e) {
		return !!re[e];
	},
	mockAble(e) {
		return e !== j.Start && e !== j.End && e !== j.Flow && e !== j.Return;
	},
	deleteAble(e) {
		return e !== j.Start && e !== j.End;
	},
	reidAble(e) {
		return e !== j.Start && e !== j.End;
	}
};
var ie = {
	saveToApi: 500,
	nodeDataUpdate: 0,
	historyLock: 500,
	validateReference: 300
};
j.Flow, j.Start, j.End;
function ae(e, t) {
	let n = {
		id: e.id,
		folded: e.folded,
		data: e.type
	};
	return e.childrenIds.length && (n.children = e.childrenIds.map((e) => ae(t[e], t))), n;
}
function oe(e) {
	let t = {}, n = null;
	return e.forEach((e) => {
		e.parentId || (n = e), t[e.id] = e;
	}), { nodes: ae(n, t) };
}
function N(e, t, n, r, i) {
	let a = e;
	if (e.childrenIds.length && e.childrenIds.forEach((o) => {
		let s = t[o];
		if (M.isRoute(e.type)) {
			let t = i({
				id: `e${r.n++}`,
				source: {
					id: e.id,
					port: "out2",
					type: e.type
				},
				target: {
					id: o,
					port: "in",
					type: s.type
				},
				routeFork: !0,
				markerEnd: !0
			}), a = i({
				id: `e${r.n++}`,
				source: {
					id: o,
					port: "out",
					type: s.type
				},
				target: {
					id: e.id,
					port: "in2",
					type: e.type
				},
				routeFork: !0,
				markerEnd: !1
			});
			n.push(t, a);
		} else {
			let t = i({
				id: `e${r.n++}`,
				source: {
					id: a.id,
					port: a === e ? "out2" : "out",
					type: a.type
				},
				target: {
					id: o,
					port: "in",
					type: s.type
				},
				routeFork: !1,
				markerEnd: !0
			});
			n.push(t), a = s;
		}
		N(s, t, n, r, i);
	}), a !== e) {
		let t = i({
			id: `e${r.n++}`,
			source: {
				id: a.id,
				port: "out",
				type: a.type
			},
			target: {
				id: e.id,
				port: "in2",
				type: e.type
			},
			routeFork: !1,
			markerEnd: !1
		});
		n.push(t);
	}
}
function se(e, t) {
	let n = {}, r = null;
	e.forEach((e) => {
		e.parentId || (r = e), n[e.id] = e;
	});
	let i = [];
	return N(r, n, i, { n: Date.now() }, t.toDagreEdge), {
		nodes: e.map((e) => t.toDagreNode(e)),
		edges: i
	};
}
function ce(e, t) {
	let n = {}, r = null;
	e.forEach((e) => {
		e.parentId || (r = e), n[e.id] = e;
	});
	let i = [];
	return N(r, n, i, { n: Date.now() }, t), i;
}
var le = 30;
function ue(e, t, n) {
	let r = [], i = [];
	return e.forEach((e) => {
		let a = e.getChildren();
		if (a) {
			let { width: r, height: i } = e.getOptions(), o = le, s = le, c = i + n, l, u, d = n;
			if (a.length) {
				let { widths: i, heights: o } = ue(a, t, n);
				if (M.isRoute(e.getType())) {
					let e = i.reduce((e, t) => e + t, 0) + t * (i.length - 1);
					l = Math.max(r, e), u = Math.max(...o);
				} else l = Math.max(r, ...i), u = o.reduce((e, t) => e + t, 0) + n * (o.length - 1);
			} else l = r, u = -d;
			e.setWidth(o + l + s), e.setHeight(c + u + d);
		}
		r.push(e.getWidth()), i.push(e.getHeight());
	}), {
		widths: r,
		heights: i
	};
}
function de(e, t, n) {
	let r = e.getWidth(), i = e.getChildren();
	if (i?.length) {
		let { height: a } = e.getOptions(), o = a + n, s = le;
		if (M.isRoute(e.getType())) {
			let e = s;
			i.forEach((r) => {
				r.setPosition({
					x: e,
					y: o
				}), e = e + r.getWidth() + t, r.getChildren()?.length && de(r, t, n);
			});
		} else {
			let e = o;
			i.forEach((i) => {
				i.setPosition({
					x: (r - i.getWidth()) / 2,
					y: e
				}), e = e + i.getHeight() + n, i.getChildren()?.length && de(i, t, n);
			});
		}
	}
}
function fe(e) {
	let t = e.getChildren();
	t?.length && t.forEach((t) => {
		t.setPosition({
			x: e.getX() + t.getX(),
			y: e.getY() + t.getY()
		}), t.getChildren()?.length && fe(t);
	});
}
var pe = class {
	id;
	data;
	size;
	position;
	children;
	constructor(e) {
		this.id = e.id, this.data = e, this.size = {
			width: e.meta.width || 250,
			height: e.meta.height || 50
		}, this.position = {
			x: 0,
			y: 0
		}, this.children = M.isContainer(this.getType()) ? [] : void 0;
	}
	getWidth() {
		return this.size.width;
	}
	getHeight() {
		return this.size.height;
	}
	setWidth(e) {
		this.size.width = e;
	}
	setHeight(e) {
		this.size.height = e;
	}
	getType() {
		return this.data.type;
	}
	getOptions() {
		return {
			width: this.data.meta.width || 250,
			height: this.data.meta.height || 50
		};
	}
	getChildren() {
		return this.children;
	}
	addChild(e) {
		this.children?.push(e);
	}
	getX() {
		return this.position.x;
	}
	getY() {
		return this.position.y;
	}
	setPosition(e) {
		this.position = e;
	}
};
function me(e, t, n) {
	let r = new pe(e);
	return n[e.id] = r, !e.folded && e.childrenIds.length && (r.children = e.childrenIds.map((e) => me(t[e], t, n))), r;
}
function he(e) {
	let t = {}, n = {}, r = null;
	e.forEach((e) => {
		e.parentId || (r = e), t[e.id] = e;
	});
	let i = me(r, t, n);
	return ue([i], 30, 62), de(i, 30, 62), fe(i), n;
}
var P = {
	clear: "清空",
	delete: "删除",
	copy: "复制",
	cut: "剪切",
	paste: "粘贴",
	rename: "重命名",
	resetId: "更改ID",
	remark: "备注",
	refresh: "刷新",
	fold: "折叠",
	unfold: "展开",
	load: "加载",
	more: "更多",
	input: "输入",
	output: "输出",
	listen: "监听",
	mapping: "映射",
	run: "运行",
	testRun: "试运行",
	stop: "停止",
	retry: "重运行",
	export: "导出",
	publish: "发布",
	log: "日志",
	switchLogs: "切换日志",
	runLogs: "运行日志",
	currentNode: "当前节点",
	flowStatus: "流程状态",
	copyCommitId: "点击可复制文档当前的CommitID",
	commitIdPrompt: "导入的日志文件必须与当前CommitID匹配",
	executing: "正在执行",
	executionNodes: "运行节点",
	executionCompleted: "执行完成",
	executionTime: "耗时",
	totalTime: "总耗时",
	flowInput: "流程入参",
	noDataPrompt: "..No Data..",
	noLogsPrompt: "没有发现与当前 CommitID 匹配的任何运行日志，请点击 “试运行“ 或 “导入“ 相关日志文件。",
	noOutputs: "没有输出",
	allNodes: "所有节点",
	envMode: "环境模式",
	envModeTips: "可将系统环境变量_ENV_设置为相应值",
	variableNodes: "变量节点",
	outputsTab: "节点输出",
	contextTab: "迭代变量",
	utilsTab: "表达式函数",
	triggers: "触发器",
	triggersTips: "没有触发器的流程仅可以被其它流程内部调用",
	noErrors: "没有发现错误",
	deleteConfirm: "确定要删除此项目吗？",
	nodeIdFormat: "节点ID只允许包含[字母,数字,$,_]且以字母或$开头",
	cancel: "取消",
	submit: "提交",
	format: "格式化",
	insertNext: "插入后续",
	insertChild: "插入子级",
	mock: "模拟",
	disable: "禁用",
	enable: "启用",
	disableNode: "禁用节点",
	enableNode: "启用节点",
	version: "版本",
	currentNodeIsDisabled: "当前节点已禁用",
	currentNodeIsDisabledDesc: "禁用节点将不执行内部逻辑，但仍可以设置模拟输出...",
	mockOutput: "设置模拟输出",
	noLogsTips: "未加载任何日志文件...",
	help: "帮助",
	uploadConfig: "保存配置到云端",
	downloadConfig: "应用配置从云端",
	graphErrorsPrompt: "节点中存在错误！",
	flowRequiresParams: "流程需要入参...",
	clipboardIsEmpty: "剪贴板数据无效",
	idCannotBeModify: "开始/结束/节点的ID不允许修改",
	nodeCannotBeDisable: "开始/返回/节点不允许禁用",
	nodeHasExist: "(${node})已经存在...",
	nodeNotExist: "(${node})节点不存在...",
	notAllowedToSelectFlowNode: "流程节点只能单独选择",
	alreadyToClipboard: "已放入剪贴板",
	startOrEndCanOnlyBeReplace: "开始/结束节点只能被替换，无法添加或删除",
	notAllowedToAddBranch: "不能在(${node})中添加分支节点",
	notAllowedToAddBehind: "不能在(${node})后添加节点",
	notAllowedToAddChild: "不能为(${node})添加子节点",
	onlySameBranchCanBeAdd: "(${node})中只能添加同类型分支节点",
	notAllowedToDelete: "不能删除节点(${node})",
	notAllowedToDeleteDefaultBranch: "不能删除默认分支(${node})",
	notAllowedToMove: "不能移动节点(${node})",
	notAllowedToMoveThat: "不能移动到此(${node})",
	notAllowedToMoveDefaultBranch: "不能移动默认分支(${node})",
	keepAtLeast2Branches: "(${node})至少保留2个分支",
	inputSchemaChanged: "流程入参定义发生了变动，请确认各触发器节点映射数据！",
	returnSchemaChanged: "流程返回定义发生了变动，请确认各返回节点返回数据！"
};
function ge(e, t = {}) {
	return e.replace(/\$\{([^}]*)\}/g, (e, n) => t[n]);
}
var _e = {};
var F = { nodeDefaultSize: {
	width: 260,
	height: 68
} };
var ve = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ijg1Ljk1MiA3OC44NzIgMzQwLjk1NyAzNDAuOTU3IiB3aWR0aD0iMzQwLjk1N3B4IiBoZWlnaHQ9IjM0MC45NTdweCI+PGc+PHJlY3QgeD0iODUuOTUyIiB5PSI3OC44NzIiIHdpZHRoPSIzNDAuOTU3IiBoZWlnaHQ9IjM0MC45NTciIHN0eWxlPSJmaWxsOiMyYjdiZWE7IiAvPjxwYXRoIGQ9Ik0gMzI4LjAyNSAyOTUuOTYgQyAzMTkuMjg2IDI5NS45NiAzMTEuMjIxIDI5OS4wMjcgMzA0LjkwNSAzMDQuMTQ4IEwgMjQxLjM2NyAyNTguMTgzIEMgMjQyLjQzMiAyNTIuMzQgMjQyLjQzMiAyNDYuMzU1IDI0MS4zNjcgMjQwLjUyMSBMIDMwNC45MDUgMTk0LjU1NiBDIDMxMS4yMjEgMTk5LjY3NyAzMTkuMjg2IDIwMi43NDEgMzI4LjAyNSAyMDIuNzQxIEMgMzQ4LjMyNSAyMDIuNzQxIDM2NC44MjIgMTg2LjI0NiAzNjQuODIyIDE2NS45NDggQyAzNjQuODIyIDE0NS42NDIgMzQ4LjMyNSAxMjkuMTQ3IDMyOC4wMjUgMTI5LjE0NyBDIDMwNy43MjUgMTI5LjE0NyAyOTEuMjI4IDE0NS42NDIgMjkxLjIyOCAxNjUuOTQ4IEMgMjkxLjIyOCAxNjkuNTAyIDI5MS43MTkgMTcyLjkwNCAyOTIuNjY5IDE3Ni4xNTUgTCAyMzIuMzIyIDIxOS44NSBDIDIyMy4zNjcgMjA3Ljk4NiAyMDkuMTM5IDIwMC4yOTEgMTkzLjEwMiAyMDAuMjkxIEMgMTY1Ljk5NiAyMDAuMjkxIDE0NC4wNCAyMjIuMjQ2IDE0NC4wNCAyNDkuMzQ4IEMgMTQ0LjA0IDI3Ni40NTggMTY1Ljk5NiAyOTguNDEzIDE5My4xMDIgMjk4LjQxMyBDIDIwOS4xMzkgMjk4LjQxMyAyMjMuMzY3IDI5MC43MTcgMjMyLjMyMiAyNzguODQ5IEwgMjkyLjY2OSAzMjIuNTQ2IEMgMjkxLjcxOSAzMjUuNzk3IDI5MS4yMjggMzI5LjIzMSAyOTEuMjI4IDMzMi43NTcgQyAyOTEuMjI4IDM1My4wNTcgMzA3LjcyNSAzNjkuNTU1IDMyOC4wMjUgMzY5LjU1NSBDIDM0OC4zMjUgMzY5LjU1NSAzNjQuODIyIDM1My4wNTcgMzY0LjgyMiAzMzIuNzU3IEMgMzY0LjgyMiAzMTIuNDU3IDM0OC4zMjUgMjk1Ljk2IDMyOC4wMjUgMjk1Ljk2IFogTSAzMjguMDI1IDE0OS45OTcgQyAzMzYuODI2IDE0OS45OTcgMzQzLjk3MSAxNTcuMTQgMzQzLjk3MSAxNjUuOTQ4IEMgMzQzLjk3MSAxNzQuNzQ4IDMzNi44MjYgMTgxLjg5MSAzMjguMDI1IDE4MS44OTEgQyAzMTkuMjI0IDE4MS44OTEgMzEyLjA4IDE3NC43NDggMzEyLjA4IDE2NS45NDggQyAzMTIuMDggMTU3LjE0IDMxOS4yMjQgMTQ5Ljk5NyAzMjguMDI1IDE0OS45OTcgWiBNIDE5My4xMDIgMjc2LjMzNSBDIDE3OC4yMyAyNzYuMzM1IDE2Ni4xMTggMjY0LjIyMiAxNjYuMTE4IDI0OS4zNDggQyAxNjYuMTE4IDIzNC40NzQgMTc4LjIzIDIyMi4zNjEgMTkzLjEwMiAyMjIuMzYxIEMgMjA3Ljk3NSAyMjIuMzYxIDIyMC4wODYgMjM0LjQ3NCAyMjAuMDg2IDI0OS4zNDggQyAyMjAuMDg2IDI2NC4yMjIgMjA3Ljk3NSAyNzYuMzM1IDE5My4xMDIgMjc2LjMzNSBaIE0gMzI4LjAyNSAzNDguNzAzIEMgMzE5LjIyNCAzNDguNzAzIDMxMi4wOCAzNDEuNTU4IDMxMi4wOCAzMzIuNzU3IEMgMzEyLjA4IDMyMy45NTcgMzE5LjIyNCAzMTYuODEyIDMyOC4wMjUgMzE2LjgxMiBDIDMzNi44MjYgMzE2LjgxMiAzNDMuOTcxIDMyMy45NTcgMzQzLjk3MSAzMzIuNzU3IEMgMzQzLjk3MSAzNDEuNTU4IDMzNi44MjYgMzQ4LjcwMyAzMjguMDI1IDM0OC43MDMgWiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIC8+PC9nPjwvc3ZnPg==";
var ye = {
	version: "1.0.0",
	icon: ve,
	type: j.Task,
	desc: "UnkownNode",
	defaultData: {
		meta: {
			name: "unkown",
			width: F.nodeDefaultSize.width,
			height: F.nodeDefaultSize.height
		},
		props: {}
	},
	defaultDsl: "",
	executor: {}
};
function be(e) {
	return _e[e] || console.error(`node: ${e} not found!`), _e[e] || ye;
}
function xe(e) {
	F.pureRunner?.setShareData({ $: e });
}
function Se(e, t) {
	if (!_e[e]) {
		t.icon ||= ve;
		let n = t.defaultData.meta;
		n.width ||= F.nodeDefaultSize.width, n.height ||= F.nodeDefaultSize.height, _e[e] = t;
	}
	return _e[e];
}
function we({ lang: e, nodeDefaultSize: t, pureRunner: n, nodeRendererUrl: r }) {
	e && Object.assign(P, e), t && (F.nodeDefaultSize = t), n && (F.pureRunner = n), r && (F.nodeRendererUrl = r);
}
async function Ee(e, t, n) {
	e = { ...e };
	let r = Object.keys(e), i = {}, a = [];
	return r.forEach((r) => {
		let [o, s] = e[r].split("@").filter(Boolean);
		e[r].startsWith("@") && (o = `@${o}`), (!s || s === "*") && (s = t[r] ? t[r].split("@").filter(Boolean).pop() : "latest", e[r] = `${o}@${s}`), t[r] && t[r] !== e[r] && (i[e[r]] = t[r], e[r] = t[r]);
		let c = e[r];
		_e[c] || a.push(n(c).then((e) => {
			let t = { ...e };
			if (e.validate && (F.pureRunner.initFunction(`${c}@validate`, e.validate.toString()), t.validate = (t, n) => F.pureRunner.runFunction(c, [t, n], e.collaborationApply ? ["$"] : void 0)), e.propsRender && (F.pureRunner.initFunction(`${c}@propsRender.in`, e.propsRender.in.toString()), F.pureRunner.initFunction(`${c}@propsRender.out`, e.propsRender.out.toString()), t.propsRender = {
				in: (e) => F.pureRunner.runFunction(`${c}@propsRender.in`, [e]),
				out: (e) => F.pureRunner.runFunction(`${c}@propsRender.out`, [e])
			}), e.outputForm) {
				let { toolsFilter: n, editableFilter: r } = e.outputForm;
				t.outputForm = { ...e.outputForm }, n && (F.pureRunner.initFunction(`${c}@outputForm.toolsFilter`, n.toString()), t.outputForm.toolsFilter = (e, t) => F.pureRunner.runFunction(`${c}@outputForm.toolsFilter`, [e, t])), r && (F.pureRunner.initFunction(`${c}@outputForm.editableFilter`, r.toString()), t.outputForm.editableFilter = (e, t) => F.pureRunner.runFunction(`${c}@outputForm.editableFilter`, [e, t]));
			}
			return Se(c, t), c;
		}));
	}), await Promise.all(a), {
		sources: e,
		replaced: i
	};
}
var De = {
	[j.Flow]: "flow",
	[j.Start]: "start",
	[j.End]: "end"
};
function Oe(e, t, n) {
	return Promise.allSettled(n).then((e) => e.reduce((e, t) => {
		if (t.status === "fulfilled") {
			let n = t.value;
			e[n.id] || (e[n.id] = {});
			let r = n.result || {};
			if (e[n.id].error = r.error || void 0, r.affects) {
				let t = r.affects;
				Object.keys(t).forEach((r) => {
					let i = t[r];
					e[r] || (e[r] = {}), e[r].affects || (e[r].affects = {}), e[r].affects[n.id] = i;
				});
			}
		}
		return e;
	}, {})).then((n) => {
		console.log("commitValidateConfiguration"), console.log(n);
		let r = !1, [i, a] = [e, t].map((e) => e.map((e) => {
			if (n[e.id]) {
				let t = n[e.id];
				Object.hasOwn(t, "error") && e.meta.configurationErrors !== t.error && (r = !0, console.log("changed error"), e = {
					...e,
					meta: {
						...e.meta,
						configurationErrors: t.error
					}
				});
				let i = t.affects;
				if (i) {
					let t = e.meta.collaboratorMessages || {};
					Object.keys(i).some((e) => t[e] !== i[e]) && (r = !0, console.log("changed collaboratorMessages"), e = {
						...e,
						meta: {
							...e.meta,
							collaboratorMessages: {
								...t,
								...i
							}
						}
					});
				}
			}
			return e;
		}));
		if (r) return {
			nodes: i,
			triggers: a
		};
	});
}
async function ke(e) {
	let t = [];
	[e.nodes, e.triggers].forEach((n) => {
		n.forEach((n) => {
			let r = n.id, i = be(e.sources[n.tag]);
			i.propsRender && t.push(i.propsRender.out(n.props).then((e) => ({
				id: r,
				props: e
			})));
		});
	});
	let n = (await Promise.allSettled(t)).reduce((e, t) => {
		if (t.status === "fulfilled") {
			let n = t.value;
			e[n.id] = n.props;
		}
		return e;
	}, {}), [r, i] = [e.nodes, e.triggers].map((e) => e.map((e) => {
		let t = e.id;
		return n[t] ? {
			...e,
			props: n[t]
		} : e;
	}));
	return {
		...e,
		nodes: r,
		triggers: i
	};
}
async function Ae(e) {
	let t = [];
	[e.nodes, e.triggers].forEach((n) => {
		n.forEach((n) => {
			let r = n.id, i = be(e.sources[n.tag]);
			n.type = i.type, n.id = De[n.type] || n.id, i.propsRender && t.push(i.propsRender.in(n.props).then((e) => ({
				id: r,
				props: e
			})));
		});
	});
	let n = (await Promise.allSettled(t)).reduce((e, t) => {
		if (t.status === "fulfilled") {
			let n = t.value;
			e[n.id] = n.props;
		}
		return e;
	}, {}), [r, i] = [e.nodes, e.triggers].map((e) => e.map((e) => {
		let t = e.id;
		return n[t] ? {
			...e,
			props: n[t]
		} : e;
	})), a = {
		...e,
		nodes: r,
		triggers: i
	};
	return a.layout ||= "dagre", a;
}
var je = "@baseflow/schema";
var I = {
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
var Me = Object.keys(I).reduce((e, t) => (e[I[t]] = t, e), {});
var Ne = Object.keys(I).map((e) => ({
	value: I[e],
	label: e
}));
var L = {
	Variable: "ͼVARIABLEͼ",
	Template: "ͼTEMPLATEͼ",
	Expression: "ͼEXPRESSIONͼ"
};
var Pe = Object.keys(L).reduce((e, t) => (e[L[t]] = t, e), {});
var R = {
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
function Fe(e, t = {}) {
	return e.replace(/\$\{([^}]*)\}/g, (e, n) => t[n]);
}
var Ie = {
	"'": /\\'/g,
	"\"": /\\"/g
};
function Le(e, t, n) {
	if (n === "") {
		let e = t.slice(-1);
		t = e === "!" || e === "?" ? e + t.slice(0, -1) : `!${t}`;
	} else (n === "!" || n === "?") && (t = n + t);
	e.push(t);
}
var Re = {
	parse(e) {
		if (typeof e != "string") throw TypeError("ObjectPath.parse must be passed a string");
		let t = 0, n = [], r, i, a, o, s;
		for (; t < e.length;) if (r = e.indexOf(".", t), i = e.indexOf("[", t), r === -1 && i === -1) Le(n, e.slice(t, e.length), ""), t = e.length;
		else if (i === -1 || r !== -1 && r < i) Le(n, e.slice(t, r), ""), t = r + 1;
		else if (i > t && (Le(n, e.slice(t, i), ""), t = i), a = e.slice(i + 1, i + 2), a !== "\"" && a !== "'") o = e.indexOf("]", i), o === -1 && (o = e.length), s = e.charAt(o + 1), Le(n, e.slice(t + 1, o), s === "?" || s === "!" ? s : "!"), t = s === "?" || s === "!" ? o + 3 : s === "." ? o + 2 : o + 1;
		else {
			for (o = e.indexOf(`${a}]`, i), o === -1 && (o = e.length); e.slice(o - 1, o) === "\\" && o !== -1;) o = e.indexOf(`${a}]`, o + 1);
			o === -1 && (o = e.length), s = e.charAt(o + 2), Le(n, e.slice(t + 2, o).replace(Ie[a], a).replace(/\\+/g, (e) => Array.from({ length: Math.ceil(e.length / 2) + 1 }).join("\\")), s === "?" || s === "!" ? s : "!"), t = s === "?" || s === "!" ? o + 4 : s === "." ? o + 3 : o + 2;
		}
		return n;
	},
	stringify(e, t, n) {
		Array.isArray(e) || (e = [e]), t = t === "\"" ? "\"" : "'";
		let r = RegExp(`(\\\\|${t})`, "g"), i = e.map((e) => {
			let i = e.charAt(0) === "?" ? "?" : "", a = e.substring(1);
			return !n && /^[$A-Z_]\w*$/i.test(a) ? a + i : !n && !/\D/.test(a) ? `[${a}]${i}` : (a = a.replace(r, "\\$1"), `[${t}${a}${t}]${i}`);
		});
		return i.slice(1).reduce((e, t) => {
			let n = e.slice(-1);
			return t.charAt(0) === "[" && n !== "?" ? e + t : `${e}.${t}`;
		}, i[0]).replace(/\?$/, "");
	},
	normalize(e, t, n) {
		return Re.stringify(Array.isArray(e) ? e : Re.parse(e), t, n);
	}
};
var ze = "//⫻Expression⫻=";
var Be = "//⫻Node⫻=";
function Ve(e, t, n, r) {
	let i, a;
	return r ? (i = /\D/.test(e) ? /^[\w$]+$/.test(e) ? e : `["${e.replace(/"/g, "\\\"")}"]` : `[${e}]`, a = i.charAt(0) === "[" && !n.endsWith("?") ? "" : ".", t && (i = `${i}?`)) : (i = `${t ? "?" : "!"}${e}`, a = "⫻"), n ? n + a + i : i;
}
function He(e) {
	let t = e.split("⫻");
	return Re.stringify(t, "\"");
}
var Ue = {
	root: void 0,
	item: void 0,
	path: "",
	ids: "",
	level: 0
};
var z = {
	find(e, t, n = Ue, r = 0) {
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
				let c = s[i], l = z.find(c, t, {
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
	list(e, t, n = Ue, r = 0, i, a = []) {
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
				z.list(u, t, {
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
	map(e, t, n = Ue, r = 0, i) {
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
			o.children = e.children.map((a, c) => z.map(a, t, {
				item: e,
				path: n,
				ids: r,
				level: i,
				root: s
			}, c, o));
		}
		return o;
	},
	filter(e, t, n = Ue, r = 0) {
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
				let { path: n, ids: r, level: a, root: o } = i, s = e.children.map((i, s) => z.filter(i, t, {
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
	each(e, t, n = Ue, r = 0) {
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
				if (z.each(s, t, {
					item: e,
					path: n,
					ids: r,
					level: i,
					root: a
				}, o)) return !0;
			}
		}
	},
	recurse(e, t, n, r = Ue, i = 0) {
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
				if (z.recurse(u, t, n, {
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
		return z.each(e, (e) => {
			let r = e[t];
			n[r] = e;
		}), n;
	},
	produce(e, t, r, i = {
		item: void 0,
		path: "",
		ids: "",
		level: 0
	}, a = 0) {
		return create$1(e, (e) => {
			let n = e;
			z.each(n, t, i, a), r?.(n);
		});
	}
};
var We = "_temp_";
var B = "_item_";
var V = "_key_";
var H = "_length_";
var Ge = `^${B}(?=[.[])`;
var Ke = "_Brand_";
var qe = "_ENV_";
var U = {
	_string: "_string",
	_number: "_number",
	_boolean: "_boolean",
	_date: "_date",
	_time: "_time",
	_datetime: "_datetime",
	_any: "_any",
	_path: "_path"
};
var Je = {
	_createMap: "_createMap",
	_arrayPush: "_arrayPush",
	_mappingEach: "_mappingEach",
	_loopKeyValue: "_loopKeyValue",
	_matchVariable: "_matchVariable"
};
var Ye = "_utils";
var Xe = {
	...U,
	...Je,
	[qe]: qe,
	[Ke]: Ke,
	[Ye]: Ye,
	[We]: We,
	[H]: H,
	[B]: B,
	[V]: V
};
Object.keys(Xe).reduce((e, t) => (e[Xe[t]] = t, e), {});
var Ze = {
	schema: {
		id: Ye,
		name: Ye,
		type: I.Object,
		children: []
	},
	nameReg: ""
};
function Qe(e) {
	Ze.schema = W.toSchemaModelTreeWithJsObject({
		name: Ye,
		disabled: !0,
		type: I.Object,
		children: e.children
	}), Ze.nameReg = `^(${e.children.map((e) => e.name).join("|").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\.`;
}
var $e = {
	id: "_system_",
	name: "_system_",
	label: R.systemVariables,
	type: I.Object,
	disabled: !0,
	children: [
		{
			id: qe,
			name: qe,
			tips: R.envVariableTips,
			type: I.String
		},
		{
			id: "''",
			name: "emptyString",
			tips: R.emptyStringTips,
			type: I.String
		},
		{
			id: "null",
			name: "null",
			type: I.Any
		},
		{
			id: "undefined",
			name: "undefined",
			type: I.Any
		}
	]
};
var et = {
	isContainer(e) {
		return e === I.Object || e === I.Array || e === I.Map;
	},
	matchVariable(e) {
		if (e) {
			let t = e.match(RegExp(`^(${Object.values(U).join("|")})\\((.+)\\)$`));
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
		if (t === L.Variable) {
			let { fun: t, variable: n } = et.matchVariable(e);
			return t === U._number ? "0" : n;
		}
		return /\D/.test(e) ? "" : "0";
	},
	getVariableMode(e) {
		return e === "_key_" || e.startsWith("_item_") ? "context" : $e.children.some((t) => t.id === e) ? "constant" : e.startsWith("_utils") ? "utils" : "output";
	},
	getConstants() {
		return $e;
	},
	getUtils() {
		return Ze.schema;
	},
	getContext(e, t) {
		if (e) {
			if (!/\D/.test(e)) return {
				id: "_context_",
				name: "_context_",
				label: `${R.iteratorSource}: Number`,
				type: I.Any,
				disabled: !0,
				children: [
					{
						id: B,
						name: B,
						type: I.Number
					},
					{
						id: V,
						name: V,
						type: I.Number
					},
					{
						id: H,
						name: H,
						type: I.Number
					}
				]
			};
			if (t) {
				let n = t.children?.find((e) => e.name === "*") || {
					name: "*",
					type: I.Any
				};
				return {
					id: "_context_",
					name: "_context_",
					label: `${R.iteratorSource}: ${e}`,
					type: I.Any,
					disabled: !0,
					children: [
						{
							id: V,
							name: V,
							type: t.type === I.Array ? I.Number : I.String
						},
						{
							id: H,
							name: H,
							type: I.Number
						},
						W.regenSchemaModelWithJsObject({
							...n,
							label: "",
							name: B
						})
					]
				};
			}
			return {
				id: "_context_",
				name: "_context_",
				label: `${R.iteratorSource}: ${e}`,
				type: I.Any,
				disabled: !0,
				children: [
					{
						id: V,
						name: V,
						type: I.Any
					},
					{
						id: H,
						name: H,
						type: I.Number
					},
					{
						id: B,
						name: B,
						type: I.Any
					}
				]
			};
		}
	}
};
var tt = new Builder({
	preserveOrder: !0,
	ignoreAttributes: !1,
	suppressEmptyNode: !0,
	suppressBooleanAttributes: !0,
	format: !0
});
var nt = new XMLParser({
	preserveOrder: !0,
	ignoreAttributes: !1,
	allowBooleanAttributes: !0
});
function rt(e) {
	let { type: t, name: n, label: r, tips: i, optional: a, direct: o, enums: s, children: c = [] } = e, l = {
		[Me[t]]: c.map(rt),
		":@": {}
	}, u = l[":@"];
	return n && (u["@_name"] = n), r && (u["@_label"] = r), i && (u["@_tips"] = i), o && (u["@_direct"] = o), a && (u["@_optional"] = !0), s?.length && (u["@_enums"] = JSON.stringify(s)), l;
}
var it = {
	string: I.String,
	number: I.Number,
	boolean: I.Bool,
	object: I.Object,
	array: I.Array,
	map: I.Map
};
function at(e, t, n, r, i, a, o) {
	return e.map((e) => {
		let s = Ve((n === I.Array || n === I.Map) && e.name === "*" && (a || o) ? "0" : e.name, e.optional, t, r), c = r ? s.replace(/\?$/, "") : s, l = {
			...e,
			id: c
		};
		i !== void 0 && (l.folded = i);
		let u = a && e.type === I.File ? [{
			name: "fileName",
			type: I.String
		}, {
			name: "fileSize",
			type: I.Number
		}] : e.children;
		return l.children = u ? at(a && e.type === I.Array ? [{
			name: "length",
			type: I.Number
		}, ...u] : u, s, e.type, r, i, a, o) : void 0, l;
	});
}
function ot(e, t = "", n = !1, r, i, a) {
	let o = Ve(e.name, e.optional, t, n), s = i && e.type === I.File ? [{
		name: "fileName",
		type: I.String
	}, {
		name: "fileSize",
		type: I.Number
	}] : e.children;
	return {
		...e,
		id: o,
		folded: r,
		children: s ? at(i && e.type === I.Array ? [{
			name: "length",
			type: I.Number
		}, ...s] : s, o, e.type, n, r, i, a) : void 0
	};
}
function st(e, t, n) {
	if (e == null) {
		n.push({
			name: t,
			type: I.String,
			optional: !0
		});
		return;
	}
	let r = typeof e, i = {
		name: t,
		type: it[r === "object" ? Array.isArray(e) ? "array" : "*" in e ? "map" : "object" : r]
	};
	if (n.push(i), i.type === I.Object) {
		i.children = [];
		for (let t in e) {
			let n = e[t];
			st(n, t, i.children);
		}
	} else i.type === I.Array ? (i.children = [], st(e[0], "*", i.children)) : i.type === I.Map && (i.children = [], st(e["*"], "*", i.children));
}
function ct(e) {
	switch (e) {
		case I.String: return "xxx";
		case I.Number: return 123;
		case I.Bool: return !0;
		case I.Date: return "1970-01-01 00:00:00";
		case I.Object: return {};
		case I.Array: return [];
		case I.Map: return {};
		case I.Any: return "xxx";
	}
}
function lt(e, t, n) {
	e.forEach((e) => {
		let r = t === I.Array ? "0" : e.name, i = ct(e.type);
		n[r] = i, e.children && lt(e.children, e.type, i);
	});
}
function ut(e, t) {
	let n = {};
	return e.map((e) => {
		let [r] = Object.keys(e), i = e[":@"] || {}, a = {};
		for (let e in i) a[e.substring(2)] = i[e].toString();
		let o = t === I.Array || t === I.Map ? "*" : a.name, s = a.label;
		if (!o) throw R.nameIsRequired;
		if (n[o]) throw Fe(R.nameIsRepeat, { name: o });
		if (!I[r]) throw Fe(R.typeRestricted, { type: r });
		n[o] = !0;
		let c = e[r], l = {
			name: o,
			type: I[r]
		};
		return a.optional === "true" && (l.optional = !0), a.tips && (l.tips = a.tips), a.enums && (l.enums = JSON.parse(a.enums)), s && (l.label = s), l.type === I.Array || l.type === I.Map ? l.children = ut([c[0] || { [Me[I.String]]: [] }], l.type) : l.type === I.Object && c.length && (l.children = ut(c, l.type)), l;
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
		return ot(e, t);
	},
	toSchemaModelTreeWithJsObject(e, t = "", n) {
		return ot(e, t, !0, n, !0);
	},
	regenSchemaModelWithJsObject(e, t, n) {
		return ot(e, t, !0, n, !1, !0);
	},
	patchSchemaDirect(e, t, n, r) {
		if (e.direct) {
			let i = t[e.direct];
			if (i) {
				if ((i.type === I.Array || i.type === I.Map) && (e.name === "_item_" || e.name === "_key_")) {
					if (e.name === "_item_") {
						let i = t[`${e.direct}[0]`];
						if (i) {
							let a = W.regenSchemaModelWithJsObject({
								...i,
								name: e.name,
								label: e.label,
								direct: void 0
							}, n, r);
							Object.assign(e, a), z.each(e, (e) => {
								t[e.id] = e;
							});
							return;
						}
					} else {
						Object.assign(e, {
							type: i.type === I.Array ? I.Number : I.String,
							direct: void 0
						});
						return;
					}
				}
				let a = ot({
					...i,
					name: e.name,
					label: e.label,
					direct: void 0
				}, n, !0, r, !1, !0);
				Object.assign(e, a), z.each(e, (e) => {
					t[e.id] = e;
				});
			}
		}
	},
	highlightOutputs(e, t, n) {
		let r = {}, i;
		return z.produce(t, (t, { ids: a }) => {
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
			return e.type === I.Array && (t.children = e.children.filter((e) => e.name === "*")), t.children = t.children.map((e) => W.filterArraySpecific(e)), t;
		}
		return e;
	},
	schemaModelToXmlData: rt,
	schemaModelToXml(e) {
		return tt.build([rt(e)]).trim();
	},
	xmlDataToSchemaModel: ut,
	xmlToSchemaModel(e) {
		return ut(nt.parse(e))[0];
	},
	formatXml(e) {
		let t = nt.parse(e);
		return tt.build(t).trim();
	},
	jsonToSchemaModel(e) {
		let t = JSON.parse(e);
		if (t == null) return {
			name: "???",
			type: I.String,
			optional: !0
		};
		let n = typeof t, r = {
			name: "???",
			type: it[n === "object" ? Array.isArray(t) ? "array" : "*" in t ? "map" : "object" : n]
		};
		if (r.type === I.Object) {
			r.children = [];
			for (let e in t) {
				let n = t[e];
				st(n, e, r.children);
			}
		} else r.type === I.Array ? (r.children = [], st(t[0], "*", r.children)) : r.type === I.Map && (r.children = [], st(t["*"], "*", r.children));
		return r;
	},
	schemaModelToJson(e) {
		let t = ct(e.type);
		return e.children && lt(e.children, e.type, t), JSON.stringify(t, null, 4);
	}
};
function dt(e, t) {
	return e.map((e) => {
		let n = Ve(e.name, !1, t, !1), r = {
			...e,
			id: n
		};
		return r.children = e.children ? dt(e.children, n) : void 0, r;
	});
}
function ft(e, t, n) {
	return e.map((e) => pt(e, t, n));
}
function pt(e, t, n) {
	let { id: r, name: i, type: a, optional: o } = e, s = e.children || [], c = typeof n == "string" ? Ve(i, !1, n, !1) : void 0, l = t[i], u = l?.value, d = l?.children, f = d?.reduce((e, t) => (e[t.name] = t, e), {}), p = s.length && d, m = u ? u.type === a && u.optional === o ? u : {
		...u,
		type: a,
		optional: o
	} : {
		type: a,
		optional: o,
		source: L.Variable,
		text: ""
	};
	if (!p && m.text === "*" && (m.text = ""), p) {
		let { id: e, type: t, optional: n, children: r } = s[0];
		if (a === I.Array || a === I.Map) {
			if (m.text === "*") {
				if (a === I.Array) {
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
				} else a === I.Map && (s = Object.keys(f).map((i) => ({
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
			source: L.Template,
			text: "*"
		};
	}
	let h = {
		name: i,
		value: m,
		children: p ? ft(s, f || {}, c) : void 0
	};
	return typeof n == "string" && (h.id = c, h.schemaId = r), h;
}
var G = {
	getValueMode(e) {
		let t = e.value, n = t.type;
		return n === I.Object ? t.text === "*" ? "deconstruct" : "assign" : n === I.Array || n === I.Map ? t.text === "*" ? "deconstruct" : e.children ? "mapping" : "assign" : "assign";
	},
	valueModeIsMapping(e) {
		let t = e.value, n = e.value.type;
		return !!((n === I.Array || n === I.Map) && t.text !== "*" && e.children);
	},
	toSchemaValueTree(e, t) {
		return dt(e, t);
	},
	createSchemaValueByModel(e, t, n) {
		return pt(n ? e : W.toSchemaModelTree(e), { [e.name]: t });
	},
	createSchemaValueTreeByModel(e, t, n = "", r) {
		return pt(r ? e : W.toSchemaModelTree(e), { [e.name]: t }, n);
	},
	checkForm(e) {
		return e.querySelector(".ͼbaseflow-SuperInput[data-error]")?.getAttribute("data-error") || "";
	},
	matchSchemaValueByModel(e, t) {
		if (e.name !== t.name && e.name !== "*") return `(${t.name})${R.nameMismatch}`;
		if (e.type !== t.value.type) return `(${t.name})${R.typeMismatch}`;
		if (e.optional !== t.value.optional) return `(${t.name})${R.optionalMismatch}`;
		let n = e.children, r = t.children;
		if (!n && r || n && !r && t.value.text === "*") return `(${t.name})${R.structureMismatch}`;
		if (n && r) {
			if (e.type === I.Object) {
				if (r.length !== n.length) return `(${t.name})${R.structureMismatch}`;
				let e = r.reduce((e, t) => (e[t.name] = t, e), {});
				for (let t = 0, r = n.length; t < r; t++) {
					let r = n[t], i = e[r.name];
					if (i) {
						let e = G.matchSchemaValueByModel(r, i);
						if (e) return e;
					} else return `(${r.name})${R.requiredPrompt}`;
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
			source: n === "deconstruct" ? L.Template : L.Variable,
			text: n === "deconstruct" ? "*" : ""
		};
		if (n === "assign") return {
			...e,
			value: a,
			children: void 0
		};
		let { id: o, name: s, type: c, optional: l, children: u } = r[0];
		(i === I.Array || i === I.Map) && (r = [{
			name: n === "deconstruct" ? i === I.Array ? "0" : "???" : s,
			id: o,
			type: c,
			optional: l,
			children: u
		}]);
		let d = ft(r, {}, e.id);
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
var mt = /* @__PURE__ */ ne((/* @__PURE__ */ k(((e, t) => {
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
var ht = {
	eachDeviceAndOutput(e, t, n = Ue, r = 0) {
		let i = {
			parent: n.item,
			index: r,
			path: e.id && n.ids ? `${n.ids}⫻${e.id}` : e.id || "",
			ids: e.id && n.ids ? `${n.ids}⫻${e.id}` : e.id || "",
			level: n.level + 1,
			hasChildren: !!e.children?.length,
			root: n.root || e,
			isDevice: !0
		}, a = t(e, i);
		if (a === !0) return a;
		if (a === void 0 && e.outputSchema && z.each(e.outputSchema, t, {
			root: void 0,
			item: void 0,
			path: i.path,
			ids: i.ids,
			level: i.level + 1
		})) return !0;
		if (i.hasChildren) {
			let { path: n, ids: r, level: a, root: o } = i, s = e.children || [];
			for (let i = 0, c = s.length; i < c; i++) {
				let c = s[i];
				if (ht.eachDeviceAndOutput(c, t, {
					item: e,
					path: n,
					ids: r,
					level: a,
					root: o
				}, i)) return !0;
			}
		}
	},
	mapDeviceAndOutput(e, t, n = Ue, r = 0, i) {
		let a = {
			parent: n.item,
			index: r,
			path: e.id && n.ids ? `${n.ids}⫻${e.id}` : e.id || "",
			ids: e.id && n.ids ? `${n.ids}⫻${e.id}` : e.id || "",
			level: n.level + 1,
			hasChildren: !!e.children?.length,
			root: n.root || e,
			isDevice: !0
		}, o = t(e, i, a);
		if (delete o.children, delete o.outputSchema, e.outputSchema && (o.outputSchema = z.map(e.outputSchema, t, {
			root: void 0,
			item: void 0,
			path: a.path,
			ids: a.ids,
			level: a.level + 1
		})), a.hasChildren) {
			let { path: n, ids: r, level: i, root: s } = a;
			o.children = e.children.map((a, c) => ht.mapDeviceAndOutput(a, t, {
				item: e,
				path: n,
				ids: r,
				level: i,
				root: s
			}, c, o));
		}
		return o;
	},
	produceDeviceAndOutput(e, t, r) {
		return create$1(e, (e) => {
			let n = e;
			ht.eachDeviceAndOutput(n, t), r?.(n);
		});
	},
	flatToVariableMap(e) {
		let t = {};
		return ht.eachDeviceAndOutput(e, (e, { isDevice: n }) => {
			n || (t[e.id] = e);
		}), t;
	},
	highlightOutputs(e, t, n) {
		let r = {}, i;
		return ht.produceDeviceAndOutput(t, (t, { ids: a }) => {
			r[t.id] = t, t.id === e ? (i = a, t.folded &&= void 0, t.highlighted = !0) : (n && (t.folded = !0), t.highlighted &&= void 0);
		}, () => {
			i && i.split("⫻").forEach((e) => {
				let t = r[e];
				t.folded &&= void 0;
			});
		});
	}
};
function gt(e, t, n, r = 9999) {
	let i = 0;
	do {
		if (i++, t(e)) return e;
		e = e.parentElement;
	} while (e && e !== n && i < r);
	return null;
}
function _t(e, t) {
	let n = (e.getAttribute("class") || "").split(" ");
	n.includes(t) || n.push(t), e.setAttribute("class", n.join(" "));
}
function vt(e, t) {
	let n = (e.getAttribute("class") || "").split(" ").filter((e) => e !== t);
	e.setAttribute("class", n.join(" "));
}
function yt(e, t, n, r) {
	let i = {
		source: void 0,
		target: void 0,
		folder: void 0
	};
	return {
		onDragStart(e) {
			r?.current && e.dataTransfer.setDragImage(r.current, 0, 0);
			let t = e.target;
			_t(t, "ͼbaseflow-dragging"), i = { source: t }, n?.(t, !0);
		},
		onDragEnter(t) {
			if (!i.source) return;
			let { target: n, folder: r } = e(t.target);
			i.folder !== r && (i.folder && vt(i.folder, "drop-active"), r && _t(r, "drop-active"), i.folder = r), i.target !== n && (i.target && vt(i.target, "drop-active"), n && (_t(n, "drop-active"), t.preventDefault()), i.target = n);
		},
		onDragOver(e) {
			i.target && e.preventDefault();
		},
		onDragEnd(e) {
			i.source && (n?.(i.source, !1), vt(i.source, "ͼbaseflow-dragging")), i.target && vt(i.target, "drop-active"), i.folder && vt(i.folder, "drop-active"), i = {};
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
	closestTarget: gt,
	addClass: _t,
	removeClass: vt,
	classNames: (...e) => (0, mt.default)(...e),
	buildDragHandlers: yt
};
var bt = "Node";
var xt = {
	[I.Any]: "any",
	[I.String]: "string",
	[I.Number]: "number",
	[I.Bool]: "boolean",
	[I.Date]: "_Date_",
	[I.Time]: "_Time_",
	[I.DateTime]: "_DateTime_",
	[I.Object]: "_Object_",
	[I.Map]: "_Map_",
	[I.Array]: "_Array_",
	[I.File]: "_File_"
};
var St = " | null | undefined";
var Ct = [`declare const ${Ke}: unique symbol;
declare const ${qe}: string;
interface ${xt[I.Time]} {
  [${Ke}]: 'Time';
  toString: () => string;
};
interface ${xt[I.Date]} {
  [${Ke}]: 'Date';
  toString: () => string;
};
interface ${xt[I.DateTime]} {
  [${Ke}]: 'DateTime';
  toString: () => string;
};
interface ${xt[I.File]} {
  [${Ke}]: 'File';
  toString: () => string;
  fileName: string;
  fileSize: number;
};
type ${xt[I.Object]} = { [key: string]: any };
type ${xt[I.Map]} = { [key: string]: any };
type ${xt[I.Array]} = any[];
type _Iterator_ = number | { [key: string]: any };
type _IMapItems_<T, Keys extends keyof T = keyof T> = Keys extends any ? { [K in keyof T]: T[Keys] } : never;
function ${U._string}(value: any): string;
function ${U._number}(value: any): number;
function ${U._boolean}(value: any): boolean;
function ${U._any}(value: any): any;
function ${U._date}(value: any): ${xt[I.Date]};
function ${U._time}(value: any): ${xt[I.Time]};
function ${U._datetime}(value: any): ${xt[I.DateTime]};
function ${U._path}<T>(value: T, ...args: any[]): T;
function ${Je._createMap}<T extends {[key:string]: any}>(obj: T & (T extends _IMapItems_<T> ? unknown : never)): T;
function ${Je._loopKeyValue}<A extends number>(arr: A): {${B}: number; ${V}: number; ${H}: number};
function ${Je._loopKeyValue}<A extends any[]>(arr: A): {${B}: A[0]; ${V}: number; ${H}: number};
function ${Je._loopKeyValue}<A extends {[key: string]: any}>(arr: A): {${B}: A[0]; ${V}: string; ${H}: number};
function ${Je._arrayPush}<A extends any[]>(arr: A, ...item: A): A;
function ${Je._mappingEach}<A extends {[key: string | number]: any}, T extends number>(target: A, source: T, reduce: (${B}: number, ${V}: number, ${H}: number) => A[0]);
function ${Je._mappingEach}<A extends {[key: string | number]: any}, T extends any[]>(target: A, source: T, reduce: (${B}: T[0], ${V}: number, ${H}: number) => A[0]);
function ${Je._mappingEach}<A extends {[key: string | number]: any}, T extends {[key: string]: any}>(target: A, source: T, reduce: (${B}: T[0], ${V}: string, ${H}: number) => A[0]);
function ${Je._matchVariable}<T, U extends T>(variable: T, value: U): void;
  `];
function wt(e) {
	let t = [];
	return z.each(e, (e) => {
		e.outputSchema && t.push(`const ${e.id}: ${bt}.${e.id};`);
	}), t.join("\n");
}
var q = {
	A: "{⫻",
	B: "⫻}",
	REG: "\\{⫻([^⫻]+?)⫻\\}",
	VarTag: "CITE",
	toJSTpl(e) {
		return e ? `\`${e.replace(new RegExp(q.REG, "g"), (e, t) => `\${${t}}`)}\`` : "";
	},
	hasVariable(e) {
		return new RegExp(q.REG).test(e);
	},
	extractVariable(e) {
		return e.match(new RegExp(q.REG, "g"))?.map((e) => e.slice(2, -2));
	},
	wrapVariable(e) {
		return `${q.A}${e}${q.B}`;
	},
	getPureValue(e) {
		let t = q.extractVariable(e);
		return t ? t.length === 1 && q.wrapVariable(t[0]) === e ? t[0] : "" : e;
	},
	getSingleVariable(e) {
		let t = q.extractVariable(e);
		return t && t.length === 1 && q.wrapVariable(t[0]) === e ? t[0] : "";
	}
};
function Tt(e) {
	return !!(Pe[e.source] && e.text);
}
function Et(e) {
	return !!(Me[e.type] && e.name);
}
function Dt(e) {
	return !!(e.value && Pe[e.value.source] && e.name);
}
function Ot(e, t, n, r = { current: 0 }, i = "") {
	let a = `${i}const v${r.current++}`;
	if (t) n.push(`${a}: _Iterator_ = ${e.text || "null"};`);
	else {
		let t = `${a}: ${xt[e.type]}${e.optional ? St : ""} = `;
		if (e.text) {
			if (e.source !== L.Template) n.push(`${t}${e.text};`);
			else if (e.text !== "*") {
				let r = q.extractVariable(e.text);
				r && (r.length === 1 && q.wrapVariable(r[0]) === e.text ? n.push(`${t}${r[0]};`) : r.forEach((e) => {
					n.push(`${i}${e};`);
				}));
			}
		} else n.push(`${t}null;`);
	}
}
function kt(e, t, n, r = 0, i = "") {
	let a = "    ".repeat(r), o = G.valueModeIsMapping(e);
	if (Ot(e.value, o, t, n, a), o) {
		t.push(`${a}{`);
		let { text: n, source: r } = e.value;
		if (!n || r !== L.Variable && /\D/.test(n) || new RegExp(Ge).test(n) && !i) t.push(`${a}    const ${We} = undefined;`), t.push(`${a}    const ${H} = undefined;`), t.push(`${a}    const ${B} = undefined;`), t.push(`${a}    const ${V} = undefined;`), i = "";
		else if (/\D/.test(n)) {
			let e = n.replace(new RegExp(Ge), i);
			t.push(`${a}    const ${We} = ${e};`), t.push(`${a}    const {${H}, ${B}, ${V}} = ${Je._loopKeyValue}(${We});`), i = `${e}[0]`;
		} else t.push(`${a}    const ${We}: number[] = null as any;`), t.push(`${a}    const ${H}: number = null as any;`), t.push(`${a}    const ${B}: number = null as any;`), t.push(`${a}    const ${V}: number = null as any;`), i = "";
	}
	let s = e.children;
	if (s) for (let e = 0, a = s.length; e < a; e++) kt(s[e], t, n, o ? r + 1 : r, i);
	o && t.push(`${a}}`);
}
function At(e, t) {
	let n = { current: 0 };
	for (let r in e) {
		let i = e[r];
		i && typeof i == "object" && (Dt(i) ? kt(i, t, n) : Tt(i) ? Ot(i, !1, t, n, "") : Et(i) || At(i, t));
	}
}
function jt(e) {
	let t = [];
	return At(e, t), t;
}
function Mt(e, t = []) {
	return e && (/\D/.test(e) ? (t.push(`const ${We} = ${e};`), t.push(`const {${H}, ${B}, ${V}} = ${Je._loopKeyValue}(${We});`)) : (t.push(`const ${We}: number[] = null as any;`), t.push(`const ${H}: number = null as any;`), t.push(`const ${B}: number = null as any;`), t.push(`const ${V}: number = null as any;`))), t.join("\n");
}
function Nt(e, t, n) {
	let r = [];
	return Mt(t, r), Ot(e, n, r), r.join("\n");
}
function Pt(e, t, n, r, i, a) {
	let o = " ".repeat((t - 1) * 2);
	if (n) {
		let n = e[0];
		return n.type === I.Array ? (r.push(`${o}Array<`), Pt(n.children || [], t + 1, !0, r, `${i + "⫻" + (n.optional ? "?" : "!")}0`, n), r.push(`${o}${n.optional ? St : ""}>`)) : n.type === I.Object || n.type === I.Map ? (r.push(`${o}Array<{`), Pt(n.children || [], t + 1, !1, r, `${i + "⫻" + (n.optional ? "?" : "!")}0`, n), r.push(`${o}}${n.optional ? St : ""}>`)) : n.optional ? r.push(`${o}(${xt[n.type]} | null)[]`) : r.push(`${o}${xt[n.type]}[]`), r;
	}
	{
		let n = a?.type === I.Map;
		return e.forEach((e) => {
			let a = i ? `${i}⫻${e.optional ? "?" : "!"}${e.name}` : `${e.optional ? "?" : "!"}${e.name}`;
			n || r.push(`${o}/** [@${a.substring(1).replace(/* @__PURE__ */ RegExp("⫻[?!]+", "g"), "->").replace(/([[\]])/g, "\\$1")}](@/${a.replace(/([()])/g, "\\$1")}) */`);
			let s = e.optional ? St : "", c = t === 1 ? `${o}type ${e.name} = ` : n ? `${o}[key: string]: ` : `${o}"${e.name.replace(/"/g, "\\\"")}"${e.optional ? "?" : ""}: `;
			if (e.type === I.Object || e.type === I.Map) r.push(`${c}{`), Pt(e.children || [], t + 1, !1, r, a, e), r.push(`${o}}${s};`);
			else if (e.type === I.Array) {
				let n = (e.children || [])[0] || {
					name: "*",
					type: I.Any
				};
				n.type === I.Object || n.type === I.Map ? (r.push(`${c}Array<{`), Pt(n.children || [], t + 1, !1, r, `${a + "⫻" + (n.optional ? "?" : "!")}0`, n), r.push(`${o}}${n.optional ? St : ""}>${s};`)) : n.type === I.Array ? (r.push(`${c}Array<`), Pt(n.children || [], t + 1, !0, r, `${a + "⫻" + (n.optional ? "?" : "!")}0`, n), r.push(`${o}${n.optional ? St : ""}>${s};`)) : n.optional ? r.push(`${c}(${xt[n.type]} | null)[]${s};`) : r.push(`${c}${xt[n.type]}[]${s};`);
			} else r.push(`${c}${xt[e.type]}${s};`);
		}), r;
	}
}
function Ft(e) {
	return Pt(e, 1, !1, [], "", null);
}
function It(e, t, n, r = 0, i = !1) {
	let a = " ".repeat(r * 2), o = G.getValueMode(e), { name: s, children: c } = e, { type: l, text: u, source: d } = e.value, f = s === "*" ? "0" : s.replace(/"/g, "\\\""), p = i || r === 0 ? `${a}` : `${a}"${f}": `, m = r === 0 ? n : `${n}["${f}"]`, h = r === 0 ? "" : ",";
	if (o === "assign") t.push(`${p}${d === L.Template ? "'' as any" : u || "null"}${h}`);
	else if (o === "deconstruct") {
		let e = l === I.Array;
		t.push(`${p}${e ? `${Je._arrayPush}(${m}!, ` : "{"}`), c?.forEach((n) => {
			It(n, t, m, r + 1, e);
		}), t.push(`${a}${e ? ")" : "}"}${h}`);
	} else o === "mapping" && (t.push(`${p}${Je._mappingEach}(${m}!, ${u || "null"}, (${B}, ${V}, ${H}) => (`), c?.forEach((e) => {
		It(e, t, m, r + 1, !0);
	}), t[t.length - 1] = t[t.length - 1].replace(/,$/, ""), t.push(`)${a})${h}`));
}
function Lt(e) {
	let { variable: t } = et.matchVariable(e.path);
	if (e.value) {
		let n = [];
		return It(e.value, n, t), `    ${Je._matchVariable}(${t}, ${n.join("\n")});`;
	}
	return `    ${Je._matchVariable}(${t}, undefined);`;
}
var Rt = {
	NodeFlag: Be,
	NodeNamespace: bt,
	systemDTS: Ct,
	superInputToInspector: Nt,
	propsToInspector: jt,
	contextToInspector: Mt,
	deviceToVariable: wt,
	schemaToDTS: Ft,
	schemaValueToSRC: Lt
};
var zt = {
	locale: "",
	monacoEditorUrl: "/monaco/index.html"
};
function Bt({ locale: e, lang: t, monacoEditorUrl: n, expressionUtils: r }) {
	t && Object.assign(R, t), e && (zt.locale = e), n && (zt.monacoEditorUrl = n), r && Qe(r);
}
function Vt() {
	return zt.locale;
}
var Ht = { validateContextExpression: 50 };
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
			this.iframe = e, e.className = "ͼbaseflow-sr-monaco", e.src = zt.monacoEditorUrl, document.body.appendChild(e), this.proxy = new Promise((e, t) => {
				this.callback = {
					resolve: e,
					reject: t
				};
			});
		}
		init(e) {
			this.tsServer = e, e.ss(Rt.systemDTS.join("\n")), this.callback.resolve({
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
				}, Ht.validateContextExpression),
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
				t.push(ze + n), t.push("{"), t.push(r.validator), t.push("}");
			}
			let n = t.join("\n");
			this.tsServer?.ce(n, ze).then((t) => {
				for (let n in e) e[n].callback(t[n] || "");
			});
		}
	}
	window[je] = {
		createUID: () => (e++, e),
		initTSServer: (e) => {
			t && t.init(e);
		},
		createValidateProvider() {
			return t ||= new n(), t;
		}
	};
}
var Ut = window[je];
var J = {
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
function Wt(e) {
	Object.assign(J, e);
}
G.createSchemaValueByModel;
var Kt = class {
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
function qt(e, t = 0) {
	let n = null;
	return ((...r) => {
		n && clearTimeout(n), n = setTimeout(() => {
			n = null, e(...r);
		}, t);
	});
}
function Jt(e) {
	return typeof e == "object" && typeof e.then == "function";
}
function Yt(e, t = "id") {
	return e.reduce((e, n) => {
		let r = n[t];
		return e[r] = n, e;
	}, {});
}
function Xt(e, t) {
	return Number(e.toFixed(t));
}
function Zt(e, t) {
	if (t) {
		for (let n in t) if (e[n] !== t[n]) return !0;
	}
	return !1;
}
function Qt(e, t) {
	let n = 1, r = t + n;
	for (; e[r];) n++, r = t + n;
	return r;
}
var $t = class {
	limit = 20;
	undoList = [];
	redoList = [];
	running = !1;
	lock = 0;
	graph;
	constructor(e) {
		this.graph = e;
	}
	getState() {
		return {
			undoAble: this.undoList.length > 0,
			redoAble: this.redoList.length > 0
		};
	}
	push(e) {
		this.running || this.lock || (this.lock = setTimeout(() => {
			this.lock = 0;
		}, ie.historyLock), this.undoList.unshift(e), this.redoList.length = 0, this.undoList.length > this.limit && (this.undoList.length = this.limit), this.graph.dispatch("historyChanged", this.getState()));
	}
	undo() {
		if (!this.running && this.undoList.length > 0) {
			let e = this.undoList.shift();
			return this.redoList.unshift(this.graph.toHistoryItem()), this.graph.dispatch("historyChanged", this.getState()), this.running = !0, this.graph.restoreHistory(e), this.running = !1, e;
		}
	}
	redo() {
		if (!this.running && this.redoList.length > 0) {
			let e = this.redoList.shift();
			return this.undoList.unshift(this.graph.toHistoryItem()), this.graph.dispatch("historyChanged", this.getState()), this.running = !0, this.graph.restoreHistory(e), this.running = !1, e;
		}
	}
};
var en = class {
	_state = "disable";
	_data;
	_result;
	graph;
	_successed;
	fetch;
	constructor(e, t, n) {
		this.graph = e, this._successed = t, this.fetch = n;
	}
	setData(e) {
		this._data = e, this._state === "disable" && this._successed !== e ? (this._state = "enable", this.graph.dispatch("saverChanged", this._state)) : this._state === "enable" && this._successed === e && (this._state = "disable", this.graph.dispatch("saverChanged", this._state));
	}
	doSave = () => {
		if (this.graph.hasBusy()) {
			setTimeout(this.doSave, ie.saveToApi);
			return;
		}
		if (this._data) {
			let e = this._data;
			this._data = void 0, this.fetch(e).then(() => {
				this._successed = e, this._state = this._data && this._data !== e ? "enable" : "disable", this.graph.dispatch("saverChanged", this._state), this._result?.resolve(), this._result = void 0;
			}, (t) => {
				this._data ||= e, this._state = this._successed === this._data ? "disable" : "enable", this.graph.dispatch("saverChanged", this._state), this._result?.reject(t), this._result = void 0;
			});
		} else this._state = "disable", this.graph.dispatch("saverChanged", this._state), this._result?.resolve(), this._result = void 0;
	};
	save = () => {
		if (this._state !== "saving") return this._state = "saving", this.graph.dispatch("saverChanged", this._state), setTimeout(this.doSave, ie.saveToApi), new Promise((e, t) => {
			this._result = {
				resolve: e,
				reject: t
			};
		});
	};
	getState() {
		return this._state;
	}
};
var tn = class extends Kt {
	_graphData;
	_nodeMap = {};
	_dataMap = {};
	_nodeErrors;
	_hooks;
	validateServer;
	_unlinks = [];
	_currentNode;
	#e;
	#t;
	#n = 0;
	#r;
	#i;
	constructor(e, t, n) {
		super({
			dataChanged: {},
			statusChanged: {},
			nodeDataChanged: {},
			triggersChanged: {},
			layoutChanged: {},
			layoutRendered: {},
			historyChanged: {},
			saverChanged: {},
			selectedChanged: {},
			currentNodeChanged: {},
			currentInputChanged: {},
			refreshNodePanel: {},
			viewportZoomed: {},
			viewportResized: {}
		}), this._graphData = e, this._hooks = t, this.validateServer = n, this.#e = new $t(this), this.#a(e.nodes, e.triggers, "init"), xe(this._graphData), this.#t = new en(this, e, (e) => ke(e).then((e) => this._hooks.onSave(e)));
		let { dts: r } = this.toInspectCode();
		n.tsServer.st(r);
	}
	#a(e, t, n) {
		let r = e.concat(t);
		if (n === "restore") {
			this.#i &&= (clearTimeout(this.#i.timer), void 0), this.#n &&= (clearTimeout(this.#n), 0);
			let e = this._dataMap, t = this._nodeMap;
			this._nodeMap = r.filter((t) => t === e[t.id]).reduce((e, n) => (e[n.id] = t[n.id], e), {});
		}
		let i, a, o, s;
		e.length !== this._graphData.nodes.length && (i = {}, a = {}), t.length !== this._graphData.triggers.length && (i = {}, o = {});
		let c = this._dataMap, l = this._nodeMap;
		this._dataMap = {}, this._nodeMap = {};
		let u = this._nodeErrors;
		if (this._nodeErrors = void 0, r.forEach((e) => {
			e.type === j.Flow ? this._flowNode = e : e.type === j.Start ? this._startNode = e : e.type === j.End && (this._endNode = e);
			let t = e.id, n = e.meta.configurationErrors || e.meta.referenceErrors || e.meta.collaboratorMessages && "Unprocessed messages...";
			n && (this._nodeErrors ||= {}, this._nodeErrors[t] = n), this._dataMap[t] = e, this._nodeMap[t] = l[t] || this.createNode(t), e !== c[t] && (i ||= {}, i[t] = e, e.type === j.Trigger ? (o ||= {}, o[t] = e) : (a ||= {}, a[t] = e));
		}), n === "update" && i) for (let e in i) {
			let t = i[e], n = c[e];
			if (n) {
				let r = t.meta, i = n.meta, a = t.props, o = n.props, c = this._nodeMap[e];
				c.rebuildGetSet(), r !== i && ((r.height !== i.height || r.width !== i.width) && this._flowLayout.refreshNodeSize(e), [
					"name",
					"summary",
					"remark",
					"mockState",
					"asyncState",
					"referenceErrors",
					"configurationErrors",
					"collaboratorMessages"
				].some((e) => r[e] !== i[e]) && this.#f(e), r.outputSchema !== i.outputSchema && c.clearCache("dts"), r.valueReference !== i.valueReference && c.clearCache("src"), r.mockState !== i.mockState && c.clearCache("mock"), !r.mockState != !i.mockState && (s ||= {}, s[e] = t)), a !== o && (c.clearCache("refs"), s ||= {}, s[e] = t);
			} else s ||= {}, s[e] = t;
		}
		return {
			changed: i,
			executorsChanged: a,
			triggersChanged: o,
			propsChanged: s,
			statusChanged: !u != !this._nodeErrors
		};
	}
	updateNodes(e, t, n = {}) {
		let r = e.concat(t), i = this._dataMap, { changed: a, executorsChanged: o, triggersChanged: s, propsChanged: c, statusChanged: l } = this.#a(e, t, "update");
		if (a) {
			if (!n.noHistory) {
				let e = this.toHistoryItem();
				this.#e.push(e);
			}
			let u = this._graphData.sources, d = {};
			r.forEach((e) => {
				d[e.tag] = u[e.tag];
			});
			let f = { ...this._graphData };
			f.sources = d, o && (f.nodes = e), s && (f.triggers = t), this._graphData = f, xe(this._graphData), this.dispatch("nodeDataChanged", { changed: a }), this.#t.setData(this._graphData), this.rebuildGetSet(), this.dispatch("dataChanged", this._graphData), l && this.dispatch("statusChanged", this.getStatus()), n.validate && (this.#l(), c && this.#d(c, i));
		}
	}
	restoreHistory(e) {
		let { graphData: t, layoutData: n, viewport: r, selected: i } = e, a = this._graphData.layout !== t.layout, o = this._graphData.triggers !== t.triggers, { statusChanged: s } = this.#a(t.nodes, t.triggers, "restore");
		this._graphData = t, xe(this._graphData);
		let { dts: c } = this.toInspectCode();
		this.validateServer.tsServer.st(c), o && this.dispatch("triggersChanged", t.triggers), a ? this.dispatch("layoutChanged", {
			layout: t.layout,
			layoutData: n,
			viewport: r
		}) : this._flowLayout.setData(n, r), this.#t.setData(this._graphData), this.rebuildGetSet(), this.dispatch("dataChanged", this._graphData), s && this.dispatch("statusChanged", this.getStatus()), this.historySelect(i || "");
	}
	#o(e, t, n) {
		let r = this._dataMap[e], i = Zt(r.meta, t), a = Zt(r.props, n);
		if (!i && !a) return {
			newData: r,
			needValidate: !1
		};
		let o = { ...r }, s = !1;
		if (a && (o.props = {
			...o.props,
			...n
		}, s = !0), i) {
			o.meta = {
				...o.meta,
				...t
			};
			let e = t?.outputSchema;
			e && (e.name = o.id), s || ("outputSchema" in t || "returnSchema" in t || "valueReference" in t || "mockState" in t) && (s = !0);
		}
		return {
			newData: o,
			needValidate: s
		};
	}
	#s = () => {
		let e = this.#i.nodes;
		this.#i = void 0;
		let t = !1, [n, r] = [this._graphData.nodes, this._graphData.triggers].map((n) => n.map((n) => {
			let r = e[n.id];
			if (r) {
				let { newData: e, needValidate: i } = this.#o(n.id, r.meta, r.props);
				return i && (t = !0), e;
			}
			return n;
		}));
		this.updateNodes(n, r, { validate: t });
	};
	updateNodeData(e, t, n) {
		this.#i ||= {
			timer: setTimeout(this.#s, ie.nodeDataUpdate),
			nodes: {}
		};
		let r = this.#i.nodes;
		r[e] || (r[e] = {});
		let i = r[e];
		t && (i.meta ||= {}, Object.assign(i.meta, t)), n && (i.props ||= {}, Object.assign(i.props, n));
	}
	#c = () => {
		let e = this.#r.nodes;
		this.#r = void 0;
		let [t, n] = [this._graphData.nodes, this._graphData.triggers].map((t) => t.map((t) => {
			let n = e[t.id];
			return n && (n.collaboratorMessages !== t.meta.collaboratorMessages && (n.collaboratorMessages &&= {
				...t.meta.collaboratorMessages,
				...n.collaboratorMessages
			}), n.configurationErrors !== t.meta.configurationErrors || n.referenceErrors !== t.meta.referenceErrors || n.collaboratorMessages !== t.meta.collaboratorMessages) ? {
				...t,
				meta: {
					...t.meta,
					...n
				}
			} : t;
		}));
		this.updateNodes(t, n, { noHistory: !0 });
	};
	updateNodeError(e, t) {
		this.#r ||= {
			timer: setTimeout(this.#c, ie.nodeDataUpdate),
			nodes: {}
		};
		let n = this.#r.nodes;
		n[e] || (n[e] = {});
		let r = n[e];
		r.configurationErrors = t;
	}
	sendNodeMessages(e, t, n) {
		this.#r ||= {
			timer: setTimeout(this.#c, ie.nodeDataUpdate),
			nodes: {}
		};
		let r = this.#r.nodes;
		r[e] || (r[e] = {});
		let i = r[e];
		i.collaboratorMessages ||= {}, i.collaboratorMessages[t] = n;
	}
	clearNodeMessages(e) {
		this.#r ||= {
			timer: setTimeout(this.#c, ie.nodeDataUpdate),
			nodes: {}
		};
		let t = this.#r.nodes;
		t[e] || (t[e] = {});
		let n = t[e];
		n.collaboratorMessages = void 0;
	}
	#l() {
		this.#n && clearTimeout(this.#n), this.#n = setTimeout(() => {
			this.#n = 0, this.#i ? this.#l() : this.#u();
		}, ie.validateReference);
	}
	#u() {
		let { dts: e, ts: t, flag: n } = this.toInspectCode();
		this.validateServer.tsServer.cd(e, t, n).then((e) => {
			console.log("commitValidateReference"), console.log(e);
			let t = !1, [n, r] = [this._graphData.nodes, this._graphData.triggers].map((n) => n.map((n) => {
				if (Object.hasOwn(e, n.id)) {
					let r = e[n.id];
					if (n.meta.referenceErrors !== r) return t = !0, {
						...n,
						meta: {
							...n.meta,
							referenceErrors: r
						}
					};
				}
				return n;
			}));
			t && this.updateNodes(n, r, { noHistory: !0 });
		});
	}
	#d(e, t) {
		let n = [];
		Object.keys(this._dataMap).forEach((r) => {
			if (e[r]) {
				let e = this._dataMap[r], i = t[r], a = i ? Object.keys(e.props).filter((t) => e.props[t] !== i.props[t]) : Object.keys(e.props), o = be(this._graphData.sources[e.tag]), s = e.meta.mockState ? void 0 : o.validate?.(e, a) || void 0;
				s && n.push(s.then((e) => ({
					id: r,
					result: e
				})));
			}
		}), Oe(this._graphData.nodes, this._graphData.triggers, n).then((e) => {
			e && this.updateNodes(e.nodes, e.triggers, { noHistory: !0 });
		});
	}
	#f(e) {
		let t = this._dataMap[e];
		t.type === j.Trigger ? this._triggerLayout.refreshNodeUI(t) : this._flowLayout.refreshNodeUI(e);
	}
	#p() {
		return this._flowLayout.getViewport();
	}
	toHistoryItem() {
		return {
			graphData: this._graphData,
			layoutData: this._flowLayout.getData(),
			viewport: this.#p(),
			selected: this._currentNode?.nodeId
		};
	}
	hasBusy() {
		return !!(this.#n || this.#i);
	}
	undo() {
		this.#e.undo();
	}
	redo() {
		this.#e.redo();
	}
	getErrors() {
		return this._nodeErrors;
	}
	getStatus() {
		return this._nodeErrors ? "error" : "normal";
	}
	save() {
		return this.#t.save();
	}
	getSaverState() {
		return this.#t.getState();
	}
	getGraphData() {
		return this._graphData;
	}
	setFlowLayout(e) {
		this._flowLayout = e;
	}
	setTriggerLayout(e) {
		this._triggerLayout = e;
	}
	isInited() {
		return !!this._flowLayout;
	}
	setLayout(e) {
		if (this._graphData.layout !== e) {
			let t = this.toHistoryItem();
			this.#e.push(t);
			let { nodes: n, sources: r, triggers: i, extend: a } = this._graphData;
			this._graphData = {
				nodes: n,
				sources: r,
				layout: e,
				triggers: i,
				extend: a
			}, this.dispatch("layoutChanged", { layout: e }), this.#t.setData(this._graphData), this.rebuildGetSet(), this.dispatch("dataChanged", this._graphData);
		}
	}
	setReturnSchema(e) {
		this.updateNodeData(this._flowNode.id, { outputSchema: e }), this._graphData.nodes.forEach((e) => {
			(e.type === j.End || e.type === j.Return) && this.sendNodeMessages(e.id, "$", "ReturnSchema has changed and needs to be confirmed");
		});
	}
	setInputSchema(e) {
		this.updateNodeData(this._startNode.id, { outputSchema: e }), this._graphData.triggers.forEach((e) => {
			this.sendNodeMessages(e.id, "$", "InputSchema has changed and needs to be confirmed");
		});
	}
	dispose() {
		this._unlinks.forEach((e) => {
			e();
		});
	}
};
function nn(e, t, n) {
	let r = e[t], i = r.childrenIds;
	i.length && i.forEach((t) => {
		n(e[t], r), nn(e, t, n);
	});
}
function rn(e, t) {
	return e.map((e) => {
		let n = t[e], r = n.childrenIds;
		return delete n.childrenIds, r.length && (n.children = rn(r, t)), n;
	});
}
var an = {
	jsonToGraph(e) {
		let { layout: t, sources: n, nodes: r, triggers: i, extend: a } = e;
		return {
			layout: t,
			sources: n,
			triggers: i.map((e) => {
				let t = {
					...e,
					parentId: "",
					childrenIds: []
				};
				return t.props = t.props || {}, delete t.children, t;
			}),
			nodes: z.list(r, (e, t, { parent: n }) => {
				let r = {
					...e,
					parentId: n?.id || "",
					childrenIds: []
				};
				return r.props = r.props || {}, delete r.children, t && t.childrenIds.push(e.id), r;
			}),
			extend: a
		};
	},
	graphToJson(e) {
		let { layout: t, sources: n, triggers: r, extend: i } = e, a = {}, o = null;
		e.nodes.forEach((e) => {
			let { id: t, tag: n, folded: r, meta: i, props: s, type: c, parentId: l, childrenIds: u } = e, { name: d, summary: f, remark: p, width: m, height: h, asyncState: g, mockState: _, valueReference: v, outputSchema: y, referenceErrors: b, configurationErrors: x } = i, S = {
				id: t,
				tag: n,
				folded: r,
				meta: {
					name: d,
					summary: f,
					remark: p,
					width: m,
					height: h,
					asyncState: g,
					mockState: _,
					valueReference: v,
					outputSchema: y,
					referenceErrors: b,
					configurationErrors: x
				},
				props: s,
				type: c,
				parentId: l,
				childrenIds: u
			};
			delete S.parentId, delete S.type, a[e.id] = S, e.parentId || (o = S);
		});
		let s = o.childrenIds;
		return delete o.childrenIds, o.children = rn(s, a), JSON.parse(JSON.stringify({
			layout: t,
			sources: n,
			triggers: r,
			extend: i,
			nodes: o
		}));
	}
};
var on = class extends Kt {
	_node;
	__node__;
	_dts = void 0;
	_refs = void 0;
	_mock = void 0;
	_src = void 0;
	id;
	graph;
	constructor(e, t) {
		super({
			selected: {},
			unselected: {},
			showMenu: {}
		}), this.id = e, this.graph = t, this._node = this.toINode(), this.__node__ = this.splitGetSet();
	}
	toINode() {
		return {
			getId: () => this.id,
			getData: this.getData.bind(this),
			getType: this.getType.bind(this),
			getTag: this.getTag.bind(this),
			getSize: this.getSize.bind(this),
			getConfig: this.getConfig.bind(this),
			getStatus: this.getStatus.bind(this),
			getName: this.getName.bind(this),
			getSummary: this.getSummary.bind(this),
			getRemark: this.getRemark.bind(this),
			getDom: this.getDom.bind(this),
			getSource: this.getSource.bind(this),
			getChildrenIds: this.getChildrenIds.bind(this),
			getChildrenLength: this.getChildrenLength.bind(this),
			getParentId: this.getParentId.bind(this),
			getErrors: this.getErrors.bind(this),
			hasError: this.hasError.bind(this),
			setMockState: this.setMockState.bind(this),
			setAsyncState: this.setAsyncState.bind(this),
			isTrigger: this.isTrigger.bind(this),
			isContainer: this.isContainer.bind(this),
			isRoute: this.isRoute.bind(this),
			isFork: this.isFork.bind(this),
			isFolded: this.isFolded.bind(this),
			isDefaultBranch: this.isDefaultBranch.bind(this),
			resetId: this.resetId.bind(this),
			updateProps: this.updateProps.bind(this),
			updateMeta: this.updateMeta.bind(this),
			updateOutputSchema: this.updateOutputSchema.bind(this),
			updateErrors: this.updateErrors.bind(this),
			fold: this.fold.bind(this),
			showMenu: this.showMenu.bind(this),
			refreshUI: this.refreshUI.bind(this),
			remove: this.remove.bind(this)
		};
	}
	splitGetSet() {
		let e = this._node, t = {}, n = {};
		return Object.keys(e).forEach((r) => {
			/^(get|is|has)[A-Z]/.test(r) ? t[r] = e[r] : n[r] = e[r];
		}), [t, n];
	}
	rebuildGetSet() {
		this.__node__[0] = this.splitGetSet()[0];
	}
	refreshUI() {
		this.graph.dispatch("refreshNodePanel", this.id);
	}
	setMockState(e) {
		if (!M.mockAble(this.getType())) return P.nodeCannotBeDisable;
		this.updateMeta({ mockState: e || void 0 });
	}
	setAsyncState(e) {
		this.updateMeta({ mockState: e || void 0 });
	}
	getINode() {
		return this._node;
	}
	getTNode() {
		return this.__node__;
	}
	getGraph() {
		return this.graph.getIGraph();
	}
	getData() {
		return this.graph.getNodeDataById(this.id);
	}
	getConfig() {
		return this.graph.getNodeConfigById(this.id);
	}
	getName() {
		return this.getData().meta.name || this.id;
	}
	getSummary() {
		return this.getData().meta.summary || "";
	}
	getRemark() {
		return this.getData().meta.remark || "";
	}
	getSize() {
		let { width: e, height: t } = this.getData().meta;
		return {
			width: e,
			height: t
		};
	}
	getType() {
		return this.getData().type;
	}
	getTag() {
		return this.getData().tag;
	}
	getChildrenIds() {
		return this.getData().childrenIds;
	}
	getChildren() {
		return this.getChildrenIds().map((e) => this.graph.get_NodeById(e));
	}
	getChildrenLength() {
		return this.getData().childrenIds.length;
	}
	getParentId() {
		return this.getData().parentId;
	}
	getParent() {
		let e = this.getParentId();
		return e ? this.graph.get_NodeById(e) : null;
	}
	getSource() {
		return this.graph.getNodeSourceById(this.id);
	}
	getErrors() {
		let e = this.getData();
		return {
			referenceErrors: e.meta.referenceErrors,
			configurationErrors: e.meta.configurationErrors
		};
	}
	getStatus() {
		return this.hasError() ? "error" : "normal";
	}
	getDom() {
		return this.graph.getNodeDomById(this.id);
	}
	isFirst() {
		let e = this.getParentId();
		return !e || this.graph.getNodeDataById(e).childrenIds[0] === this.id;
	}
	isLast() {
		let e = this.getParentId();
		if (e) {
			let t = this.graph.getNodeDataById(e).childrenIds;
			return t[t.length - 1] === this.id;
		}
		return !0;
	}
	isTrigger() {
		return this.getData().type === j.Trigger;
	}
	isContainer() {
		return M.isContainer(this.getType());
	}
	isRoute() {
		return M.isRoute(this.getType());
	}
	isFork() {
		return M.isFork(this.getType());
	}
	isDefaultBranch() {
		return this.getData().type === j.Branch && this.isLast();
	}
	isFolded() {
		return !!this.getData().folded;
	}
	hasError() {
		let e = this.getData();
		return !!(e.meta.referenceErrors || e.meta.configurationErrors);
	}
	getMockState() {
		return this.getData().meta.mockState;
	}
	fold(e) {
		this.graph.foldNode(this.id, e);
	}
	updateProps(e) {
		this.graph.updateNodeData(this.id, void 0, e);
	}
	updateMeta(e) {
		this.graph.updateNodeData(this.id, e, void 0);
	}
	updateOutputSchema = (e) => {
		this.updateMeta({ outputSchema: e });
	};
	updateErrors(e) {
		this.graph.updateNodeError(this.id, e);
	}
	clearMessages() {
		this.graph.clearNodeMessages(this.id);
	}
	resetId(e) {
		return this.graph.resetNodeId(this.id, e);
	}
	remove() {
		this.graph.deleteNodes([this.id]);
	}
	showMenu() {
		this.dispatch("showMenu", void 0);
	}
	getDTS() {
		if (this._dts === void 0) {
			let e = this.getData(), t = e.meta.outputSchema;
			if (t) {
				if (!z.find(t, (e) => !!e.direct)) {
					let e = Rt.schemaToDTS([{
						...t,
						name: this.id
					}]), n = {};
					this._dts = {
						types: e.join("\n"),
						varMap: n
					};
					let r = W.toSchemaModelTreeWithJsObject({
						...t,
						name: this.id
					}, "");
					z.each(r, (e) => {
						n[e.id] = e;
					});
				}
			} else this._dts = {
				types: `type ${e.id} = undefined;`,
				varMap: {}
			};
		}
		return this._dts;
	}
	getSRC() {
		if (this._src === void 0) {
			this._src = "";
			let e = this.getData().meta.valueReference;
			e && (this._src = Rt.schemaValueToSRC(e));
		}
		return this._src;
	}
	getRefs() {
		if (this._refs === void 0) {
			this._refs = [];
			let e = this.getData().props;
			e && Object.keys(e).length > 0 && (this._refs = Rt.propsToInspector(e));
		}
		return this._refs;
	}
	getMock() {
		if (this._mock === void 0) {
			this._mock = [];
			let e = this.getData().meta.mockState;
			e && typeof e == "object" && (this._mock = Rt.propsToInspector({ mock: e }));
		}
		return this._mock;
	}
	clearCache(e) {
		this[`_${e}`] = void 0;
	}
};
var sn = class extends tn {
	#e = Date.now().toString();
	#t = this.#r();
	#n = this.#i();
	_options;
	_selectedNodes = [];
	_state = "Editable";
	_currentInput;
	_lastLogs;
	_container;
	_onShowCreater;
	constructor(e, t, n, r, i, a) {
		super(e, r, a), r.setGraph(this.#t), this._container = t, this._onShowCreater = n, this._options = i, this._state = this._options.readonly === 1 ? "ReadOnly" : this._options.readonly === 2 ? "NodeOnly" : "Editable";
	}
	createNode(e) {
		return new on(e, this);
	}
	fetchLogsList() {
		return this._hooks.onFetchLogsList();
	}
	fetchLogsItem(e) {
		return this._hooks.onFetchLogsItem(e);
	}
	getState() {
		return this._state;
	}
	getSelected() {
		return this._selectedNodes;
	}
	getSelectedIds() {
		return this._selectedNodes.map((e) => e.id);
	}
	getContainer() {
		return this._container;
	}
	setCenterNode(e, t) {
		!e && this._nodeErrors && (e = Object.keys(this._nodeErrors)[0], t === void 0 && (t = !0)), e ||= this._startNode.id, t && this.reselect(e), this._flowLayout.setCenter(e, t);
	}
	setLastLogs(e) {
		this._lastLogs = e;
	}
	getTriggers() {
		return this._graphData.triggers;
	}
	get_NodeById(e) {
		return this._nodeMap[e];
	}
	getNodeById(e) {
		return this._nodeMap[e]?.getINode();
	}
	getNodeDataById(e) {
		return this._dataMap[e];
	}
	getNodeConfigById(e) {
		let t = this._dataMap[e] || {};
		return be(this._graphData.sources[t.tag]);
	}
	getNodeConfigByTag(e) {
		return be(this._graphData.sources[e]);
	}
	getNodeDataMaps() {
		return { ...this._dataMap };
	}
	getNodeSourceById(e) {
		let t = this._dataMap[e] || {}, n = this._graphData.sources[t.tag], r = be(n), [i, a] = n.split("@").filter(Boolean);
		return n.startsWith("@") && (i = `@${i}`), a ||= "*", {
			name: i,
			formalVersion: a,
			actualVersion: r.version
		};
	}
	getVariableSchema(e) {
		let { variable: t } = et.matchVariable(e), n = this._currentNode?.runtimeVariableMaps[t.replace(/!$/, "")];
		if (n) return W.filterArraySpecific(n);
	}
	getInputSchema() {
		return this._startNode.meta.outputSchema;
	}
	getReturnSchema() {
		return this._flowNode.meta.outputSchema;
	}
	getLastLogs() {
		return this._lastLogs;
	}
	getNodeDomById(e) {
		return document.getElementById(`bf_nd_${e}`);
	}
	getZoom() {
		return this.getViewport().zoom;
	}
	zoomIn() {
		let e = this.getZoom(), t = Math.min(Xt(e + .2, 1), 1);
		e !== t && (this._flowLayout.zoomTo(t), this.dispatch("viewportZoomed", t));
	}
	zoomOut() {
		let e = this.getZoom(), t = Math.max(Xt(e - .2, 1), .2);
		e !== t && (this._flowLayout.zoomTo(t), this.dispatch("viewportZoomed", t));
	}
	zoomFit() {
		let e = this.getZoom(), t = Xt(this._flowLayout.zoomFit(), 1);
		e !== t && this.dispatch("viewportZoomed", t);
	}
	eachChildrenData(e, t) {
		nn(this._dataMap, e, t);
	}
	uploadNodeData(e) {
		let t = this._dataMap[e];
		if (!t) throw ge(P.nodeNotExist, { node: e });
		return this._hooks.onUploadNodeData(t);
	}
	downloadNodeData(e) {
		let t = this._dataMap[e];
		if (!t) throw ge(P.nodeNotExist, { node: e });
		return this._hooks.onDownloadNodeData(this._graphData.sources[t.tag]).then((e) => {});
	}
	onResized = qt(() => {
		this.dispatch("viewportResized", this._container);
	});
	onLayoutRendered = qt((e) => {
		this.dispatch("layoutRendered", e);
	});
	getIGraph() {
		return this.#t;
	}
	getTGraph() {
		return this.#n;
	}
	getLayout() {
		return this._graphData.layout;
	}
	getViewport() {
		return this._flowLayout.getViewport();
	}
	foldNode = (e, t) => {
		let n = this._dataMap[e];
		n && M.isContainer(n.type) && (t ||= !n.folded, this.updateNodes(this._graphData.nodes.map((n) => n.id === e ? {
			...n,
			folded: t
		} : n), this._graphData.triggers), this._flowLayout.foldNode(e, t));
	};
	showCreator(e) {
		this._onShowCreater(e);
	}
	async testRun(e, t, n) {
		return await this.save(), this._hooks.onTestRun(e, t, n);
	}
	rebuildGetSet() {
		this.#n[0] = this.#i()[0];
	}
	#r() {
		return {
			getId: () => this.#e,
			addListener: this.addListener.bind(this),
			getState: this.getState.bind(this),
			getStatus: this.getStatus.bind(this),
			getErrors: this.getErrors.bind(this),
			setLayout: this.setLayout.bind(this),
			setInputSchema: this.setInputSchema.bind(this),
			setReturnSchema: this.setReturnSchema.bind(this),
			setCenterNode: this.setCenterNode.bind(this),
			save: this.save.bind(this),
			testRun: this.testRun.bind(this),
			getGraphData: this.getGraphData.bind(this),
			getTriggers: this.getTriggers.bind(this),
			getNodeById: this.getNodeById.bind(this),
			getNodeDataById: this.getNodeDataById.bind(this),
			getNodeConfigByTag: this.getNodeConfigByTag.bind(this),
			getNodeDomById: this.getNodeDomById.bind(this),
			getNodeConfigById: this.getNodeConfigById.bind(this),
			getNodeSourceById: this.getNodeSourceById.bind(this),
			getVariableSchema: this.getVariableSchema.bind(this),
			getInputSchema: this.getInputSchema.bind(this),
			getReturnSchema: this.getReturnSchema.bind(this),
			getContainer: this.getContainer.bind(this),
			getLayout: this.getLayout.bind(this),
			getSelectedIds: this.getSelectedIds.bind(this),
			getSaverState: this.getSaverState.bind(this),
			getLastLogs: this.getLastLogs.bind(this),
			getZoom: this.getZoom.bind(this),
			zoomIn: this.zoomIn.bind(this),
			zoomOut: this.zoomOut.bind(this),
			zoomFit: this.zoomFit.bind(this),
			undo: this.undo.bind(this),
			redo: this.redo.bind(this),
			uploadNodeData: this.uploadNodeData.bind(this),
			downloadNodeData: this.downloadNodeData.bind(this),
			deleteNodes: this.deleteNodes.bind(this),
			deleteTrigger: this.deleteTrigger.bind(this),
			moveNodes: this.moveNodes.bind(this),
			applyNode: this.applyNode.bind(this),
			applyTrigger: this.applyTrigger.bind(this),
			toClipboard: this.toClipboard.bind(this),
			pasteFromClipboard: this.pasteFromClipboard.bind(this),
			dispose: this.dispose.bind(this),
			select: this.select.bind(this),
			reselect: this.reselect.bind(this),
			refreshCurrentNode: this.refreshCurrentNode.bind(this)
		};
	}
	#i() {
		let e = this.#t, t = {}, n = {};
		return Object.keys(e).forEach((r) => {
			/^(get|is|has)[A-Z]/.test(r) ? t[r] = e[r] : n[r] = e[r];
		}), delete t.getNodeById, [t, n];
	}
};
function cn(e, t, n) {
	e.forEach((e) => {
		let r = n[e];
		t[e] = !0, r.childrenIds.length && cn(r.childrenIds, t, n);
	});
}
var ln = class extends sn {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i, a);
		let o, s = (e) => {
			o = e;
		};
		t.addEventListener("mousedown", s, !1), this._unlinks.push(() => t.removeEventListener("mousedown", s, !1));
		let c = K.domRoles, l = {
			[c.FlowNode]: !0,
			[c.GraphContiner]: !0,
			[c.SuperInput]: !0,
			[c.SuperInputVariables]: !0
		}, u = (e) => {
			if (!o || o.clientX === e.clientX && o.clientY === e.clientY) {
				o = void 0;
				let n = e.target, r = K.closestTarget(n, (e) => l[e.dataset.baseflowRole || ""], t);
				if (r) {
					let t = r.dataset.baseflowRole;
					if (t === c.FlowNode) {
						let t = r.dataset.baseflowNode || "";
						e.metaKey ? this.select(t) : this.reselect(t), this.setCurrentSuperInput(void 0);
						return;
					}
					if (t === c.GraphContiner) {
						this.setCurrentSuperInput(void 0), this.reselect("");
						return;
					}
					if (t === c.SuperInput || t === c.SuperInputVariables) return;
				}
				this.setCurrentSuperInput(void 0);
			} else o = void 0;
		};
		t.addEventListener("click", u, !1), this._unlinks.push(() => t.removeEventListener("click", u, !1));
	}
	setCurrentSuperInput(e) {
		let t = this._currentInput;
		t !== e && (this._currentInput = e, t && t.setActive(!1), e && e.setActive(!0), this.dispatch("currentInputChanged", e));
	}
	getCurrentSuperInput() {
		return this._currentInput;
	}
	createNodeId(e, t = {}) {
		let n = e.match(/[a-z$][\w$]*$/i), r = n ? n[0] : "node";
		return Qt({
			...this._dataMap,
			...t
		}, r);
	}
	verifyNewNodeId(e) {
		return /^[a-z$][\w$]*$/i.test(e) ? this._dataMap[e] ? ge(P.nodeHasExist, { node: e }) : "" : P.nodeIdFormat;
	}
	parseDeleteIds(e) {
		let t = {};
		cn(e, t, this._dataMap);
		let n = {}, r = {};
		return this._graphData.nodes.forEach((e) => {
			t[e.id] && (t[e.parentId] || (n[e.parentId] || (n[e.parentId] = {}), r[e.id] = !0, n[e.parentId][e.id] = !0));
		}), {
			delMap: t,
			delRealMap: r,
			delChildrenMap: n
		};
	}
	reselect(e) {
		let t = this._selectedNodes, n = (e ? Array.isArray(e) ? e : [e] : []).map((e) => this._nodeMap[e]).filter(Boolean), r = Yt(n), i = Yt(this._selectedNodes);
		n.length === t.length && n.every((e) => i[e.id]) || (this._hooks.onBeforeReselect(n.map((e) => e.getINode())), this._selectedNodes.forEach((e) => {
			!r[e.id] && e.dispatch("unselected", e);
		}), n.forEach((e) => {
			!i[e.id] && e.dispatch("selected", e);
		}), this.setSelectedNodes(n));
	}
	select(e) {
		let t = this._nodeMap[e], n = this._dataMap[e];
		if (!t) return;
		if (n.type === j.Trigger) {
			this.reselect(e);
			return;
		}
		let r = this._selectedNodes;
		if (r[0]?.getType() === j.Trigger) {
			this.reselect(e);
			return;
		}
		this._hooks.onBeforeSelect(t.getINode()), r.find((e) => e.id === t.id) ? (t.dispatch("unselected", t), this.setSelectedNodes(r.filter((e) => e.id !== t.id))) : (t.dispatch("selected", t), this.setSelectedNodes([...r, t]));
	}
	historySelect(e) {
		let t = this._nodeMap[e];
		t ? this._currentNode?.nodeId === t.id ? this.dispatch("nodeDataChanged", {
			changed: { [e]: t.getData() },
			inHistory: !0
		}) : (this._selectedNodes = [t], this.dispatch("selectedChanged", [e]), this._currentNode = {
			node: t,
			nodeId: e,
			runtimeOutputs: { id: e },
			runtimeVariableMaps: {}
		}, this.refreshCurrentNode(), this.dispatch("currentNodeChanged", {
			node: t,
			nodeId: t.id
		})) : this._selectedNodes.length && (this._selectedNodes = [], this.dispatch("selectedChanged", []), this._currentNode = void 0, this.validateServer.tsServer.sv(""), this.dispatch("currentNodeChanged", void 0));
	}
	setSelectedNodes(e) {
		this._selectedNodes = e, this.dispatch("selectedChanged", this._selectedNodes.map((e) => e.id));
		let t = this._currentNode, n = e.length === 1 ? e[0] : void 0;
		t?.nodeId !== n?.id && (n ? (this._currentNode = {
			node: n,
			nodeId: n.id,
			runtimeOutputs: { id: n.id },
			runtimeVariableMaps: {}
		}, this.refreshCurrentNode(), this.dispatch("currentNodeChanged", {
			node: n,
			nodeId: n.id
		})) : (this._currentNode = void 0, this.validateServer.tsServer.sv(""), this.dispatch("currentNodeChanged", void 0)));
	}
	getCurrentNode() {
		return this._currentNode;
	}
	refreshCurrentNode() {
		let e = this._currentNode?.node;
		if (e) {
			let t = this.getRuntimeOutputs(e), n = {};
			ht.eachDeviceAndOutput(t, (e, { isDevice: t, parent: r }) => {
				if (!t) {
					let t = e;
					n[t.id] = t, t.direct && W.patchSchemaDirect(t, n, r?.id, !0);
				}
			});
			let r = Rt.deviceToVariable(t);
			this._currentNode = {
				node: e,
				nodeId: e.id,
				runtimeOutputs: t,
				runtimeVariableMaps: n
			}, this.validateServer.tsServer.sv(r);
		}
	}
	getRuntimeOutputs(e) {
		let t = e.getData();
		if (t.type === j.Trigger) {
			let e = this._flowNode, n = this._startNode;
			return {
				id: e.id,
				data: j.Flow,
				children: [{
					id: t.id,
					data: t.type,
					outputSchema: t.meta.outputSchema ? W.toSchemaModelTreeWithJsObject({
						...t.meta.outputSchema,
						name: t.id,
						folded: !0
					}, "", !0) : void 0
				}, {
					id: n.id,
					data: n.type
				}]
			};
		}
		let n = {
			id: t.id,
			data: t.type
		}, r = e.getParent();
		for (; r;) {
			let t = r.getData(), i = t.childrenIds, a = r.isRoute() ? [] : i.slice(0, i.indexOf(e.id)), o = {
				id: t.id,
				data: t.type,
				outputSchema: t.meta.outputSchema && !t.meta.asyncState && (!t.meta.mockState || t.meta.mockState !== !0) ? W.toSchemaModelTreeWithJsObject({
					...t.meta.outputSchema,
					name: t.id,
					folded: !0
				}, "", !0) : void 0,
				children: a.map((e) => {
					let t = this.get_NodeById(e).getData();
					return {
						id: t.id,
						data: t.type,
						outputSchema: t.meta.outputSchema && !t.meta.asyncState && (!t.meta.mockState || t.meta.mockState !== !0) ? W.toSchemaModelTreeWithJsObject({
							...t.meta.outputSchema,
							name: t.id,
							folded: !0
						}, "", !0) : void 0
					};
				})
			};
			o.children.push(n), n = o, e = r, r = e.getParent();
		}
		return n;
	}
	toInspectCode() {
		let e = [], { nodes: t } = oe(this._graphData.nodes), n = t.children, r = n.shift();
		this._graphData.triggers.forEach((e) => {
			n.unshift({ id: e.id });
		}), n.unshift(r);
		let i = [], a = this._nodeMap, o = this._dataMap, s = {};
		z.recurse(t, (t, { level: n, hasChildren: r }) => {
			let c = "  ".repeat(n), l = a[t.id], u = o[t.id];
			if (i.push(`${Rt.NodeFlag}${t.id}`), u.type !== j.Trigger) {
				let e = l.getSRC();
				e && i.push(e);
				let t = u.meta.mockState ? l.getMock() : l.getRefs();
				t.length && (i.push(`${c}{`), i.push(`  ${c}${t.join(`\n  ${c}`)}`), i.push(`${c}}`));
			}
			if (u.meta.asyncState) e.push(`type ${u.id} = undefined;`);
			else {
				let t = l.getDTS();
				if (t) e.push(t.types), Object.assign(s, t.varMap);
				else {
					let t = W.toSchemaModelTreeWithJsObject({
						...u.meta.outputSchema,
						name: u.id
					}, "");
					z.each(t, (e, { parent: t }) => {
						s[e.id] = e, e.direct && W.patchSchemaDirect(e, s, t?.id);
					});
					let n = Rt.schemaToDTS([t]);
					e.push(n.join("\n"));
				}
			}
			if (i.push(`${c}${u.type === j.Variable ? "let" : "const"} ${t.id}: ${Rt.NodeNamespace}.${t.id} = null as any;`), u.type === j.Trigger && !u.meta.mockState) {
				let e = l.getSRC();
				e && i.push(e);
				let t = l.getRefs();
				t.length && (i.push(`${c}{`), i.push(`  ${c}${t.join(`\n  ${c}`)}`), i.push(`${c}}`));
			}
			r && i.push(`${c}{`);
		}, (e, { level: t, hasChildren: n }) => {
			let r = "  ".repeat(t);
			n && i.push(`${r}}`);
		});
		let c = `declare namespace ${Rt.NodeNamespace} {\n${e.join("\n")}\n}`;
		return i.splice(3, 0, ...i.slice(0, 2)), {
			dts: c,
			ts: i.slice(3, -1).join("\n"),
			flag: Rt.NodeFlag
		};
	}
	deleteNodes(e) {
		let { delMap: t, delRealMap: n, delChildrenMap: r } = this.parseDeleteIds(e);
		this._hooks.onBeforeDeleteNodes(t, n, r), this._selectedNodes.length && this._selectedNodes.some((e) => t[e.id]) && this.reselect("");
		let i = this._graphData.nodes.filter((e) => !t[e.id]).map((e) => {
			let t = r[e.id];
			return t ? {
				...e,
				childrenIds: e.childrenIds.filter((e) => !t[e])
			} : e;
		});
		this.updateNodes(i, this._graphData.triggers, { validate: !0 }), this._flowLayout.deleteNodes(t, r);
	}
	deleteTrigger(e) {
		this._hooks.onBeforeDeleteTrigger(e), this._selectedNodes.length && this._selectedNodes.some((t) => t.id === e) && this.reselect(""), this.updateNodes(this._graphData.nodes, this._graphData.triggers.filter((t) => t.id !== e)), this._triggerLayout.setNodes(this._graphData.triggers);
	}
	resetNodeId(e, t) {
		if (e === "start" || e === "end" || e === "flow") return P.idCannotBeModify;
		let n = this._dataMap[e];
		if (!n) return ge(P.nodeNotExist, { node: e });
		let r = this.verifyNewNodeId(t);
		if (r) return r;
		if (this.reselect(""), n.type === j.Trigger) {
			let n = this._graphData.triggers.map((n) => n.id === e ? {
				...n,
				id: t
			} : n);
			this.updateNodes(this._graphData.nodes, n, { validate: !0 });
			return;
		}
		let i = n.parentId, a = n.childrenIds.reduce((e, t) => (e[t] = !0, e), {}), o = this._graphData.nodes.map((n) => n.id === e ? {
			...n,
			id: t
		} : n.id === i ? {
			...n,
			childrenIds: n.childrenIds.map((n) => n === e ? t : n)
		} : a[n.id] ? {
			...n,
			parentId: t
		} : n);
		this.updateNodes(o, this._graphData.triggers, { validate: !0 }), this._flowLayout.resetNodeId(e, t);
	}
	moveNodes(e, t, n) {
		console.log(e, t, n);
		let { delMap: r, delRealMap: i, delChildrenMap: a } = this.parseDeleteIds(n);
		this._hooks.onBeforeMoveNodes(e, t, r, i, a), this.reselect("");
		let o = this.get_NodeById(e), s = t === "inside" ? o.id : o.getParentId(), c = {}, l = this._graphData.nodes.map((n) => {
			let r = n;
			if (i[n.id]) r = {
				...r,
				parentId: s
			};
			else {
				let o = a[n.id];
				if (o && (r = {
					...r,
					childrenIds: r.childrenIds.filter((e) => !o[e])
				}, c[r.id] = r.childrenIds), n.id === s) {
					let n = t === "inside" ? 0 : r.childrenIds.indexOf(e) + 1;
					r = {
						...r,
						childrenIds: [...r.childrenIds]
					}, r.childrenIds.splice(n, 0, ...Object.keys(i)), c[r.id] = r.childrenIds;
				}
			}
			return r;
		});
		this.updateNodes(l, this._graphData.triggers, { validate: !0 }), this._flowLayout.moveNodes(c);
	}
	applyTrigger(e, t) {
		return Ee(t, this._graphData.sources, this._hooks.onImportNode.bind(this._hooks)).then(async ({ sources: t, replaced: n }) => {
			let [r] = e;
			this._hooks.onBeforeApplyTrigger(r), this._graphData.sources = {
				...this._graphData.sources,
				...t
			};
			let i = r.tag, a = this.getNodeConfigByTag(i), o = {
				...r,
				id: this.createNodeId(r.tag),
				tag: i,
				type: a.type,
				parentId: "",
				childrenIds: []
			}, s = a.defaultData, c = {
				...o,
				meta: {
					...s.meta,
					...o.meta
				},
				props: {
					...s.props,
					...o.props
				}
			};
			c.meta.outputSchema && (c.meta.outputSchema = {
				...c.meta.outputSchema,
				name: c.id
			});
			let l = this._graphData.triggers;
			return this.updateNodes(this._graphData.nodes, l.concat([c]), { validate: !0 }), this._triggerLayout.setNodes(this._graphData.triggers), setTimeout(() => this.reselect(c.id), ie.nodeDataUpdate + 50), n;
		});
	}
	applyNode(e, t, n, r) {
		return Ee(r, this._graphData.sources, this._hooks.onImportNode.bind(this._hooks)).then(({ sources: r, replaced: i }) => {
			this._graphData.sources = {
				...this._graphData.sources,
				...r
			}, this._hooks.onBeforeApplyNodes(e, t, n);
			let a = {}, o = n.reduce((e, t) => {
				let n = t.id;
				if (n) {
					if (this._dataMap[n]) {
						let r = this.createNodeId(t.tag, a);
						a[r] = !0, e[n] = r;
					} else e[n] = n;
				}
				return e;
			}, {}), s = [], c = this.get_NodeById(e), l = t === "inside" ? c : c.getParent(), u = l.id, d = t === "inside" ? 0 : l.getChildrenIds().indexOf(e) + 1, f = n.map((e) => {
				let t = e.tag, n = this.getNodeConfigByTag(t), r = {
					...e,
					id: o[e.id || ""] || this.createNodeId(t),
					tag: t,
					type: n.type,
					parentId: o[e.parentId || ""] || "",
					childrenIds: (e.childrenIds || []).map((e) => o[e]).filter(Boolean)
				}, i = n.defaultData, a = {
					...r,
					meta: {
						...i.meta,
						...r.meta
					},
					props: {
						...i.props,
						...r.props
					}
				};
				return a.meta.outputSchema && (a.meta.outputSchema = {
					...a.meta.outputSchema,
					name: a.id
				}), a.parentId || (a.parentId = u, s.push(a.id)), a;
			}), p = this._graphData.nodes.map((e) => {
				if (e.id === u) {
					let t = {
						...e,
						childrenIds: [...e.childrenIds]
					};
					return t.childrenIds.splice(d, 0, ...s), t;
				}
				return e;
			}).concat(f);
			return this.updateNodes(p, this._graphData.triggers, { validate: !0 }), this._flowLayout.addNodes(f, l.getData()), f.length === 1 && setTimeout(() => this.reselect(f[0].id), ie.nodeDataUpdate + 50), i;
		});
	}
	toClipboard(e, t) {
		let { delMap: n, delRealMap: r } = this.parseDeleteIds(t), i = {
			action: e,
			namespace: "baseflow",
			items: e === "cut" ? Object.keys(r) : Object.keys(n).map((e) => this.getNodeDataById(e))
		}, a = JSON.stringify(i);
		return J.clipboard.write(a).then(() => J.message.success(P.alreadyToClipboard)), a;
	}
	async pasteFromClipboard(e, t) {
		let n = await J.clipboard.read(), r = n ? JSON.parse(n) : null;
		if (r?.namespace !== "baseflow") throw Error(P.clipboardIsEmpty);
		return r.action === "copy" ? this.applyNode(e, t, r.items, r.sources) : (r.action === "cut" && this.moveNodes(e, t, r.items), Promise.resolve({}));
	}
};
var un = {};
async function dn(e, t, n, r, i, a) {
	return e = await Ae(e), new ln(e, t, n, r, {
		...un,
		...i
	}, a);
}
var fn = class {
	_graph;
	setGraph(e) {
		this._graph = e;
	}
	getGraph() {
		return this._graph;
	}
	onBeforeSelect(e) {
		if (e.getType() === j.Flow) throw Error(P.notAllowedToSelectFlowNode);
	}
	onBeforeReselect(e) {
		if (e.find((e) => e.getType() === j.Flow) && e.length !== 1) throw Error(P.notAllowedToSelectFlowNode);
	}
	onBeforeApplyTrigger() {}
	onBeforeDeleteTrigger() {}
	onBeforeApplyNodes(e, t, n) {
		let r = n.reduce((e, t) => (t.id && (e[t.id] = t.id), e), {});
		n = n.filter((e) => !r[e.parentId || ""]);
		let i = this.getGraph().getNodeById(e), a = i.getName(), o = i.getType(), s = t === "inside" ? i : this.getGraph().getNodeById(i.getParentId()), c = s.getType(), l = s.getName();
		if (t === "behind" && (o === j.End || i.isDefaultBranch())) throw Error(ge(P.notAllowedToAddBehind, { node: a }));
		if (!s.isContainer()) throw Error(ge(P.notAllowedToAddChild, { node: l }));
		for (let e of n) {
			let n = e.tag || "", r = this.getGraph().getNodeConfigByTag(n).type;
			if ((r === j.Start || r === j.End) && t !== "replace") throw Error(P.startOrEndCanOnlyBeReplace);
			if (c === j.Choice && r !== j.Branch || c === j.Parallel && r !== j.Thread) throw Error(ge(P.onlySameBranchCanBeAdd, { node: l }));
			if (r === j.Branch && c !== j.Choice || r === j.Thread && c !== j.Parallel) throw Error(ge(P.notAllowedToAddBranch, { node: l }));
		}
	}
	onBeforeDeleteNodes(e, t, n) {
		for (let e in t) {
			let t = this.getGraph().getNodeById(e);
			if (!t) throw Error(ge(P.nodeNotExist, { node: e }));
			if (!M.deleteAble(t.getType())) throw Error(ge(P.notAllowedToDelete, { node: t.getName() }));
			if (t.isDefaultBranch()) throw Error(ge(P.notAllowedToDeleteDefaultBranch, { node: t.getName() }));
		}
		for (let e in n) {
			let t = this.getGraph().getNodeById(e), r = n[e];
			if (t.isRoute() && t.getChildrenLength() - Object.keys(r).length < 2) throw Error(ge(P.keepAtLeast2Branches, { node: t.getName() }));
		}
	}
	onBeforeMoveNodes(e, t, n, r, i) {
		let a = this.getGraph().getNodeById(e), o = t === "inside" ? a.getId() : a.getParentId();
		if (n[e]) throw Error(ge(P.notAllowedToMoveThat, { node: a.getName() }));
		for (let e in r) {
			let t = this.getGraph().getNodeById(e);
			if (!t) throw Error(ge(P.nodeNotExist, { node: e }));
			if (t.getType() === j.Start || t.getType() === j.End) throw Error(ge(P.notAllowedToMove, { node: t.getName() }));
			if (t.isDefaultBranch()) throw Error(ge(P.notAllowedToMoveDefaultBranch, { node: t.getName() }));
		}
		for (let n in i) {
			let r = this.getGraph().getNodeById(n), a = i[n];
			if (o !== n) {
				if (console.log("跨级移动", a), r.isRoute() && r.getChildrenLength() - Object.keys(a).length < 2) throw Error(ge(P.keepAtLeast2Branches, { node: r.getName() }));
				this.onBeforeApplyNodes(e, t, Object.keys(a).map((e) => this.getGraph().getNodeDataById(e)));
			} else console.log("同级移动", a);
		}
	}
};
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
var pn = {
	name: Y.AddNext,
	box: "0 0 500 500",
	content: "<path d=\"M 430 319.997 C 430 419.406 349.409 500 250.003 500 C 150.591 500 70 419.406 70 319.997 C 70 227.353 140.001 151.049 230 141.099 L 230 60 L 85 60 L 85 0 L 415 0 L 415 60 L 270 60 L 270 141.098 C 359.996 151.047 430 227.351 430 319.997 Z M 140.497 343.956 L 226.046 343.956 L 226.046 429.5 L 273.958 429.5 L 273.958 343.956 L 359.508 343.956 L 359.508 296.046 L 273.958 296.046 L 273.958 210.495 L 226.046 210.495 L 226.046 296.046 L 140.497 296.046 Z\"></path>"
};
var mn = {
	name: Y.AddSub,
	box: "0 0 500 500",
	content: "<path d=\"M 0.078 0 L 330 0.456 L 329.922 60.456 L 40 60.055 L 40 311.553 L 140.195 311.553 C 144.605 216.066 223.42 140 320.002 140 C 419.409 140 500 220.59 500 319.998 C 500 419.408 419.409 500 320.002 500 C 231.354 500 157.675 435.918 142.757 351.553 L 20 351.553 C 8.954 351.553 0 342.599 0 331.553 L 0 42.56 L 0.023 42.56 Z M 210.495 343.956 L 296.045 343.956 L 296.045 429.501 L 343.958 429.501 L 343.958 343.956 L 429.507 343.956 L 429.507 296.046 L 343.958 296.046 L 343.958 210.494 L 296.045 210.494 L 296.045 296.046 L 210.495 296.046 Z\"></path>"
};
var hn = {
	name: Y.Align,
	box: "64 64 896 896",
	content: "<path d=\"M264 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm496 424c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496zm144 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z\"></path>"
};
var gn = {
	name: Y.ArrowDown,
	box: "0 0 1024 1024",
	content: "<path d=\"M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z\"></path>"
};
var _n = {
	name: Y.ArrowLeft,
	box: "0 0 1024 1024",
	content: "<path d=\"M689 165.1L308.2 493.5c-10.9 9.4-10.9 27.5 0 37L689 858.9c14.2 12.2 35 1.2 35-18.5V183.6c0-19.7-20.8-30.7-35-18.5z\"></path>"
};
var vn = {
	name: Y.ArrowRight,
	box: "-100 0 1024 1024",
	content: "<path d=\"M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z\" />"
};
var yn = {
	name: Y.BoldPlus,
	box: "0 0 1024 1024",
	content: "<path d=\"M576 192 448 192 448 448 192 448 192 576 448 576 448 832 576 832 576 576 832 576 832 448 576 448Z\"></path>"
};
var bn = {
	name: Y.CheckCircle,
	box: "64 64 896 896",
	content: "<path d=\"M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path>"
};
var xn = {
	name: Y.Close,
	box: "64 64 896 896",
	content: "<path d=\"M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z\"></path>"
};
var Sn = {
	name: Y.CloseCircle,
	box: "64 64 896 896",
	content: "<path d=\"M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm128.01 198.83c.03 0 .05.01.09.06l45.02 45.01a.2.2 0 01.05.09.12.12 0 010 .07c0 .02-.01.04-.05.08L557.25 512l127.87 127.86a.27.27 0 01.05.06v.02a.12.12 0 010 .07c0 .03-.01.05-.05.09l-45.02 45.02a.2.2 0 01-.09.05.12.12 0 01-.07 0c-.02 0-.04-.01-.08-.05L512 557.25 384.14 685.12c-.04.04-.06.05-.08.05a.12.12 0 01-.07 0c-.03 0-.05-.01-.09-.05l-45.02-45.02a.2.2 0 01-.05-.09.12.12 0 010-.07c0-.02.01-.04.06-.08L466.75 512 338.88 384.14a.27.27 0 01-.05-.06l-.01-.02a.12.12 0 010-.07c0-.03.01-.05.05-.09l45.02-45.02a.2.2 0 01.09-.05.12.12 0 01.07 0c.02 0 .04.01.08.06L512 466.75l127.86-127.86c.04-.05.06-.06.08-.06a.12.12 0 01.07 0z\"></path>"
};
var Cn = {
	name: Y.CloseFilled,
	box: "64 64 896 896",
	content: "<path d=\"M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z\"></path>"
};
var wn = {
	name: Y.CloudDownload,
	box: "0 0 230 230",
	content: "<g transform=\"matrix(1, 0, 0, 1, -270.3800, -1.1368)\">\n  <path d=\"M 386.998 219.18 C 386.175 220.23 384.585 220.23 383.764 219.18 L 355.014 182.806 C 354.041 181.565 354.777 179.736 356.339 179.515 C 356.435 179.501 356.533 179.494 356.631 179.495 L 375.601 179.495 L 375.601 109.272 C 375.601 108.143 376.524 107.219 377.655 107.219 L 393.056 107.219 C 394.185 107.219 395.11 108.143 395.11 109.272 L 395.11 179.469 L 414.131 179.469 C 415.85 179.469 416.801 181.446 415.748 182.78 L 386.998 219.18 Z\"/>\n  <path d=\"M 462.235 77.318 C 450.479 46.308 420.523 24.258 385.432 24.258 C 350.342 24.258 320.385 46.283 308.628 77.292 C 286.629 83.067 270.38 103.115 270.38 126.937 C 270.38 155.302 293.355 178.276 321.694 178.276 L 331.987 178.276 C 333.117 178.276 334.041 177.352 334.041 176.223 L 334.041 160.821 C 334.041 159.692 333.117 158.767 331.987 158.767 L 321.694 158.767 C 313.043 158.767 304.906 155.327 298.848 149.09 C 292.816 142.878 289.607 134.509 289.889 125.833 C 290.121 119.056 292.43 112.69 296.615 107.326 C 300.902 101.858 306.908 97.879 313.582 96.108 L 323.311 93.566 L 326.88 84.171 C 329.087 78.319 332.167 72.85 336.044 67.896 C 339.87 62.987 344.403 58.669 349.494 55.088 C 360.045 47.669 372.469 43.742 385.432 43.742 C 398.396 43.742 410.82 47.669 421.37 55.088 C 426.478 58.681 430.996 62.994 434.82 67.896 C 438.696 72.85 441.776 78.344 443.984 84.171 L 447.527 93.54 L 457.229 96.108 C 471.143 99.855 480.872 112.51 480.872 126.937 C 480.872 135.434 477.56 143.443 471.553 149.449 C 465.603 155.434 457.506 158.789 449.067 158.767 L 438.773 158.767 C 437.644 158.767 436.719 159.692 436.719 160.821 L 436.719 176.223 C 436.719 177.352 437.644 178.276 438.773 178.276 L 449.067 178.276 C 477.406 178.276 500.38 155.302 500.38 126.937 C 500.38 103.141 484.182 83.119 462.235 77.318 Z\"/>\n  </g>"
};
var Tn = {
	name: Y.CloudUpload,
	box: "64 64 896 896",
	content: "<path d=\"M518.3 459a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z\"></path><path d=\"M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z\"></path>"
};
var En = {
	name: Y.Code,
	box: "183 243 103.68 93.433",
	content: "<path d=\"M 186.044 280.381 C 184.896 280.381 183.958 279.443 183.958 278.295 L 183.958 245.865 C 183.958 244.717 184.896 243.778 186.044 243.778 L 241.817 243.778 C 242.965 243.778 243.904 244.717 243.904 245.865 L 243.904 278.295 C 243.904 279.443 242.965 280.381 241.817 280.381 L 186.044 280.381 Z M 193.347 270.991 L 234.514 270.991 L 234.514 253.168 L 193.347 253.168 L 193.347 270.991 Z M 254.337 271.252 C 254.337 270.679 254.807 270.209 255.381 270.209 L 286.594 270.209 C 287.168 270.209 287.637 270.679 287.637 271.252 L 287.637 278.556 C 287.637 279.129 287.168 279.599 286.594 279.599 L 255.381 279.599 C 254.807 279.599 254.337 279.129 254.337 278.556 L 254.337 271.252 Z M 254.337 252.907 L 254.337 245.604 C 254.337 245.03 254.807 244.561 255.381 244.561 L 286.594 244.561 C 287.168 244.561 287.637 245.03 287.637 245.604 L 287.637 252.907 C 287.637 253.481 287.168 253.951 286.594 253.951 L 255.381 253.951 C 254.807 253.951 254.337 253.481 254.337 252.907 Z M 186.045 337.211 C 184.897 337.211 183.959 336.273 183.959 335.125 L 183.959 302.695 C 183.959 301.547 184.897 300.608 186.045 300.608 L 241.818 300.608 C 242.966 300.608 243.905 301.547 243.905 302.695 L 243.905 335.125 C 243.905 336.273 242.966 337.211 241.818 337.211 L 186.045 337.211 Z M 193.348 327.821 L 234.515 327.821 L 234.515 309.998 L 193.348 309.998 L 193.348 327.821 Z M 254.338 328.082 C 254.338 327.509 254.808 327.039 255.382 327.039 L 286.595 327.039 C 287.169 327.039 287.638 327.509 287.638 328.082 L 287.638 335.386 C 287.638 335.959 287.169 336.429 286.595 336.429 L 255.382 336.429 C 254.808 336.429 254.338 335.959 254.338 335.386 L 254.338 328.082 Z M 254.338 309.737 L 254.338 302.434 C 254.338 301.86 254.808 301.391 255.382 301.391 L 286.595 301.391 C 287.169 301.391 287.638 301.86 287.638 302.434 L 287.638 309.737 C 287.638 310.311 287.169 310.781 286.595 310.781 L 255.382 310.781 C 254.808 310.781 254.338 310.311 254.338 309.737 Z\"></path>"
};
var Dn = {
	name: Y.Copy,
	box: "207.054 191.403 178.89 227.674",
	content: "<path d=\"M 377.814 203.6 L 350.364 203.6 L 350.364 193.436 C 350.364 192.318 349.454 191.403 348.334 191.403 L 334.104 191.403 C 332.984 191.403 332.074 192.318 332.074 193.436 L 332.074 203.6 L 293.444 203.6 L 293.444 193.436 C 293.444 192.318 292.534 191.403 291.414 191.403 L 277.184 191.403 C 276.064 191.403 275.154 192.318 275.154 193.436 L 275.154 203.6 L 247.714 203.6 C 243.214 203.6 239.584 207.234 239.584 211.731 L 239.584 242.224 L 215.184 242.224 C 210.684 242.224 207.054 245.857 207.054 250.355 L 207.054 410.946 C 207.054 415.443 210.684 419.077 215.184 419.077 L 341.284 419.077 C 345.784 419.077 349.414 415.443 349.414 410.946 L 349.414 386.552 L 377.814 386.552 C 382.304 386.552 385.944 382.918 385.944 378.421 L 385.944 211.731 C 385.944 207.234 382.304 203.6 377.814 203.6 Z M 331.124 400.782 L 225.354 400.782 L 225.354 260.519 L 276.744 260.519 L 276.744 304.732 C 276.744 310.347 281.294 314.896 286.904 314.896 L 331.124 314.896 L 331.124 400.782 Z M 331.124 298.634 L 293.004 298.634 L 293.004 260.519 L 293.054 260.519 L 331.124 298.583 L 331.124 298.634 Z M 367.644 368.257 L 349.414 368.257 L 349.414 291.011 L 300.624 242.224 L 257.874 242.224 L 257.874 221.895 L 275.154 221.895 L 293.444 221.895 L 332.074 221.895 L 350.364 221.895 L 367.644 221.895 L 367.644 368.257 Z\" />"
};
var On = {
	name: Y.Cut,
	box: "64 64 896 896",
	content: "<path d=\"M567.1 512l318.5-319.3c5-5 1.5-13.7-5.6-13.7h-90.5c-2.1 0-4.2.8-5.6 2.3l-273.3 274-90.2-90.5c12.5-22.1 19.7-47.6 19.7-74.8 0-83.9-68.1-152-152-152s-152 68.1-152 152 68.1 152 152 152c27.7 0 53.6-7.4 75.9-20.3l90 90.3-90.1 90.3A151.04 151.04 0 00288 582c-83.9 0-152 68.1-152 152s68.1 152 152 152 152-68.1 152-152c0-27.2-7.2-52.7-19.7-74.8l90.2-90.5 273.3 274c1.5 1.5 3.5 2.3 5.6 2.3H880c7.1 0 10.7-8.6 5.6-13.7L567.1 512zM288 370c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm0 444c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z\"></path>"
};
var kn = {
	name: Y.Dagre,
	box: "64 64 896 896",
	content: "<path d=\"M908 640H804V488c0-4.4-3.6-8-8-8H548v-96h108c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h108v96H228c-4.4 0-8 3.6-8 8v152H116c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16H292v-88h440v88H620c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h288c8.8 0 16-7.2 16-16V656c0-8.8-7.2-16-16-16zm-564 76v168H176V716h168zm84-408V140h168v168H428zm420 576H680V716h168v168z\"></path>"
};
var An = {
	name: Y.Debug,
	box: "64 64 896 896",
	content: "<path d=\"M304 280h56c4.4 0 8-3.6 8-8 0-28.3 5.9-53.2 17.1-73.5 10.6-19.4 26-34.8 45.4-45.4C450.9 142 475.7 136 504 136h16c28.3 0 53.2 5.9 73.5 17.1 19.4 10.6 34.8 26 45.4 45.4C650 218.9 656 243.7 656 272c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-40-8.8-76.7-25.9-108.1a184.31 184.31 0 00-74-74C596.7 72.8 560 64 520 64h-16c-40 0-76.7 8.8-108.1 25.9a184.31 184.31 0 00-74 74C304.8 195.3 296 232 296 272c0 4.4 3.6 8 8 8z\"></path><path d=\"M940 512H792V412c76.8 0 139-62.2 139-139 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8a63 63 0 01-63 63H232a63 63 0 01-63-63c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 76.8 62.2 139 139 139v100H84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h148v96c0 6.5.2 13 .7 19.3C164.1 728.6 116 796.7 116 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-44.2 23.9-82.9 59.6-103.7a273 273 0 0022.7 49c24.3 41.5 59 76.2 100.5 100.5S460.5 960 512 960s99.8-13.9 141.3-38.2a281.38 281.38 0 00123.2-149.5A120 120 0 01836 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-79.3-48.1-147.4-116.7-176.7.4-6.4.7-12.8.7-19.3v-96h148c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM716 680c0 36.8-9.7 72-27.8 102.9-17.7 30.3-43 55.6-73.3 73.3C584 874.3 548.8 884 512 884s-72-9.7-102.9-27.8c-30.3-17.7-55.6-43-73.3-73.3A202.75 202.75 0 01308 680V412h408v268z\"></path>"
};
var jn = {
	name: Y.Decrease,
	box: "64 64 896 896",
	content: "<path d=\"M328 544h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z\"></path>"
};
var Mn = {
	name: Y.Delete,
	box: "199.548 216.473 128.723 134.085",
	content: "<path d=\"M 238.433 240.607 L 289.386 240.607 L 289.386 228.54 L 290.727 228.54 C 289.989 228.54 289.386 227.939 289.386 227.198 L 289.386 228.54 L 238.433 228.54 L 238.433 227.198 C 238.433 227.939 237.83 228.54 237.092 228.54 L 238.433 228.54 L 238.433 240.607 Z M 301.453 240.607 L 322.907 240.607 C 325.874 240.607 328.271 243.006 328.271 245.97 L 328.271 251.333 C 328.271 252.073 327.667 252.675 326.93 252.675 L 316.806 252.675 L 312.666 340.334 C 312.398 346.066 307.688 350.558 301.956 350.558 L 225.862 350.558 C 220.147 350.558 215.421 346.05 215.152 340.334 L 211.012 252.675 L 200.889 252.675 C 200.152 252.675 199.548 252.073 199.548 251.333 L 199.548 245.97 C 199.548 243.006 201.945 240.607 204.912 240.607 L 226.365 240.607 L 226.365 227.198 C 226.365 221.284 231.176 216.473 237.092 216.473 L 290.727 216.473 C 296.643 216.473 301.453 221.284 301.453 227.198 L 301.453 240.607 Z M 304.722 252.675 L 223.097 252.675 L 227.153 338.49 L 257.505 338.49 L 257.505 281.736 L 270.314 281.736 L 270.314 338.49 L 300.666 338.49 L 304.722 252.675 Z\" />"
};
var Nn = {
	name: Y.Down,
	box: "0 0 1024 1024",
	content: "<path d=\"M512 559.1552l398.1824-389.31456a47.2832 47.2832 0 0 1 68.38272 2.38592 51.5584 51.5584 0 0 1-2.7648 71.40352l-426.1376 410.24c-21.69344 20.74624-56.90368 20.74624-78.62272 0-1.09568-1.04448-142.70976-137.55392-424.85248-409.52832a51.88096 51.88096 0 0 1-2.69312-71.90016 47.80544 47.80544 0 0 1 69.0176-2.4064l399.488 389.12z\"></path>"
};
var Pn = {
	name: Y.DownCircle,
	box: "64 64 896 896",
	content: "<path d=\"M690 405h-46.9c-10.2 0-19.9 4.9-25.9 13.2L512 563.6 406.8 418.2c-6-8.3-15.6-13.2-25.9-13.2H334c-6.5 0-10.3 7.4-6.5 12.7l178 246c3.2 4.4 9.7 4.4 12.9 0l178-246c3.9-5.3.1-12.7-6.4-12.7z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path>"
};
var Fn = {
	name: Y.Edit,
	box: "2 0 18 20",
	content: "<path d=\"M10.8427581,3.29049799 C11.201201,2.93447931 11.7623576,2.90549653 12.1537974,3.20466412 L12.247906,3.28629312 L16.8505452,7.80340428 C17.217684,8.16372079 17.2475577,8.73689045 16.938996,9.13182034 L16.8548041,9.22661316 L7.3073426,18.709502 C7.15122797,18.8645608 6.94928875,18.962923 6.73351075,18.9914032 L6.60263918,19 L2,19 C1.48716416,19 1.06449284,18.6139598 1.00672773,18.1166211 L1,18 L1,13.4828888 C1,13.2608951 1.07381291,13.0465477 1.20779568,12.8726263 L1.29529659,12.7733868 L10.8427581,3.29049799 Z M11.552,5.405 L3,13.898 L3,17 L6.189,17 L14.726,8.521 L11.552,5.405 Z M14.6835225,0.476509026 L14.7774278,0.560038383 L19.4786615,5.29545958 C19.8677684,5.68739611 19.8654745,6.32055694 19.473538,6.70966386 C19.1117504,7.06883949 18.5444226,7.09451387 18.1532391,6.78806977 L18.0593337,6.70454042 L13.3581001,1.96911922 C12.9689932,1.57718269 12.971287,0.944021865 13.3632235,0.554914937 C13.7250111,0.195739311 14.2923389,0.170064935 14.6835225,0.476509026 Z\" />"
};
var In = {
	name: Y.Empty,
	box: "0 0 1024 1024",
	content: "<path d=\"M615.565239 262.567068H800.894178L604.662935 65.334008v186.272427c0 5.482875 5.450129 10.960633 10.902304 10.960633z m-1.090845 333.101517H253.629c-13.080923 0-23.984251-10.955516-23.984251-24.102954 0-13.152555 10.904351-24.109094 23.984251-24.109095H629.735983c11.993149 0 20.716834 8.763594 22.895453 19.722181 34.886555-20.820188 75.223239-32.868595 118.826316-32.868595 10.904351 0 21.804608 1.093914 31.616068 2.192945V309.685201H615.565239c-31.614022 0-57.778938-26.301016-57.778938-58.077743V63.142086H111.906208c-26.164916 0-46.876634 20.818141-46.876634 47.11711v756.058529c0 26.292829 20.711717 47.113017 46.876634 47.113017h470.953141a236.410338 236.410338 0 0 1-46.87561-141.349285c0-70.123081 30.523177-133.678582 78.490655-176.412872zM253.629 406.105205H629.735983c13.08604 0 23.985274 10.960633 23.985274 24.109094s-10.899234 24.108071-23.985274 24.10807H253.629c-13.080923 0-23.984251-10.959609-23.984251-24.10807s10.903328-24.109094 23.984251-24.109094zM770.368954 583.615061c-103.567797 0-188.598402 84.372619-188.598402 189.564403 0 104.093776 83.941807 189.56031 188.598402 189.56031 104.656595-1.094938 188.599426-85.467557 188.599425-190.656271 0-104.095823-83.941807-188.468442-188.599425-188.468442z m0 306.806641c-13.0799 0-23.984251-10.955516-23.984251-24.102954 0-13.153578 10.904351-24.108071 23.984251-24.108071 13.080923 0 23.985274 10.95347 23.985274 24.108071 0.001023 14.239306-10.904351 24.102954-23.985274 24.102954z m0-71.223135c-13.0799 0-23.984251-129.294738-23.984251-141.348262 0-12.056594 10.904351-24.111141 23.984251-24.11114 13.080923 0 23.985274 10.960633 23.985274 24.11114 0.001023 13.146415-10.904351 141.348262-23.985274 141.348262z\"></path>"
};
var Ln = {
	name: Y.Export,
	box: "0 0 1024 1024",
	content: "<path d=\"M904 632c30.912 0 56 25.088 56 56v216a56 56 0 0 1-56 56H120A56 56 0 0 1 64 904V688a56 56 0 0 1 112 0v160h672v-160c0-30.912 25.088-56 56-56zM512.192 64c14.336 0 28.672 5.44 39.68 16.384l237.44 237.568a56 56 0 1 1-79.168 79.168l-142.144-142.08v401.728a56 56 0 0 1-112 0V255.36L314.24 397.12A56 56 0 0 1 234.88 317.952l221.248-221.184 16.384-16.384A55.808 55.808 0 0 1 512.192 64z\"></path>"
};
var Rn = {
	name: Y.Fit,
	box: "95.628 190.849 169.872 132.891",
	content: "<path d=\"M 158.073 293.017 L 122.351 257.294 L 158.073 221.571 L 158.073 248.363 L 203.055 248.363 L 203.055 221.571 L 238.777 257.294 L 203.055 293.017 L 203.055 266.225 L 158.073 266.225 L 158.073 293.017 Z M 95.628 323.74 L 95.628 190.849 L 113.489 190.849 L 113.489 323.74 L 95.628 323.74 Z M 247.639 323.74 L 247.639 190.849 L 265.5 190.849 L 265.5 323.74 L 247.639 323.74 Z\" />"
};
var zn = {
	name: Y.Help,
	box: "64 64 896 896",
	content: "<path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path><path d=\"M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z\"></path>"
};
var Bn = {
	name: Y.History,
	box: "64 64 896 896",
	content: "<path d=\"M536.1 273H488c-4.4 0-8 3.6-8 8v275.3c0 2.6 1.2 5 3.3 6.5l165.3 120.7c3.6 2.6 8.6 1.9 11.2-1.7l28.6-39c2.7-3.7 1.9-8.7-1.7-11.2L544.1 528.5V281c0-4.4-3.6-8-8-8zm219.8 75.2l156.8 38.3c5 1.2 9.9-2.6 9.9-7.7l.8-161.5c0-6.7-7.7-10.5-12.9-6.3L752.9 334.1a8 8 0 003 14.1zm167.7 301.1l-56.7-19.5a8 8 0 00-10.1 4.8c-1.9 5.1-3.9 10.1-6 15.1-17.8 42.1-43.3 80-75.9 112.5a353 353 0 01-112.5 75.9 352.18 352.18 0 01-137.7 27.8c-47.8 0-94.1-9.3-137.7-27.8a353 353 0 01-112.5-75.9c-32.5-32.5-58-70.4-75.9-112.5A353.44 353.44 0 01171 512c0-47.8 9.3-94.2 27.8-137.8 17.8-42.1 43.3-80 75.9-112.5a353 353 0 01112.5-75.9C430.6 167.3 477 158 524.8 158s94.1 9.3 137.7 27.8A353 353 0 01775 261.7c10.2 10.3 19.8 21 28.6 32.3l59.8-46.8C784.7 146.6 662.2 81.9 524.6 82 285 82.1 92.6 276.7 95 516.4 97.4 751.9 288.9 942 524.8 942c185.5 0 343.5-117.6 403.7-282.3 1.5-4.2-.7-8.9-4.9-10.4z\"></path>"
};
var Vn = {
	name: Y.Import,
	box: "-50 0 1150 1100",
	content: "<path d=\"M1035.498324 624.689133a60.590605 60.590605 0 0 0-63.620135 60.590604v181.771814a28.477584 28.477584 0 0 1-28.477584 28.477584h-787.67786a28.477584 28.477584 0 0 1-28.477584-28.477584v-181.771814a63.620135 63.620135 0 0 0-127.240269 0v181.771814a155.717854 155.717854 0 0 0 158.141478 156.929666h787.677859a155.717854 155.717854 0 0 0 155.717854-155.717854v-181.771813a60.590605 60.590605 0 0 0-66.043759-61.802417z\"></path>\n        <path d=\"M209.042477 127.24027h173.28913A105.427652 105.427652 0 0 1 487.153352 232.062015v264.175036L360.518989 384.144433a60.590605 60.590605 0 0 0-79.979598 90.885907l193.889934 172.077317a116.939867 116.939867 0 0 0 155.111948 0l192.072217-172.077317a60.590605 60.590605 0 0 0-81.191411-90.280001L614.393622 501.0843V232.062015A232.667921 232.667921 0 0 0 382.331607 0H209.042477a63.620135 63.620135 0 0 0 0 127.24027z\"></path>"
};
var Hn = {
	name: Y.Increase,
	box: "64 64 896 896",
	content: "<path d=\"M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z\"></path>"
};
var Un = {
	name: Y.Info,
	box: "64 64 896 896",
	content: "<path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path><path d=\"M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z\"></path>"
};
var Wn = {
	name: Y.JSON,
	box: "0 0 323.83 237.259",
	content: "<path d=\"M 0 133.403 L 0 103.56 C 6.566 102.96 11.64 102.66 14.625 100.57 C 17.609 99.68 20.293 96.7 22.68 93.41 C 25.067 89.83 26.559 85.95 27.754 80.28 C 28.352 76.4 29.246 69.84 29.246 60.29 C 29.246 44.17 29.844 33.13 31.633 26.56 C 33.126 20.59 36.11 14.92 39.692 11.34 C 43.571 7.76 49.84 4.78 57.301 2.39 C 62.372 1.49 70.43 0 82.07 0 L 89.233 0 L 89.233 29.25 C 79.684 29.25 73.117 29.84 70.731 31.34 C 68.344 32.23 66.254 33.73 64.164 36.41 C 62.672 38.5 62.075 42.08 62.075 46.86 C 62.075 51.93 61.477 62.08 60.582 76.1 C 59.985 84.76 59.09 91.32 57.598 95.8 C 55.508 100.87 53.122 104.75 50.437 108.33 C 48.047 111.32 43.274 114.9 37.902 118.48 C 42.973 121.46 47.453 124.45 50.437 128.031 C 53.419 131.612 56.106 136.686 57.898 141.461 C 59.985 147.131 60.88 153.995 60.88 162.948 C 61.477 176.378 61.477 185.033 61.477 189.211 C 61.477 194.881 62.075 198.164 63.567 200.85 C 65.059 203.237 67.446 204.431 70.133 205.923 C 72.52 206.819 79.086 208.012 88.636 208.012 L 88.636 237.259 L 81.176 237.259 C 69.536 237.259 59.985 236.663 54.614 234.872 C 48.047 232.783 42.973 229.798 38.5 225.919 C 34.023 222.039 31.336 216.966 29.547 210.698 C 28.052 204.73 27.457 195.18 27.457 182.048 C 27.457 166.828 26.86 156.98 25.367 152.801 C 23.278 146.236 20.293 141.162 16.414 138.178 C 14.027 135.194 7.758 133.403 0 133.403 Z M 323.83 133.403 C 317.264 134 312.191 134.298 309.207 136.387 C 306.222 137.283 303.536 140.267 301.149 143.55 C 298.761 147.131 297.269 151.011 296.075 156.681 C 295.478 160.561 294.583 167.126 294.583 176.676 C 294.583 192.792 293.986 203.834 292.196 210.4 C 290.703 216.966 287.719 222.039 284.138 225.62 C 280.258 229.202 273.991 232.186 266.53 234.573 C 261.456 235.469 253.399 236.961 241.76 236.961 L 234.597 236.961 L 234.597 207.714 C 244.147 207.714 249.817 207.117 253.1 205.625 C 256.085 204.73 258.174 202.641 259.666 200.552 C 261.158 198.462 261.755 194.881 261.755 190.106 C 261.755 185.331 262.352 175.483 263.247 161.456 C 263.844 152.801 265.336 145.937 267.127 141.461 C 269.216 135.79 271.603 131.911 274.588 128.33 C 277.572 124.748 281.75 121.76 286.525 118.78 C 278.467 113.71 273.394 110.12 271.006 106.84 C 267.127 101.17 263.844 94.31 262.949 86.85 C 261.456 80.88 260.86 68.34 260.86 49.24 C 260.86 43.27 260.263 39.1 258.771 36.71 C 257.278 34.62 255.786 33.13 253.1 31.64 C 250.713 30.74 244.147 29.55 234 29.55 L 234 0.3 L 241.163 0.3 C 252.802 0.3 262.352 0.9 267.724 2.69 C 274.289 4.78 279.363 7.76 283.839 11.64 C 288.316 15.52 291.002 20.59 292.792 26.86 C 294.285 32.83 295.18 42.38 295.18 55.51 C 295.18 70.73 295.777 80.28 297.269 84.76 C 299.358 91.32 302.342 96.4 306.222 98.19 C 310.102 101.17 316.369 102.07 323.83 103.26 L 323.83 133.403 Z M 140.206 108.868 C 147.727 129.921 130.204 147.214 109.112 139.392 C 104.859 137.822 100.095 133.027 98.523 128.81 C 90.703 107.718 107.99 90.233 129.043 97.71 C 133.571 99.322 138.559 104.307 140.206 108.868 Z M 225.294 108.447 C 233.202 129.691 215.603 147.254 194.35 139.392 C 190.096 137.822 185.344 133.027 183.772 128.81 C 175.865 107.566 193.476 90.004 214.717 97.865 C 218.97 99.436 223.723 104.19 225.294 108.447 Z\" />"
};
var Gn = {
	name: Y.Loop,
	box: "0 0 1024 1024",
	content: "<path d=\"M546.8 601l-0.6 116c97.8-16.4 172.6-102 172.6-205 0-31.8-7.2-62-20-89-5.6-11.6-12-22.6-19.6-33l94.2-87c2.2 2.6 4.2 5.4 6.2 8 41.8 56 66.4 125.6 66.4 201 0 2.4 0 5 0 7.4-3 143-95.2 264-222.8 309.2-24.6 8.6-50.4 14.6-77 17.4l-0.2 114-152.4-134L341.2 780l88.8-77.4L546.8 601z\" p-id=\"2358\"></path><path d=\"M178 504.6c3.2-144.2 96.6-266 225.8-310.4 23.4-8 48-13.6 73.6-16.2l0.2-114 152.2 133.8 52.4 46.2-88.6 77.2-116.8 101.8 0.4-115.8c-97.6 16.6-172 102.2-172 204.8 0 32 7.2 62.2 20.2 89.4 5.4 11.6 12 22.4 19.4 32.6l-94 87.2c-2.6-3.2-5.2-6.6-7.6-10C202.2 655.4 178 586.6 178 512 178 509.6 178 507 178 504.6z\"></path>"
};
var Kn = {
	name: Y.Minus,
	box: "0 0 1024 1024",
	content: "<path d=\"M64 576h896V448H64z\"></path>"
};
var qn = {
	name: Y.MinusCircle,
	box: "64 64 896 896",
	content: "<path d=\"M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path>"
};
var Jn = {
	name: Y.Options,
	box: "0 0 20 20",
	content: "<path d=\"M4,8 C5.1045695,8 6,8.8954305 6,10 C6,11.1045695 5.1045695,12 4,12 C2.8954305,12 2,11.1045695 2,10 C2,8.8954305 2.8954305,8 4,8 Z M10,8 C11.1045695,8 12,8.8954305 12,10 C12,11.1045695 11.1045695,12 10,12 C8.8954305,12 8,11.1045695 8,10 C8,8.8954305 8.8954305,8 10,8 Z M16,8 C17.1045695,8 18,8.8954305 18,10 C18,11.1045695 17.1045695,12 16,12 C14.8954305,12 14,11.1045695 14,10 C14,8.8954305 14.8954305,8 16,8 Z\" />"
};
var Yn = {
	name: Y.Pause,
	box: "64 64 896 896",
	content: "<path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm-88-532h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8zm224 0h-48c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8z\"></path>"
};
var Xn = {
	name: Y.Plus,
	box: "0 0 1024 1024",
	content: "<path d=\"M576 64H448v384H64v128h384v384h128V576h384V448H576z\"></path>"
};
var Zn = {
	name: Y.PlusCircle,
	box: "64 64 896 896",
	content: "<path d=\"M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path>"
};
var Qn = {
	name: Y.PlusNext,
	box: "45.809 204.634 139.187 139.187",
	content: "<g><rect x=\"45.809\" y=\"204.634\" width=\"139.187\" height=\"139.187\" style=\"fill: rgba(0, 0, 0, 0);\" /><path d=\"M 129.783 227.155 C 129.783 233.207 126.045 238.386 120.751 240.508 L 120.751 257.522 C 139.903 260.131 154.662 276.552 154.662 296.421 C 154.662 318.103 137.084 335.68 115.402 335.68 C 93.72 335.68 76.143 318.103 76.143 296.421 C 76.143 276.541 90.918 260.113 110.086 257.518 L 110.086 240.52 C 104.776 238.406 101.023 233.219 101.023 227.155 C 101.023 219.213 107.461 212.775 115.403 212.775 C 123.345 212.775 129.783 219.213 129.783 227.155 Z M 110.692 291.463 L 93.373 291.463 L 93.373 301.381 L 110.692 301.381 L 110.692 318.395 L 120.109 318.395 L 120.109 301.381 L 137.431 301.381 L 137.431 291.463 L 120.109 291.463 L 120.109 274.447 L 110.692 274.447 L 110.692 291.463 Z\" /></g>"
};
var $n = {
	name: Y.PlusSub,
	box: "223.545 204.634 139.187 139.187",
	content: "<g><rect x=\"223.545\" y=\"204.634\" width=\"139.187\" height=\"139.187\" style=\"fill: rgba(0, 0, 0, 0);\"/><path d=\"M 271.538 232.479 L 271.538 286.999 C 271.538 289.299 273.39 291.149 275.686 291.149 L 283.889 291.149 C 286.397 271.885 302.87 257.008 322.818 257.008 C 344.5 257.008 362.077 274.585 362.077 296.268 C 362.077 317.95 344.5 335.527 322.818 335.527 C 303.019 335.527 286.644 320.872 283.947 301.819 L 275.686 301.819 C 267.509 301.819 260.872 295.179 260.872 286.999 L 260.872 232.479 L 251.606 232.479 C 249.502 237.699 244.391 241.369 238.421 241.369 C 230.569 241.369 224.199 234.999 224.199 227.149 C 224.199 219.299 230.569 212.929 238.421 212.929 C 244.218 212.929 249.435 216.439 251.606 221.819 L 321.492 221.819 C 322.144 221.819 322.677 222.349 322.677 222.999 L 322.677 231.299 C 322.677 231.949 322.144 232.479 321.492 232.479 L 271.538 232.479 Z M 318.119 291.32 L 300.839 291.32 L 300.839 301.214 L 318.119 301.214 L 318.119 318.191 L 327.514 318.191 L 327.514 301.214 L 344.796 301.214 L 344.796 291.32 L 327.514 291.32 L 327.514 274.344 L 318.119 274.344 L 318.119 291.32 Z\" /></g>"
};
var er = {
	name: Y.Redo,
	box: "0 0 1024 1024",
	content: "<path d=\"M0.00032 576a510.72 510.72 0 0 0 173.344 384l84.672-96A383.136 383.136 0 0 1 128.00032 576C128.00032 363.936 299.93632 192 512.00032 192c106.048 0 202.048 42.976 271.52 112.48L640.00032 448h384V64l-149.984 149.984A510.272 510.272 0 0 0 512.00032 64C229.21632 64 0.00032 293.216 0.00032 576z\"></path>"
};
var tr = {
	name: Y.Run,
	box: "0 0 24 24",
	content: "<path d=\"M8 18.3915V5.60846L18.2264 12L8 18.3915ZM6 3.80421V20.1957C6 20.9812 6.86395 21.46 7.53 21.0437L20.6432 12.848C21.2699 12.4563 21.2699 11.5436 20.6432 11.152L7.53 2.95621C6.86395 2.53993 6 3.01878 6 3.80421Z\"></path>"
};
var nr = {
	name: Y.Stop,
	box: "64 64 896 896",
	content: "<path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z\"></path>"
};
var rr = {
	name: Y.Switch,
	box: "60 80 335 322",
	content: "<path d=\"M 385.053 296.328 L 313.542 387.029 C 311.615 389.173 308.295 390.767 305.465 390.938 L 274.753 390.938 C 272.284 390.588 269.428 388.856 268.549 387.027 C 267.67 385.199 268.092 381.895 269.336 379.764 L 325.993 307.912 L 76.849 307.912 C 75.2 307.758 73.035 306.946 71.981 305.893 C 70.926 304.841 70.111 302.675 69.956 301.023 L 69.956 275.607 C 70.111 273.955 70.926 271.789 71.981 270.737 C 73.035 269.684 75.2 268.872 76.849 268.718 L 371.631 268.718 C 378.347 269.06 384.517 273.221 386.995 278.325 C 389.473 283.43 388.922 290.853 385.054 296.328 Z M 388.728 175.637 L 388.728 201.053 C 388.574 202.703 387.761 204.868 386.708 205.921 C 385.655 206.974 383.49 207.788 381.84 207.942 L 87.01 207.942 C 80.316 207.598 74.157 203.436 71.686 198.332 C 69.216 193.228 69.767 185.808 73.636 180.333 L 145.145 89.629 C 147.073 87.488 150.391 85.894 153.222 85.723 L 183.933 85.723 C 186.402 86.073 189.258 87.805 190.137 89.634 C 191.016 91.462 190.593 94.766 189.35 96.897 L 132.693 168.749 L 381.84 168.749 C 383.49 168.903 385.655 169.716 386.708 170.769 C 387.761 171.822 388.574 173.987 388.728 175.637 Z\" />"
};
var ir = {
	name: I.Any,
	box: "64 64 896 896",
	content: "<path d=\"M264 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm496 424c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496zm144 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z\"></path>"
};
var ar = {
	name: I.Array,
	box: "0 80 470 300",
	content: "<path d=\"M 146.307 239.485 L 159.609 198.424 C 190.259 209.219 212.525 218.568 226.405 226.472 C 222.742 191.579 220.814 167.579 220.621 154.471 L 262.55 154.471 C 261.971 173.555 259.754 197.46 255.899 226.183 C 275.755 216.159 298.502 206.905 324.141 198.424 L 337.442 239.485 C 312.96 247.581 288.96 252.978 265.442 255.677 C 277.201 265.895 293.778 284.112 315.177 310.328 L 280.478 334.907 C 269.296 319.678 256.091 298.955 240.863 272.738 C 226.597 299.919 214.067 320.642 203.272 334.907 L 169.151 310.328 C 191.513 282.761 207.513 264.544 217.152 255.677 C 192.283 250.857 168.669 245.46 146.307 239.485 Z M 23.162 402.827 L 23.162 89.135 L 118.114 89.135 L 118.114 112.291 L 71.481 112.291 L 71.481 379.67 L 118.114 379.67 L 118.114 402.827 L 23.162 402.827 Z M 460.588 402.159 L 365.636 402.159 L 365.636 379.002 L 412.268 379.002 L 412.268 111.623 L 365.636 111.623 L 365.636 88.467 L 460.588 88.467 L 460.588 402.159 Z\" />"
};
var or = {
	name: I.Bool,
	box: "0 -1 20 20",
	content: "<path d=\"M14.5,4.59302522 C17.5375661,4.59302522 20,7.0554591 20,10.0930252 C20,13.1305913 17.5375661,15.5930252 14.5,15.5930252 C12.6400269,15.5930252 10.9956939,14.6697601 10.0002965,13.2565253 C9.00430607,14.6697601 7.3599731,15.5930252 5.5,15.5930252 C2.46243388,15.5930252 0,13.1305913 0,10.0930252 C0,7.0554591 2.46243388,4.59302522 5.5,4.59302522 C7.3599731,4.59302522 9.00430607,5.51629032 9.99970353,6.92952513 C10.9956939,5.51629032 12.6400269,4.59302522 14.5,4.59302522 Z M5.5,6.59302522 C3.56700338,6.59302522 2,8.1600286 2,10.0930252 C2,12.0260218 3.56700338,13.5930252 5.5,13.5930252 C7.43299662,13.5930252 9,12.0260218 9,10.0930252 C9,8.1600286 7.43299662,6.59302522 5.5,6.59302522 Z M16.1099312,8.05749132 L13.8022389,10.4574913 L12.6483927,9.25749132 L11.8791619,10.0574913 L13.8022389,12.0574913 L16.8791619,8.85749132 L16.1099312,8.05749132 Z M6.66446609,8.05749132 L7.46446609,8.85749132 L6.26446609,10.0574913 L7.46446609,11.2574913 L6.66446609,12.0574913 L5.46446609,10.8574913 L4.26446609,12.0574913 L3.46446609,11.2574913 L4.66446609,10.0574913 L3.46446609,8.85749132 L4.26446609,8.05749132 L5.46446609,9.25749132 L6.66446609,8.05749132 Z\" />"
};
var sr = {
	name: I.Date,
	box: "0 0 20 20",
	content: "<path d=\"M13,2 C13.5522847,2 14,2.44771525 14,3 L17,3 C18.1045695,3 19,3.8954305 19,5 L19,16 C19,17.1045695 18.1045695,18 17,18 L3,18 C1.8954305,18 1,17.1045695 1,16 L1,5 C1,3.8954305 1.8954305,3 3,3 L6,3 C6,2.44771525 6.44771525,2 7,2 C7.55228475,2 8,2.44771525 8,3 L12,3 C12,2.44771525 12.4477153,2 13,2 Z M17,9 L3,9 L3,16 L17,16 L17,9 Z M6,13 C6.55228475,13 7,13.4477153 7,14 C7,14.5522847 6.55228475,15 6,15 C5.44771525,15 5,14.5522847 5,14 C5,13.4477153 5.44771525,13 6,13 Z M10,13 C10.5522847,13 11,13.4477153 11,14 C11,14.5522847 10.5522847,15 10,15 C9.44771525,15 9,14.5522847 9,14 C9,13.4477153 9.44771525,13 10,13 Z M14,13 C14.5522847,13 15,13.4477153 15,14 C15,14.5522847 14.5522847,15 14,15 C13.4477153,15 13,14.5522847 13,14 C13,13.4477153 13.4477153,13 14,13 Z M6,10 C6.55228475,10 7,10.4477153 7,11 C7,11.5522847 6.55228475,12 6,12 C5.44771525,12 5,11.5522847 5,11 C5,10.4477153 5.44771525,10 6,10 Z M10,10 C10.5522847,10 11,10.4477153 11,11 C11,11.5522847 10.5522847,12 10,12 C9.44771525,12 9,11.5522847 9,11 C9,10.4477153 9.44771525,10 10,10 Z M14,10 C14.5522847,10 15,10.4477153 15,11 C15,11.5522847 14.5522847,12 14,12 C13.4477153,12 13,11.5522847 13,11 C13,10.4477153 13.4477153,10 14,10 Z M6,5 L3,5 L3,7 L17,7 L17,5 L14,5 C14,5.55228475 13.5522847,6 13,6 C12.4477153,6 12,5.55228475 12,5 L8,5 C8,5.55228475 7.55228475,6 7,6 C6.44771525,6 6,5.55228475 6,5 Z\" />"
};
var cr = {
	name: I.DateTime,
	box: "0 0 20 20",
	content: "<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M13,2 C13.5522847,2 14,2.44771525 14,3 L17,3 C18.1045695,3 19,3.8954305 19,5 L19.0008411,9.6834702 C19.632174,10.6335237 20,11.7738067 20,13 C20,16.3137085 17.3137085,19 14,19 C12.7738067,19 11.6335237,18.632174 10.6834702,18.0008411 L3,18 C1.8954305,18 1,17.1045695 1,16 L1,5 C1,3.8954305 1.8954305,3 3,3 L6,3 C6,2.44771525 6.44771525,2 7,2 C7.55228475,2 8,2.44771525 8,3 L12,3 C12,2.44771525 12.4477153,2 13,2 Z M14,9 C11.790861,9 10,10.790861 10,13 C10,15.209139 11.790861,17 14,17 C16.209139,17 18,15.209139 18,13 C18,10.790861 16.209139,9 14,9 Z M9.52766929,9.0001315 L3,9 L3,16 L8.80325037,16.000963 C8.29239547,15.1182253 8,14.093259 8,13 C8,11.5593949 8.50770848,10.2373715 9.35395605,9.20309916 L9.52766929,9.0001315 Z M14,10 C14.5522847,10 15,10.4477153 15,11 L15,12.47 L16.470203,13.3745556 C16.8961053,13.6363239 17.058206,14.1671476 16.8676427,14.616159 L16.7990381,14.75 C16.551053,15.1795228 16.0249969,15.348408 15.5795487,15.1605478 L15.4470893,15.0924003 L13.5389825,13.9196388 C13.4794306,13.883037 13.4250363,13.8411748 13.3760426,13.7950116 L13.3066327,13.7226607 C13.1182557,13.5400593 13,13.2838397 13,13 L13,11 C13,10.4477153 13.4477153,10 14,10 Z M6,5 L3,5 L3,7 L14,7 C15.093259,7 16.1182253,7.29239547 17.000963,7.80325037 L17,5 L14,5 C14,5.55228475 13.5522847,6 13,6 C12.4477153,6 12,5.55228475 12,5 L8,5 C8,5.55228475 7.55228475,6 7,6 C6.44771525,6 6,5.55228475 6,5 Z\" />"
};
var lr = {
	name: I.File,
	box: "0 0 174.6638 215.24",
	content: "<path d=\"M 164.446 215.226 L 10.201 215.226 C 4.561 215.36 -0.069 210.78 0.001 205.133 L 0.001 10.104 C 0.001 4.381 4.411 0.01 10.201 0.01 L 95.497 0.01 C 96.479 -0.034 97.46 0.067 98.406 0.313 C 100.891 0.915 102.972 2.378 104.331 4.39 L 171.589 70.665 C 173.417 72.474 174.426 74.756 174.617 77.056 C 174.648 77.389 174.664 77.727 174.664 78.07 L 174.664 205.146 C 174.664 210.524 170.252 215.24 164.46 215.24 L 164.446 215.226 Z M 106.041 67.976 L 140.004 67.976 L 106.041 34.351 L 106.041 67.976 Z M 20.391 195.053 L 154.284 195.053 L 154.284 88.15 L 95.821 88.15 C 90.181 88.275 85.561 83.698 85.631 78.056 L 85.631 20.182 L 20.381 20.182 L 20.381 195.039 L 20.391 195.053 Z\" />"
};
var ur = {
	name: I.Map,
	box: "0 0 500 500",
	content: "<path d=\"M 0.311 248.111 L 72.314 406.373 L 127.585 406.373 L 55.239 248.111 L 127.585 93.626 L 72.314 93.626 L 0.311 248.111 Z\" />\n  <path d=\"M 427.684 93.626 L 372.413 93.626 L 444.76 248.111 L 372.413 406.373 L 427.684 406.373 L 499.688 248.111 L 427.684 93.626 Z\" />\n  <path d=\"M 156.34 243.402 L 169.642 202.341 C 200.292 213.136 222.558 222.485 236.438 230.389 C 232.775 195.496 230.847 171.496 230.654 158.388 L 272.583 158.388 C 272.004 177.472 269.787 201.377 265.932 230.1 C 285.788 220.076 308.535 210.822 334.174 202.341 L 347.475 243.402 C 322.993 251.498 298.993 256.895 275.475 259.594 C 287.234 269.812 303.811 288.029 325.21 314.245 L 290.511 338.824 C 279.329 323.595 266.124 302.872 250.896 276.655 C 236.63 303.836 224.1 324.559 213.305 338.824 L 179.184 314.245 C 201.546 286.678 217.546 268.461 227.185 259.594 C 202.316 254.774 178.702 249.377 156.34 243.402 Z\" />"
};
var dr = {
	name: I.Number,
	box: "0 0 57.543 40",
	content: "<g><path d=\"M 1.433 28.672 L 1.433 23.755 L 6.533 23.755 L 6.533 7.224 L 2.111 7.224 L 2.111 3.063 C 4.693 2.495 6.371 1.739 8.05 0.529 L 12.278 0.529 L 12.278 23.755 L 16.603 23.755 L 16.603 28.672 L 1.433 28.672 Z M 19.928 28.672 L 19.928 24.815 C 25.931 18.422 29.966 13.314 29.966 9.229 C 29.966 6.657 28.739 5.258 26.835 5.258 C 25.189 5.258 23.898 6.543 22.768 7.981 L 19.637 4.35 C 21.993 1.437 24.188 0 27.61 0 C 32.258 0 35.485 3.48 35.485 8.851 C 35.485 13.693 31.935 19.027 28.255 23.377 C 29.412 23.377 35.518 23.377 36.583 23.377 L 36.583 28.672 L 19.928 28.672 Z M 39.004 25.269 L 41.65 21.031 C 43.103 22.657 44.781 23.755 46.653 23.755 C 48.88 23.755 50.333 22.657 50.333 20.54 C 50.333 18.119 49.235 16.681 44.2 16.681 L 44.2 11.953 C 48.299 11.953 49.59 10.477 49.59 8.246 C 49.59 6.316 48.622 5.258 46.847 5.258 C 45.233 5.258 44.006 6.128 42.554 7.603 L 39.649 3.48 C 41.876 1.285 44.265 0 47.105 0 C 52.076 0 55.336 2.723 55.336 7.754 C 55.336 10.553 54.045 12.748 51.462 13.958 L 51.462 14.147 C 54.141 15.093 56.11 17.362 56.11 20.994 C 56.11 26.252 52.011 29.202 47.234 29.202 C 43.425 29.202 40.746 27.651 39.004 25.269 Z M 0 36.573 L 57.543 36.573 L 57.543 42.536 L 0 42.536 L 0 36.573 Z\" /></g>"
};
var fr = {
	name: I.Object,
	box: "20 0 1024 1024",
	content: "<path d=\"M 414.165 463.242 C 345.265 438.742 288.765 495.942 314.365 564.942 C 319.465 578.842 334.965 594.442 348.965 599.642 C 417.865 625.242 475.265 568.642 450.665 499.742 C 445.165 484.842 428.965 468.542 414.165 463.242\" />\n  <path d=\"M 795.283 99.791 L 743.883 99.791 C 730.478 99.523 719.402 109.76 719.183 122.618 L 719.183 151.103 C 719.402 163.961 730.478 174.198 743.883 173.93 L 777.483 173.93 C 814.983 173.93 832.683 193.112 832.683 233.299 L 832.683 412.461 C 832.683 455.046 848.983 487.368 880.783 508.852 C 894.367 517.607 894.625 536.688 881.283 545.778 C 849.183 568.03 832.883 599.584 832.883 641.018 L 832.883 820.948 C 832.883 859.312 815.083 879.453 777.583 879.453 L 743.983 879.453 C 730.578 879.186 719.502 889.423 719.283 902.28 L 719.283 930.766 C 719.501 943.662 730.64 953.914 744.083 953.593 L 795.283 953.593 C 838.683 953.593 872.283 939.878 895.983 914.365 C 917.683 890.483 928.483 857.682 928.483 817.399 L 928.483 645.622 C 928.483 619.15 934.383 599.872 946.183 588.075 C 957.083 576.566 974.683 569.564 999.183 566.207 C 1011.124 564.821 1020.171 555.202 1020.383 543.668 L 1020.383 509.907 C 1020.184 498.437 1011.245 488.842 999.383 487.368 C 974.883 483.724 957.283 476.434 946.283 465.5 C 934.483 452.744 928.583 433.562 928.583 407.954 L 928.583 237.04 C 928.583 195.894 917.783 162.996 896.083 139.306 C 872.283 112.739 838.683 99.887 795.283 99.791 Z\" />\n  <path d=\"M 304.883 116.291 L 304.883 157.054 C 304.719 166.43 296.659 173.902 286.883 173.742 L 246.683 173.742 C 209.183 173.742 191.483 192.924 191.483 233.111 L 191.483 412.273 C 191.483 457.831 172.883 491.496 136.483 513.076 C 125.472 519.373 125.255 534.595 136.083 541.178 C 172.683 563.717 191.483 596.711 191.483 640.926 L 191.483 820.951 C 191.483 859.316 209.183 879.457 246.683 879.457 L 286.883 879.457 C 296.783 879.457 304.883 886.842 304.883 896.146 L 304.883 936.908 C 304.719 946.246 296.72 953.703 286.983 953.597 L 228.983 953.597 C 185.583 953.597 151.983 939.881 128.283 914.369 C 106.583 890.487 95.783 857.685 95.783 817.403 L 95.783 645.434 C 95.783 618.962 89.883 599.684 78.083 587.887 C 66.383 575.514 46.983 568.321 19.883 565.444 C 10.962 564.659 4.099 557.539 3.983 548.947 L 3.983 504.348 C 3.983 495.908 10.783 488.811 19.883 487.852 C 46.983 484.686 66.383 477.014 78.083 465.408 C 89.883 452.652 95.783 433.374 95.783 407.862 L 95.783 236.852 C 95.783 195.706 106.583 162.808 128.283 139.118 C 151.983 112.647 185.583 99.795 228.983 99.795 L 286.883 99.795 C 296.626 99.526 304.72 106.944 304.883 116.291\" />\n  <path d=\"M 690.657 463.747 C 621.157 438.047 563.657 495.447 589.457 564.947 C 594.557 578.847 610.157 594.447 624.057 599.647 C 693.557 625.347 751.057 567.847 725.257 498.347 C 720.057 484.447 704.457 468.947 690.557 463.747\" />"
};
var pr = [
	{
		name: I.String,
		box: "0 0 59.931 33.007",
		content: "<path d=\"M 5.434 32.408 L 6.718 25.097 L 13.288 25.097 L 14.572 32.408 L 20.186 32.408 L 13.288 0.599 L 6.898 0.599 L 0 32.408 L 5.434 32.408 Z M 12.273 19.197 L 7.734 19.197 L 8.211 16.503 C 8.779 13.339 9.376 9.62 9.914 6.285 L 10.033 6.285 C 10.63 9.535 11.198 13.339 11.795 16.503 L 12.273 19.197 Z M 30.906 32.408 C 35.743 32.408 39.595 29.501 39.595 23.002 C 39.595 18.77 37.893 16.375 35.654 15.52 L 35.654 15.349 C 37.445 14.365 38.55 11.288 38.55 8.466 C 38.55 2.352 34.877 0.599 30.279 0.599 L 22.515 0.599 L 22.515 32.408 L 30.906 32.408 Z M 30.07 13.212 L 27.86 13.212 L 27.86 6.414 L 30.07 6.414 C 32.309 6.414 33.354 7.354 33.354 9.62 C 33.354 11.8 32.339 13.212 30.07 13.212 Z M 30.518 26.55 L 27.86 26.55 L 27.86 18.855 L 30.518 18.855 C 33.116 18.855 34.4 19.881 34.4 22.489 C 34.4 25.225 33.086 26.55 30.518 26.55 Z M 52.675 33.007 C 55.571 33.007 58.05 31.425 59.931 28.304 L 57.124 23.515 C 56.079 25.14 54.645 26.423 52.884 26.423 C 49.748 26.423 47.718 22.746 47.718 16.418 C 47.718 10.219 50.077 6.542 52.943 6.542 C 54.526 6.542 55.69 7.568 56.795 9.021 L 59.602 4.147 C 58.079 1.924 55.75 0 52.854 0 C 47.21 0 42.253 6.072 42.253 16.674 C 42.253 27.449 47.031 33.007 52.675 33.007 Z\"\" />"
	},
	dr,
	or,
	sr,
	{
		name: I.Time,
		box: "0 0 20 20",
		content: "<path d=\"M3.40035701171875,3.40035701171875Q0.66668701171875,6.13402701171875,0.66668701171875,10.00001701171875Q0.66668701171875,13.86598701171875,3.40035701171875,16.59968701171875Q6.13402701171875,19.33338701171875,10.00001701171875,19.33338701171875Q13.86598701171875,19.33338701171875,16.59968701171875,16.59968701171875Q19.33338701171875,13.86598701171875,19.33338701171875,10.00001701171875Q19.33338701171875,6.13402701171875,16.59968701171875,3.40035701171875Q13.86598701171875,0.66668701171875,10.00001701171875,0.66668701171875Q6.13402701171875,0.66668701171875,3.40035701171875,3.40035701171875ZM4.81456701171875,15.18548701171875Q2.66668701171875,13.03758701171875,2.66668701171875,10.00001701171875Q2.66668701171875,6.96245701171875,4.81456701171875,4.81456701171875Q6.96245701171875,2.66668701171875,10.00001701171875,2.66668701171875Q13.03758701171875,2.66668701171875,15.18548701171875,4.81456701171875Q17.33338701171875,6.96245701171875,17.33338701171875,10.00001701171875Q17.33338701171875,13.03758701171875,15.18548701171875,15.18548701171875Q13.03758701171875,17.33338701171875,10.00001701171875,17.33338701171875Q6.96244701171875,17.33338701171875,4.81456701171875,15.18548701171875Z\" fill-rule=\"evenodd\" />\n  <path d=\"M10.90349072265625,5.00046591815625L10.90308072265625,9.103731035156251L14.58337072265625,9.10372103515625Q14.67201072265625,9.10372103515625,14.75895072265625,9.12101103515625Q14.84589072265625,9.13831103515625,14.927790722656251,9.172231035156251Q15.009680722656249,9.20615103515625,15.083390722656251,9.25540103515625Q15.15709072265625,9.304651035156251,15.21977072265625,9.367331035156251Q15.28245072265625,9.43001103515625,15.331700722656251,9.50371103515625Q15.38094072265625,9.57741103515625,15.41486072265625,9.65931103515625Q15.44879072265625,9.74120103515625,15.466080722656251,9.82814103515625Q15.48337072265625,9.91508103515625,15.48337072265625,10.00372103515625Q15.48337072265625,10.09236103515625,15.466080722656251,10.17930103515625Q15.44879072265625,10.26624103515625,15.41486072265625,10.34814103515625Q15.38094072265625,10.43003103515625,15.331700722656251,10.50373103515625Q15.28245072265625,10.57744103515625,15.21977072265625,10.64012103515625Q15.15709072265625,10.70280103515625,15.083390722656251,10.75204103515625Q15.009680722656249,10.80129103515625,14.927790722656251,10.835211035156249Q14.84589072265625,10.86913103515625,14.75895072265625,10.88643103515625Q14.67202072265625,10.90372103515625,14.58337072265625,10.90372103515625L14.582450722656251,10.90372103515625L10.00299072265625,10.90373103515625Q9.82396972265625,10.90373103515625,9.65857572265625,10.83522103515625Q9.49318272265625,10.76671103515625,9.36659572265625,10.64012103515625Q9.24000772265625,10.513541035156251,9.17149972265625,10.34814103515625Q9.10299072265625,10.182751035156251,9.10299072265625,10.00373103515625L9.10349072265625,5.000061035155353L9.10349072265625,4.99997112195625Q9.10349972265625,4.91133453515625,9.12079872265625,4.82440303515625Q9.13809872265625,4.73747103515625,9.17202472265625,4.65558403515625Q9.205950722656251,4.57369703515625,9.25519872265625,4.5000010351562505Q9.30444772265625,4.42630603515625,9.36712672265625,4.36363303515625Q9.42980472265625,4.30096103515625,9.50350572265625,4.25172003515625Q9.57720572265625,4.20247903515625,9.65909672265625,4.16856103515625Q9.74098672265625,4.13464303515625,9.82792072265625,4.11735203515625Q9.91485402265625,4.10006103515625,10.00349062665625,4.10006103515625Q10.09213292265625,4.10006103515625,10.17907172265625,4.11735403515625Q10.26601072265625,4.13464803515625,10.34790572265625,4.16857003515625Q10.42980072265625,4.20249103515625,10.50350372265625,4.25173903515625Q10.57720672265625,4.30098503515625,10.63988672265625,4.3636650351562505Q10.70256572265625,4.42634503515625,10.75181272265625,4.50004803515625Q10.80105972265625,4.57375103515625,10.83498172265625,4.65564603515625Q10.86890372265625,4.73754103515625,10.88619772265625,4.82448003515625Q10.90349072265625,4.91141883515625,10.90349072265625,5.00006103515625L10.90349072265625,5.00015094835625L10.90349072265625,5.00046591815625Z\" fill-rule=\"evenodd\" />"
	},
	cr,
	fr,
	ar,
	ur,
	lr,
	ir,
	vn,
	_n,
	gn,
	hn,
	Ln,
	In,
	Vn,
	xn,
	Cn,
	Tn,
	wn,
	Sn,
	Mn,
	An,
	On,
	Dn,
	bn,
	rr,
	nr,
	Gn,
	Xn,
	yn,
	Fn,
	Rn,
	tr,
	{
		name: Y.Undo,
		box: "0 0 1024 1024",
		content: "<path d=\"M512 64A510.272 510.272 0 0 0 149.984 213.984L0.032 64v384h384L240.512 304.48A382.784 382.784 0 0 1 512.032 192c212.064 0 384 171.936 384 384 0 114.688-50.304 217.632-130.016 288l84.672 96a510.72 510.72 0 0 0 173.344-384c0-282.784-229.216-512-512-512z\"></path>"
	},
	er,
	kn,
	En,
	pn,
	mn,
	Nn,
	Pn,
	Hn,
	Kn,
	jn,
	zn,
	Bn,
	Un,
	Jn,
	Qn,
	$n,
	Zn,
	Yn,
	qn,
	{
		name: Y.Versions,
		box: "64 64 896 896",
		content: "<path d=\"M945 412H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h256c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM811 548H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h122c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM477.3 322.5H434c-6.2 0-11.2 5-11.2 11.2v248c0 3.6 1.7 6.9 4.6 9l148.9 108.6c5 3.6 12 2.6 15.6-2.4l25.7-35.1v-.1c3.6-5 2.5-12-2.5-15.6l-126.7-91.6V333.7c.1-6.2-5-11.2-11.1-11.2z\"></path><path d=\"M804.8 673.9H747c-5.6 0-10.9 2.9-13.9 7.7a321 321 0 01-44.5 55.7 317.17 317.17 0 01-101.3 68.3c-39.3 16.6-81 25-124 25-43.1 0-84.8-8.4-124-25-37.9-16-72-39-101.3-68.3s-52.3-63.4-68.3-101.3c-16.6-39.2-25-80.9-25-124 0-43.1 8.4-84.7 25-124 16-37.9 39-72 68.3-101.3 29.3-29.3 63.4-52.3 101.3-68.3 39.2-16.6 81-25 124-25 43.1 0 84.8 8.4 124 25 37.9 16 72 39 101.3 68.3a321 321 0 0144.5 55.7c3 4.8 8.3 7.7 13.9 7.7h57.8c6.9 0 11.3-7.2 8.2-13.3-65.2-129.7-197.4-214-345-215.7-216.1-2.7-395.6 174.2-396 390.1C71.6 727.5 246.9 903 463.2 903c149.5 0 283.9-84.6 349.8-215.8a9.18 9.18 0 00-8.2-13.3z\"></path>"
	},
	Wn,
	{
		name: Y.XML,
		box: "0 0 1163 1024",
		content: "<path d=\"M631.490909 0l109.454546 22.763636L532.145455 1024l-109.454546-22.763636L631.490909 0m374.109091 512l-200.436364-204.218182V146.763636L1163.636364 512l-358.472728 364.654545V715.636364l200.436364-203.636364M0 512l358.472727-365.236364v161.018182L158.036364 512l200.436363 203.636364v161.018181L0 512z\" p-id=\"8050\"></path>"
	}
].map((e) => `  <symbol viewBox="${e.box}" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" id="@baseflow-icon-${e.name}">${e.content}</symbol>`);
pr.unshift("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" aria-hidden=\"true\" focusable=\"false\" width=\"0\" height=\"0\">"), pr.push("</svg>");
var mr = pr.join("\n");
var hr = (0, import_react.createContext)("");
function gr() {
	return (0, import_react.useContext)(hr);
}
var _r = (0, import_react.createContext)({});
function vr() {
	return (0, import_react.useContext)(_r);
}
var yr = _r.Provider;
function Z(e) {
	let t = (0, import_react.useRef)(e);
	t.current = e;
	let n = (0, import_react.useRef)(void 0);
	return n.current ||= function(...e) {
		return t.current.apply(this, e);
	}, n.current;
}
var br = function({ className: e, style: t, htmlType: n, children: r }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: e,
		style: t,
		type: n,
		children: r
	});
};
var xr = function({ value: e, onChange: t, className: n, placeholder: r }) {
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
var Sr = (0, import_react.memo)(({ value: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: e }));
var Cr = function({ value: e, onChange: t, className: n, block: r, placeholder: i }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: K.classNames(n, { "ͼbaseflow-sr-inputBlock": r }),
		value: e,
		placeholder: i,
		onChange: (e) => {
			t?.(e.target.value);
		}
	});
};
var wr = (0, import_react.memo)(({ options: e, value: t, onChange: n, className: r }) => {
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
var Tr = function({ value: e, options: t, onChange: n, className: r, block: i }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: K.classNames(r, { "ͼbaseflow-sr-inputBlock": i }),
		value: e,
		onChange: (e) => {
			n?.(e.target.value);
		},
		children: t.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: e.label }, e.value))
	});
};
var Er = function() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading..." });
};
var Dr = function({ value: e, onChange: t, className: n }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: n,
		type: "checkbox",
		checked: !!e,
		onChange: (e) => {
			t?.(e.target.checked);
		}
	});
};
var Or = function({ className: e, style: t, rows: n, value: r, noTrim: i, block: a, onChange: o, onBlur: s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: K.classNames(e, { "ͼbaseflow-sr-inputBlock": a }),
		style: t,
		value: r,
		rows: n,
		onBlur: s,
		onChange: (e) => o?.(i ? e.target.value : e.target.value.trim())
	});
};
var kr = function({ value: e, onChange: t, className: n, placeholder: r }) {
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
var Ar = (0, import_react.memo)(function({ payload: e, onClose: t }) {
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
function jr(e, t, n = {}) {
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
var Mr = (0, import_react.memo)(({ payload: e, onClose: t }) => {
	let n = (0, import_react.useRef)(void 0), r = (0, import_react.useRef)(void 0), i = (0, import_react.useRef)(0), a = Z(() => {
		e && !i.current && (i.current = setTimeout(() => {
			t(), i.current = 0;
		}, 300));
	}), o = Z(() => {
		e && (clearTimeout(i.current), i.current = 0, t());
	}), s = Z(() => {
		i.current &&= (clearTimeout(i.current), 0);
	});
	return (0, import_react.useEffect)(() => {
		r.current && r.current.removeEventListener("mouseleave", a, !1);
		let t = e.target;
		return r.current = t, t && (i.current &&= (clearTimeout(i.current), 0), jr(t, n.current, e.offset), t.addEventListener("mouseleave", a, !1)), () => {
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
		onMouseOver: s,
		onMouseLeave: a,
		ref: n,
		children: e.content
	});
});
function Nr(e, t) {
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
var Pr = (0, import_react.memo)(({ payload: e, onClose: t }) => {
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
		return r.current = t, t && (i.current &&= (clearTimeout(i.current), 0), Nr(t, n.current), t.addEventListener("mouseleave", a, !1)), () => {
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
var Fr = (0, import_react.memo)(() => {
	let [e, t] = (0, import_react.useState)(null), [n, r] = (0, import_react.useState)(null), [i, a] = (0, import_react.useState)(null), o = Z(() => {
		e?.mask === "closeAble" && t(null);
	}), s = (0, import_react.useCallback)(() => {
		a(null);
	}, []), l = (0, import_react.useCallback)(() => {
		r(null);
	}, []);
	return (0, import_react.useMemo)(() => {
		Ir({
			popup: a,
			tooltip: r,
			modal: t
		});
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			zIndex: 1001
		},
		children: [
			n ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pr, {
				payload: n,
				onClose: l
			}) : null,
			e ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ar, {
				payload: e,
				onClose: o
			}) : null,
			i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mr, {
				payload: i,
				onClose: s
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { display: "none" },
				dangerouslySetInnerHTML: { __html: mr }
			})
		]
	});
});
var Q = {
	Button: br,
	Select: Tr,
	Input: Cr,
	TextArea: Or,
	Switch: Dr,
	DatePicker: xr,
	TimePicker: kr,
	Segmented: wr,
	DescMD: Sr,
	Spin: Er,
	popup: () => void 0,
	modal: () => void 0,
	tooltip: () => void 0
};
function Ir(e) {
	Object.assign(Q, e);
}
var Lr = class extends Kt {
	constructor() {
		super({
			variableClick: {},
			expressionClick: {},
			valueChanged: {}
		});
	}
};
var Rr = {
	[L.Expression](e, t) {
		if (e) {
			if (t === L.Variable) return e;
			if (t === L.Template) return q.toJSTpl(e);
		}
		return e;
	},
	[L.Template](e, t) {
		if (e) {
			if (t === L.Variable) return q.wrapVariable(e);
			if (t === L.Expression) return "";
		}
		return e;
	},
	[L.Variable](e, t) {
		if (e) {
			if (t === L.Expression) return "";
			if (t === L.Template) return q.extractVariable(e)?.[0] || "";
		}
		return e;
	}
};
function zr(e, t) {
	let n = t || e?.source || L.Variable, r = e?.text || "", i = "";
	return e?.text ? (t && e.source !== t && (r = Rr[t](e.text, e.source)), i = n === L.Variable && r ? q.wrapVariable(r) : r) : i = "", {
		source: n,
		text: r,
		mode: n === L.Expression ? "complex" : "simple",
		code: i
	};
}
function Br(e, t, n, r, i) {
	e = e.trim();
	let a, o;
	if (n.mode === t ? t === "simple" ? e ? (o = q.getSingleVariable(e), o ? a = L.Variable : (a = L.Template, o = e)) : (a = L.Variable, o = "") : (a = L.Expression, o = e) : t === "simple" ? (a = L.Variable, o = "") : (a = L.Expression, o = q.getSingleVariable(e), o ||= q.toJSTpl(e)), r && r !== a && (o = Rr[r](o, a), a = r), i === "mapping") {
		if (a === L.Template && /\D/.test(o) || a === L.Expression) o = "", a = L.Variable;
		else if (a === L.Variable) {
			let { fun: e } = et.matchVariable(o);
			e && e !== U._number && e !== U._path && (o = "", a = L.Variable);
		}
	} else if (i === "variable") {
		if (a === L.Template || a === L.Expression) o = "", a = L.Variable;
		else if (a === L.Variable) {
			let { fun: e } = et.matchVariable(o);
			e && e !== U._path && (o = "", a = L.Variable);
		}
	}
	return {
		source: a,
		text: o
	};
}
var Vr = (0, import_react.memo)((e) => {
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
		placeholder: `${R.complexValue}...`,
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
function Hr(e) {
	return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r?\n/g, "<br/>").replace(/\s/g, "&nbsp;").replace(RegExp(`(${q.REG})`, "g"), `<${q.VarTag} contentEditable="false" class="ͼbaseflow-TplEditor__var"><i class="act"></i>$2</${q.VarTag}>`);
}
function Ur(e) {
	let t = "", n = Array.from(e.childNodes);
	return n[n.length - 1] && n[n.length - 1].nodeName === "BR" && n.length > 1 && (n = n.splice(0, n.length - 1)), n.forEach((e) => {
		if (e.nodeName === "#text") t += e.nodeValue;
		else if (e.nodeName === "BR") t += "\n";
		else if (e.nodeName === "P") t += `\n${Ur(e)}`;
		else if (e.nodeName === q.VarTag) t += q.wrapVariable(e.textContent);
		else if (e.nodeName === "DIV") {
			let n = Array.from(e.childNodes);
			n.length === 1 && n[0].nodeName === "BR" || e.previousSibling && e.previousSibling.nodeName === "BR" ? t += Ur(e) : t += `\n${Ur(e)}`;
		} else t += Ur(e);
	}), t.replace(/\u00A0/g, " ").trim();
}
function Wr(e, t) {
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
function Gr(e) {
	if (e.key === "Enter") {
		let t = window.getSelection();
		if (t?.rangeCount) {
			let n = t.getRangeAt(0), r = document.createElement("br");
			Wr({ args: [
				n.startContainer,
				n.startOffset,
				n.endContainer,
				n.endOffset
			] }, r), e.preventDefault();
		}
	}
}
function Kr(e, t) {
	let n = document.createElement(q.VarTag);
	n.contentEditable = "false", n.className = "ͼbaseflow-TplEditor__var", n.innerHTML = `<i class="act"></i>${t.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\s/g, "&nbsp;")}`, Wr(e, n);
}
function qr(e) {
	e.stopPropagation(), e.preventDefault();
	let t = e.clipboardData?.getData("text/plain");
	if (t) {
		let e = Hr(t), n = window.getSelection();
		n?.rangeCount && n.getRangeAt(0).deleteContents(), document.execCommand("insertHTML", !1, e);
	}
}
var Jr = {
	valueToHtml: Hr,
	htmlToValue: Ur,
	onKeyDown: Gr,
	insertVariable: Kr,
	onPaste: qr
};
var Yr = (0, import_react.memo)(({ path: e, args: t, onChange: n }) => {
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
	}, [e, t]), a = (0, import_react.useCallback)(() => Q.popup(null), []), o = Z(() => {
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
				onClick: a,
				children: R.ButtonCancel
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
				size: "small",
				type: "primary",
				onClick: o,
				children: R.ButtonSubmit
			})]
		})]
	});
});
var Xr = (0, import_react.memo)(({ tag: e, target: t, sourceType: n, onSubmit: r }) => {
	let { text: i, fun: a, variable: o, args: s, isAssert: c } = (0, import_react.useMemo)(() => et.matchVariable(e.textContent || ""), [e.textContent]), l = Z(() => {
		let t = o.endsWith("!") ? o.slice(0, -1) : `${o}!`, n = e.childNodes[1];
		n.textContent = i.replace(o, t), Q.popup(null), r();
	}), u = Z((t) => {
		let n = e.childNodes[1];
		n.textContent = t.some((e) => e !== "0") ? `${U._path}(${o},${t.join(",")})` : o, Q.popup(null), r();
	}), d = Z((n) => {
		let i = e.childNodes[1];
		n === U._path ? Q.popup({
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Yr, {
				path: o,
				args: s,
				onChange: u
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: R.nullAssert })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "funs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: K.classNames("ͼbaseflow-TplEditor__Fun", {
						on: a === U._path,
						disabled: !o.includes("[0]")
					}),
					onClick: () => o.includes("[0]") && d(U._path),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.setPath }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {})
					]
				}),
				n !== "variable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === U._number }),
					onClick: () => d(U._number),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.convertTo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Number)" })
					]
				}),
				!n && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === U._string }),
						onClick: () => d(U._string),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(String)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === U._boolean }),
						onClick: () => d(U._boolean),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Boolean)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === U._date }),
						onClick: () => d(U._date),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Date)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === U._time }),
						onClick: () => d(U._time),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Time)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === U._datetime }),
						onClick: () => d(U._datetime),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(DateTime)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("ͼbaseflow-TplEditor__Fun", { on: a === U._any }),
						onClick: () => d(U._any),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Help }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.convertTo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "(Any)" })
						]
					})
				] })
			]
		})]
	});
});
function Zr(e, t) {
	return Array.prototype.indexOf.call(e, t);
}
var Qr = (0, import_react.forwardRef)(({ value: e = "", onChange: t, onBlur: n, onFocus: r, onClickVariable: i, placeholder: a, sourceType: o }, s) => {
	let c = (0, import_react.useRef)(null), l = (0, import_react.useRef)({
		value: "",
		html: "",
		currentHtml: "",
		currentEmpty: !0
	}), d = (0, import_react.useRef)(null), [g, y] = (0, import_react.useState)(0);
	(0, import_react.useMemo)(() => {
		Object.assign(l.current, {
			value: e,
			html: Jr.valueToHtml(e),
			currentEmpty: !e
		});
	}, [e]);
	let b = Z(() => {
		let e = !c.current.textContent;
		e !== l.current.currentEmpty && (l.current.currentEmpty = e, y(g + 1));
	}), x = Z(() => {
		let n = Jr.htmlToValue(c.current);
		e !== n && (l.current.currentHtml = c.current.innerHTML, l.current.currentEmpty = !e, c.current.innerHTML = l.current.html, y(g + 1), t?.(n));
	}), S = Z((e) => {
		n?.(e), x();
	}), C = Z((e) => {
		if (e.target.nodeName === "I") {
			let t = e.target.parentNode, n = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xr, {
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
		let { variable: t } = et.matchVariable(e.target.nodeName === q.VarTag ? e.target.textContent : "");
		t = t.replace(/!$/, ""), t && i?.(t);
	}), w = Z((e) => {
		if (!d.current) {
			let e = c.current.childNodes;
			d.current = {
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
		let { start: t, end: n } = d.current, r = c.current.childNodes;
		try {
			Jr.insertVariable({ args: [
				r[t.index] || c.current,
				t.offset,
				r[n.index] || c.current,
				n.offset
			] }, e);
		} catch (e) {
			console.log(e), d.current = null;
		}
		setTimeout(x);
	}), T = Z(() => {
		let e = window.getSelection();
		if (e?.rangeCount) {
			let { startContainer: t, endContainer: n, startOffset: r, endOffset: i } = e.getRangeAt(0);
			if (c.current.contains(t) && c.current.contains(n) && t.parentNode?.nodeName !== q.VarTag && n.parentNode?.nodeName !== q.VarTag) {
				let e = c.current.childNodes;
				d.current = {
					start: {
						index: Zr(e, t),
						offset: r
					},
					end: {
						index: Zr(e, n),
						offset: i
					}
				};
				return;
			}
		}
		d.current = null;
	});
	return (0, import_react.useImperativeHandle)(s, () => ({ insertVariable: w }), [w]), (0, import_react.useEffect)(() => {
		if (c.current.innerHTML = l.current.html, c.current.innerHTML !== l.current.currentHtml && (d.current = null), document.activeElement === c.current && d.current) {
			let { start: e, end: t } = d.current, n = c.current.childNodes, r = [
				n[e.index] || c.current,
				e.offset,
				n[t.index] || c.current,
				t.offset
			], i = window.getSelection();
			if (i) {
				i.removeAllRanges();
				try {
					let e = document.createRange();
					e.setStart(r[0], r[1]), e.setEnd(r[2], r[3]), e.collapse(!0), i.addRange(e);
				} catch (e) {
					d.current = null, console.log(e);
				}
			}
		}
	}, [e]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-TplEditor",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: c,
			className: "input",
			contentEditable: !0,
			onKeyDown: Jr.onKeyDown,
			onInput: b,
			onBlur: S,
			onFocus: r,
			onPaste: Jr.onPaste,
			onSelect: T,
			onClick: C
		}), l.current.currentEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "placeholder",
			children: a || R.requiredPrompt
		}) : null]
	});
});
var $r = (0, import_react.memo)(Qr);
var ei = (0, import_react.memo)(({ value: e, onChange: t, options: n }) => {
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
		placeholder: R.selectPrompt,
		value: r,
		onChange: i,
		options: n
	});
});
var ti = [{
	value: "true",
	label: "true"
}, {
	value: "false",
	label: "false"
}];
function ni(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime());
}
function ri(e) {
	let t = /* @__PURE__ */ new Date(`1979-01-01 ${e}`);
	return Number.isNaN(t.getTime());
}
var ii = {
	[I.Bool]: (e, t) => !e || e === "true" || e === "false" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
		valueNotBeEmpty: !0,
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: R.selectPrompt,
		options: ti,
		...t
	}) : null,
	[I.Date]: (e, t) => !e || !ni(e) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.DatePicker, {
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: R.selectPrompt,
		...t
	}) : null,
	[I.Time]: (e, t) => !e || !ri(e) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.TimePicker, {
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: R.selectPrompt,
		...t
	}) : null,
	[I.DateTime]: (e, t) => !e || !ni(e) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.DatePicker, {
		variant: "borderless",
		block: !0,
		showTime: !0,
		className: "nativeInput",
		placeholder: R.selectPrompt,
		...t
	}) : null,
	[I.String]: (e, t) => t ? (t = t.map((e) => e.label ? e : {
		...e,
		label: e.value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
		valueNotBeEmpty: !0,
		variant: "borderless",
		block: !0,
		className: "nativeInput",
		placeholder: R.selectPrompt,
		options: t
	})) : null,
	[I.Array]: (e, t) => t ? (t = t.map((e) => e.label ? e : {
		...e,
		label: e.value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ei, { options: t })) : null
};
function ai(e, t) {
	return e === I.String || e === I.Number ? t ? ii[I.String] : void 0 : e === I.Array ? t ? ii[I.Array] : void 0 : ii[e];
}
var oi = (0, import_react.forwardRef)((e, t) => {
	let { value: n, onChange: i, onClickVariable: a, dataType: o, nativeRenderOptions: s, placeholder: c, sourceType: l } = e, [u, d] = (0, import_react.useState)(!0), y = e.nativeRender || ai(o, s), b = (0, import_react.useRef)(null), x = (0, import_react.useMemo)(() => {
		let e = y ? y(n, s) : null;
		return e ? (0, import_react.cloneElement)(e, {
			value: n,
			onChange: i
		}) : null;
	}, [
		y,
		i,
		s,
		n
	]), S = Z((e) => {
		e.stopPropagation(), d(!u), !u && !x && i("");
	});
	(0, import_react.useMemo)(() => {
		d(!n || !!x);
	}, [x, n]);
	let C = Z((e) => {
		b.current ? b.current.insertVariable(e) : i(q.wrapVariable(e));
	});
	return (0, import_react.useImperativeHandle)(t, () => ({ insertVariable: C }), [C]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!u || !x ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)($r, {
		ref: b,
		value: n,
		onChange: i,
		onClickVariable: a,
		placeholder: c,
		sourceType: l
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
var si = (0, import_react.memo)(oi);
var ci = (0, import_react.forwardRef)((e, t) => {
	let n = vr(), [r] = (0, import_react.useState)(Ut.createUID()), i = (0, import_react.useRef)(null), a = (0, import_react.useRef)(""), { style: o, variant: s, nativeRender: l, optional: d, nativeRenderOptions: g, onChange: y, sourceType: b, error: x, hideError: S, dataTypeEditable: C, context: w = "", runtime: T = "expression", dataType: E = I.String } = e, ee = e.variableFilter, D = T === "script" ? L.Expression : e.dataSource, te = b === "mapping" ? e.placeholder || R.loopContextPrompt : e.placeholder, O = b === "mapping" || e.hideIcon, [k, A] = (0, import_react.useState)(!1), [ne] = (0, import_react.useState)(new Lr()), [j, re] = (0, import_react.useState)(""), M = Z((e) => {
		j !== e && re(e);
	}), ie = (0, import_react.useMemo)(() => {
		if (e.height) return { minHeight: e.height };
	}, [e.height]), ae = (0, import_react.useMemo)(() => K.classNames("ͼbaseflow-SuperInput", e.className, s, {
		active: k,
		hideIcon: O,
		hasError: !S && (x || j)
	}), [
		e.className,
		O,
		x,
		j,
		S,
		s,
		k
	]), oe = (0, import_react.useRef)(void 0);
	(0, import_react.useMemo)(() => {
		oe.current = E;
	}, [E]);
	let N = (0, import_react.useMemo)(() => zr(e.value, D), [e.value, D]), se = Z((t) => {
		if (N.mode !== t) {
			let { source: n, text: r } = Br(N.code, t, N, D, b);
			(n !== e.value?.source || r !== e.value?.text) && y?.({
				type: E,
				optional: d,
				source: n,
				text: r
			});
		}
	}), ce = Z((t) => {
		if (N.code !== t) {
			let { source: n, text: r } = Br(t, N.mode, N, D, b);
			if (n !== e.value?.source || r !== e.value?.text) {
				let e = {
					type: E,
					optional: d,
					source: n,
					text: r
				};
				C && n === L.Variable && oe.current && (e.type = oe.current), y?.(e);
			}
		}
	}), le = Z((e) => {
		y?.({
			type: E,
			optional: d,
			source: N.source,
			text: e
		});
	}), ue = (0, import_react.useCallback)((e, t) => {
		oe.current = t, i.current?.insertVariable(e);
	}, []), de = Z(() => N.mode), fe = Z(() => E), pe = Z(() => w), me = Z(() => T), he = Z(() => ee), P = Z(() => e.value), ge = (0, import_react.useCallback)(() => a.current, []), _e = Z(() => e.brand), F = (0, import_react.useCallback)((e) => {
		e || (a.current = ""), A(e);
	}, []), [ve] = (0, import_react.useState)({
		setMode: se,
		getMode: de,
		setText: le,
		insertVariable: ue,
		getDataType: fe,
		getContext: pe,
		getValue: P,
		getHighlight: ge,
		getBrand: _e,
		getRuntime: me,
		setActive: F,
		getVariableFilter: he,
		addListener: ne.addListener.bind(ne)
	});
	(0, import_react.useImperativeHandle)(t, () => ve, [ve]);
	let ye = Z(() => {
		k || n.setActivedSuperInput(ve);
	}), be = Z(() => {
		if (!d && !N.text) {
			M(R.requiredPrompt);
			return;
		}
		let e = Rt.superInputToInspector({
			type: E,
			optional: d,
			source: N.source,
			text: N.text
		}, w, b === "mapping");
		e ? n.validateSuperInput(`${r}`, e, M) : M("");
	}), xe = Z((e) => {
		a.current = e, ne.dispatch("variableClick", {
			variable: e,
			target: ve
		});
	}), Se = Z((e) => {
		ne.dispatch("expressionClick", {
			expression: e,
			target: ve
		});
	}), Ce = Z((e) => {
		Q.popup(null);
		let t = e.target, n = t.dataset.type || t.parentElement?.dataset.type;
		n && y?.({
			type: n,
			optional: d,
			source: N.source,
			text: N.text
		});
	}), we = (0, import_react.useMemo)(() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "ͼbaseflow-SuperInput__dataTypeMenu",
		onClick: Ce,
		children: Ne.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			"data-type": e.value,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: e.value }),
				" ",
				e.label
			]
		}, e.value))
	}), [Ce]), Te = Z((e) => {
		C && Q.popup({
			content: we,
			target: e.target,
			offset: {
				left: "-15px",
				top: "2px"
			}
		});
	});
	return (0, import_react.useEffect)(() => {
		be();
	}, [w, e.value]), (0, import_react.useEffect)(() => () => {
		n.getActivedSuperInput() === ve && n.setActivedSuperInput(null);
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames(ae, N.mode),
		"data-error": x || j || void 0,
		style: o,
		children: [
			!D && !b && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ͼbaseflow-SuperInput__modeSwitch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: K.classNames("item", { on: N.mode === "simple" }),
					onClick: () => se("simple"),
					children: R.simpleValue
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: K.classNames("item", { on: N.mode === "complex" }),
					onClick: () => se("complex"),
					children: R.complexValue
				})]
			}),
			!O && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				className: K.classNames("dataType", { editable: C }),
				name: E,
				onClick: Te
			}),
			!S && (x || j) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "dataError",
				title: x || j,
				onClick: (e) => {
					J.clipboard.write(e.currentTarget.textContent), J.message.success(R.copied);
				},
				children: x || j
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("ͼbaseflow-SuperInput__input", N.mode),
				"data-baseflow-role": K.domRoles.SuperInput,
				style: ie,
				onClick: ye,
				children: N.mode === "complex" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vr, {
					onChange: ce,
					text: N.code,
					onClickExpression: Se
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(si, {
					ref: i,
					dataType: E,
					value: N.code,
					onChange: ce,
					nativeRender: l,
					nativeRenderOptions: g,
					onClickVariable: xe,
					placeholder: te,
					sourceType: b
				})
			})
		]
	});
});
var li = (0, import_react.memo)(ci);
function ui(e) {}
function di(e) {
	switch (e) {
		case I.String: return [
			{
				label: R.equalTo,
				value: "equalTo"
			},
			{
				label: R.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: R.startsWith,
				value: "startsWith"
			},
			{
				label: R.endsWith,
				value: "endsWith"
			},
			{
				label: R.containsString,
				value: "containsString"
			},
			{
				label: R.notContainsString,
				value: "notContainsString"
			},
			{
				label: R.containedIn,
				value: "containedIn"
			},
			{
				label: R.notContainedIn,
				value: "notContainedIn"
			},
			{
				label: R.in,
				value: "in"
			},
			{
				label: R.notIn,
				value: "notIn"
			}
		];
		case I.Number: return [
			{
				label: R.equalTo,
				value: "equalTo"
			},
			{
				label: R.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: R.greaterThan,
				value: "greaterThan"
			},
			{
				label: R.lessThan,
				value: "lessThan"
			},
			{
				label: R.greaterOrEqual,
				value: "greaterOrEqual"
			},
			{
				label: R.lessOrEqual,
				value: "lessOrEqual"
			},
			{
				label: R.in,
				value: "in"
			},
			{
				label: R.notIn,
				value: "notIn"
			}
		];
		case I.Date:
		case I.Time:
		case I.DateTime: return [
			{
				label: R.equalTo,
				value: "equalTo"
			},
			{
				label: R.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: R.laterThan,
				value: "laterThan"
			},
			{
				label: R.earlierThan,
				value: "earlierThan"
			},
			{
				label: R.laterOrEqual,
				value: "laterOrEqual"
			},
			{
				label: R.earlierOrEqual,
				value: "earlierOrEqual"
			},
			{
				label: R.in,
				value: "in"
			},
			{
				label: R.notIn,
				value: "notIn"
			}
		];
		case I.Bool: return [
			{
				label: R.equalTo,
				value: "equalTo"
			},
			{
				label: R.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: R.in,
				value: "in"
			},
			{
				label: R.notIn,
				value: "notIn"
			}
		];
		case I.Array: return [
			{
				label: R.equalTo,
				value: "equalTo"
			},
			{
				label: R.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: R.containsItem,
				value: "containsItem"
			},
			{
				label: R.notContainsItem,
				value: "notContainsItem"
			},
			{
				label: R.in,
				value: "in"
			},
			{
				label: R.notIn,
				value: "notIn"
			}
		];
		case I.Map:
		case I.Object: return [
			{
				label: R.equalTo,
				value: "equalTo"
			},
			{
				label: R.notEqualTo,
				value: "notEqualTo"
			},
			{
				label: R.containsItem,
				value: "containsItem"
			},
			{
				label: R.notContainsItem,
				value: "notContainsItem"
			},
			{
				label: R.hasKey,
				value: "hasKey"
			},
			{
				label: R.notHasKey,
				value: "notHasKey"
			},
			{
				label: R.in,
				value: "in"
			},
			{
				label: R.notIn,
				value: "notIn"
			}
		];
	}
	return [
		{
			label: R.equalTo,
			value: "equalTo"
		},
		{
			label: R.notEqualTo,
			value: "notEqualTo"
		},
		{
			label: R.in,
			value: "in"
		},
		{
			label: R.notIn,
			value: "notIn"
		}
	];
}
function fi(e, t) {
	return t === "in" || t === "notIn" ? I.Array : t === "hasKey" || t === "notHasKey" ? I.String : t === "containsItem" || t === "notContainsItem" ? I.Any : e;
}
var pi = (0, import_react.memo)(({ value: e, onChange: t }) => {
	let n = Z(() => {
		t(e === "and" ? "or" : "and");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-ConditionSelector__Relation",
		onClick: n,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.ArrowDown }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.toUpperCase() })]
	});
});
var mi = {
	type: I.String,
	source: L.Variable,
	text: ""
};
var hi = (0, import_react.memo)((e) => {
	let t = (0, import_react.useRef)(1), n = (0, import_react.useRef)({});
	(0, import_react.useMemo)(() => {
		if (e.value !== n.current.value) {
			n.current.value = e.value;
			let t = JSON.parse(JSON.stringify(e.value));
			n.current._value = t, n.current.__value = t, t.groups.forEach((e) => {
				e.items.forEach((e) => {
					e.operatorOptions ||= di(e.source.type);
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
					source: { ...mi },
					operator: "equalTo",
					target: { ...mi },
					operatorOptions: di(mi.type)
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
						source: { ...mi },
						operator: "equalTo",
						target: { ...mi },
						operatorOptions: di(mi.type)
					},
					...n.items.slice(t + 1)
				]
			} : n)
		});
	}, u = (e, t) => {
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
	}, d = (e, t, n) => {
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
							target: { ...mi },
							operatorOptions: di(n.type)
						}), t;
					}
					return e;
				})
			} : r)
		});
	}, f = (e, t, n) => {
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
	}, h = (e, t, n) => {
		r({
			...i,
			groups: i.groups.map((r, i) => i === e ? {
				...r,
				items: r.items.map((e, r) => {
					if (r === t) {
						let t = {
							...e,
							operator: n
						}, r = fi(e.source.type, n);
						return e.target.type !== r && (t.target = {
							...mi,
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
							children: i === 0 ? "WHEN" : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(pi, {
								value: e.relation,
								onChange: (e) => o(n, e)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(li, {
							dataTypeEditable: !0,
							dataType: r.source.type,
							value: r.source,
							onChange: (e) => d(n, i, e)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "action",
							name: Y.MinusCircle,
							onClick: () => u(n, i)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bd",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
							className: "operator",
							value: r.operator,
							options: r.operatorOptions,
							onChange: (e) => h(n, i, e)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(li, {
							dataType: r.target.type,
							value: r.target,
							onChange: (e) => f(n, i, e)
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.PlusCircle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.addGroup })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "btn",
						onClick: () => c(n),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.MinusCircle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.delGroup })]
					}),
					i.groups.length > 1 && n < i.groups.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "group-relation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(pi, {
							value: i.relation,
							onChange: a
						})
					})
				]
			})]
		}, e.key)))
	});
});
var gi = {
	type: I.String,
	source: L.Variable,
	text: ""
};
var _i = {
	relation: "or",
	groups: [{
		relation: "and",
		items: [{
			source: { ...gi },
			operator: "equalTo",
			target: { ...gi }
		}]
	}]
};
(0, import_react.memo)(({ value: e, onChange: t }) => {
	let n = (0, import_react.useMemo)(() => {
		if (typeof e == "string") return {
			type: I.String,
			text: e,
			source: L.Expression
		};
	}, [e]), r = Z((e) => {
		t?.(e.text);
	}), i = Z((e) => {
		e ? t?.("") : t?.(_i);
	});
	return e === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-ConditionSelector",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
			type: "link",
			size: "small",
			onClick: () => t?.(_i),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.PlusCircle }),
			children: R.createCondition
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-ConditionSelector",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mode-switch",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "title",
				children: R.condition
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Switch, {
				checkedChildren: R.scriptsMode,
				unCheckedChildren: R.scriptsMode,
				value: typeof e == "string",
				onChange: i
			})]
		}), typeof e == "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-ConditionSelector__conditionScripts",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label",
				children: R.conditionScripts
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "input",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(li, {
					height: 100,
					hideIcon: !0,
					runtime: "script",
					brand: "variable",
					dataType: I.Any,
					value: n,
					onChange: r
				})
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(hi, {
			value: e,
			onChange: t || ui
		})]
	});
});
var yi = ({ className: e, header: t, children: n }) => {
	let [r, i] = (0, import_react.useState)(!1), a = Z(() => {
		i(!r);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-ExpandPanel", e),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hd",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				button: !0,
				name: Y.ArrowRight,
				className: K.classNames("icon", { on: r }),
				onClick: a
			}), t]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bd",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("container", r ? "noScoller" : "scoller"),
				children: n
			})
		})]
	});
};
var bi = (e) => typeof e == "boolean" || e instanceof Boolean;
var xi = (e) => typeof e == "number" || e instanceof Number;
var Si = (e) => typeof e == "bigint" || e instanceof BigInt;
var Ci = (e) => !!e && e instanceof Date;
var wi = (e) => typeof e == "string" || e instanceof String;
var Ti = (e) => Array.isArray(e);
var Ei = (e) => typeof e == "object" && !!e;
var Di = (e) => !!e && e instanceof Object && typeof e == "function";
function Oi(e, t) {
	return t === void 0 && (t = !1), !e || t ? `"${e}"` : e;
}
function ki(e, t, n) {
	return n ? JSON.stringify(e) : t ? `"${e}"` : e;
}
function Ai(e) {
	let { field: t, value: n, data: r, lastElement: i, openBracket: o, closeBracket: s, level: c, style: l, shouldExpandNode: f, clickToExpandNode: p, outerRef: g, beforeExpandChange: _ } = e, v = (0, import_react.useRef)(!1), [y, b] = (0, import_react.useState)(() => f(c, n, t)), x = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		v.current ? b(f(c, n, t)) : v.current = !0;
	}, [f]);
	let S = (0, import_react.useId)();
	if (r.length === 0) return ji({
		field: t,
		openBracket: o,
		closeBracket: s,
		lastElement: i,
		style: l
	});
	let C = y ? l.collapseIcon : l.expandIcon, w = y ? l.ariaLables.collapseJson : l.ariaLables.expandJson, T = c + 1, E = r.length - 1, ee = (e) => {
		y !== e && (!_ || _({
			level: c,
			value: n,
			field: t,
			newExpandValue: e
		})) && b(e);
	}, D = (e) => {
		if (e.key === "ArrowRight" || e.key === "ArrowLeft") e.preventDefault(), ee(e.key === "ArrowRight");
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
	}, te = () => {
		ee(!y);
		let e = x.current;
		if (!e) return;
		let t = g.current?.querySelector("[role=button][tabindex=\"0\"]");
		t && (t.tabIndex = -1), e.tabIndex = 0, e.focus();
	};
	return /*#__PURE__*/ (0, import_react.createElement)("div", {
		className: l.basicChildStyle,
		role: "treeitem",
		"aria-expanded": y,
		"aria-selected": void 0
	}, /*#__PURE__*/ (0, import_react.createElement)("span", {
		className: C,
		onClick: te,
		onKeyDown: D,
		role: "button",
		"aria-label": w,
		"aria-expanded": y,
		"aria-controls": y ? S : void 0,
		ref: x,
		tabIndex: c === 0 ? 0 : -1
	}), (t || t === "") && (p ? /*#__PURE__*/ (0, import_react.createElement)("span", {
		className: l.clickableLabel,
		onClick: te,
		onKeyDown: D
	}, Oi(t, l.quotesForFieldNames), ":") : /*#__PURE__*/ (0, import_react.createElement)("span", { className: l.label }, Oi(t, l.quotesForFieldNames), ":")), /*#__PURE__*/ (0, import_react.createElement)("span", { className: l.punctuation }, o), y ? /*#__PURE__*/ (0, import_react.createElement)("ul", {
		id: S,
		role: "group",
		className: l.childFieldsContainer
	}, r.map((e, t) => /*#__PURE__*/ (0, import_react.createElement)(Fi, {
		key: e[0] || t,
		field: e[0],
		value: e[1],
		style: l,
		lastElement: t === E,
		level: T,
		shouldExpandNode: f,
		clickToExpandNode: p,
		beforeExpandChange: _,
		outerRef: g
	}))) : /*#__PURE__*/ (0, import_react.createElement)("span", {
		className: l.collapsedContent,
		onClick: te,
		onKeyDown: D
	}), /*#__PURE__*/ (0, import_react.createElement)("span", { className: l.punctuation }, s), !i && /*#__PURE__*/ (0, import_react.createElement)("span", { className: l.punctuation }, ","));
}
function ji(e) {
	let { field: t, openBracket: n, closeBracket: r, lastElement: i, style: o } = e;
	return /*#__PURE__*/ (0, import_react.createElement)("div", {
		className: o.basicChildStyle,
		role: "treeitem",
		"aria-selected": void 0
	}, (t || t === "") && /*#__PURE__*/ (0, import_react.createElement)("span", { className: o.label }, Oi(t, o.quotesForFieldNames), ":"), /*#__PURE__*/ (0, import_react.createElement)("span", { className: o.punctuation }, n), /*#__PURE__*/ (0, import_react.createElement)("span", { className: o.punctuation }, r), !i && /*#__PURE__*/ (0, import_react.createElement)("span", { className: o.punctuation }, ","));
}
function Mi(e) {
	let { field: t, value: n, style: r, lastElement: i, shouldExpandNode: a, clickToExpandNode: o, level: s, outerRef: c, beforeExpandChange: l } = e;
	return Ai({
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
function Ni(e) {
	let { field: t, value: n, style: r, lastElement: i, level: a, shouldExpandNode: o, clickToExpandNode: s, outerRef: c, beforeExpandChange: l } = e;
	return Ai({
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
function Pi(e) {
	let { field: t, value: n, style: r, lastElement: i } = e, o, s = r.otherValue;
	return n === null ? (o = "null", s = r.nullValue) : n === void 0 ? (o = "undefined", s = r.undefinedValue) : wi(n) ? (o = ki(n, !r.noQuotesForStringValues, r.stringifyStringValues), s = r.stringValue) : bi(n) ? (o = n ? "true" : "false", s = r.booleanValue) : xi(n) ? (o = n.toString(), s = r.numberValue) : Si(n) ? (o = `${n.toString()}n`, s = r.numberValue) : o = Ci(n) ? n.toISOString() : Di(n) ? "function() { }" : n.toString(), /*#__PURE__*/ (0, import_react.createElement)("div", {
		className: r.basicChildStyle,
		role: "treeitem",
		"aria-selected": void 0
	}, (t || t === "") && /*#__PURE__*/ (0, import_react.createElement)("span", { className: r.label }, Oi(t, r.quotesForFieldNames), ":"), /*#__PURE__*/ (0, import_react.createElement)("span", { className: s }, o), !i && /*#__PURE__*/ (0, import_react.createElement)("span", { className: r.punctuation }, ","));
}
function Fi(e) {
	let t = e.value;
	return Ti(t) ? /*#__PURE__*/ (0, import_react.createElement)(Ni, Object.assign({}, e)) : Ei(t) && !Ci(t) && !Di(t) ? /*#__PURE__*/ (0, import_react.createElement)(Mi, Object.assign({}, e)) : /*#__PURE__*/ (0, import_react.createElement)(Pi, Object.assign({}, e));
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
var Ii = {
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
var Li = () => !0;
var Ri = (e) => {
	let { data: t, style: n = Ii, shouldExpandNode: r = Li, clickToExpandNode: i = !1, beforeExpandChange: o, compactTopLevel: s, ...c } = e, l = (0, import_react.useRef)(null);
	return /*#__PURE__*/ (0, import_react.createElement)("div", Object.assign({ "aria-label": "JSON view" }, c, {
		className: n.container,
		ref: l,
		role: "tree"
	}), s && Ei(t) ? Object.entries(t).map((e) => {
		let [t, s] = e;
		return /*#__PURE__*/ (0, import_react.createElement)(Fi, {
			key: t,
			field: t,
			value: s,
			style: {
				...Ii,
				...n
			},
			lastElement: !0,
			level: 1,
			shouldExpandNode: r,
			clickToExpandNode: i,
			beforeExpandChange: o,
			outerRef: l
		});
	}) : /*#__PURE__*/ (0, import_react.createElement)(Fi, {
		value: t,
		style: {
			...Ii,
			...n
		},
		lastElement: !0,
		level: 0,
		shouldExpandNode: r,
		clickToExpandNode: i,
		outerRef: l,
		beforeExpandChange: o
	}));
};
var zi = (0, import_react.memo)(({ data: e, shouldExpandNode: t }) => {
	let n = (0, import_react.useMemo)(() => ({
		...Ii,
		quotesForFieldNames: !0
	}), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-JsonView",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ri, {
			data: e,
			shouldExpandNode: t,
			clickToExpandNode: !0,
			style: n
		})
	});
});
var Bi = (0, import_react.memo)(({ value: e, onChange: t, ...n }) => {
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
var Vi = (0, import_react.memo)(({ value: e, onChange: t, labelPlaceholder: n = "label", valuePlaceholder: r = "value", hideLabel: i, className: a, variant: o }) => {
	let s = (0, import_react.useRef)(0), c = (0, import_react.useRef)(/* @__PURE__ */ new Map()), l = Z(() => {
		let n = {
			value: "",
			label: i ? void 0 : ""
		};
		t?.(e ? [...e, n] : [n]);
	}), u = Z((n) => {
		t?.(e.filter((e, t) => t !== n || (c.current.delete(e), !1)));
	}), d = Z((n, r) => {
		let i = e.map((e, t) => t === r ? (c.current.delete(e), {
			...e,
			value: n
		}) : e);
		t?.(i);
	}), f = Z((n, r) => {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bi, {
						className: K.classNames("input", { "input-error": !e.value }),
						variant: "filled",
						placeholder: r,
						value: e.value,
						onChange: (e) => d(e || "", t)
					}),
					!i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bi, {
						className: "input",
						variant: "filled",
						placeholder: n,
						value: e.label,
						onChange: (e) => f(e || "", t)
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
var Hi = (0, import_react.memo)(({ onClose: e, item: t }) => {
	let [n, r] = (0, import_react.useState)(W.schemaModelToXml(t)), [i, a] = (0, import_react.useState)(""), o = Z(() => {
		let e = W.xmlToSchemaModel(n), t = W.schemaModelToJson(e);
		a(t);
	}), s = Z((e) => {
		J.clipboard.write(e).then(() => J.message.success(R.alreadyToClipboard));
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
					children: R.export
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
								children: `${R.jsonValue}:`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "link",
								onClick: () => s(i),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Copy }), R.copy]
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
							children: R.generate
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ͼbaseflow-SchemaExport__col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hd",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "title",
								children: `${R.schemaModel}:`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "link",
								onClick: () => s(n),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Copy }), R.copy]
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
				children: R.exportSchemaTips
			})
		]
	});
});
function Ui({ namespace: e, looseLeaf: t, node: n, parent: r, index: i, isFirst: a, isLast: o, parentLevel: s, parentPath: c, parentIds: u, parentIsEnd: d, parentIsFinish: f, attributeRender: p, context: m, contextValueRender: h, nodeRender: g, folderRender: y }) {
	let b = {
		node: n,
		parent: r,
		index: i,
		level: s + 1,
		path: n.name && c ? `${c}⫻${n.name}` : n.name || "",
		ids: n.id && u ? `${u}⫻${n.id}` : n.id || "",
		isFirst: a,
		isLast: o,
		isBegin: a && s === 0,
		isEnd: o && d,
		isFinish: o && f,
		isLeaf: t ? !n.children : !n.children?.length,
		folded: !!n.folded,
		disabled: !!n.disabled,
		contextValue: m ? (0, import_react.useContext)(m) : void 0
	}, x = p ? p(b) : void 0, S = h ? h(b) : void 0, C = !b.isLeaf && n.disabled !== "all", w = C && n.children.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wi, {
		namespace: e,
		looseLeaf: t,
		context: m,
		contextValueRender: h,
		attributeRender: p,
		folderRender: y,
		nodeRender: g,
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
				children: g(b)
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
				children: m && S !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.Provider, {
					value: S,
					children: w
				}) : w
			})
		]
	});
}
var Wi = (0, import_react.memo)(Ui);
function Gi(e) {
	let t = e.source, { style: n, namespace: r, looseLeaf: i = !1, context: a, contextValueRender: o, attributeRender: s, nodeRender: c, folderRender: u } = e;
	if (e.renderRoot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SimpleTree", r && `ͼbaseflow-${r}`),
		style: n,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wi, {
			namespace: r,
			looseLeaf: i,
			context: a,
			contextValueRender: o,
			attributeRender: s,
			folderRender: u,
			nodeRender: c,
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
		children: f !== "all" && d.map((e, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wi, {
			namespace: r,
			looseLeaf: i,
			context: a,
			contextValueRender: o,
			attributeRender: s,
			folderRender: u,
			nodeRender: c,
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
var Ki = (0, import_react.memo)(Gi);
var qi = ({ className: e, children: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
	className: K.classNames("ͼbaseflow-FormLayout", e),
	children: t
});
var Ji = (0, import_react.memo)(({ value: e, onChange: t, error: n }) => {
	let [r, i] = (0, import_react.useState)(""), [a, o] = (0, import_react.useState)(e), [s, c] = (0, import_react.useState)(""), [l, u] = (0, import_react.useState)(n);
	(0, import_react.useMemo)(() => {
		u(n);
	}, [n]);
	let d = Z(() => {
		r || c(R.jsonValueTips);
		let e;
		try {
			e = W.jsonToSchemaModel(r);
		} catch (e) {
			console.error(e);
		}
		if (e) {
			c(""), u("");
			let n = W.schemaModelToXml(e);
			o(n), t?.(n);
		} else c(R.jsonValueTips);
	}), f = Z(() => {
		t?.(a);
	}), m = Z(() => {
		let e = r.trim();
		if (e) try {
			let t = JSON.parse(e);
			e = JSON.stringify(t, null, 4), i(e), c("");
		} catch (e) {
			console.error(e), u(R.jsonValueTips);
		}
	}), g = Z(() => {
		let e = a.trim();
		if (e) try {
			let t = W.formatXml(e);
			o(t), u("");
		} catch (e) {
			console.error(e), u(R.schemaValueTips);
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
								children: `${R.jsonValue}:`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "error",
								children: s
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "format",
								onClick: m,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Loop }), R.format]
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
						onClick: d,
						children: R.infer
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ͼbaseflow-SchemaModelForm-SchemaImport__col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hd",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "title",
								children: `${R.schemaModel}:`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "error",
								children: l
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "format",
								onClick: g,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Loop }), R.format]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.TextArea, {
						className: "input",
						variant: "filled",
						rows: 10,
						block: !0,
						value: a,
						onChange: o,
						onBlur: f
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ft",
			children: R.importSchemaTips.split("\n").map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: e }, e))
		})]
	});
});
var Yi = [{
	label: R.createdFromManual,
	value: "manual"
}, {
	label: R.createdFromDSL,
	value: "import"
}];
var Xi = (0, import_react.memo)(({ onCancel: e, onSubmit: t, item: n, place: r, target: i, targetPath: a, parent: o, nameExists: s, editableFilter: c }) => {
	let l = o?.type === I.Array || o?.type === I.Map, [d, f] = (0, import_react.useState)(), m = !!(!d || d.name === void 0 || d.name) && !l && !!o, g = !!(!d || d.type === void 0 || d.type), { typeOptions: y, typeMap: b } = (0, import_react.useMemo)(() => {
		let e = Ne, t = d?.type;
		return t === !1 ? e = [{
			value: n.type || I.String,
			label: Me[n.type || I.String]
		}] : Array.isArray(t) && (e = t.map((e) => ({
			label: Me[e],
			value: e
		}))), {
			typeOptions: e,
			typeMap: e.reduce((e, t) => (e[t.value] = !0, e), {})
		};
	}, [d?.type, n.type]), { subTypeOptions: x, subTypeMap: S } = (0, import_react.useMemo)(() => {
		let e = Ne, t = d?.subType;
		return t === !1 ? e = [{
			value: n.subType || I.String,
			label: Me[n.subType || I.String]
		}] : Array.isArray(t) && (e = t.map((e) => ({
			label: Me[e],
			value: e
		}))), {
			subTypeOptions: e,
			subTypeMap: e.reduce((e, t) => (e[t.value] = !0, e), {})
		};
	}, [d?.subType, n.subType]), C = (0, import_react.useMemo)(() => {
		let e = d?.name, t;
		return e === !1 ? t = (e) => {
			if (e !== n.name) return Fe(R.nameRestricted, { name: e });
		} : typeof e == "function" && (t = e), t;
	}, [d?.name, n.name]), [w, T] = (0, import_react.useState)("manual"), [E, ee] = (0, import_react.useState)(""), [D, te] = (0, import_react.useState)(""), O = Z((e) => {
		e === "import" && (E || ee(W.schemaModelToXml(n))), T(e);
	}), k = Z((e) => {
		if (!e) return R.nameIsRequired;
		if (!m && e !== n.name) return Fe(R.nameRestricted, { name: e });
		if (e !== n.name && s[e]) return Fe(R.nameIsRepeat, { name: e });
	}), [A, ne] = (0, import_react.useState)(() => ({
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
		ne({
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
	let j = Z((e) => {
		ne({
			...A,
			enums: e?.length ? e : void 0
		});
	}), re = Z((e) => {
		ne({
			...A,
			optional: e || void 0
		});
	}), M = Z((e) => {
		ne({
			...A,
			tips: e || void 0
		});
	}), ie = Z((e) => {
		ne({
			...A,
			label: e || void 0
		});
	}), ae = Z((e) => {
		let t = e || "";
		ne({
			...A,
			name: t,
			nameError: k(t) || C?.(t) || ""
		});
	}), oe = Z((e) => {
		ne({
			...A,
			type: e,
			subType: e === I.Array || e === I.Map ? n.subType || I.String : void 0
		});
	}), N = Z((e) => {
		ne({
			...A,
			subType: e
		});
	}), se = Z((e) => {
		if (!e.trim()) return R.schemaValueTips;
		let t, n;
		try {
			t = W.xmlToSchemaModel(e);
		} catch (e) {
			n = e;
		}
		if (!t) return typeof n == "string" ? n : R.schemaValueTips;
		let r = k(t.name) || C?.(t.name) || "";
		if (r) return r;
		if (!b[t.type]) return Fe(R.typeRestricted, { type: Me[t.type] });
		let i = t.type === I.Array || t.type === I.Map ? t.children[0].type : void 0;
		return i && !S[i] ? Fe(R.typeRestricted, { type: Me[i] }) : t;
	}), ce = Z(() => {
		let e;
		if (w === "import") {
			let t = se(E);
			typeof t == "string" ? te(t) : e = t;
		} else {
			let { type: t, name: n, label: a, tips: o, optional: s, subType: c } = A, l = A.enums, u = k(n) || C?.(n) || "";
			if (u !== A.nameError && ne({
				...A,
				nameError: u
			}), !u && (e = {
				type: t,
				name: n,
				label: a,
				tips: o,
				optional: s
			}, r === "replace" && i.type === t && (t === I.Object || (t === I.Array || t === I.Map) && i.children?.[0].type === c) && (e.children = i.children), l && (l = l.filter((e) => e.value), l.length || (l = void 0), e.enums = l), (t === I.Array || t === I.Map) && !e.children)) {
				let t = {
					type: c || I.String,
					name: "*"
				};
				e.children = [t], (t.type === I.Array || t.type === I.Map) && (t.children = [{
					type: I.String,
					name: "*"
				}]);
			}
		}
		e && t(e, r, a);
	});
	return (0, import_react.useEffect)(() => {
		let e = c?.(n, o);
		Jt(e) ? e.then(f) : f(e);
	}, [
		c,
		n,
		o
	]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-SchemaModelForm-Editor ͼbaseflow-sr-modal head-split",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hd",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: r === "replace" ? Y.Edit : r === "sub" ? Y.AddSub : Y.AddNext }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r === "replace" ? R.update : r === "sub" ? R.insertChild : R.insertNext, i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "tips",
					children: `(${i.name})`
				}) : null] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bd",
				children: [d?.import !== !1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ͼbaseflow-SchemaModelForm-Editor__tab",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Segmented, {
						className: "tab",
						value: w,
						options: Yi,
						onChange: O
					})
				}), w === "import" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ji, {
					value: E,
					onChange: ee,
					error: D
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(qi, {
					className: "ͼbaseflow-SchemaModelForm-Editor__form",
					children: [
						m && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label required",
							children: R.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "item-content",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bi, {
								value: A.name,
								className: `ͼbaseflow-input${A.nameError ? " ͼbaseflow-error" : ""}`,
								placeholder: "name",
								onChange: ae,
								block: !0
							}), !!A.nameError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "item-error",
								children: A.nameError
							})]
						})] }),
						g && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label required",
							children: R.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
								value: A.type,
								options: y,
								block: !0,
								placeholder: "type",
								onChange: oe
							})
						})] }),
						(A.type === I.String || A.type === I.Number) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label",
							children: R.useEnum
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vi, {
								value: A.enums,
								onChange: j
							})
						})] }),
						(A.type === I.Array || A.type === I.Map) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label required",
							children: R.subType
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
								value: A.subType,
								options: x,
								placeholder: "item type",
								block: !0,
								onChange: N
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label",
							children: R.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bi, {
								value: A.label,
								block: !0,
								placeholder: "label",
								onChange: ie
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label",
							children: R.tips
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bi, {
								value: A.tips,
								block: !0,
								placeholder: "tips",
								onChange: M
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-label",
							children: R.optional
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "item-content",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Switch, {
								value: A.optional,
								className: "ͼbaseflow-checkbox",
								onChange: re
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
					children: R.ButtonCancel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
					className: "ͼbaseflow-form-submit",
					type: "primary",
					onClick: ce,
					children: R.ButtonSubmit
				})]
			})
		]
	});
});
var Zi = {
	name: "",
	type: I.String
};
var Qi = (0, import_react.memo)(({ className: e, node: t, parent: n, nodePath: r, labelRender: i, toolsFilter: a, onDelItem: o, onEditItem: s, onExportItem: c }) => {
	let l = n && (n.type === I.Array || n.type === I.Map), [d, f] = (0, import_react.useState)(), m = (0, import_react.useMemo)(() => W.toSchemaTitle(t, n, i), [
		i,
		t,
		n
	]), g = {
		addNext: n && !l ? {
			key: "addNext",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.AddNext,
				button: !0,
				title: R.insertNext,
				onClick: () => s(Zi, "next", t, r, n)
			}, "addNext")
		} : !1,
		addSub: t.type === I.Object && {
			key: "addChild",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.AddSub,
				button: !0,
				title: R.insertChild,
				onClick: () => s(Zi, "sub", t, r, t)
			}, "addChild")
		},
		edit: {
			key: "edit",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.Edit,
				button: !0,
				title: R.edit,
				onClick: () => s(t, "replace", t, r, n)
			}, "edit")
		},
		delete: !l && {
			key: "delete",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.Delete,
				button: !0,
				title: R.delete,
				onClick: () => o(r)
			}, "delete")
		},
		export: {
			key: "export",
			btn: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.Export,
				button: !0,
				title: R.export,
				onClick: () => c(t)
			}, "export")
		}
	}, y = [
		g.addNext,
		g.addSub,
		g.edit,
		g.delete,
		g.export
	];
	return y = d ? y.filter((e) => e && d[e.key] !== !1) : y.filter(Boolean), (0, import_react.useEffect)(() => {
		let e = a?.(t, n);
		Jt(e) ? e.then(f) : f(e);
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
				className: K.classNames("item-title", { tips: m.tips }),
				title: m.tips || m.title,
				children: m.title
			}),
			t.optional && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "item-optional ͼbaseflow-sr-optional" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "item-tools",
				children: y.map((e) => e.btn)
			})
		]
	});
});
var $i = {
	name: "data",
	type: I.Object
};
var ea = (0, import_react.memo)((e) => {
	let t = e.renderRoot === void 0, n = e.defaultValue || $i, r = (0, import_react.useRef)(null), i = Z((e) => {
		Q.modal(e ? {
			content: e,
			mask: "closeAble"
		} : null), r.current = e;
	}), a = Z(() => {
		i(null);
	}), { onChange: o, labelRender: s, toolsFilter: c, editableFilter: l } = e, [d, f] = (0, import_react.useState)(e.value || n);
	(0, import_react.useMemo)(() => {
		f(e.value || n);
	}, [n, e.value]);
	let g = Z((e) => {
		d !== e && o?.(e);
	}), v = Z((e) => {
		if (e === d.name) {
			g(void 0);
			return;
		}
		let t, n, r = z.produce(d, (r, i) => {
			if (i.path === e) return t = r, n = i.parent, !0;
		}, () => {
			let e = n.children;
			e.splice(e.indexOf(t), 1);
		});
		g(r);
	}), y = Z((e, t, n) => {
		if (i(null), n === d.name && t === "replace") {
			g(e);
			return;
		}
		let r = z.produce(d, (r, i) => {
			if (i.path === n) {
				if (t === "next" || t === "replace") {
					let n = i.parent.children;
					t === "next" ? n.splice(n.indexOf(r) + 1, 0, e) : n.splice(n.indexOf(r), 1, e);
				} else r.children ? r.children.unshift(e) : r.children = [e];
				return !0;
			}
		});
		g(r);
	}), b = Z((e, t, n, r, o) => {
		let s = (o?.children || []).reduce((e, t) => (e[t.name] = !0, e), {}), c = e.children?.[0];
		c && (e = {
			...e,
			subType: c.type
		}), i(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xi, {
			item: e,
			parent: o,
			target: n,
			targetPath: r,
			place: t,
			nameExists: s,
			editableFilter: l,
			onCancel: a,
			onSubmit: y
		}));
	}), x = Z((e) => {
		let t = z.produce(d, (t, n) => {
			if (n.path === e) return t.folded = !t.folded, !0;
		});
		f(t);
	}), S = Z(({ path: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		name: Y.ArrowRight,
		className: "ͼbaseflow-folder",
		onClick: () => x(e)
	})), C = Z((e) => {
		i(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hi, {
			item: e,
			onClose: a
		}));
	}), w = Z(({ node: e, parent: t, path: n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Qi, {
		node: e,
		nodePath: n,
		parent: t,
		onDelItem: v,
		onEditItem: b,
		onExportItem: C,
		labelRender: s,
		toolsFilter: c
	}));
	return (0, import_react.useEffect)(() => () => {
		r.current && i(null);
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SchemaModelForm", e.variant, { showRootTools: e.showRootTools }),
		children: e.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ki, {
			namespace: "SchemaModelFormTree",
			source: d,
			nodeRender: w,
			folderRender: S,
			renderRoot: t
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
			className: "empty",
			name: Y.PlusCircle,
			onClick: () => g({ ...n })
		})
	});
});
var ta = (0, import_react.memo)(({ node: e, parent: t, labelRender: n, onSelect: r }) => {
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
var na = (0, import_react.memo)(({ className: e, schema: t, onSwitch: n, onSelected: r, labelRender: i }) => {
	let a = Z((e) => {
		r?.(e.id, e.type);
	}), o = Z(({ node: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		button: !0,
		name: Y.ArrowRight,
		className: "ͼbaseflow-folder",
		onClick: () => n?.(e.id)
	})), s = Z(({ node: e, parent: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ta, {
		parent: t,
		node: e,
		labelRender: i,
		onSelect: e.disabled ? void 0 : a
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SchemaSelector", e),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ki, {
			renderRoot: !0,
			source: t,
			nodeRender: s,
			folderRender: o
		})
	});
});
var ra = (0, import_react.memo)(({ node: e, parent: t, labelRender: n }) => {
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
var ia = (0, import_react.memo)(({ className: e, schema: t, labelRender: n }) => {
	let [r, i] = (0, import_react.useState)(t);
	(0, import_react.useMemo)(() => {
		i(t);
	}, [t]);
	let a = Z((e) => {
		let t = z.produce(r, (t, n) => {
			if (n.path === e) return t.folded = !t.folded, !0;
		});
		i(t);
	}), o = Z(({ path: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		button: !0,
		name: Y.ArrowRight,
		className: "ͼbaseflow-folder",
		onClick: () => a(e)
	})), s = Z(({ node: e, parent: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ra, {
		labelRender: n,
		parent: t,
		node: e
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-SchemaShow", e),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ki, {
			renderRoot: !0,
			source: r,
			nodeRender: s,
			folderRender: o
		})
	});
});
var aa = (0, import_react.memo)(({ className: e = "", value: t = "", title: n, onChange: r }) => {
	let i = (0, import_react.useRef)(null), [a, o] = (0, import_react.useState)(!1), [s, c] = (0, import_react.useState)(t), l = Z(() => {
		o(!1), t !== s && (c(t), r?.(s));
	});
	return (0, import_react.useMemo)(() => {
		c(t);
	}, [t]), (0, import_react.useEffect)(() => {
		a && i.current?.focus();
	}, [a]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [a ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref: i,
		className: K.classNames("ͼbaseflow-TextEditor__input", e),
		onBlur: l,
		onKeyDown: (e) => e.key === "Enter" && i.current.blur(),
		value: s,
		onChange: (e) => {
			c(e.target.value.trim());
		}
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "ͼbaseflow-TextEditor__title",
		title: n,
		children: t
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		title: R.edit,
		name: Y.Edit,
		className: "ͼbaseflow-TextEditor__editBtn",
		onClick: () => o(!a)
	})] });
});
var oa = (0, import_react.memo)(({ dataType: e, mode: t, onChange: n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: K.classNames("item", { on: t === "assign" }),
		onClick: () => {
			t !== "assign" && n("assign");
		},
		children: R.assign
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: K.classNames("item", { on: t === "deconstruct" }),
		onClick: () => t !== "deconstruct" && n("deconstruct"),
		children: R.deconstruct
	}),
	(e === I.Array || e === I.Map) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: K.classNames("item", { on: t === "mapping" }),
		onClick: () => t !== "mapping" && n("mapping"),
		children: R.mapping
	})
] }));
var sa = (0, import_react.memo)(({ className: e, node: t, index: n, schema: r, parent: i, parentSchema: a, labelRender: o, onItemNameChange: s, onItemValueChange: c, onItemModeChange: l, onAddItem: u, onDelItem: d, inputPropsRender: f }) => {
	let m = r.type, h = r.optional, g = m === I.Object || m === I.Array || m === I.Map, y = m === I.Array || m === I.Map, b = i ? i.value.type : void 0, x = i ? G.getValueMode(i) : void 0, S = b === I.Array || b === I.Map, C = G.getValueMode(t), w = gr(), T = (0, import_react.useMemo)(() => W.toSchemaTitle(r, a, o), [
		o,
		a,
		r
	]), E = {
		addNext: i && S && x === "deconstruct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "item",
			title: R.insertNext,
			onClick: () => u(G.createSchemaValueTreeByModel(r, void 0, i.id, !0), n + 1, i),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.AddNext })
		}, "addNext"),
		addSub: y && C === "deconstruct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "item",
			title: R.insertChild,
			onClick: () => u(G.createSchemaValueTreeByModel(r.children[0], void 0, t.id, !0), 0, t),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.AddSub })
		}, "addSub"),
		delete: i && S && x === "deconstruct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "item",
			title: R.delete,
			onClick: () => d(n, i),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Delete })
		}, "delete")
	}, ee = Z((e) => {
		l(t, e);
	}), D = Z((e) => c(t.id, e)), te = Z((e) => {
		if (!i) return;
		if (!e) {
			J.message.error(R.requiredPrompt);
			return;
		}
		b === I.Array && (e = `${Number(e) || 0}`);
		let n = i.children || [];
		for (let t of n) if (t.name === e) {
			J.message.error(Fe(R.hasExist, { item: e }));
			return;
		}
		s(e, t, i);
	}), O = [
		E.addNext,
		E.addSub,
		E.delete
	].filter(Boolean), k = (0, import_react.useMemo)(() => {
		if (r.enums) return r.enums;
		if (r.type === I.Array) return r.children?.[0]?.enums;
	}, [r]), A = f?.(r);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-SchemaValueForm__item",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: K.classNames("ͼbaseflow-SchemaValueForm__itemHead", e),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "item-icon",
						name: m
					}),
					S && x === "deconstruct" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(aa, {
						value: t.name,
						onChange: te,
						title: T.tips || T.title
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: K.classNames("item-title", { tips: T.tips }),
						title: T.tips || T.title,
						children: T.title
					}),
					r.optional && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "item-optional ͼbaseflow-sr-optional" }),
					(g || O.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "item-tools",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ͼbaseflow-SchemaValueForm__itemTools",
							children: [g && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(oa, {
								dataType: m,
								mode: C,
								onChange: ee
							}, "ModeSwitch"), O]
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
					title: R.loopContextPrompt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(li, {
					sourceType: "mapping",
					dataType: m,
					value: t.value,
					context: w,
					onChange: D,
					...A
				})]
			}),
			C === "assign" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ͼbaseflow-SchemaValueForm__itemBody",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(li, {
					hideIcon: !0,
					value: t.value,
					nativeRenderOptions: k,
					onChange: D,
					dataType: m,
					optional: h,
					context: w,
					...A
				})
			})
		]
	});
});
var ca = {
	name: "mock",
	type: I.Any
};
var la = (0, import_react.memo)(({ schema: e = ca, value: t, labelRender: n, onChange: r, inputPropsRender: i, showRootTools: a, variant: o }) => {
	let [, s] = (0, import_react.useState)(0), c = (0, import_react.useRef)({}), l = Z((e) => {
		if (c.current.valueTree !== e) {
			let t = z.map(e, ({ name: e, value: t, folded: n }) => ({
				name: e,
				value: t,
				folded: n
			}));
			c.current.value = t, c.current._valueTree = e, r?.(t);
		}
	}), u = Z(() => {
		if (c.current.schema === ca) c.current.value !== void 0 && r?.(void 0);
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
			c.current.schemaTree = t, c.current.schemaMap = z.toMap(t);
		}
		if (c.current.matchError = e === ca ? "Schema is undefined" : void 0, n || i) {
			let n = c.current.schemaTree;
			if (c.current.value = t, !t) c.current.valueTree = G.createSchemaValueTreeByModel(n, void 0, void 0, !0);
			else {
				let r = e === ca ? "Schema is undefined" : G.matchSchemaValueByModel(n, t);
				r ? (c.current.matchError = r, c.current.valueTree = G.toSchemaValueTree([t], "")[0]) : c.current.valueTree = G.createSchemaValueTreeByModel(n, t, void 0, !0);
			}
			c.current._valueTree = c.current.valueTree;
		} else if (r) {
			let e = G.createSchemaValueTreeByModel(c.current.schemaTree, c.current.value, void 0, !0);
			l(e);
		} else c.current.valueTree = c.current._valueTree;
	}, [e, t]);
	let d = c.current.schemaMap, f = c.current.valueTree, g = Z((e) => {
		let t = z.produce(f, (t) => {
			if (e.id === t.id) return t.folded = !t.folded, !0;
		});
		c.current.value = t, c.current.valueTree = t, s(Date.now());
	}), y = Z((e, t) => {
		let n = G.setValueMode(e, d[e.schemaId], t), r = z.produce(f, (t) => {
			if (e.id === t.id) return t.value = n.value, t.children = n.children, !0;
		});
		l(r);
	}), b = Z((e, t) => {
		let n = z.produce(f, (n) => {
			if (e === n.id) return n.value = t, !0;
		});
		l(n);
	}), x = Z((e, t, n) => {
		let r = f;
		if (n.value.type === I.Array) {
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
			})), i = G.toSchemaValueTree(i, n.id), r = z.produce(f, (e) => {
				if (n.id === e.id) return e.children.splice(a, e.children.length - a, ...i), !0;
			});
		} else {
			let i = {
				...t,
				name: e
			};
			i = G.toSchemaValueTree([i], n.id)[0], r = z.produce(f, (e) => {
				if (t.id === e.id) return e.id = i.id, e.name = i.name, e.children = i.children, !0;
			});
		}
		l(r);
	}), S = Z((e, t, n) => {
		let r = f;
		if (n.value.type === I.Array) {
			let i = (n.children || []).slice(t);
			i.unshift(e), i = i.map((e, n) => ({
				...e,
				name: `${n + t}`
			})), i = G.toSchemaValueTree(i, n.id), r = z.produce(f, (e) => {
				if (n.id === e.id) return e.children.splice(t, e.children.length - t, ...i), !0;
			});
		} else {
			let i = (n.children || []).reduce((e, t) => (e[t.name] = !0, e), {}), a = [{
				...e,
				name: G.createNoDuplicateKey(i)
			}];
			a = G.toSchemaValueTree(a, n.id), r = z.produce(f, (e) => {
				if (n.id === e.id) return e.children.splice(t, 0, a[0]), !0;
			});
		}
		l(r);
	}), C = Z((e, t) => {
		let n = f;
		if (t.value.type === I.Array) {
			let r = (t.children || []).slice(e);
			r.shift(), r.length && (r = r.map((t, n) => ({
				...t,
				name: `${n + e}`
			})), r = G.toSchemaValueTree(r, t.id)), n = z.produce(f, (n) => {
				if (t.id === n.id) return n.children.splice(e, n.children.length - e, ...r), n.children.length || (n.value.source = L.Variable, n.value.text = "", n.children = void 0), !0;
			});
		} else n = z.produce(f, (n) => {
			if (t.id === n.id) return n.children.splice(e, 1), n.children.length || (n.value.source = L.Variable, n.value.text = "", n.children = void 0), !0;
		});
		l(n);
	}), w = Z(({ node: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		name: Y.ArrowRight,
		className: "ͼbaseflow-folder",
		onClick: () => g(e)
	})), T = Z(({ node: e, parent: t, index: r }) => {
		let o = d[e.schemaId];
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
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(sa, {
			className: !t && a ? "showRootTools" : "",
			index: r,
			node: e,
			schema: o,
			parent: t,
			parentSchema: t ? d[t.schemaId] : void 0,
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
			let n = et.getValidContextRef(e.value);
			return new RegExp(Ge).test(n) && (n = t && /\D/.test(t) ? n.replace(B, `${t}[0]`) : ""), n;
		}
	}), ee = Z(({ node: e, isLast: t, isLeaf: n }) => {
		if (t && n) return { className: "ͼbaseflow-last" };
	});
	return c.current.schema === ca && !c.current.value ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-SchemaValueForm", o),
		children: [c.current.matchError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ͼbaseflow-SchemaValueForm__matchError",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tools",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tips",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: R.invalidTips }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "msg",
						children: c.current.matchError
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
					type: "link",
					size: "small",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Loop }),
					onClick: u,
					children: R.fix
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ki, {
			namespace: "SchemaValueFormTree",
			source: f,
			nodeRender: T,
			folderRender: w,
			contextValueRender: E,
			attributeRender: ee,
			context: hr,
			renderRoot: !0
		})]
	});
});
var ua = (0, import_react.memo)(({ style: e, namespace: t, nodeRender: n, attributeRender: r, onSwitch: i, source: a }) => {
	let o = Z(({ node: e, parent: n, folded: r, isLeaf: a, isFirst: o, isLast: s, isEnd: c, isBegin: l, isFinish: u }) => {
		let d = n ? M.isRoute(n.data) : !1, f = n ? M.isFork(n.data) : !1;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			!d && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `ͼbaseflow-${t}-lineNext` }),
			(o || d) && !l && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `ͼbaseflow-${t}-lineIn` }),
			(s || d) && !u && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `ͼbaseflow-${t}-lineOut`,
				children: !c && !f && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `ͼbaseflow-${t}-lineOutArrow` })
			}),
			!a && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `ͼbaseflow-${t}-NodeCollapse${r ? " ͼbaseflow-folded" : ""}`,
				onClick: () => i(e.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Increase }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Decrease })]
			})
		] });
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ki, {
		style: e,
		namespace: t,
		nodeRender: n,
		folderRender: o,
		attributeRender: r,
		source: a
	});
});
var da = (0, import_react.memo)(({ className: e, value: t = "", onSubmit: n }) => {
	let r = (0, import_react.useRef)(null), i = (0, import_react.useCallback)((e) => {
		e.nativeEvent.stopPropagation();
	}, []), a = (0, import_react.useCallback)((e) => {
		n(e.target.value.trim());
	}, [n]);
	return (0, import_react.useEffect)(() => {
		r.current?.focus();
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: e,
		ref: r,
		onMouseDownCapture: i,
		onClickCapture: i,
		defaultValue: t,
		onBlur: a,
		onKeyDown: (e) => e.key === "Enter" && r.current.blur()
	});
});
var fa = (0, import_react.memo)(({ icon: e, status: t, message: n, mocked: r, ...i }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...i,
	className: K.classNames("ͼbaseflow-Flow__NodeIcon", t, { mocked: r }),
	onMouseEnter: (e) => {
		n ? Q.tooltip({
			content: n,
			target: e.target
		}) : r && Q.tooltip({
			content: "disabled!",
			target: e.target
		});
	},
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		alt: "icon",
		src: e
	})
}));
var pa = {
	rename: "rename",
	resetId: "resetId",
	disable: "disable",
	enable: "enable",
	remove: "remove"
};
var ma = (0, import_react.memo)(({ node: e, nodeData: t, onSelect: n }) => {
	let r = e.getSource();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-Flow__NodeMenu",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "menu-item",
				onClick: () => n(pa.rename),
				children: P.rename
			}),
			M.reidAble(t.type) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "menu-item",
				onClick: () => n(pa.resetId),
				children: P.resetId
			}),
			M.mockAble(t.type) ? t.meta.mockState ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "menu-item",
				onClick: () => n(pa.enable),
				children: P.enable
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "menu-item",
				onClick: () => n(pa.disable),
				children: P.disable
			}) : null,
			M.deleteAble(t.type) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "menu-item",
				onClick: () => n(pa.remove),
				children: P.delete
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "menu-item",
				onMouseEnter: (e) => Q.tooltip({
					content: `${r.name}@${r.actualVersion}（${r.formalVersion}）`,
					target: e.target
				}),
				children: `©${P.version}`
			})
		] })
	});
});
var ha = (0, import_react.memo)(({ className: e, value: t = "", onSubmit: n }) => {
	let r = (0, import_react.useRef)(null), i = (0, import_react.useCallback)((e) => {
		e.nativeEvent.stopPropagation();
	}, []);
	return (0, import_react.useEffect)(() => {
		let e = r.current;
		if (e) {
			e.focus();
			let t = document.createRange();
			t.selectNodeContents(e), t.collapse(!1);
			let n = window.getSelection();
			n?.removeAllRanges(), n?.addRange(t);
		}
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: e,
		ref: r,
		onMouseDownCapture: i,
		onClickCapture: i,
		contentEditable: !0,
		onBlur: (e) => {
			n(e.target.innerText.trim());
		},
		children: t ? t.split("\n").map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: e }, e)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})
	});
});
var ga = (0, import_react.memo)(({ node: e, nodeData: t, graph: n }) => {
	let r = e.getConfig(), i = (0, import_react.useRef)(null), a = t.meta.name || `${t.tag}-???`, o = t.id, s = t.meta.summary || "", l = t.meta.remark || "", d = !!t.meta.mockState, f = e.getStatus(), p = e.getErrors(), [y, b] = (0, import_react.useState)(!1), [x, S] = (0, import_react.useState)(!1), [C, w] = (0, import_react.useState)(!1), T = (0, import_react.useCallback)((t) => {
		b(!1), t && t !== a && e.updateMeta({ name: t });
	}, [a, e]), E = (0, import_react.useCallback)((t) => {
		S(!1), t !== o && setTimeout(() => {
			let n = e.resetId(t);
			n && J.message.error(n);
		});
	}, [o, e]), ee = (0, import_react.useCallback)((t) => {
		console.log("onRemarkChange", t), w(!1), t !== l && e.updateMeta({ remark: t });
	}, [e, l]), D = (0, import_react.useCallback)((t) => {
		if (t === pa.remove) try {
			e.remove();
		} catch (e) {
			throw J.message.error(e.message || e), e;
		}
		else if (t === pa.rename) b(!0);
		else if (t === pa.resetId) S(!0);
		else if (t === pa.disable) {
			let t = e.setMockState(!0);
			t && J.message.error(t);
		} else t === pa.enable && e.setMockState(void 0);
		Q.popup(null);
	}, [e]), te = Z((n) => {
		n.nativeEvent.stopPropagation(), Q.popup({
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ma, {
				node: e,
				nodeData: t,
				onSelect: D
			}),
			target: n.target,
			offset: {
				left: "-20px",
				top: "-8px"
			}
		});
	}), O = (0, import_react.useCallback)((t) => {
		t.nativeEvent.stopPropagation(), e.updateMeta({ remark: "" });
	}, [e]);
	return (0, import_react.useEffect)(() => {
		if (n.isInited()) {
			let n = i.current.offsetHeight;
			n && n !== t.meta.height && (console.log("update height", n), e.updateMeta({ height: n }));
		}
	}, [t.meta.summary, t.meta.remark]), (0, import_react.useEffect)(() => e.addListener("showMenu", () => {
		let e = i.current.querySelector(".node-menu");
		e && (n.reselect(""), e.click());
	})), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-Flow__NodeItem", f, { mocked: d }),
		id: `bf_nd_${o}`,
		ref: i,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-Flow__NodeHeader",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(fa, {
					icon: r.icon,
					status: f,
					mocked: d,
					message: p.configurationErrors || p.referenceErrors
				}),
				y ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(da, {
					className: "ͼbaseflow-Flow__NodeName input",
					value: a,
					onSubmit: T
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ͼbaseflow-Flow__NodeName",
					children: a
				}),
				x ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(da, {
					className: "ͼbaseflow-Flow__NodeId input",
					value: o,
					onSubmit: E
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ͼbaseflow-Flow__NodeId",
					children: `ID: ${o}`
				}),
				!y && !x && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "node-menu",
					name: Y.Options,
					onClickCapture: te
				}),
				!x && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "node-version",
					children: `v${r.version}`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ͼbaseflow-Flow__NodeFacade",
			children: C ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ha, {
				className: "ͼbaseflow-Flow__NodeSummary input",
				value: l,
				onSubmit: ee
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "edit-btn",
					name: Y.Edit,
					onClickCapture: (e) => {
						e.nativeEvent.stopPropagation(), w(!0);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.DescMD, {
					className: K.classNames("ͼbaseflow-Flow__NodeSummary", { remarked: l }),
					value: l || s
				}),
				l && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "clear-btn",
					name: Y.CloseFilled,
					onClickCapture: O
				})
			] })
		})]
	});
});
var _a = (0, import_react.memo)(({ device: e, graph: t }) => {
	let n = t.get_NodeById(e.id), r = n.getData(), i = n.getSize(), a = (0, import_react.useRef)(void 0), o = n.getType(), s = n.isContainer();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-CodeFlow__node",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: a,
			"data-baseflow-role": K.domRoles.FlowNode,
			"data-baseflow-node": n.id,
			className: "ͼbaseflow-Flow__NodeWraper",
			style: i,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ga, {
				node: n,
				nodeData: r,
				graph: t
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-CodeFlow__actions",
			style: { height: i.height },
			children: [o !== j.End && o !== j.Return && o !== j.Break && !n.isDefaultBranch() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.PlusNext,
				"data-baseflow": "ͼbaseflow-flow-node-plus",
				"data-action": `behind::${n.id}`,
				onMouseEnter: (e) => Q.tooltip({
					content: P.insertNext,
					target: e.target
				}),
				onClick: () => t.showCreator({
					sourceNode: n.getINode(),
					place: "behind",
					target: a.current
				})
			}), s && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.PlusSub,
				"data-baseflow": "ͼbaseflow-flow-node-plus",
				"data-action": `inside::${n.id}`,
				onMouseEnter: (e) => Q.tooltip({
					content: P.insertChild,
					target: e.target
				}),
				onClick: () => t.showCreator({
					sourceNode: n.getINode(),
					place: "inside",
					target: a.current
				})
			})]
		})]
	});
});
var va = (0, import_react.memo)(({ graph: e, initialLayoutData: t, initialViewport: r }) => {
	let i = (0, import_react.useRef)(t), [a, o] = (0, import_react.useState)(t), [s, l] = (0, import_react.useState)(r.zoom), d = (0, import_react.useRef)(null), f = (0, import_react.useRef)(void 0), g = (0, import_react.useRef)(!1), v = (0, import_react.useCallback)((e) => {
		l(e), g.current = !0;
	}, []), y = (0, import_react.useCallback)((e) => {
		v(e.zoom), d.current.scrollLeft = e.x, d.current.scrollTop = e.y;
	}, [v]), b = Z(() => {
		let e = d.current;
		return {
			zoom: s,
			x: e.scrollLeft,
			y: e.scrollTop
		};
	}), x = (0, import_react.useCallback)(() => i.current, []), S = (0, import_react.useCallback)((e, t) => {
		i.current = e, o(e), t && y(t), g.current = !0;
	}, [y]), C = Z(() => {
		let e = i.current, t = e.nodes, n = f.current?.ids || {};
		f.current = void 0;
		let r = z.produce(t, (e) => {
			n[e.id] && (e.key = (e.key || 0) + 1);
		});
		t !== r && S({
			...e,
			nodes: r
		});
	}), w = Z((e, t) => {
		let n = i.current, r = n.nodes, a = z.produce(r, (n) => {
			if (e === n.id) return n.id = t, !0;
		});
		r !== a && S({
			...n,
			nodes: a
		});
	}), T = Z((e, t) => {
		let n = i.current, r = n.nodes, a = z.produce(r, (n) => {
			if (e === n.id && !!n.folded !== t) return n.folded = t, !0;
		});
		r !== a && S({
			...n,
			nodes: a
		});
	}), E = Z((e, t) => {
		let n = i.current, r = e.reduce((e, t) => (e[t.id] = t, e), {}), a = [];
		e.forEach((e) => {
			e.parentId === t.id && a.push(ae(e, r));
		});
		let o = t.childrenIds, s = n.nodes, c = z.produce(s, (e) => {
			if (e.id === t.id) {
				let t = (e.children || []).concat(a).reduce((e, t) => (e[t.id] = t, e), {});
				return e.children = o.map((e) => t[e]), !0;
			}
		});
		s !== c && S({
			...n,
			nodes: c
		});
	}), ee = Z((e, t) => {
		let r = i.current, a = r.nodes, o = create$1(a, (e) => {
			let n = {};
			z.each(e, (e) => {
				n[e.id] = e;
			}), Object.keys(t).forEach((e) => {
				let r = n[e], i = t[e];
				r.children = r.children.filter((e) => !i[e.id]);
			});
		});
		a !== o && S({
			...r,
			nodes: o
		});
	}), D = Z((e) => {
		let t = i.current, r = t.nodes, a = create$1(r, (t) => {
			let n = {};
			z.each(t, (e) => {
				n[e.id] = e;
			}), Object.keys(e).forEach((t) => {
				let r = n[t];
				r.children = e[t].map((e) => n[e]);
			});
		});
		r !== a && S({
			...t,
			nodes: a
		});
	});
	(0, import_react.useEffect)(() => {
		let t = (e) => {
			f.current ||= {
				timer: setTimeout(C),
				ids: {}
			}, f.current.ids[e] = !0;
		}, n = d.current;
		n.scrollLeft = r.x, n.scrollTop = r.y;
		let i = {
			getData: x,
			setData: S,
			setViewport: y,
			setCenter(t) {
				let n = e.getNodeDomById(t);
				n && n.scrollIntoView({ behavior: "smooth" });
			},
			resetNodeId: w,
			refreshNodeSize: t,
			refreshNodeUI: t,
			getViewport: b,
			zoomTo: v,
			zoomFit() {
				let e = d.current, t = e.scrollHeight, n = e.clientHeight / t, r = n > 1 ? 1 : n < .1 ? .1 : n;
				return e.scrollTop = 0, v(r), r;
			},
			foldNode: T,
			addNodes: E,
			deleteNodes: ee,
			moveNodes: D
		};
		e.setFlowLayout(i), e.onLayoutRendered({
			layout: "code",
			layoutData: x(),
			viewport: b()
		}), e.onResized();
	}, []);
	let te = (0, import_react.useCallback)(({ node: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_a, {
		device: t,
		graph: e
	}), [e]), O = (0, import_react.useCallback)(({ node: e }) => ({
		"data-baseflow-role": K.domRoles.FlowNodeRange,
		"data-baseflow-node": e.id
	}), []), k = (0, import_react.useMemo)(() => ({ transform: `scale(${s})` }), [s]);
	return (0, import_react.useEffect)(() => {
		g.current && (g.current = !1, e.onResized());
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-CodeFlow",
		ref: d,
		onScroll: e.onResized,
		"data-baseflow-role": K.domRoles.GraphContiner,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ua, {
			namespace: "CodeLayoutTree",
			style: k,
			source: a.nodes,
			nodeRender: te,
			attributeRender: O,
			onSwitch: e.foldNode
		})
	});
});
function ya(e) {
	return {
		id: e.id,
		position: {
			x: 0,
			y: 0
		},
		type: "DagreNode",
		data: { size: {
			width: 0,
			height: 0
		} }
	};
}
function ba(e) {
	let t = {
		id: e.id,
		source: e.source.id,
		sourceHandle: e.source.port,
		target: e.target.id,
		targetHandle: e.target.port,
		className: e.source.type
	};
	return e.routeFork && (t.type = "DagreEdge"), e.markerEnd || (t.markerEnd = ""), t;
}
function xa(e, t) {
	try {
		let t = se(e, {
			toDagreNode: ya,
			toDagreEdge: ba
		}), n, r = e.reduce((e, t) => (t.parentId || (n = t), e[t.id] = t, e), {}), i = {};
		nn(r, n.id, (e, t) => {
			i[e.id] = t.folded || i[t.id];
		});
		let a = he(e);
		t.nodes.forEach((e) => {
			e.hidden = i[e.id], a[e.id] && (e.position = a[e.id].position, e.data.size = a[e.id].size);
		});
		let { nodes: o, edges: s } = t;
		return {
			nodes: o.filter((e) => e.id !== n.id),
			edges: s.filter((e) => e.source !== n.id && e.target !== n.id)
		};
	} catch (e) {
		return console.error(e), {
			nodes: [],
			edges: []
		};
	}
}
function Sa(e, t) {
	let n = he(t.nodes);
	return e.map((e) => {
		if (n[e.id]) {
			let t = n[e.id].size, r = n[e.id].position, i = e.data.size, a = e.position;
			if (i.width !== t.width || i.height !== t.height || a.x !== r.x || a.y !== r.y) return {
				...e,
				position: r,
				data: { size: t }
			};
		}
		return e;
	});
}
function Ca(e, t) {
	let n = e.reduce((e, t) => (e[`${t.source}-${t.target}`] = t, e), {});
	return ce(t, ba).map((e) => {
		let t = `${e.source}-${e.target}`;
		return n[t] ? n[t] : e;
	});
}
var wa = (0, import_react.memo)(({ id: e, sourceX: t, sourceY: n, targetX: r, targetY: i, markerStart: a, markerEnd: o, style: s }) => {
	let [c] = getSmoothStepPath({
		sourceX: t,
		sourceY: n,
		targetX: r,
		targetY: i,
		centerY: i - 37
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaseEdge, {
		id: e,
		path: c,
		style: s,
		markerStart: a,
		markerEnd: o
	});
});
var Ta = {
	TIMEOUT: "TIMEOUT",
	BLOCKED: "BLOCKED",
	NOT_FOUND: "NOT_FOUND",
	COMPILE_ERROR: "COMPILE_ERROR",
	RUNTIME_ERROR: "RUNTIME_ERROR",
	CLONE_ERROR: "CLONE_ERROR",
	ASYNC_NOT_ALLOWED: "ASYNC_NOT_ALLOWED",
	SHARE_DATA_NOT_FOUND: "SHARE_DATA_NOT_FOUND",
	RUNNER_DESTROYED: "RUNNER_DESTROYED",
	WORKER_CRASHED: "WORKER_CRASHED"
};
var Ea = class extends Error {
	code;
	funId;
	constructor(e, t, n) {
		super(t), this.name = "PureRunnerError", this.code = e, this.funId = n;
	}
};
var Da = 1e3;
var Oa = class {
	timeout;
	workerURL;
	crashErrorHandler;
	functions = /* @__PURE__ */ new Map();
	queue = [];
	inflight = null;
	timer = null;
	worker = null;
	ready = null;
	resolveReady = null;
	rejectReady = null;
	shareData = null;
	shareDataLive = !1;
	pumping = !1;
	destroyed = !1;
	nextReqId = 1;
	constructor(e, t, n) {
		this.timeout = e, this.workerURL = t, this.crashErrorHandler = n;
	}
	initFunction(e, t) {
		return this.assertAlive(), !this.functions.has(e) && (this.functions.set(e, {
			src: t,
			liveInWorker: !1,
			blockedReason: null
		}), !0);
	}
	setShareData(e) {
		return this.destroyed ? Promise.reject(Aa()) : e === this.shareData && !this.hasPendingSync() ? Promise.resolve() : new Promise((t, n) => {
			this.queue.push(this.createSyncCall(e, () => t(), n)), this.pump();
		});
	}
	runFunction(e, t = [], n) {
		if (this.destroyed) return Promise.reject(Aa());
		let r = this.functions.get(e);
		return r ? r.blockedReason ? Promise.reject(ka(e, r.blockedReason)) : new Promise((r, i) => {
			this.queue.push({
				kind: "run",
				reqId: this.nextReqId++,
				funId: e,
				args: t,
				shareDataKeys: n,
				resolve: r,
				reject: i
			}), this.pump();
		}) : Promise.reject(ja(e));
	}
	createSyncCall(e, t, n) {
		return {
			kind: "sync",
			reqId: this.nextReqId++,
			funId: "",
			args: [],
			pendingShareData: e,
			resolve: t,
			reject: n
		};
	}
	destroyRunner() {
		if (this.destroyed) return;
		this.destroyed = !0, this.clearTimer();
		let e = this.inflight ? [this.inflight, ...this.queue] : this.queue;
		this.inflight = null, this.queue = [];
		for (let t of e) t.reject(Aa());
		this.rejectReady?.(Aa()), this.teardownWorker(), this.functions.clear(), this.shareData = null, Ma === this && (Ma = null);
	}
	async pump() {
		if (!this.pumping) {
			this.pumping = !0;
			try {
				for (; !this.destroyed && !this.inflight && this.queue.length > 0;) {
					let e = this.queue[0];
					if (e.kind === "run") {
						let t = this.functions.get(e.funId);
						if (!t) {
							this.queue.shift(), e.reject(ja(e.funId));
							continue;
						}
						if (t.blockedReason) {
							this.queue.shift(), e.reject(ka(e.funId, t.blockedReason));
							continue;
						}
					}
					let t = this.ensureWorker();
					try {
						await this.ready;
					} catch (t) {
						if (this.destroyed) return;
						this.queue.shift(), e.reject(t);
						continue;
					}
					if (this.destroyed) return;
					if (this.worker !== t) continue;
					let n;
					if (e.kind === "sync") n = {
						type: "setShareData",
						reqId: e.reqId,
						shareData: e.pendingShareData
					};
					else {
						let t = this.functions.get(e.funId);
						if (!t || t.blockedReason) continue;
						if (this.shareData !== null && !this.shareDataLive && !e.shareDataRestoreTried) {
							e.shareDataRestoreTried = !0, this.queue.unshift(this.createRestoreTask(this.shareData));
							continue;
						}
						n = {
							type: "run",
							reqId: e.reqId,
							funId: e.funId,
							args: e.args,
							...e.shareDataKeys === void 0 ? {} : { shareDataKeys: e.shareDataKeys },
							...t.liveInWorker ? {} : { src: t.src }
						};
					}
					this.queue.shift(), this.inflight = e;
					try {
						t.postMessage(n);
					} catch (t) {
						this.inflight = null, e.reject(new Ea(Ta.CLONE_ERROR, e.kind === "sync" ? `shareData 无法结构化克隆 —— ${String(t)}` : `funId '${e.funId}' 的参数无法结构化克隆 —— ${String(t)}`, e.kind === "sync" ? void 0 : e.funId));
						continue;
					}
					this.timer = setTimeout(() => this.onTimeout(), this.timeout);
				}
			} finally {
				this.pumping = !1;
			}
		}
	}
	ensureWorker() {
		if (this.worker) return this.worker;
		let e = new Worker(this.workerURL, { type: "module" });
		return this.worker = e, this.ready = new Promise((e, t) => {
			this.resolveReady = e, this.rejectReady = t;
		}), this.ready.catch(() => {}), e.addEventListener("message", (t) => this.onMessage(e, t)), e.addEventListener("error", () => this.onWorkerCrash(e, "Worker 触发 error 事件")), e.addEventListener("messageerror", () => this.onWorkerCrash(e, "Worker 消息反序列化失败")), e;
	}
	onMessage(e, t) {
		if (e !== this.worker) return;
		let n = t.data;
		if (n.type === "ready") {
			this.resolveReady?.();
			return;
		}
		let r = this.inflight;
		!r || r.reqId !== n.reqId || this.finishCall(r, n);
	}
	finishCall(e, t) {
		if (this.inflight === e) {
			if (this.clearTimer(), this.inflight = null, e.kind === "sync") t.type === "ok" ? (this.shareData = e.pendingShareData, this.shareDataLive = !0, e.resolve(t.result)) : e.reject(new Ea(t.code, t.message));
			else {
				let n = this.functions.get(e.funId);
				n && (n.liveInWorker = t.type === "ok" || t.code !== Ta.COMPILE_ERROR && t.code !== Ta.NOT_FOUND), t.type === "ok" ? e.resolve(t.result) : e.reject(new Ea(t.code, t.message, e.funId));
			}
			this.pump();
		}
	}
	onTimeout() {
		let e = this.inflight;
		if (!e) return;
		this.clearTimer(), this.inflight = null;
		let t = e.kind === "sync" ? `执行超过 ${this.timeout}ms 未返回` : `总体执行超过 ${this.timeout}ms 未完成`;
		e.kind === "run" && this.blockFunction(e.funId, t), this.teardownWorker();
		let n = new Ea(Ta.TIMEOUT, e.kind === "sync" ? `setShareData ${t}，已终止 Worker` : `funId '${e.funId}' ${t}，已判定为恶意函数并终止 Worker`, e.kind === "sync" ? void 0 : e.funId);
		e.reject(n), e.kind === "run" && this.notifyCrash(e.funId, n.message), this.pump();
	}
	onWorkerCrash(e, t) {
		if (e !== this.worker) return;
		let n = this.inflight;
		this.clearTimer(), this.inflight = null, n?.kind === "run" && this.blockFunction(n.funId, t);
		let r = new Ea(Ta.WORKER_CRASHED, n && n.kind === "run" ? `funId '${n.funId}' ${t}，已判定为恶意函数并重建 Worker` : `${t}，已重建 Worker`, n?.kind === "run" ? n.funId : void 0);
		this.rejectReady?.(r), this.teardownWorker(), n?.reject(r), n?.kind === "run" && this.notifyCrash(n.funId, r.message), this.pump();
	}
	createRestoreTask(e) {
		return this.createSyncCall(e, () => {}, () => {});
	}
	hasPendingSync() {
		return this.inflight?.kind === "sync" || this.queue.some((e) => e.kind === "sync");
	}
	blockFunction(e, t) {
		let n = this.functions.get(e);
		n && (n.blockedReason = t);
	}
	notifyCrash(e, t) {
		if (this.crashErrorHandler) try {
			this.crashErrorHandler(e, t);
		} catch {}
	}
	teardownWorker() {
		this.worker?.terminate(), this.worker = null, this.ready = null, this.resolveReady = null, this.rejectReady = null, this.shareDataLive = !1;
		for (let e of this.functions.values()) e.liveInWorker = !1;
	}
	clearTimer() {
		this.timer !== null && (clearTimeout(this.timer), this.timer = null);
	}
	assertAlive() {
		if (this.destroyed) throw Aa();
	}
};
function ka(e, t) {
	return new Ea(Ta.BLOCKED, `funId '${e}' 已被判定为恶意函数（${t}），拒绝执行`, e);
}
function Aa() {
	return new Ea(Ta.RUNNER_DESTROYED, "Runner 已销毁");
}
function ja(e, t = "不存在函数实例") {
	return new Ea(Ta.NOT_FOUND, `funId '${e}' ${t}`, e);
}
var Ma = null;
function Na(e) {
	if (!e || e.workerURL === void 0) throw TypeError("initPureRunner: workerURL 为必填项");
	return Ma || (Ma = new Oa(e.timeout ?? Da, e.workerURL, e.crashErrorHandler), Ma);
}
var Pa = {};
var Fa = {
	...R,
	...P
};
var Ia = (0, import_react.memo)(({ locale: e = "en-US", lang: t, nodeDefaultSize: n, widgets: r, monacoEditorUrl: i, pureRunnerUrl: a, nodeRendererUrl: o, expressionUtils: s, children: c }) => ((0, import_react.useMemo)(() => {
	t && (Object.assign(Fa, t), Bt({ lang: t })), we({
		nodeRendererUrl: o || "./nodeRender.html",
		pureRunner: Na({ workerURL: a || "./pureRunner.worker.js" })
	}), e && Bt({ locale: e }), n && we({ nodeDefaultSize: n }), i && Bt({ monacoEditorUrl: i }), s && Bt({ expressionUtils: s }), r && Wt(r), r && Ir(r);
}, []), (0, import_react.useEffect)(() => {
	Ut.createValidateProvider(), Object.assign(Pa, J, Q);
}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [c, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fr, {})] })));
(0, import_react.createContext)({});
var za = (0, import_react.createContext)({ graph: null });
var Ba = (0, import_react.createContext)({ graph: null });
function Va() {
	return (0, import_react.useContext)(Ba);
}
function Ua() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: "empty-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "50%",
			y1: "0",
			x2: "50%",
			y2: "100%",
			className: "empty-line-path"
		})
	});
}
var Wa = { DagreNode: (0, import_react.memo)((e) => {
	let t = Va().graph, n = e.id, r = t.get_NodeById(n), i = r.getData(), a = r.getSize(), o = r.getType(), s = r.isFolded(), c = r.isContainer(), l = r.isFork(), u = !r.getChildrenLength(), d = c && (s || u), f = e.data.size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: f.width,
			height: f.height
		},
		className: K.classNames("ͼbaseflow-DagreFlow__node", { isFolded: s }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle$1, {
				type: "target",
				position: Position.Top,
				id: "in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle$1, {
				type: "source",
				position: Position.Bottom,
				id: "out"
			}),
			c && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle$1, {
				type: "target",
				position: Position.Top,
				id: "in2",
				className: "in2"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle$1, {
				type: "source",
				position: Position.Bottom,
				id: "out2",
				className: "out2"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-baseflow-role": K.domRoles.FlowNodeRange,
				"data-baseflow-node": r.id,
				className: K.classNames("ͼbaseflow-DagreFlow__nodeBg", i.tag, {
					"is-loop": o === j.Loop,
					"is-group": o === j.Group
				}),
				children: d && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ua, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-baseflow-role": K.domRoles.FlowNode,
				"data-baseflow-node": r.id,
				className: "ͼbaseflow-Flow__NodeWraper",
				style: {
					width: a.width,
					height: a.height
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ga, {
					node: r,
					nodeData: i,
					graph: t
				})
			}),
			c && !u && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ͼbaseflow-DagreFlow__collapse",
				style: { top: a.height },
				onClick: () => r.fold(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: s ? "isFolded" : "",
					name: Y.ArrowDown,
					title: s ? P.fold : P.unfold
				})
			}),
			o !== j.End && o !== j.Return && o !== j.Break && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.BoldPlus,
				"data-baseflow-role": K.domRoles.FlowNodePlus,
				"data-baseflow-action": `${c ? "inside" : "behind"}::${r.id}`,
				style: { top: a.height },
				className: K.classNames("ͼbaseflow-DagreFlow__nodePlus", { "is-inside": c }),
				onClick: (e) => t.showCreator({
					sourceNode: r.getINode(),
					place: c ? "inside" : "behind",
					target: e.target
				})
			}),
			c && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.BoldPlus,
				"data-baseflow-role": K.domRoles.FlowNodePlus,
				"data-baseflow-action": `behind::${r.id}`,
				className: K.classNames("ͼbaseflow-DagreFlow__nodePlus", {
					"is-branch": l,
					"is-default": r.isDefaultBranch()
				}),
				style: l ? {
					top: a.height / 2,
					marginLeft: a.width / 2 + 5
				} : { top: "100%" },
				onClick: (e) => t.showCreator({
					sourceNode: r.getINode(),
					place: "behind",
					target: e.target
				})
			})
		]
	});
}) };
var Ga = { DagreEdge: wa };
var Ka = { markerEnd: {
	type: MarkerType.ArrowClosed,
	width: 26,
	height: 26
} };
var qa = (0, import_react.memo)(({ graph: e, initialLayoutData: t, initialViewport: n }) => {
	let r = (0, import_react.useRef)(t), [i, a] = (0, import_react.useState)(t.nodes), [o, s] = (0, import_react.useState)(t.edges), [l, d] = (0, import_react.useState)(), f = (0, import_react.useRef)(void 0), g = (0, import_react.useRef)(!1), v = Z(() => l?.getViewport() || n), y = Z((t) => {
		l?.setViewport(t), e.onResized();
	}), b = (0, import_react.useCallback)(() => r.current, []), x = Z((e, t) => {
		r.current = {
			...r.current,
			...e
		}, e.nodes && e.nodes !== i && a(e.nodes), e.edges && e.edges !== o && s(e.edges), t && y(t), g.current = !0;
	}), S = Z(() => {
		let t = f.current?.ids || {};
		f.current = void 0;
		let n = r.current.nodes;
		t._ && (delete t._, n = Sa(n, e.getGraphData())), Object.keys(t) && (n = n.map((e) => t[e.id] ? {
			...e,
			data: { ...e.data }
		} : e)), x({ nodes: n });
	}), w = Z((t, n) => {
		let i = {};
		n ? e.eachChildrenData(t, (e) => {
			i[e.id] = !0;
		}) : e.eachChildrenData(t, (e, t) => {
			i[e.id] = t.folded || i[t.id];
		});
		let a = r.current.nodes.map((e) => Object.hasOwn(i, e.id) && !!e.hidden != !!i[e.id] ? {
			...e,
			hidden: i[e.id]
		} : e);
		a = Sa(a, e.getGraphData()), x({ nodes: a }), setTimeout(() => {
			let e = l.getNode(t);
			if (e) {
				let { position: t, width: n = 0, height: r = 0 } = e;
				l.setCenter(t.x + n / 2, t.y + r / 2, { zoom: 1 });
			}
		});
	}), T = Z((e, t) => {
		let n = l.getNode(e);
		if (n) {
			let { position: e, width: r = 0, height: i = 0 } = n;
			l.setCenter(e.x + r / 2 + (t ? 300 : 0), e.y + i / 2, {
				zoom: 1,
				duration: 500
			});
		}
	}), E = Z((t) => {
		let n = e.getGraphData(), i = t.map((e) => ya(e)), a = Sa(r.current.nodes.concat(i), n), o = Ca(r.current.edges, n.nodes);
		x({
			nodes: a,
			edges: o
		});
	}), ee = Z((t) => {
		let n = e.getGraphData(), i = Sa(r.current.nodes.filter((e) => !t[e.id]), n), a = Ca(r.current.edges, n.nodes);
		x({
			nodes: i,
			edges: a
		});
	}), D = Z(() => {
		let t = e.getGraphData(), n = Sa(r.current.nodes, t), i = Ca(r.current.edges, t.nodes);
		x({
			nodes: n,
			edges: i
		});
	}), te = Z((t, n) => {
		let i = e.getGraphData(), a = r.current.nodes.map((e) => e.id === t ? {
			...e,
			id: n
		} : e), o = Ca(r.current.edges, i.nodes);
		x({
			nodes: a,
			edges: o
		});
	}), O = Z((t) => {
		d(t), e.onLayoutRendered({
			layout: "dagre",
			layoutData: b(),
			viewport: v()
		}), e.onResized();
	});
	return (0, import_react.useMemo)(() => {
		if (l) {
			let t = {
				getViewport: v,
				getData: b,
				setData: x,
				setViewport: y,
				setCenter: T,
				resetNodeId: te,
				refreshNodeSize: () => {
					f.current ||= {
						timer: setTimeout(S),
						ids: {}
					}, f.current.ids._ = !0;
				},
				refreshNodeUI: (e) => {
					f.current ||= {
						timer: setTimeout(S),
						ids: {}
					}, f.current.ids[e] = !0;
				},
				zoomTo: (t) => {
					l.zoomTo(t), e.onResized();
				},
				zoomFit: () => (l.fitView({
					minZoom: .1,
					maxZoom: 1
				}), e.onResized(), l.getZoom()),
				foldNode: w,
				addNodes: E,
				deleteNodes: ee,
				moveNodes: D
			};
			e.setFlowLayout(t);
		}
	}, [l]), (0, import_react.useEffect)(() => {
		g.current && (g.current = !1, e.onResized());
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactFlow, {
		"data-baseflow-role": K.domRoles.GraphContiner,
		className: "ͼbaseflow-DagreFlow",
		fitView: !1,
		defaultViewport: n,
		onInit: O,
		nodeTypes: Wa,
		nodes: i,
		edges: o,
		defaultEdgeOptions: Ka,
		edgeTypes: Ga,
		nodesDraggable: !1,
		nodesConnectable: !1,
		nodesFocusable: !1,
		edgesFocusable: !1,
		elementsSelectable: !1,
		panOnScroll: !0,
		panOnDrag: !0,
		minZoom: .2,
		maxZoom: 1,
		onMove: e.onResized,
		zoomOnDoubleClick: !1
	});
});
function Ja(e, t, n) {
	return !(n === "meta" || n === "props" || n === "outputSchema" || n === "sources" && e === 1);
}
var Ya = (0, import_react.memo)(({ graph: e, initialLayoutData: t }) => {
	let [n, r] = (0, import_react.useState)(t), i = Z(() => n), a = Z((e) => {
		let t = an.graphToJson(e);
		r(t);
	}), o = Z(() => {
		J.clipboard.write(JSON.stringify(n)).then(() => J.message.success(P.alreadyToClipboard));
	});
	return (0, import_react.useEffect)(() => {
		let t = {
			getData: i,
			setData: r,
			setViewport: () => void 0,
			setCenter: () => void 0,
			resetNodeId: () => void 0,
			refreshNodeSize: () => void 0,
			refreshNodeUI: () => void 0,
			getViewport: () => ({
				zoom: 1,
				x: 0,
				y: 0
			}),
			zoomTo: () => void 0,
			zoomFit: () => 1,
			foldNode: () => void 0,
			addNodes: () => void 0,
			deleteNodes: () => void 0,
			moveNodes: () => void 0
		};
		return e.setFlowLayout(t), e.onLayoutRendered({
			layout: "dsl",
			layoutData: n,
			viewport: {
				zoom: 1,
				x: 0,
				y: 0
			}
		}), e.onResized(), e.addListener("dataChanged", a);
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-DSLFlow",
		"data-baseflow-role": K.domRoles.GraphContiner,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
			className: "copy",
			name: Y.Copy,
			button: !0,
			onClick: o
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "code",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(zi, {
				data: n,
				shouldExpandNode: Ja
			})
		})]
	});
});
var Xa = (0, import_react.memo)(({ graph: e }) => {
	let [t, n] = (0, import_react.useState)(e.getLayout());
	return (0, import_react.useEffect)(() => e.addListener("layoutChanged", (e) => n(e.layout)), []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-Flow__LayoutTools",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `item${t === "dagre" ? " on" : ""}`,
				title: "Dagre-Layout",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					name: Y.Dagre,
					onClick: () => e.setLayout("dagre")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `item${t === "code" ? " on" : ""}`,
				title: "Code-Layout",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					name: Y.Code,
					onClick: () => e.setLayout("code")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `item${t === "dsl" ? " on" : ""}`,
				title: "Code-Layout",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					name: Y.JSON,
					onClick: () => e.setLayout("dsl")
				})
			})
		]
	});
});
var Za = (0, import_react.memo)(({ nodeData: e, node: t, currentTab: n, onTabChange: r }) => {
	let [i, a] = (0, import_react.useState)(!1), [o, s] = (0, import_react.useState)(!1), l = t.getConfig(), u = t.getStatus(), d = t.getErrors(), f = e.meta.name || `${e.tag}-???`, p = e.id, m = !!e.meta.mockState, g = l.type === j.Trigger, y = (0, import_react.useCallback)((e) => {
		a(!1), e && e !== f && t.updateMeta({ name: e });
	}, [f, t]), b = (0, import_react.useCallback)((e) => {
		if (s(!1), e !== p) {
			let n = t.resetId(e);
			n && J.message.error(n);
		}
	}, [p, t]), x = (0, import_react.useCallback)(() => {
		let e = t.setMockState(!0);
		e ? J.message.error(e) : r("mock");
	}, [t, r]), S = (0, import_react.useCallback)(() => {
		t.getGraph().uploadNodeData(t.id);
	}, [t]), C = (0, import_react.useCallback)(() => {
		t.getGraph().downloadNodeData(t.id);
	}, [t]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-NodePanel__Header",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(fa, {
				icon: l.icon,
				status: u,
				mocked: m,
				message: d.configurationErrors || d.referenceErrors
			}),
			i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(da, {
				className: "node-name input",
				value: f,
				onSubmit: y
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "node-name",
				onClick: () => a(!0),
				children: f
			}),
			o ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(da, {
				className: "node-id input",
				value: p,
				onSubmit: b
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "node-id",
				onClick: () => s(!0),
				children: `ID: ${p}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ͼbaseflow-NodePanel__HeaderTabs",
				children: [
					!m && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: K.classNames("tab", { on: n === "in" }),
						onClick: () => n !== "in" && r("in"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g ? P.listen : P.input })
					}),
					!m && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: K.classNames("tab", { on: n === "out" }),
						onClick: () => n !== "out" && r("out"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g ? P.mapping : P.output })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: K.classNames("tab", { on: n === "log" }),
						onClick: () => n !== "log" && r("log"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: P.log })
					}),
					!m && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "link upload",
						name: Y.CloudDownload,
						onMouseEnter: (e) => Q.tooltip({
							content: P.downloadConfig,
							target: e.target
						}),
						onClick: C
					}),
					!m && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "link upload",
						name: Y.CloudUpload,
						onMouseEnter: (e) => Q.tooltip({
							content: P.uploadConfig,
							target: e.target
						}),
						onClick: S
					}),
					M.mockAble(e.type) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: K.classNames("link", {
							on: n === "mock",
							disabled: m
						}),
						name: Y.Pause,
						onMouseEnter: (e) => Q.tooltip({
							content: P.disable,
							target: e.target
						}),
						onClick: () => m ? n !== "mock" && r("mock") : x()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						name: Y.Help,
						className: K.classNames("link", { on: n === "info" }),
						onMouseEnter: (e) => Q.tooltip({
							content: P.help,
							target: e.target
						}),
						onClick: () => n !== "info" && r("info")
					})
				]
			})
		]
	});
});
var Qa = (0, import_react.memo)(({ node: e, nodeData: t, content: n }) => {
	let r = e.getSource(), i = e.getConfig();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-NodePanel__Helper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "version",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lang",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Executor：" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cite", { children: Object.keys(i.executor).join(" / ") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "source",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "tag:" }), t.tag] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "src:" }), r.name] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "ver:" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: `v${r.actualVersion}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { color: "var(--bf-tx-lesser)" },
								children: `(@${r.formalVersion})`
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "desc",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "info-icon",
						name: Y.Info
					}), i.desc]
				})
			]
		}), n && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.DescMD, { value: n })]
	});
});
var $a = (e, t) => {
	if (!t) return { name: P.flowInput };
};
var eo = (0, import_react.memo)(({ node: e, nodeData: t }) => {
	let n = e.getGraph().getInputSchema(), r = t.meta.valueReference?.value, i = Z((t) => {
		e.updateMeta({ valueReference: {
			path: "start",
			value: t
		} });
	}), a = Z(() => {
		e.clearMessages(), !n && r && e.updateMeta({ valueReference: {
			path: "start",
			value: void 0
		} });
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [t.meta.collaboratorMessages && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "alert",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Info }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: P.inputSchemaChanged })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
			size: "small",
			type: "primary",
			onClick: a,
			children: R.ButtonOk
		})]
	}), (n || r) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(la, {
		labelRender: $a,
		schema: n,
		value: r,
		onChange: i
	})] });
});
var to = (e, t) => {
	if (!t) return {
		name: "output",
		label: P.mock
	};
};
var no = (0, import_react.memo)(({ nodeData: e, node: t, onTabChange: n }) => {
	let r = e?.meta.mockState, i = e.meta.outputSchema, a = Z(() => {
		let e = t.setMockState(!0);
		e && J.message.error(e);
	}), o = Z(() => {
		t.setMockState(void 0), n("in");
	}), s = Z((e) => {
		e ? i ? t.setMockState(G.createSchemaValueByModel(i)) : J.message.error("节点未定义输出") : t.setMockState(!0);
	});
	if (r) {
		let n = r === !0 ? void 0 : r;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-NodePanel__MockState",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hd",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "title on",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: P.currentNodeIsDisabled }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Switch, {
						value: !1,
						checkedChildren: P.enableNode,
						unCheckedChildren: P.enableNode,
						onChange: o
					})]
				}), e.type !== j.Trigger && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "desc",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: P.currentNodeIsDisabledDesc }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Switch, {
						value: r !== !0,
						checkedChildren: P.mockOutput,
						unCheckedChildren: P.mockOutput,
						onChange: s
					})]
				})]
			}), n && i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bd",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(la, {
					labelRender: to,
					schema: i,
					value: n,
					onChange: t.setMockState
				})
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-NodePanel__MockState",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hd",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "title",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: P.currentNodeIsDisabledDesc }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Switch, {
					value: !1,
					checkedChildren: P.disableNode,
					unCheckedChildren: P.disableNode,
					onChange: a
				})]
			})
		})
	});
});
var ro = (0, import_react.memo)(({ node: e, nodeData: t }) => {
	let n = e.getGraph(), r = e.getGraph().getLastLogs(), i = Z(() => {
		n.reselect(""), document.getElementById("_BaseflowDebug_")?.click();
	});
	if (!r) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ͼbaseflow-NodePanel__NodeLogs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "empty",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Info }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: { marginLeft: "5px" },
					children: P.noLogsTips
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
					size: "small",
					type: "link",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Debug }),
					onClick: i,
					children: P.load
				})
			]
		})
	});
	let a = r.info, o = r.result, s = r.nodes[t.id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-NodePanel__NodeLogs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flow-status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						name: Y.Versions,
						className: "run"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "title",
						children: `${P.runLogs}:`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: a.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "time",
						children: `(${a.datetime})`
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
					className: "switch",
					size: "small",
					type: "link",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Switch }),
					onClick: i,
					children: P.switchLogs
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: K.classNames("ͼbaseflow-Flow__SettingsLogsForm__result", o.status),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "field",
						children: P.flowStatus
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "status",
						children: o.status.toUpperCase()
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "field",
						children: P.totalTime
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: `${o.totalTime}s` })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "field",
						children: P.executionNodes
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: `${o.totalNodes}` })] })
				]
			}),
			s ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: K.classNames("node-status", s.status),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						name: Y.Dagre,
						className: "run"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "title",
						children: `${P.currentNode}:`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: s.id
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "status",
					children: s.status.toUpperCase()
				}), s.time ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "time",
					children: `(${P.executionTime}: ${s.time}s)`
				}) : null] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "console",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(yi, {
					header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Output" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "output",
						children: s.output
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(yi, {
					header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Console" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "console",
						children: s.console
					})
				})]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "node-status",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "title",
					children: `${P.currentNode}:`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label",
					children: t.id
				})] })
			})
		]
	});
});
var io = (e, t) => {
	if (!t) return { name: "Output" };
};
var ao = (0, import_react.memo)(({ node: e, nodeData: t, options: n }) => {
	let r = t.meta.outputSchema;
	return r ? n?.editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ea, {
		variant: "borderless",
		labelRender: io,
		editableFilter: n.editableFilter,
		toolsFilter: n.toolsFilter,
		value: r,
		onChange: e.updateOutputSchema
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ia, {
		labelRender: io,
		schema: r
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-sr-empty",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Empty }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: P.noDataPrompt })]
	});
});
var oo = (0, import_react.memo)(({ node: e, graph: t }) => {
	let [n, r] = (0, import_react.useState)(), i = (0, import_react.useRef)(0), [a, o] = (0, import_react.useState)(0), [s, c] = (0, import_react.useState)("in"), l = n?.type === j.Trigger, { inputForm: d, outputForm: f, readme: y } = (0, import_react.useMemo)(() => {
		if (e) {
			let t = e.getData();
			return r(t), c(t.meta.mockState ? "mock" : "in"), e.getConfig();
		}
		return r(void 0), c("in"), {
			inputForm: void 0,
			outputForm: void 0,
			readme: void 0
		};
	}, [e]), b = Z((t) => {
		if (e && t.changed[e.id]) {
			let n = t.changed[e.id];
			t.inHistory && i.current++, r(n);
		}
	}), x = Z(() => {}), S = Z((t) => {
		e && e.id === t && (i.current++, o(a + 1));
	});
	return (0, import_react.useEffect)(() => {
		let e = [
			t.addListener("dataChanged", x),
			t.addListener("nodeDataChanged", b),
			t.addListener("refreshNodePanel", S)
		];
		return () => {
			e.forEach((e) => {
				e();
			});
		};
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-NodePanel", { on: e }),
		children: e && n && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Za, {
			nodeData: n,
			node: e,
			currentTab: s,
			onTabChange: c
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-NodePanel__Body",
			children: [
				s === "in" && d && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					className: "ͼbaseflow-NodePanel__IFrame",
					title: "node",
					src: F.nodeRendererUrl
				}) }),
				s === "out" && (l ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(eo, {
					nodeData: n,
					node: e
				}, e.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ao, {
					nodeData: n,
					node: e,
					options: f
				}, e.id)),
				s === "mock" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(no, {
					nodeData: n,
					node: e,
					onTabChange: c
				}, e.id),
				s === "log" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ro, {
					nodeData: n,
					node: e
				}, e.id),
				s === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Qa, {
					nodeData: n,
					node: e,
					content: y
				}, e.id)
			]
		})] })
	});
});
var so = (0, import_react.memo)(({ graph: e, onSubmit: t }) => {
	let [n, r] = (0, import_react.useState)(), [i, a] = (0, import_react.useState)(!1), o = n?.list, s = (0, import_react.useCallback)((n) => {
		a(!0), e.fetchLogsItem(n).then((e) => {
			Q.popup(null), t(e);
		}).finally(() => a(!1));
	}, [e, t]), l = (0, import_react.useCallback)(() => {
		J.clipboard.write(n?.commitId || "").then(() => J.message.success(P.alreadyToClipboard));
	}, [n?.commitId]);
	return (0, import_react.useEffect)(() => {
		e.fetchLogsList().then((e) => r(e));
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-Flow__DebugForm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "info",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "title",
					children: P.runLogs
				}), n ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "commit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						onClick: l,
						onMouseEnter: (e) => Q.tooltip({
							content: P.copyCommitId,
							target: e.target
						}),
						children: `CommitID: ${n.commitId.substring(0, 20)}...`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "help",
						name: Y.Help,
						onMouseEnter: (e) => Q.tooltip({
							content: P.commitIdPrompt,
							target: e.target
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "commit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "loading..." })
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					button: !0,
					name: Y.Import,
					onMouseEnter: (e) => Q.tooltip({
						content: R.import,
						target: e.target
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					button: !0,
					name: Y.Copy,
					onMouseEnter: (e) => Q.tooltip({
						content: R.paste,
						target: e.target
					})
				})] })]
			}),
			i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "loading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Spin, { size: "small" })
			}),
			o ? o.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list",
				children: o.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					onClick: () => s(e.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "time",
							children: `▷ ${e.time}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "label",
							children: e.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `status ${e.status}` })
					]
				}, e.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "empty",
				children: P.noLogsPrompt
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "loading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Spin, { size: "small" })
			})
		]
	});
});
var co = (0, import_react.memo)(({ className: e, graph: t, device: n, status: r }) => {
	let i = t.getNodeDataById(n.id), a = i.meta.name || `${i.tag}-???`, o = t.getNodeConfigById(n.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-OutputSelector-DeviceItem ͼbaseflow-Flow__SettingsLogs", e, { selected: n.highlighted }),
		"data-node-id": n.id,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-OutputSelector-DeviceItem__node",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "device-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						alt: "",
						src: o.icon
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "device-name",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: i.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: K.classNames("device-status", r) })
			]
		})
	});
});
var lo = (e, t) => {
	if (!t) return { name: P.output };
};
var uo = (0, import_react.forwardRef)(({ graph: e, data: t, onClose: n }, r) => {
	let [i, a] = (0, import_react.useState)(!!t.running), o = (0, import_react.useRef)(void 0), [s] = (0, import_react.useState)(() => e.getNodeDataMaps()), [c, l] = (0, import_react.useState)(() => oe(e.getGraphData().nodes).nodes), [d, y] = (0, import_react.useState)(""), b = t.logs, x = t.running, S = b.nodes[d], C = Object.values(b.nodes).filter((e) => e.status === "running"), w = Z((e) => {
		let t = e.target.getAttribute("data-node-id") || "";
		if (d !== t) {
			y(t);
			let e = z.produce(c, (e) => {
				e.id === t ? e.highlighted = !0 : e.highlighted &&= void 0;
			});
			l(e);
		}
	}), T = Z(() => {
		x?.abort().then(() => {
			b.result = {
				...b.result,
				status: "error"
			};
			let e = {};
			Object.values(b.nodes).forEach((t) => {
				t.status === "running" && (t.status = "error", e[t.id] = t.status);
			});
			let t = z.produce(c, (t) => {
				e[t.id] && (t.key = t.key ? t.key + 1 : 1);
			});
			l(t), a(!1);
		});
	}), E = Z(() => {
		x?.retry().then(() => {
			a(!0);
		});
	}), ee = Z(() => {
		i ? (K.addClass(o.current, "anmi"), setTimeout(() => K.removeClass(o.current, "anmi"), 200)) : n();
	}), D = Z((e) => {
		let t = e.nodes;
		b.result = e.result;
		let n = b.nodes, r = {};
		Object.keys(t).forEach((e) => {
			let i = t[e], a = n[e];
			a ? (a.status !== i.status && (r[e] = i.status), n[e] = {
				...a,
				...i,
				console: (a.console || "") + (i.console || "")
			}) : (n[e] = i, r[e] = i.status);
		});
		let i = z.produce(c, (e) => {
			r[e.id] && (e.key = e.key ? e.key + 1 : 1);
		});
		l(i), b.result.status !== "running" && (b.result.status === "error" ? J.message.error(P.executionCompleted) : J.message.success(P.executionCompleted), a(!1));
	}), te = Z((e) => {
		let t = z.produce(c, (t) => {
			if (t.id === e) return t.folded = !t.folded, !0;
		});
		l(t);
	}), O = Z(({ node: t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(co, {
		graph: e,
		device: t,
		status: b.nodes[t.id]?.status
	}));
	(0, import_react.useEffect)(() => {
		i || e.setLastLogs(b);
	}, [
		b,
		e,
		i
	]), (0, import_react.useImperativeHandle)(r, () => ({
		close: ee,
		onMessage: D
	}), [ee, D]);
	let k = (0, import_react.useMemo)(() => {
		let e = b.result, t = C[0]?.id;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: K.classNames("ͼbaseflow-Flow__SettingsLogsForm__result", e.status),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: K.classNames("field", { running: i }),
					children: P.flowStatus
				}), t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "current",
					children: t.toUpperCase()
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "status",
					children: e.status.toUpperCase()
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "field",
					children: P.totalTime
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: `${e.totalTime}s` })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "field",
					children: P.executionNodes
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: `${e.totalNodes}` })] })
			]
		});
	}, [b.result, i]), A = (0, import_react.useMemo)(() => {
		if (!S) return null;
		let t = s[S.id], n = t.meta.name || `${t.tag}-???`, r = e.getNodeConfigById(S.id), i = t.meta.outputSchema;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ͼbaseflow-OutputSelector-DeviceItem",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: K.classNames("ͼbaseflow-OutputSelector-DeviceItem__node"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "device-icon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							alt: "",
							src: r.icon
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "device-name",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: t.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: K.classNames("status", S.status),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text",
					children: S.status.toUpperCase()
				}), S.time ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: `${P.executionTime}: ${S.time}s` }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "console",
				children: [
					i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(yi, {
						header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Schema" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "schema",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ia, {
								labelRender: lo,
								schema: i
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(yi, {
						header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Output" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "output",
							children: "\n{\n    \"layout\": \"dagre\",\n    \"sources\": {\n        \"@baseflow-nodes/flow\": \"@baseflow-nodes/flow@1.0.0\",\n        \"@baseflow-nodes/start\": \"@baseflow-nodes/start@1.0.0\",\n        \"@baseflow-nodes/choice\": \"@baseflow-nodes/choice@1.0.0\",\n        \"@baseflow-nodes/branch\": \"@baseflow-nodes/branch@1.0.0\",\n        \"@baseflow-nodes/http\": \"@baseflow-nodes/http@1.0.0\",\n        \"@baseflow-nodes/variable\": \"@baseflow-nodes/variable@1.0.0\",\n        \"@baseflow-nodes/end\": \"@baseflow-nodes/end@1.0.0\"\n    },\n    \"triggers\": [],\n}\n              "
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(yi, {
						header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Console" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
							className: "console",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手啊粉萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手啊萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大啊粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大啊粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大啊粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大手啊粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大萨芬是大方啊说分手啊粉丝大啊粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手啊粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手啊粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手啊粉丝大发是大法师大 sa fafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "sdfsdafasd" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "撒大法师大方似懂非懂萨芬是大方啊说分手啊粉丝大发是大法师大 sa fafasd" })
							]
						})
					})
				]
			})
		] });
	}, [S]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-Flow__SettingsLogsForm",
		onClick: w,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hd",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "title",
				children: `${P.runLogs}:`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "name",
				children: b.info?.label
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "time",
				children: b.info?.datetime
			})] }), i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
				ref: o,
				className: "pause-btn",
				size: "small",
				color: "primary",
				variant: "text",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Pause }),
				onClick: T,
				children: P.stop
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
				size: "small",
				type: "text",
				className: "cancel",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.CloseCircle }),
				onClick: n,
				children: P.cancel
			}), x && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
				ref: o,
				size: "small",
				color: "primary",
				variant: "text",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Run }),
				onClick: E,
				children: P.retry
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bd",
			children: [k, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ua, {
				namespace: "OutputSelector",
				source: c,
				nodeRender: O,
				onSwitch: te
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-Flow__SettingsLogsDetail", { on: S }),
		children: A
	})] });
});
var fo = (0, import_react.memo)(uo);
var po = (e, t) => {
	if (!t) return { name: P.flowInput };
};
var mo = [
	{
		label: "development",
		value: "development"
	},
	{
		label: "test",
		value: "test"
	},
	{
		label: "production",
		value: "production"
	}
];
var ho = (0, import_react.memo)(({ graph: e }) => {
	let [t, n] = (0, import_react.useState)(e.getStatus()), r = (0, import_react.useRef)(null), [i, a] = (0, import_react.useState)(), [o, s] = (0, import_react.useState)(), [c, l] = (0, import_react.useState)("development"), [d, f] = (0, import_react.useState)(), p = (0, import_react.useRef)(null), y = Z((e) => {
		p.current.onMessage(e);
	}), b = Z(() => {
		if (t === "error") {
			J.message.error(P.graphErrorsPrompt), e.setCenterNode();
			return;
		}
		let n = e.getInputSchema();
		if (n) {
			let e = G.createSchemaValueByModel(n, o);
			s(e), a(n);
		} else s(void 0), a("none");
	}), x = Z(() => {
		a(void 0);
	}), S = Z(() => {
		f(void 0);
	}), C = Z(() => {
		let t = G.checkForm(r.current);
		t ? J.message.error(t) : e.testRun(y, c, o).then((e) => {
			a(void 0), f(e);
		});
	}), w = Z((t) => {
		Q.popup({
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(so, {
				graph: e,
				onSubmit: (e) => f({ logs: e })
			}),
			target: t.target,
			offset: {
				left: "-8px",
				top: "5px"
			}
		});
	});
	(0, import_react.useEffect)(() => e.addListener("statusChanged", n), [e]);
	let T = !!(i || d);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-Flow__RunTools",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group",
				children: [
					t === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: K.classNames("item info", { err: t === "error" }),
						name: Y.Info,
						onClick: () => e.setCenterNode(),
						onMouseEnter: (e) => Q.tooltip({
							content: P.graphErrorsPrompt,
							target: e.target
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "item info",
						name: Y.Info,
						onClick: () => J.message.success(P.noErrors)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "split" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: K.classNames("item primary", { err: t === "error" }),
						onClick: b,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Run }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label",
							children: P.testRun
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "split" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "item debug",
						name: Y.Debug,
						id: "_BaseflowDebug_",
						onClick: w
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "group",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "item",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Export }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: P.publish
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: K.classNames("ͼbaseflow-Flow__Settings", { on: T }),
			children: [i && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ͼbaseflow-Flow__SettingsInputForm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hd",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "title",
							children: `${P.testRun}...`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
								size: "small",
								type: "text",
								className: "cancel",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.CloseCircle }),
								onClick: x,
								children: P.cancel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
								size: "small",
								color: "primary",
								variant: "text",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.CheckCircle }),
								onClick: C,
								children: P.submit
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cd",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								name: Y.Help,
								onMouseEnter: (e) => Q.tooltip({
									content: P.envModeTips,
									target: e.target
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: `${P.envMode}:` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Select, {
								className: "env-select",
								size: "small",
								value: c,
								options: mo,
								onChange: l
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bd",
						ref: r,
						children: i !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(la, {
							labelRender: po,
							schema: i,
							value: o,
							onChange: s
						})
					})
				]
			}), d && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(fo, {
				graph: e,
				data: d,
				onClose: S,
				ref: p
			})]
		}),
		T && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ͼbaseflow-Flow__SettingsMask",
			onClick: () => {
				i ? x() : p.current && p.current.close();
			}
		})
	] });
});
function go(e, t) {
	let n = t.offset, r = {
		left: [],
		right: [],
		top: [],
		bottom: []
	};
	e.forEach((e) => {
		let i = t.nodes[e].getBoundingClientRect();
		Object.assign(t.boxs[e].style, {
			left: `${i.left - n.left}px`,
			top: `${i.top - n.top}px`,
			width: `${i.width}px`,
			height: `${i.height}px`
		});
		let a = t.bgs[e].getBoundingClientRect();
		r.left.push(a.left), r.top.push(a.top), r.right.push(a.left + a.width), r.bottom.push(a.top + a.height);
	});
	let i = Math.min(...r.left), a = Math.min(...r.top), o = Math.max(...r.right) - i, s = Math.max(...r.bottom) - a;
	Object.assign(t.boxs.$.style, {
		left: `${i - n.left}px`,
		top: `${a - n.top}px`,
		width: `${o}px`,
		height: `${s}px`
	}), Object.assign(t.boxs._.style, {
		left: `${i - n.left}px`,
		top: `${a - n.top - 16}px`
	});
}
function _o(e, t, n, r, i, a) {
	let o = {
		left: t.style.left,
		top: t.style.width
	}, s = t.getBoundingClientRect(), c = {
		x: r.clientX - s.left,
		y: r.clientY - s.top
	}, l = !1, u = (r) => {
		l || (l = !0, e.style.pointerEvents = "none", n.style.visibility = "hidden");
		let i = {
			x: r.clientX - c.x,
			y: r.clientY - c.y
		};
		t.style.left = `${i.x - s.x}px`, t.style.top = `${i.y - s.y}px`;
	}, d = (e) => {
		e.preventDefault();
	}, f = (r) => {
		l = !1, e.style.pointerEvents = "auto", n.style.visibility = "visible", i.current = void 0, t.style.left = o.left, t.style.top = o.top, window.removeEventListener("mousemove", u), window.removeEventListener("mouseup", f), window.removeEventListener("selectstart", d), a(r.target);
	};
	return window.addEventListener("mousemove", u), window.addEventListener("mouseup", f), window.addEventListener("selectstart", d), f;
}
var vo = (0, import_react.memo)(({ selected: e, graph: t, children: n }) => {
	let r = (0, import_react.useRef)(null), i = (0, import_react.useRef)(null), a = (0, import_react.useRef)(null), o = (0, import_react.useRef)(void 0), s = (0, import_react.useRef)(void 0), l = Z((e) => {
		e.metaKey && t.select(e.target.dataset.id);
	}), d = Z(() => {
		if (o.current) {
			console.log("onLayoutChanged");
			let e = t.getContainer(), n = o.current;
			e.querySelectorAll(`div[data-baseflow-role=${K.domRoles.FlowNode}]`).forEach((e) => {
				let t = e.getAttribute("data-baseflow-node") || "";
				n.boxs[t] && (n.nodes[t] = e);
			}), e.querySelectorAll(`div[data-baseflow-role=${K.domRoles.FlowNodeRange}]`).forEach((e) => {
				let t = e.getAttribute("data-baseflow-node") || "";
				n.boxs[t] && (n.bgs[t] = e);
			});
		}
	}), f = Z(() => {
		o.current && go(e, o.current);
	}), h = Z(() => {
		let e = t.getSelected()[0];
		e && e.showMenu();
	}), y = Z(() => {
		let e = t.getSelected();
		if (e.length) try {
			t.deleteNodes(e.map((e) => e.id));
		} catch (e) {
			J.message.error(e.message || e);
		}
	}), b = Z(() => {
		let e = t.getSelected();
		e.length && t.toClipboard("copy", e.map((e) => e.id));
	}), x = Z(() => {
		let e = t.getSelected();
		e.length && t.toClipboard("cut", e.map((e) => e.id));
	}), S = Z((e) => {
		if (e.dataset.baseflowRole === K.domRoles.FlowNodePlus) {
			let [n, r] = (e.dataset.baseflowAction || "").split("::"), i = t.getSelectedIds();
			if (n && r && i.length) try {
				t.moveNodes(r, n, i);
			} catch (e) {
				J.message.error(e.message || e);
			}
		}
	}), C = (0, import_react.useCallback)((e) => {
		let t = e.target;
		t.dataset.id && t.dataset.trigger !== "true" && (s.current ? s.current(e) : s.current = _o(t, i.current, a.current, e, s, S));
	}, [S]), { activated: w, isTrigger: T } = (0, import_react.useMemo)(() => t.getLayout() === "dsl" ? {
		activated: !1,
		isTrigger: !1
	} : e[0] ? {
		activated: !0,
		isTrigger: t.getNodeDataById(e[0]).type === j.Trigger
	} : {
		activated: !1,
		isTrigger: !1
	}, [t, e]), E = e.length === 1;
	return (0, import_react.useEffect)(() => {
		if (w) {
			let n = t.getContainer(), s = {
				boxs: {
					$: r.current,
					_: a.current
				},
				nodes: {},
				bgs: {},
				offset: i.current.getBoundingClientRect()
			};
			i.current.querySelectorAll("div[data-id]").forEach((e) => {
				let t = e.getAttribute("data-id") || "";
				s.boxs[t] = e;
			}), n.querySelectorAll(`div[data-baseflow-role=${K.domRoles.FlowNode}]`).forEach((e) => {
				let t = e.getAttribute("data-baseflow-node") || "";
				s.boxs[t] && (s.nodes[t] = e);
			}), n.querySelectorAll(`div[data-baseflow-role=${K.domRoles.FlowNodeRange}]`).forEach((e) => {
				let t = e.getAttribute("data-baseflow-node") || "";
				s.boxs[t] && (s.bgs[t] = e);
			}), o.current = s, go(e, s);
		} else o.current = void 0;
	}, [e]), (0, import_react.useEffect)(() => t?.addListener("layoutRendered", d), [t, d]), (0, import_react.useEffect)(() => t?.addListener("viewportResized", f), [t, f]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ͼbaseflow-FlowSelection range",
			children: w && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "box",
				ref: r
			})
		}),
		n,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `ͼbaseflow-FlowSelection ghost${T ? " triggers" : ""}`,
			ref: i,
			onMouseDown: C,
			children: [w && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `ͼbaseflow-FlowSelection__tools ${t.getLayout()}`,
				ref: a,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						name: Y.Delete,
						title: P.delete,
						onClick: y
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						name: Y.Copy,
						title: P.copy,
						onClick: b
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						name: Y.Cut,
						title: P.cut,
						onClick: x
					}),
					E && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						name: Y.Options,
						title: P.more,
						onClick: h
					})
				]
			}), e.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "box",
				"data-id": e,
				"data-trigger": T,
				onClick: l
			}, e))]
		})
	] });
});
var yo = (0, import_react.memo)(({ graph: e, initialList: t, selected: n, onShowCreater: r }) => {
	let i = (0, import_react.useRef)(t), [a, o] = (0, import_react.useState)(t), s = (0, import_react.useCallback)((e) => {
		i.current = e, o(e);
	}, []), l = (0, import_react.useCallback)((t) => {
		J.confirm(P.deleteConfirm, (n) => {
			if (n) try {
				e.deleteTrigger(t);
			} catch (e) {
				J.message.error(e.message);
			}
		});
	}, [e]), d = Z((e) => {
		let t = i.current;
		s(t.map((t) => t.id === e.id ? e : t));
	});
	return (0, import_react.useEffect)(() => {
		let t = {
			refreshNodeUI: d,
			setNodes: s
		};
		e.setTriggerLayout(t);
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-FlowTriggers",
		"data-baseflow-role": K.domRoles.GraphContiner,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.Help,
				style: {
					fontSize: "12px",
					marginRight: "-1px"
				},
				onMouseEnter: (e) => Q.tooltip({
					content: P.triggersTips,
					target: e.target
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "subject",
				children: P.triggers
			}),
			a.map((t) => {
				let r = e.getNodeConfigByTag(t.tag), i = !!(t.meta.referenceErrors || t.meta.configurationErrors), a = !!t.meta.mockState;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: K.classNames("item", { on: n === t.id }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "tools",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "action",
								name: Y.Delete,
								title: P.delete,
								onClick: () => l(t.id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "action",
								name: Y.Copy,
								title: P.copy,
								onClick: () => e.toClipboard("copy", [t.id])
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "node-item",
							"data-baseflow-role": K.domRoles.FlowNode,
							"data-baseflow-node": t.id,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(fa, {
								icon: r.icon,
								status: i ? "error" : "normal",
								message: t.meta.configurationErrors || t.meta.referenceErrors,
								mocked: a
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "node-bg",
							"data-baseflow-role": K.domRoles.FlowNodeRange,
							"data-baseflow-node": t.id
						})
					]
				}, t.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "add",
				onClick: (t) => r({
					sourceNode: e.getNodeById("flow"),
					place: "inside",
					target: t.currentTarget
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Plus })
			})
		]
	});
});
var bo = (0, import_react.memo)(({ options: e, value: t, onChange: n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "ͼbaseflow-LinkNav",
	children: e.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("item", { on: t === e.value }),
		onClick: () => {
			t !== e.value && n?.(e.value);
		},
		children: e.label
	}, e.value))
}));
var xo = (0, import_react.memo)(({ className: e, graph: t, onSwitchOutput: n, onSelectedVariable: r, onSwitchAllSchema: i, onSwitchSchema: a, device: o }) => {
	let s = o.outputSchema, c = t.getNodeDataById(o.id), l = c.meta.name || `${c.tag}-???`, u = t.getNodeConfigById(o.id), d = !!c.meta.mockState, [f, m] = (0, import_react.useState)(!1), [g, y] = (0, import_react.useState)(() => s ? !s.folded : !1), b = (0, import_react.useMemo)(() => s?.children, [s]);
	(0, import_react.useMemo)(() => y(s ? !s.folded : !1), [s]);
	let x = Z((e) => {
		a(o.id, e);
	}), S = Z(() => {
		i(o.id, !f), m(!f);
	}), C = Z(() => {
		s ? n(o.id) : y(!g);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-OutputSelector-DeviceItem", e),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: K.classNames("ͼbaseflow-OutputSelector-DeviceItem__node"),
			"data-node-id": s ? s.id : void 0,
			onClick: C,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: K.classNames("device-icon", { mocked: d }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						alt: "node-icon",
						src: u.icon
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "device-name",
					children: l
				}),
				s && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "device-output",
					name: Y.ArrowRight
				}),
				s && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "device-data",
					name: s.type
				})
			]
		}), g && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-OutputSelector-DeviceItem__output",
			children: [b && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				name: Y.Down,
				className: K.classNames("expand-all", { on: f }),
				onClick: S
			}), s ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(na, {
				schema: s,
				onSwitch: x,
				onSelected: r
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-output",
				children: P.noOutputs
			})]
		})]
	});
});
var So = (0, import_react.memo)(({ graph: e, currentDeviceId: t, source: n, onSelectedVariable: r, onSourceChange: i }) => {
	let a = Z((e) => {
		let t = z.produce(n, (t) => {
			if (t.id === e) return t.folded = !t.folded, !0;
		});
		i?.(t);
	}), o = Z((e) => {
		let t = z.produce(n, (t) => {
			if (t.id === e) return t.outputSchema.folded = !t.outputSchema.folded, !0;
		});
		i?.(t);
	}), s = Z((e, t) => {
		let r = z.produce(n, (n) => {
			if (n.id === e) return z.each(n.outputSchema, (e) => {
				e.id === t && (e.folded = !e.folded);
			}), !0;
		});
		i?.(r);
	}), c = Z((e, t) => {
		let r = z.produce(n, (n) => {
			if (n.id === e) return z.each(n.outputSchema, (e, { parent: n }) => {
				n && (e.folded = !t);
			}), !0;
		});
		i?.(r);
	}), l = Z(({ node: n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(xo, {
		className: K.classNames({
			on: n.id === t,
			disabled: n.disabled
		}),
		graph: e,
		device: n,
		onSwitchSchema: s,
		onSwitchOutput: o,
		onSelectedVariable: r,
		onSwitchAllSchema: c
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ua, {
		namespace: "OutputSelector",
		source: n,
		nodeRender: l,
		onSwitch: a
	});
});
var Co = (e) => ({
	name: e.label,
	label: ""
});
var wo = (0, import_react.memo)(({ schema: e, isUtils: t, onSourceChange: n, onSelectedVariable: r }) => {
	let i = Z((t) => {
		let r = z.produce(e, (e) => {
			if (e.id === t) return e.folded = !e.folded, !0;
		});
		n?.(r);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(na, {
		className: "ͼbaseflow-VarSelector-Schema",
		labelRender: t ? Co : void 0,
		schema: e,
		onSelected: r,
		onSwitch: i
	});
});
var To = [{
	label: P.allNodes,
	value: "all"
}, {
	label: P.variableNodes,
	value: j.Variable
}];
function Eo(e) {
	setTimeout(() => {
		let t = e?.querySelector(".item-title.highlight");
		t && t.scrollIntoView({ behavior: "smooth" });
	}, 50);
}
var Do = {
	runtimeOutputs: {
		id: "flow",
		data: j.Flow,
		children: []
	},
	runtimeVariableMaps: {}
};
var Oo = (0, import_react.forwardRef)((e, t) => {
	let { graph: n, superInput: r, currentNodeId: i } = e, a = (0, import_react.useRef)(!1), [o, s] = (0, import_react.useState)(), [c, l] = (0, import_react.useState)(""), [d, f] = (0, import_react.useState)(), [y, b] = (0, import_react.useState)(et.getConstants()), [x, S] = (0, import_react.useState)(et.getUtils()), [C, w] = (0, import_react.useState)("output"), [T, E] = (0, import_react.useState)(""), ee = (0, import_react.useRef)(null), D = (0, import_react.useRef)(null), te = (0, import_react.useRef)(null), O = n.validateServer.editorDom, k = n.validateServer.tsServer, A = r?.getMode();
	(0, import_react.useMemo)(() => {
		r && !i && w("constant");
	}, [!i, r]);
	let ne = Z((e, t) => {
		A === "simple" ? r?.insertVariable(e, t) : k.iv(C === "utils" ? `${e}()` : e);
	}), j = Z((e, t) => {
		let { output: n, context: r } = t || {
			output: o,
			context: d
		}, i = et.getVariableMode(e);
		if (i === "output" && n) {
			let t = ht.highlightOutputs(e, n, !0);
			w("output"), s(t);
		} else if (i === "context" && r) {
			let t = W.highlightOutputs(e, r, !0);
			w("context"), f(t);
		} else if (i === "constant") {
			let t = W.highlightOutputs(e, y, !0);
			w("constant"), b(t);
		} else if (i === "utils") {
			let t = W.highlightOutputs(e, x, !0);
			w("utils"), b(t);
		}
	}), re = Z(() => {
		k.fm().then(() => {
			let e = k.gc().trim();
			r?.setText(e), n.setCurrentSuperInput(void 0);
		});
	}), M = Z((e) => {
		let t = He(e);
		j(t), Eo(D.current);
	}), ie = (0, import_react.useMemo)(() => {
		if (r && !T) {
			let e = r.getBrand() === "variable" ? "Variable" : "all";
			return E(e), e;
		}
		return T;
	}, [r, T]);
	(0, import_react.useMemo)(() => {
		if (r) {
			let e = r.getVariableFilter(), { runtimeOutputs: t, runtimeVariableMaps: i } = n.getCurrentNode() || Do, c = o || t;
			c &&= e ? ht.produceDeviceAndOutput(c, (t, { isDevice: n }) => {
				let r;
				r = n ? (ie === "all" ? void 0 : t.data !== ie) || void 0 : e(t) || void 0, t.disabled !== r && (t.disabled = r);
			}) : ht.produceDeviceAndOutput(c, (e, { isDevice: t }) => {
				let n;
				n = t && (ie === "all" ? void 0 : e.data !== ie) || void 0, e.disabled !== n && (e.disabled = n);
			}), s(c);
			let u, d = r.getContext();
			l(d), d ? (u = i[d], u = et.getContext(d, u), u && e && (u = z.produce(u, (t) => {
				t.disabled = e(t) || void 0;
			})), f(u)) : f(void 0);
			let p = r.getHighlight();
			p && (j(p, {
				output: c,
				context: u
			}), a.current && Eo(D.current));
		}
	}, [
		r,
		A,
		ie
	]);
	let ae = (0, import_react.useMemo)(() => r ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-VarSelector__header",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("tab", {
					on: C === "output",
					disabled: !i
				}),
				onClick: (e) => !e.target.className.includes("disabled") && w("output"),
				children: P.outputsTab
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("tab", { on: C === "context" }),
				onClick: (e) => !e.target.className.includes("disabled") && w("context"),
				children: P.contextTab
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("tab", { on: C === "constant" }),
				onClick: (e) => !e.target.className.includes("disabled") && w("constant"),
				children: R.systemVariables
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("tab", {
					on: C === "utils",
					disabled: A !== "complex"
				}),
				onClick: (e) => !e.target.className.includes("disabled") && w("utils"),
				children: P.utilsTab
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-VarSelector__body",
		ref: D,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: K.classNames("tab-panel outputs", { on: C === "output" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "filter",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(bo, {
						value: ie,
						options: To,
						onChange: E
					})
				}), o ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(So, {
					graph: n,
					source: o,
					currentDeviceId: i,
					onSourceChange: s,
					onSelectedVariable: ne
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ͼbaseflow-sr-empty",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Empty }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: P.noDataPrompt })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("tab-panel", { on: C === "context" }),
				children: d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(wo, {
					schema: d,
					onSourceChange: f,
					onSelectedVariable: ne
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ͼbaseflow-sr-empty",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { name: Y.Empty }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: P.noDataPrompt })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("tab-panel", { on: C === "constant" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(wo, {
					schema: y,
					onSourceChange: b,
					onSelectedVariable: ne
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("tab-panel", { on: C === "utils" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(wo, {
					isUtils: !0,
					schema: x,
					onSourceChange: S,
					onSelectedVariable: ne
				})
			})
		]
	})] }) : null, [
		o,
		d,
		y,
		x,
		C,
		A,
		ie
	]), oe = !r;
	return (0, import_react.useMemo)(() => {
		r && A === "complex" ? k.sc(r.getValue()?.text || "", Rt.contextToInspector(c), r.getRuntime()) : k.sc("");
	}, [
		r,
		A,
		k,
		c
	]), (0, import_react.useMemo)(() => {
		oe && (a.current = !1, w("output"), E(""), l(""), f(void 0), s(void 0), b(et.getConstants()), S(et.getUtils()));
	}, [oe]), (0, import_react.useEffect)(() => {
		let e = [];
		return r && (e.push(r.addListener("valueChanged", () => void 0)), e.push(r.addListener("variableClick", ({ variable: e }) => {
			j(e), Eo(D.current);
		})), e.push(r.addListener("expressionClick", () => void 0))), () => {
			e.forEach((e) => {
				e();
			});
		};
	}, [r]), (0, import_react.useEffect)(() => {
		A !== "complex" && O.style.visibility === "visible" && (O.style = "");
	}, [
		A,
		O,
		r
	]), (0, import_react.useEffect)(() => {
		let e = ee.current, t = (t) => {
			if (t.target === e && t.propertyName === "transform") {
				if (a.current = e.className !== "ͼbaseflow-VarSelector", e.dataset.mode === "complex") {
					let e = te.current.getBoundingClientRect();
					O.style = `top: ${e.top}px; left: ${e.left}px;visibility: visible;`;
				}
				a.current && Eo(D.current);
			}
		}, n = (t) => {
			if (e.dataset.mode === "complex") {
				let e = te.current.getBoundingClientRect();
				O.style = `top: ${e.top}px; left: ${e.left}px;visibility: visible;`;
			}
		};
		return k.ol(M), e.addEventListener("transitionend", t), window.addEventListener("resize", n), () => {
			e.removeEventListener("transitionend", t), window.removeEventListener("resize", n);
		};
	}, []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: K.classNames("ͼbaseflow-VarSelector", A, { testRun: !i }),
		"data-mode": A,
		"data-baseflow-role": K.domRoles.SuperInputVariables,
		ref: ee,
		children: [ae, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ͼbaseflow-VarSelector__editor",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "monaco",
				ref: te
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
						onClick: () => n.setCurrentSuperInput(void 0),
						children: P.cancel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
						type: "dashed",
						onClick: k.fm,
						children: P.format
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
						type: "primary",
						onClick: re,
						children: P.submit
					})
				]
			})]
		})]
	}), A === "complex" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ͼbaseflow-Modal__mask ͼbaseflow-VarSelector__mask" })] });
});
var ko = (0, import_react.memo)(Oo);
var Ao = (0, import_react.memo)(({ graph: e }) => {
	let [t, n] = (0, import_react.useState)(1);
	return (0, import_react.useEffect)(() => e.addListener("viewportZoomed", n), []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-Flow__ZoomTools",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `item${t >= 1 ? " disable" : ""}`,
				title: "Zoom-In",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					name: Y.Plus,
					onClick: e.zoomIn
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "item",
				title: "Fit-All",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					name: Y.Fit,
					onClick: e.zoomFit
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `item${t <= .2 ? " disable" : ""}`,
				title: "Zoom-Out",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					name: Y.Minus,
					onClick: e.zoomOut
				})
			})
		]
	});
});
var jo = (0, import_react.memo)(({ className: e, initialData: t, graphHooks: n, onShowCreater: r, options: i, onInit: a, onClick: o }) => {
	let [s, c] = (0, import_react.useState)(), [l, d] = (0, import_react.useState)(t.triggers), [f, g] = (0, import_react.useState)(), [y, b] = (0, import_react.useState)([]), [x, S] = (0, import_react.useState)(), [C, w] = (0, import_react.useState)(), T = (0, import_react.useRef)(null), E = s?.graph.getState(), [ee, D] = (0, import_react.useState)(), te = Z((e) => dn(t, T.current, r, n, i || {}, e).then((e) => {
		g({ layout: e.getLayout() }), c({ graph: e }), e.addListener("triggersChanged", d), e.addListener("layoutChanged", g), e.addListener("selectedChanged", b), e.addListener("currentNodeChanged", S), e.addListener("currentInputChanged", w), a?.(e.getIGraph());
	})), O = (0, import_react.useMemo)(() => {
		if (s) return { graph: s.graph.getIGraph() };
	}, [s]), k = (0, import_react.useMemo)(() => {
		if (s && f) {
			let { layout: e, layoutData: t, viewport: n } = f, r = s.graph.getGraphData().nodes, i = t;
			return i || (e === "dagre" ? i = xa(r, s.graph) : e === "code" ? i = oe(r) : e === "dsl" && (i = an.graphToJson(s.graph.getGraphData()))), {
				layout: e,
				graph: s.graph,
				initialLayoutData: i,
				initialViewport: n || {
					zoom: 1,
					x: 0,
					y: 0
				}
			};
		}
	}, [s, f]), A = (0, import_react.useMemo)(() => {
		if (s) return {
			validateSuperInput: s.graph.validateServer.validateSuperInput,
			setActivedSuperInput: (e) => s.graph.setCurrentSuperInput(e || void 0),
			getActivedSuperInput: () => s.graph.getCurrentSuperInput() || null
		};
	}, [s]);
	return (0, import_react.useEffect)(() => {
		let e = Ut.createValidateProvider();
		return Promise.all([e.proxy, Ee(t.sources, {}, n.onImportNode.bind(n))]).then((e) => te(e[0])).catch((e) => D(e)), () => {
			e.destory(), s?.graph.dispose();
		};
	}, []), ee ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-Flow", E, e),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				padding: "10px",
				color: "red"
			},
			children: ee?.message || ee.toString()
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: K.classNames("ͼbaseflow-Flow", E, e),
		ref: T,
		onClick: o,
		children: k ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ba.Provider, {
			value: s,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(za.Provider, {
				value: O,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(vo, {
						selected: y,
						graph: s.graph,
						children: [k.layout === "code" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(va, { ...k }) : k.layout === "dagre" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(qa, { ...k }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ya, { ...k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(yo, {
							graph: s.graph,
							initialList: l,
							selected: y?.[0],
							onShowCreater: r
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tools",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xa, { graph: O.graph }), k.layout !== "dsl" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ao, { graph: O.graph })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(yr, {
						value: A,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ho, { graph: s.graph }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(oo, {
							node: x?.node,
							graph: s.graph
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ko, {
						graph: s.graph,
						superInput: C,
						currentNodeId: x?.nodeId
					})
				]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: { padding: "10px" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Spin, {})
		})
	});
});
var Mo = (0, import_react.memo)(({ graph: e }) => {
	let [t, n] = (0, import_react.useState)({
		undoAble: !1,
		redoAble: !1
	}), [r, i] = (0, import_react.useState)(e.getSaverState()), a = e.getState(), o = a === "NodeOnly" || a === "ReadOnly";
	return (0, import_react.useEffect)(() => e.addListener("historyChanged", n), []), (0, import_react.useEffect)(() => e.addListener("saverChanged", i), []), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ͼbaseflow-Flow__HistoryTools",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("item", { disable: !t.undoAble || o }),
				title: "Undo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					name: Y.Undo,
					onClick: e.undo
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: K.classNames("item", { disable: !t.redoAble || o }),
				title: "Redo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					name: Y.Redo,
					onClick: e.redo
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q.Button, {
				className: "save",
				type: "primary",
				disabled: r === "disable" || o,
				loading: r === "saving",
				onClick: () => e.save(),
				children: "保存"
			})
		]
	});
});
//#endregion
export { Pa as a, fn as c, Mo as i, jo as l, I as n, Vt as o, Ia as r, an as s, Fa as t };

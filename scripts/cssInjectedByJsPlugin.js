/**
 * 把节点物料产出的 CSS 内联进 JS 产物。
 *
 * 节点渲染基座只通过动态 import 加载节点的 index.js，不加载同目录的 CSS，
 * 因此节点样式必须由 JS 自行注入，否则接入即丢样式。
 *
 * @returns {import("vite").Plugin}
 */
export function cssInjectedByJsPlugin() {
  return {
    name: "baseflow:css-injected-by-js",
    apply: "build",
    // 必须晚于 Vite 的 CSS 后置插件，此时 CSS 才已作为 asset 落入 bundle
    enforce: "post",
    generateBundle(_options, bundle) {
      const styles = [];

      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type === "asset" && fileName.endsWith(".css")) {
          styles.push(typeof output.source === "string" ? output.source : Buffer.from(output.source).toString("utf8"));
          delete bundle[fileName];
        }
      }

      if (styles.length === 0) return;

      const entry = Object.values(bundle).find((output) => output.type === "chunk" && output.isEntry);
      if (entry?.type !== "chunk") {
        throw new Error("cssInjectedByJsPlugin: 未找到入口 chunk，无法内联 CSS");
      }

      // import 声明会被提升，注入代码放在最前不影响共享依赖的求值顺序
      entry.code = `${createInjectCode(styles.join("\n"))}\n${entry.code}`;
    },
  };
}

/** @param {string} css */
function createInjectCode(css) {
  return `(() => {
  if (typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = ${JSON.stringify(css)};
  document.head.appendChild(style);
})();`;
}

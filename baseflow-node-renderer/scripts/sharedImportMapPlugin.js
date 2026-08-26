import { createSharedImports } from "./sharedDependencies.js";

/**
 * 由共享依赖表生成 index.html 的 Import Map，避免与 external、lib.entry 手工对齐。
 *
 * 只在 build 生效：dev 下 rollupOptions.external 不起作用，renderer 自身的 react 会走
 * Vite 预构建的 /node_modules/.vite/deps，而 Import Map 会把节点物料的裸标识符指向
 * ./shared，两者是两份 React 实例。renderer 的 dev 不支持加载节点物料。
 *
 * 注入用 head-prepend，但最终位置由 Vite 决定：它会把 importmap 重排到 head 中第一个
 * module script 之前。这正是 Import Map 生效所需的顺序，无需也无法在此固定到 head 首行。
 *
 * @returns {import("vite").Plugin}
 */
export function sharedImportMapPlugin() {
  return {
    name: "baseflow:shared-import-map",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "importmap" },
          children: JSON.stringify({ imports: createSharedImports() }, null, 2),
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

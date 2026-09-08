/**
 * Runtime 公共模块的 shared 构建配置。
 *
 * 模块 ID 的 ABI 清单仍由 runtimeContract.js 定义；这里仅描述每个入口
 * 使用哪个依赖包、输出名称和门面源码。
 */
/** @type {Readonly<Record<string, { packageName: string, name: string, source: string }>>} */
export const SharedDependencyDefinitionsById = Object.freeze({
  react: { packageName: "react", name: "react", source: "shared/react.ts" },
  "react/jsx-runtime": { packageName: "react", name: "react-jsx-runtime", source: "shared/reactJsxRuntime.ts" },
  "react-dom": { packageName: "react-dom", name: "react-dom", source: "shared/reactDom.ts" },
  "react-dom/client": { packageName: "react-dom", name: "react-dom-client", source: "shared/reactDomClient.ts" },
  "@baseflow/render-react": {
    packageName: "@baseflow/render-react",
    name: "baseflow-render-react",
    source: "shared/renderReact.ts",
  },
});

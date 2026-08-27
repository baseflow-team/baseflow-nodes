export const RuntimeVersion = 1;

/** 缺少 runtimeVersion 的历史节点固定按 v1 解释，不随当前 Runtime 升级漂移。 */
export const LegacyDefaultRuntimeVersion = 1;

/** Runtime v1 对节点公开的完整 bare import 入口。 */
export const RuntimeModuleIds = Object.freeze(["react", "react/jsx-runtime", "react-dom", "react-dom/client", "@baseflow/render-react"]);

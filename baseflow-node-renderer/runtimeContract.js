import WorkspacePackage from "../package.json" with { type: "json" };

const RuntimeConfig = WorkspacePackage.baseflow;

if (!RuntimeConfig || typeof RuntimeConfig !== "object" || Array.isArray(RuntimeConfig)) {
  throw new Error("根 package.json 必须包含有效的 baseflow Runtime 配置");
}

const { runtimeVersion, runtimeReleaseId } = RuntimeConfig;

if (!Number.isInteger(runtimeVersion) || runtimeVersion < 1) {
  throw new Error("根 package.json 的 baseflow.runtimeVersion 必须为正整数");
}

if (typeof runtimeReleaseId !== "string" || !/^\d{8}T\d{6}Z$/.test(runtimeReleaseId)) {
  throw new Error("根 package.json 的 baseflow.runtimeReleaseId 必须使用 UTC YYYYMMDDTHHmmssZ 格式");
}

export const RuntimeVersion = runtimeVersion;

export const RuntimeReleaseId = runtimeReleaseId;

/** 相对 baseflow-preview 的当前 Runtime release 目录。 */
export const RuntimeReleaseDir = `runtime/v${RuntimeVersion}/${RuntimeReleaseId}`;

export const RuntimeRendererUrl = `/${RuntimeReleaseDir}/index.html`;

/** 缺少 runtimeVersion 的历史节点固定按 v1 解释，不随当前 Runtime 升级漂移。 */
export const LegacyDefaultRuntimeVersion = 1;

/** 当前 Runtime 对节点公开的完整 bare import 入口。 */
export const RuntimeModuleIds = Object.freeze(["react", "react/jsx-runtime", "react-dom", "react-dom/client", "@baseflow/render-react"]);

/**
 * 当前分支的 Runtime ABI 契约，是版本和派生路径的唯一来源。
 *
 * 这里刻意不从 package.json 读配置：本模块同时被构建脚本和浏览器代码 import，
 * 一旦引入 JSON module，整份根 package.json（含 devDependencies、scripts）会被
 * 打进 renderer 和 demo 产物，构建期的配置校验也会跟着发到浏览器。
 */
export const RuntimeVersion = 1;

/**
 * 相对 baseflow-preview 的当前 Runtime 目录。
 *
 * 路径只包含 ABI 版本：构建身份由 index.html 引用的哈希文件名承担，
 * index.html 本身可变且不做长期缓存。父页面因此可以直接由节点
 * manifest 的 runtimeVersion 拼出 renderer 地址，无需查表或重定向。
 */
export const RuntimeDir = `runtime/v${RuntimeVersion}`;

export const RuntimeRendererUrl = `/${RuntimeDir}/index.html`;

/** 缺少 runtimeVersion 的历史节点固定按 v1 解释，不随当前 Runtime 升级漂移。 */
export const LegacyDefaultRuntimeVersion = 1;

/** 当前 Runtime 对节点公开的完整 bare import 入口。 */
export const RuntimeModuleIds = Object.freeze(["react", "react/jsx-runtime", "react-dom", "react-dom/client", "@baseflow/render-react"]);

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { RuntimeModuleIds, RuntimeVersion } from "../runtimeContract.js";

/**
 * 共享依赖的唯一事实来源。
 *
 * 同一张表同时驱动三处，避免手工同步：
 * - vite.shared.config.ts 的 lib.entry（outputName -> source）
 * - renderer 与节点物料的 rollupOptions.external（id）
 * - renderer index.html 的 Import Map（id -> shared/<outputName>.js）
 */

export const SharedOutputDir = "shared";

const Require = createRequire(import.meta.url);

const SharedDependencyDefinitionsById = new Map([
  ["react", { packageName: "react", name: "react", source: "src/shared/react.ts" }],
  ["react/jsx-runtime", { packageName: "react", name: "react-jsx-runtime", source: "src/shared/reactJsxRuntime.ts" }],
  ["react-dom", { packageName: "react-dom", name: "react-dom", source: "src/shared/reactDom.ts" }],
  ["react-dom/client", { packageName: "react-dom", name: "react-dom-client", source: "src/shared/reactDomClient.ts" }],
  [
    "@baseflow/render-react",
    {
      packageName: "@baseflow/render-react",
      name: "baseflow-render-react",
      source: "src/shared/renderReact.ts",
    },
  ],
]);

const SharedDependencyDefinitions = RuntimeModuleIds.map((id) => {
  const definition = SharedDependencyDefinitionsById.get(id);
  if (!definition) throw new Error(`sharedDependencies: Runtime 契约中的 ${id} 缺少构建定义`);
  return { id, ...definition };
});

if (SharedDependencyDefinitionsById.size !== RuntimeModuleIds.length) {
  throw new Error("sharedDependencies: 共享依赖构建定义与 Runtime 契约不一致");
}

export const SharedDependencies = SharedDependencyDefinitions.map((dependency) => {
  const version = resolvePackageVersion(dependency.packageName);
  return { ...dependency, version, outputName: `${dependency.name}@${version}` };
});

/** 当前 Runtime 对节点公开的完整模块入口。 */
export const SharedDependencyIds = RuntimeModuleIds;

export const SharedPackageNames = [...new Set(SharedDependencies.map(({ packageName }) => packageName))];

export function externalizeRendererSharedDependency(id) {
  if (isSharedDependency(id)) return true;
  if (id === "@baseflow/render-react/style.css") return false;

  rejectUnsupportedSharedSubpath(id);
  return false;
}

export function externalizeNodeSharedDependency(id) {
  if (isSharedDependency(id)) return true;

  rejectUnsupportedSharedSubpath(id);
  return false;
}

function isSharedDependency(id) {
  return SharedDependencyIds.includes(id);
}

function rejectUnsupportedSharedSubpath(id) {
  const sharedPackageName = SharedPackageNames.find((packageName) => id.startsWith(`${packageName}/`));
  if (sharedPackageName) throw new Error(`sharedDependencies: Runtime v${RuntimeVersion} 不支持公共模块入口 "${id}"`);
}

/** vite.shared.config.ts 的 lib.entry，相对 renderer 根目录。 */
export const SharedLibEntry = Object.fromEntries(SharedDependencies.map(({ outputName, source }) => [outputName, source]));

/**
 * Import Map 的 imports 字段。路径相对当前 Runtime release 的 index.html，
 * 与 renderer 的 base: "./" 保持一致。
 */
export function createSharedImports() {
  return Object.fromEntries(SharedDependencies.map(({ id, outputName }) => [id, `./${SharedOutputDir}/${outputName}.js`]));
}

function resolvePackageVersion(packageName) {
  for (const nodeModulesDir of Require.resolve.paths(packageName) ?? []) {
    const packageFile = join(nodeModulesDir, packageName, "package.json");
    try {
      const packageJson = JSON.parse(readFileSync(packageFile, "utf8"));
      if (typeof packageJson.version === "string" && packageJson.version.length > 0) return packageJson.version;
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT") throw error;
    }
  }
  throw new Error(`sharedDependencies: 无法解析共享依赖 ${packageName} 的版本`);
}

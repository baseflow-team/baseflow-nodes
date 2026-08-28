import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { RuntimeModuleIds, RuntimeVersion } from "../runtimeContract.js";

/**
 * 共享依赖的唯一事实来源。
 *
 * 同一张表同时驱动三处，避免手工同步：
 * - vite.shared.config.ts 的 lib.entry（outputName -> source）
 * - renderer 与节点物料的 rollupOptions.external（id）
 * - shared 构建产出的 sharedManifest.json（id -> 实际文件名）
 *
 * 注意：Import Map 的目标文件名带内容哈希，只有构建产物知道，
 * 因此由 sharedManifest.json 提供，不能再从这张表直接拼出来。
 */

export const SharedOutputDir = "shared";

/** shared 构建产出、纳入 Git 跟踪的文件名清单，renderer 构建据此生成 Import Map。 */
export const SharedManifestFile = resolve(import.meta.dirname, "../sharedManifest.json");

const Require = createRequire(import.meta.url);

const SharedDependencyDefinitionsById = new Map([
  ["react", { packageName: "react", name: "react", source: "shared/react.ts" }],
  ["react/jsx-runtime", { packageName: "react", name: "react-jsx-runtime", source: "shared/reactJsxRuntime.ts" }],
  ["react-dom", { packageName: "react-dom", name: "react-dom", source: "shared/reactDom.ts" }],
  ["react-dom/client", { packageName: "react-dom", name: "react-dom-client", source: "shared/reactDomClient.ts" }],
  [
    "@baseflow/render-react",
    {
      packageName: "@baseflow/render-react",
      name: "baseflow-render-react",
      source: "shared/renderReact.ts",
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

/** outputName 是 lib.entry 的键，也是产物文件名去掉内容哈希后的前缀。 */
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
 * 读取 shared 构建产出的文件名清单。
 *
 * 惰性读取：shared 自身构建时该文件可能尚未生成或已过期，只有需要 Import Map、
 * 产物校验和兼容测试时才要求它与当前依赖版本一致。
 *
 * @returns {Record<string, string>} id -> shared 目录下的文件名
 */
export function readSharedManifest() {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(SharedManifestFile, "utf8"));
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") {
      throw new Error(`sharedDependencies: 缺少 ${SharedManifestFile}，请先执行 npm run build:shared`);
    }
    throw new Error(`sharedDependencies: ${SharedManifestFile} 不是有效 JSON`, { cause: error });
  }

  if (manifest?.runtimeVersion !== RuntimeVersion) {
    throw new Error(`${SharedManifestFile}: runtimeVersion 应为 ${RuntimeVersion}，请重新执行 npm run build:shared`);
  }

  const files = manifest.files;
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    throw new Error(`${SharedManifestFile}: files 必须是对象`);
  }
  if (Object.keys(files).length !== SharedDependencies.length) {
    throw new Error(`${SharedManifestFile}: files 与共享依赖表条目数量不一致，请重新执行 npm run build:shared`);
  }

  for (const { id, outputName } of SharedDependencies) {
    const fileName = files[id];
    if (typeof fileName !== "string" || !fileName.startsWith(`${outputName}-`) || !fileName.endsWith(".js") || fileName.includes("/")) {
      throw new Error(`${SharedManifestFile}: ${id} 的产物应为 ${outputName}-<hash>.js，实际为 ${String(fileName)}；请重新执行 npm run build:shared`);
    }
  }

  return files;
}

/**
 * Import Map 的 imports 字段。路径相对当前 Runtime 目录的 index.html，
 * 与 renderer 的 base: "./" 保持一致。
 */
export function createSharedImports() {
  const files = readSharedManifest();
  return Object.fromEntries(SharedDependencies.map(({ id }) => [id, `./${SharedOutputDir}/${files[id]}`]));
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

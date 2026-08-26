import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

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

const SharedDependencyDefinitions = [
  { id: "react", packageName: "react", name: "react", source: "src/shared/react.ts" },
  { id: "react/jsx-runtime", packageName: "react", name: "react-jsx-runtime", source: "src/shared/reactJsxRuntime.ts" },
  {
    id: "react/jsx-dev-runtime",
    packageName: "react",
    name: "react-jsx-dev-runtime",
    source: "src/shared/reactJsxDevRuntime.ts",
  },
  { id: "react-dom", packageName: "react-dom", name: "react-dom", source: "src/shared/reactDom.ts" },
  { id: "react-dom/client", packageName: "react-dom", name: "react-dom-client", source: "src/shared/reactDomClient.ts" },
  {
    id: "@baseflow/render-react",
    packageName: "@baseflow/render-react",
    name: "baseflow-render-react",
    source: "src/shared/renderReact.ts",
  },
];

export const SharedDependencies = SharedDependencyDefinitions.map((dependency) => {
  const version = resolvePackageVersion(dependency.packageName);
  return { ...dependency, version, outputName: `${dependency.name}@${version}` };
});

/** rollupOptions.external：renderer 与节点物料都不打包这些包。 */
export const SharedDependencyIds = SharedDependencies.map(({ id }) => id);

/** vite.shared.config.ts 的 lib.entry，相对 renderer 根目录。 */
export const SharedLibEntry = Object.fromEntries(SharedDependencies.map(({ outputName, source }) => [outputName, source]));

/**
 * Import Map 的 imports 字段。路径相对文档基址（/renderer/index.html），
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

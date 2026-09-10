import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { parse, transformWithOxc } from "vite";
import WorkspacePackage from "../package.json" with { type: "json" };

const BaseflowRuntimeVersion = WorkspacePackage.baseflowRuntimeVersion;

/**
 * manifest 只允许类型依赖；类型擦除后仍存在的模块依赖都属于运行时依赖。
 *
 * @param {object} root
 * @returns {string | undefined}
 */
function findRuntimeDependency(root) {
  /** @type {unknown[]} */
  const pending = [root];
  const visited = new WeakSet();

  while (pending.length > 0) {
    const value = pending.pop();
    if (typeof value !== "object" || value === null || visited.has(value)) continue;
    visited.add(value);

    if ("type" in value) {
      if (value.type === "ImportDeclaration" || value.type === "ImportExpression") return value.type;
      if ((value.type === "ExportNamedDeclaration" || value.type === "ExportAllDeclaration") && "source" in value && value.source) {
        return value.type;
      }
      if (
        value.type === "CallExpression" &&
        "callee" in value &&
        typeof value.callee === "object" &&
        value.callee !== null &&
        "type" in value.callee &&
        value.callee.type === "Identifier" &&
        "name" in value.callee &&
        value.callee.name === "require"
      ) {
        return "require()";
      }
    }

    for (const child of Object.values(value)) {
      if (Array.isArray(child)) pending.push(...child);
      else pending.push(child);
    }
  }
}

/**
 * @param {string} manifestFile
 * @returns {Promise<Record<string, unknown>>}
 */
async function loadNodeManifest(manifestFile) {
  const typescriptSource = await readFile(manifestFile, "utf8");
  const { code } = await transformWithOxc(typescriptSource, manifestFile, { lang: "ts", target: "es2022" });
  const { program } = await parse(manifestFile, code);
  const runtimeDependency = findRuntimeDependency(program);

  if (runtimeDependency) {
    throw new Error(`${manifestFile}: manifest.ts 只允许 import type，不允许运行时模块依赖（发现 ${runtimeDependency}）`);
  }

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  const manifestModule = await import(moduleUrl).catch((error) => {
    throw new Error(`${manifestFile}: 执行 manifest.ts 失败`, { cause: error });
  });
  const manifest = manifestModule.default;

  if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest)) {
    throw new Error(`${manifestFile}: default export 必须是对象`);
  }

  return manifest;
}

/**
 * @param {Record<string, unknown>} manifest
 * @returns {Record<string, unknown>}
 */
function createBaseflowManifest(manifest) {
  /** @type {Record<string, unknown>} */
  const baseflow = { runtimeVersion: BaseflowRuntimeVersion };

  for (const [key, value] of Object.entries(manifest)) {
    baseflow[key] = typeof value === "function" ? Function.prototype.toString.call(value) : value;
  }

  if (typeof baseflow.defaultDsl !== "string") {
    baseflow.defaultDsl = JSON.stringify(baseflow.defaultDsl);
  }

  return baseflow;
}

/**
 * 将节点源 package.json 和 manifest.ts 编译为产物 package.json。
 *
 * @param {string} packageDir 节点包根目录。
 * @returns {Promise<string>}
 */
export async function compileNodeManifest(packageDir) {
  const packageFile = resolve(packageDir, "package.json");
  const manifestFile = resolve(packageDir, "src/manifest.ts");
  const nodeId = basename(packageDir);
  const packageJson = await readFile(packageFile, "utf8");
  const { name, version } = JSON.parse(packageJson);

  // 目录名是 node ID 的唯一事实来源，父页面按包名末段拼 /nodes/<id>/，两者不一致会静默指向错误目录
  if (typeof name !== "string" || name.split("/").pop() !== nodeId) {
    throw new Error(`${packageFile}: package.name 的末段必须与节点目录名 "${nodeId}" 一致，实际为 ${name}`);
  }

  const baseflow = createBaseflowManifest(await loadNodeManifest(manifestFile));
  return JSON.stringify({ type: "module", name, version, baseflow }, null, 2);
}

/**
 * 生成约定格式的 package.json 作为产物发布到 outDir。
 *
 * 父页面通过 JSON module 直接 import /nodes/<id>/package.json 并取其中的
 * baseflow 字段作为 NodeManifest（见 baseflow-demo/src/utils.ts 的 onImportNode）
 *
 * @param {string} packageDir 节点包根目录。
 * @returns {import("vite").Plugin}
 */
export function nodeManifestPlugin(packageDir) {
  /** @type {string} */
  let manifestSource;

  return {
    name: "baseflow:node-manifest",
    apply: "build",
    // 放在 buildStart：manifest 不合法时不必等整包构建完才失败
    async buildStart() {
      manifestSource = await compileNodeManifest(packageDir);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "package.json",
        source: manifestSource,
      });
    },
  };
}

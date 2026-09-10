import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { parse, transformWithOxc } from "vite";
import WorkspacePackage from "../package.json" with { type: "json" };

const WorkspaceRoot = resolve(import.meta.dirname, "..");
const NodesDir = resolve(WorkspaceRoot, "baseflow-nodes");
const PackageDir = process.cwd();
const NodeId = basename(PackageDir);
const PackageFile = resolve(PackageDir, "package.json");
const ManifestFile = resolve(PackageDir, "src/manifest.ts");
const OutputDir = resolve(WorkspaceRoot, "baseflow-preview/nodes", NodeId);
const NodeIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BaseflowRuntimeVersion = WorkspacePackage.baseflowRuntimeVersion;

if (dirname(PackageDir) !== NodesDir) {
  throw new Error(`buildNodeManifest 必须在 ${NodesDir} 的直接子目录中运行，实际为 ${PackageDir}`);
}
if (!NodeIdPattern.test(NodeId)) {
  throw new Error(`节点文件夹名必须是 kebab-case，实际为 "${NodeId}"`);
}

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

/** @returns {Promise<Record<string, unknown>>} */
async function loadNodeManifest() {
  const typescriptSource = await readFile(ManifestFile, "utf8");
  const { code } = await transformWithOxc(typescriptSource, ManifestFile, { lang: "ts", target: "es2022" });
  const { program } = await parse(ManifestFile, code);
  const runtimeDependency = findRuntimeDependency(program);

  if (runtimeDependency) {
    throw new Error(`${ManifestFile}: manifest.ts 只允许 import type，不允许运行时模块依赖（发现 ${runtimeDependency}）`);
  }

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  const manifestModule = await import(moduleUrl).catch((error) => {
    throw new Error(`${ManifestFile}: 执行 manifest.ts 失败`, { cause: error });
  });
  const manifest = manifestModule.default;

  if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest)) {
    throw new Error(`${ManifestFile}: default export 必须是对象`);
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

const packageJson = JSON.parse(await readFile(PackageFile, "utf8"));
const { name, version } = packageJson;

if (typeof name !== "string" || name.split("/").pop() !== NodeId) {
  throw new Error(`${PackageFile}: package.name 的末段必须与节点目录名 "${NodeId}" 一致，实际为 ${name}`);
}

const baseflow = createBaseflowManifest(await loadNodeManifest());
const manifestSource = JSON.stringify(
  {
    private: false,
    publishConfig: {
      access: "public",
    },
    type: "module",
    name,
    version,
    baseflow,
  },
  null,
  2,
);

await rm(OutputDir, { recursive: true, force: true });
await mkdir(OutputDir, { recursive: true });
await writeFile(resolve(OutputDir, "package.json"), `${manifestSource}\n`);
console.log(`已构建节点元数据: ${name}`);

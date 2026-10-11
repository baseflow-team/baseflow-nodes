import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { build } from "vite";
import WorkspacePackage from "../package.json" with { type: "json" };
import { defineNodeManifestConfig } from "./defineNodeManifestConfig.js";

const WorkspaceRoot = resolve(import.meta.dirname, "..");
const NodesDir = resolve(WorkspaceRoot, "baseflow-nodes");
const PackageDir = process.cwd();
const NodeId = basename(PackageDir);
const PackageFile = resolve(PackageDir, "package.json");
const OutputDir = resolve(WorkspaceRoot, "baseflow-preview/nodes", NodeId);
const NodeIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RequiredBaseflowKeys = ["type", "name", "icon", "desc", "executor", "defaultDsl"];

if (dirname(PackageDir) !== NodesDir) {
  throw new Error(`buildNodeManifest 必须在 ${NodesDir} 的直接子目录中运行，实际为 ${PackageDir}`);
}
if (!NodeIdPattern.test(NodeId)) {
  throw new Error(`节点文件夹名必须是 kebab-case，实际为 "${NodeId}"`);
}

const packageJson = JSON.parse(await readFile(PackageFile, "utf8"));
const { name, version } = packageJson;

if (typeof name !== "string" || name.split("/").pop() !== NodeId) {
  throw new Error(`${PackageFile}: package.name 的末段必须与节点目录名 "${NodeId}" 一致，实际为 ${name}`);
}
if (typeof packageJson.baseflow !== "object" || packageJson.baseflow === null || Array.isArray(packageJson.baseflow)) {
  throw new Error(`${PackageFile}: baseflow 必须是对象`);
}
const missingKeys = RequiredBaseflowKeys.filter((key) => !Object.hasOwn(packageJson.baseflow, key));
if (missingKeys.length > 0) {
  throw new Error(`${PackageFile}: baseflow 缺少必填字段: ${missingKeys.join(", ")}`);
}

const baseflow = { ...packageJson.baseflow, runtimeVersion: WorkspacePackage.baseflowRuntimeVersion };
const packageSource = JSON.stringify(
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
await writeFile(resolve(OutputDir, "package.json"), `${packageSource}\n`);
await build(defineNodeManifestConfig(PackageDir));
console.log(`已构建节点元数据与 Manifest: ${name}`);

import { cp, readFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const DemoRoot = resolve(ScriptDir, "..");
const DefaultTargetDir = join(DemoRoot, "public/monaco/monaco-editor");
// monaco 通过 AMD loader 按需请求 min/vs 下的资源，只有这几项需要随 public 一起发布。
// min-maps 是 min 的 source map（约 15MB），只在调试 monaco 内部时有用，不随产物发布。
// package.json 必须留在最后：它同时是下次比对版本的完成标记，中途失败不会被误判为已复制。
const CopiedEntries = ["min", "LICENSE", "ThirdPartyNotices.txt", "package.json"];

const Require = createRequire(import.meta.url);

/**
 * monaco-editor 的 exports 通配把 "monaco-editor/package.json" 映射到 esm/vs 下，
 * require.resolve 无法用它定位包根目录，这里沿 node_modules 查找路径逐级探测。
 */
async function resolveMonaco() {
  for (const nodeModulesDir of Require.resolve.paths("monaco-editor") ?? []) {
    const monacoDir = join(nodeModulesDir, "monaco-editor");
    const version = await readVersion(join(monacoDir, "package.json"));
    if (version) return { monacoDir, version };
  }
  throw new Error("未找到 monaco-editor，请先安装依赖：npm install");
}

/** @param {string} packageFile */
async function readVersion(packageFile) {
  try {
    return JSON.parse(await readFile(packageFile, "utf8")).version;
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") return undefined;
    throw error;
  }
}

export async function copyMonaco({ targetDir = DefaultTargetDir, force = false } = {}) {
  const { monacoDir, version: sourceVersion } = await resolveMonaco();
  const targetVersion = await readVersion(join(targetDir, "package.json"));

  if (!force && sourceVersion === targetVersion) {
    console.log(`monaco-editor@${targetVersion} 已是最新，跳过复制: ${targetDir}`);
    return { copied: false, version: targetVersion };
  }

  await rm(targetDir, { recursive: true, force: true });
  for (const entry of CopiedEntries) {
    await cp(join(monacoDir, entry), join(targetDir, entry), { recursive: true });
  }

  console.log(`已复制 monaco-editor@${sourceVersion}: ${targetDir}`);
  return { copied: true, version: sourceVersion };
}

const IsMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (IsMain) {
  await copyMonaco({ force: process.argv.includes("--force") });
}

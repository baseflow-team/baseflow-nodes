import { lstat, readdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const WorkspaceRoot = resolve(ScriptDir, "../..");
const PreviewDir = join(WorkspaceRoot, "baseflow-preview");
const PreservedEntries = new Set([".git", "nodes", "renderer"]);

function assertPreviewDir() {
  if (dirname(PreviewDir) !== WorkspaceRoot || PreviewDir !== join(WorkspaceRoot, "baseflow-preview")) {
    throw new Error(`拒绝清理非预期目录: ${PreviewDir}`);
  }
}

export async function cleanPreview() {
  assertPreviewDir();

  let stats;
  try {
    stats = await lstat(PreviewDir);
  } catch (error) {
    if (error?.code === "ENOENT") {
      console.log(`preview 目录不存在，跳过清理: ${PreviewDir}`);
      return;
    }
    throw error;
  }

  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    throw new Error(`拒绝清理非普通目录: ${PreviewDir}`);
  }

  const entries = await readdir(PreviewDir);
  const removableEntries = entries.filter((entry) => !PreservedEntries.has(entry));

  for (const entry of removableEntries) {
    const target = resolve(PreviewDir, entry);
    if (dirname(target) !== PreviewDir) {
      throw new Error(`拒绝清理 preview 目录之外的路径: ${target}`);
    }
    await rm(target, { recursive: true, force: true });
  }

  console.log(`已清理 preview 应用产物，保留 nodes 和 renderer: ${PreviewDir}`);
}

const IsMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (IsMain) {
  await cleanPreview();
}

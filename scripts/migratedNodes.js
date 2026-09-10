import { readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const WorkspaceRoot = resolve(import.meta.dirname, "..");
const NodesDir = resolve(WorkspaceRoot, "baseflow-nodes");

/** 已准备就绪可以参与构建的节点：package.json 的 build 脚本。 */
const MigratedBuildScript = "vite build";

/**
 *
 * @returns {Promise<{ id: string, packageName: string, packageDir: string, hasUi: boolean }[]>}
 */
export async function listMigratedNodes() {
  const entries = await readdir(NodesDir, { withFileTypes: true });
  const migrated = [];

  for (const entry of entries.filter((item) => item.isDirectory()).sort((left, right) => left.name.localeCompare(right.name))) {
    const packageDir = resolve(NodesDir, entry.name);
    const packageFile = resolve(packageDir, "package.json");

    const source = await readFile(packageFile, "utf8").catch((error) => {
      if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") return undefined;
      throw error;
    });
    if (source === undefined) continue;

    const packageJson = JSON.parse(source);
    if (packageJson.scripts?.build !== MigratedBuildScript) continue;

    const entryFile = resolve(packageDir, "src/index.tsx");
    const entryStats = await stat(entryFile).catch((error) => {
      if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") return undefined;
      throw error;
    });
    if (entryStats && !entryStats.isFile()) throw new Error(`${entryFile}: UI 入口必须是文件`);

    migrated.push({ id: entry.name, packageName: packageJson.name, packageDir, hasUi: entryStats?.isFile() ?? false });
  }

  if (migrated.length === 0) throw new Error(`${NodesDir}: 未发现已迁移节点`);
  return migrated;
}

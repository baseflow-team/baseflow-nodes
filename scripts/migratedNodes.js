import { readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const WorkspaceRoot = resolve(import.meta.dirname, "..");
const NodesDir = resolve(WorkspaceRoot, "baseflow-nodes");

/** 已迁移到官方 Vite 工厂的节点标记：package.json 的 build 脚本。 */
const MigratedBuildScript = "vite build";

/**
 * 发现已接入官方浏览器 ESM 构建的节点。
 *
 * 构建命令和产物校验都从这里取清单，避免两处各自硬编码一份节点名单后漂移。
 *
 * @returns {Promise<{ id: string, packageName: string, packageDir: string }[]>}
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
    const entryStats = await stat(entryFile).catch(() => undefined);
    if (!entryStats?.isFile()) {
      throw new Error(`${packageFile}: 声明了官方构建脚本但缺少入口 ${entryFile}`);
    }
    migrated.push({ id: entry.name, packageName: packageJson.name, packageDir });
  }

  if (migrated.length === 0) throw new Error(`${NodesDir}: 未发现已迁移节点`);
  return migrated;
}

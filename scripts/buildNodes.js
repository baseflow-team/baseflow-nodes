import { spawnSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const NpmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const WorkspaceRoot = resolve(import.meta.dirname, "..");
const NodesDir = resolve(WorkspaceRoot, "baseflow-nodes");
const Entries = await readdir(NodesDir, { withFileTypes: true });
const BuildableNodes = [];

for (const entry of Entries.filter((item) => item.isDirectory()).sort((left, right) => left.name.localeCompare(right.name))) {
  const packageFile = resolve(NodesDir, entry.name, "package.json");
  const source = await readFile(packageFile, "utf8").catch((error) => {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") return undefined;
    throw error;
  });
  if (source === undefined) continue;

  const packageJson = JSON.parse(source);
  if (typeof packageJson.scripts?.build !== "string" || packageJson.scripts.build.trim() === "") continue;
  if (typeof packageJson.name !== "string" || packageJson.name === "") {
    throw new Error(`${packageFile}: 可构建节点必须声明 package.name`);
  }

  BuildableNodes.push({ id: entry.name, packageName: packageJson.name });
}

if (BuildableNodes.length === 0) throw new Error(`${NodesDir}: 未发现可构建节点`);
console.log(`构建已准备节点: ${BuildableNodes.map(({ id }) => id).join(", ")}`);

for (const { packageName } of BuildableNodes) {
  const result = spawnSync(NpmCommand, ["run", "build", "--workspace", packageName], { stdio: "inherit" });
  if (result.status !== 0) {
    if (result.error) {
      console.error(`节点构建启动失败: ${packageName}`, result.error);
    } else if (result.signal) {
      console.error(`节点构建被信号终止: ${packageName} (${result.signal})`);
    } else {
      console.error(`节点构建失败: ${packageName} (退出码: ${result.status})`);
    }
    process.exit(result.status ?? 1);
  }
}

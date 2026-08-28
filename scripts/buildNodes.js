import { spawnSync } from "node:child_process";
import { listMigratedNodes } from "./migratedNodes.js";

const NpmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const MigratedNodes = await listMigratedNodes();
console.log(`构建已迁移节点: ${MigratedNodes.map(({ id }) => id).join(", ")}`);

for (const { packageName } of MigratedNodes) {
  const result = spawnSync(NpmCommand, ["run", "build", "--workspace", packageName], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`节点构建失败: ${packageName}`);
    process.exit(result.status ?? 1);
  }
}

import { spawnSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { listMigratedNodes } from "./migratedNodes.js";
import { compileNodeManifest } from "./nodeManifestPlugin.js";

const NpmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const MigratedNodes = await listMigratedNodes();
console.log(`构建已迁移节点: ${MigratedNodes.map(({ id }) => id).join(", ")}`);

for (const { id, packageName, packageDir, hasUi } of MigratedNodes) {
  if (!hasUi) {
    const manifestSource = await compileNodeManifest(packageDir);
    const outputDir = resolve(packageDir, "../../baseflow-preview/nodes", id);

    await rm(outputDir, { recursive: true, force: true });
    await mkdir(outputDir, { recursive: true });
    await writeFile(resolve(outputDir, "package.json"), `${manifestSource}\n`);
    console.log(`节点无 UI，已生成 manifest: ${packageName}`);
    continue;
  }

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

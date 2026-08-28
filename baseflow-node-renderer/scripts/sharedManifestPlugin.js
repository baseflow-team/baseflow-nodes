import { writeFile } from "node:fs/promises";
import { RuntimeVersion } from "../runtimeContract.js";
import { SharedDependencies, SharedManifestFile } from "./sharedDependencies.js";

/**
 * 记录 shared 每个公共入口的实际产物文件名。
 *
 * entry 带内容哈希后，文件名只有构建产物知道，而 renderer 主构建只复制
 * public/shared、不重跑 shared 构建，因此必须落成一份随 shared 一起纳入 Git
 * 的清单，供 Import Map、产物校验和兼容测试读取。
 *
 * @returns {import("vite").Plugin}
 */
export function sharedManifestPlugin() {
  return {
    name: "baseflow:shared-manifest",
    apply: "build",
    async writeBundle(_options, bundle) {
      const fileNamesByOutputName = new Map();
      for (const output of Object.values(bundle)) {
        if (output.type === "chunk" && output.isEntry) fileNamesByOutputName.set(output.name, output.fileName);
      }

      const files = {};
      for (const { id, outputName } of SharedDependencies) {
        const fileName = fileNamesByOutputName.get(outputName);
        if (!fileName) throw new Error(`sharedManifestPlugin: shared 产物缺少入口 ${outputName}`);
        files[id] = fileName;
      }

      await writeFile(SharedManifestFile, `${JSON.stringify({ runtimeVersion: RuntimeVersion, files }, null, 2)}\n`, "utf8");
    },
  };
}

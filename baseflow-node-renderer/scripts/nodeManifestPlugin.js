import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { RuntimeVersion } from "../runtimeContract.js";

/**
 * 把节点自身的 package.json 作为产物发布到 outDir。
 *
 * 父页面通过 JSON module 直接 import /nodes/<id>/package.json 并取其中的
 * baseflow 字段作为 NodeManifest（见 baseflow-demo/src/utils.ts 的 onImportNode），
 * 所以它是运行时产物，不是构建残留。
 *
 * @param {string} packageDir 节点包根目录。
 * @returns {import("vite").Plugin}
 */
export function nodeManifestPlugin(packageDir) {
  const packageFile = resolve(packageDir, "package.json");

  return {
    name: "baseflow:node-manifest",
    apply: "build",
    async generateBundle() {
      const source = await readFile(packageFile, "utf8");
      const packageJson = JSON.parse(source);
      if (packageJson.baseflow?.runtimeVersion !== RuntimeVersion) {
        throw new Error(`${packageFile}: 官方节点必须声明 baseflow.runtimeVersion = ${RuntimeVersion}`);
      }

      this.emitFile({
        type: "asset",
        fileName: "package.json",
        source,
      });
    },
  };
}

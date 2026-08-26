import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

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
      this.emitFile({
        type: "asset",
        fileName: "package.json",
        source: await readFile(packageFile, "utf8"),
      });
    },
  };
}

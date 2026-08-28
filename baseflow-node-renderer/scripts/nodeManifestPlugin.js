import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
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
  const nodeId = basename(packageDir);
  /** @type {string} */
  let manifestSource;

  return {
    name: "baseflow:node-manifest",
    apply: "build",
    // 放在 buildStart：manifest 不合法时不必等整包构建完才失败
    async buildStart() {
      manifestSource = await readFile(packageFile, "utf8");
      const packageJson = JSON.parse(manifestSource);

      if (packageJson.baseflow?.runtimeVersion !== RuntimeVersion) {
        throw new Error(`${packageFile}: 官方节点必须声明 baseflow.runtimeVersion = ${RuntimeVersion}`);
      }
      // 目录名是 node ID 的唯一事实来源，父页面按包名末段拼 /nodes/<id>/，两者不一致会静默指向错误目录
      if (typeof packageJson.name !== "string" || packageJson.name.split("/").pop() !== nodeId) {
        throw new Error(`${packageFile}: package.name 的末段必须与节点目录名 "${nodeId}" 一致，实际为 ${String(packageJson.name)}`);
      }
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "package.json",
        source: manifestSource,
      });
    },
  };
}

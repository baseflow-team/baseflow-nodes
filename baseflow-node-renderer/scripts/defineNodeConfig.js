import { basename, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { cssInjectedByJsPlugin } from "./cssInjectedByJsPlugin.js";
import { nodeManifestPlugin } from "./nodeManifestPlugin.js";
import { SharedDependencyIds } from "./sharedDependencies.js";

/** 节点文件夹名即节点 ID，kebab-case。 */
const NodeIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * 节点物料的 Vite 配置工厂。
 *
 * 所有节点物料共用同一套构建约定，逐个复制配置既容易漂移，也容易在 outDir 上出错：
 * outDir 是清空式构建（emptyOutDir）的目标，节点 ID 一旦为空就会退化成 nodes 根目录，
 * 把其它节点的产物一并清掉。这里由文件夹名推导并强校验，杜绝手写 ID。
 *
 * @param {string} packageDir 节点包根目录，调用方传 import.meta.dirname。
 * @returns {import("vite").UserConfig}
 */
export function defineNodeConfig(packageDir) {
  const nodeId = basename(packageDir);

  if (!NodeIdPattern.test(nodeId)) {
    throw new Error(`defineNodeConfig: 节点文件夹名必须是 kebab-case，实际为 "${nodeId}"`);
  }

  return defineConfig({
    root: packageDir,
    plugins: [react(), cssInjectedByJsPlugin(), nodeManifestPlugin(packageDir)],
    build: {
      outDir: resolve(packageDir, "../../baseflow-preview/nodes", nodeId),
      emptyOutDir: true,
      minify: false,
      cssMinify: false,
      lib: {
        entry: resolve(packageDir, "src/index.tsx"),
        formats: ["es"],
        fileName: "index",
      },
      rollupOptions: {
        cwd: packageDir,
        external: SharedDependencyIds,
        output: {
          entryFileNames: "index.js",
        },
      },
    },
  });
}

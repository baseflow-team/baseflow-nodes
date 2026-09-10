import { basename, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { cssInjectedByJsPlugin } from "./cssInjectedByJsPlugin.js";

/** 节点文件夹名即节点 ID，kebab-case。 */
const NodeIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * 节点物料的 Vite 配置工厂。
 *
 * 所有节点物料共用同一套构建约定，逐个复制配置既容易漂移，也容易在 outDir 上出错：
 * outDir 由文件夹名推导并强校验，避免将 UI 产物写入其它节点目录。
 * 节点目录的清理由先行的 buildNodeManifest.js 负责，Vite 必须保留已生成的 package.json。
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
    plugins: [react(), cssInjectedByJsPlugin()],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    build: {
      target: "es2022",
      outDir: resolve(packageDir, "../../baseflow-preview/nodes", nodeId),
      emptyOutDir: false,
      minify: false,
      cssMinify: false,
      lib: {
        entry: resolve(packageDir, "src/index.tsx"),
        formats: ["es"],
        fileName: "index",
      },
      rollupOptions: {
        cwd: packageDir,
        output: {
          entryFileNames: "index.js",
        },
      },
    },
  });
}

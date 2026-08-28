import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { RuntimeDir } from "./runtimeContract.js";
import { externalizeRendererSharedDependency } from "./scripts/sharedDependencies.js";
import { sharedImportMapPlugin } from "./scripts/sharedImportMapPlugin.js";

export default defineConfig({
  base: "./",
  plugins: [react(), sharedImportMapPlugin()],
  build: {
    // 本地 preview 可清空重建；线上发布是增量上传 + 延迟回收，不得清空目录
    outDir: `../baseflow-preview/${RuntimeDir}`,
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
    rollupOptions: {
      external: externalizeRendererSharedDependency,
    },
  },
});

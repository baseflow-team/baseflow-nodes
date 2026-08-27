import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { externalizeRendererSharedDependency } from "./scripts/sharedDependencies.js";
import { sharedImportMapPlugin } from "./scripts/sharedImportMapPlugin.js";

export default defineConfig({
  base: "./",
  plugins: [react(), sharedImportMapPlugin()],
  build: {
    outDir: "../baseflow-preview/renderer",
    // 共享依赖已改为 public/shared，清理 renderer 产物目录的职责回到主构建
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
    rollupOptions: {
      external: externalizeRendererSharedDependency,
    },
  },
});

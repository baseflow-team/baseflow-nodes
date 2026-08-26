import { resolve } from "node:path";
import { defineConfig } from "vite";
import { SharedLibEntry, SharedOutputDir } from "./scripts/sharedDependencies.js";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    // 产出到 public/shared，由 renderer 主构建作为静态资源一并复制到 ../baseflow-preview/renderer/shared
    outDir: `public/${SharedOutputDir}`,
    emptyOutDir: true,
    // 不关掉会把 public 下的其它静态资源重复复制进 shared
    copyPublicDir: false,
    minify: false,
    lib: {
      entry: Object.fromEntries(Object.entries(SharedLibEntry).map(([name, source]) => [name, resolve(import.meta.dirname, source)])),
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});

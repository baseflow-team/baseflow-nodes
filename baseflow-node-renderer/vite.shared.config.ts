import { resolve } from "node:path";
import { defineConfig } from "vite";
import { SharedLibEntry, SharedOutputDir } from "./scripts/sharedDependencies.js";
import { sharedManifestPlugin } from "./scripts/sharedManifestPlugin.js";

export default defineConfig({
  plugins: [sharedManifestPlugin()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    target: "es2022",
    // 产出到 public/shared，由 renderer 主构建复制到当前 Runtime 目录
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
        // Runtime 目录不含 release 身份，全部生成文件必须内容寻址
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
});

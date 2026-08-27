import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { RuntimeReleaseDir } from "./runtimeContract.js";
import { externalizeRendererSharedDependency } from "./scripts/sharedDependencies.js";
import { sharedImportMapPlugin } from "./scripts/sharedImportMapPlugin.js";

export default defineConfig({
  base: "./",
  plugins: [react(), sharedImportMapPlugin()],
  build: {
    outDir: `../baseflow-preview/${RuntimeReleaseDir}`,
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
    rollupOptions: {
      external: externalizeRendererSharedDependency,
    },
  },
});

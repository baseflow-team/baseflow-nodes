import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../baseflow-preview/nodes/break",
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
    lib: {
      entry: "src/index.tsx",
      formats: ["es"],
      fileName: "index",
      cssFileName: "style",
    },
    rollupOptions: {
      external: "react|react-dom",
    },
  },
});

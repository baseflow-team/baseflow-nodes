import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const SharedDependencies = ["react", "react/jsx-runtime", "react/jsx-dev-runtime", "react-dom", "react-dom/client", "@baseflow/render-react"];

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../baseflow-preview/nodes/break",
    emptyOutDir: false,
    minify: false,
    cssMinify: false,
    lib: {
      entry: "src/index.tsx",
      formats: ["es"],
      fileName: "index",
      cssFileName: "style",
    },
    rollupOptions: {
      external: SharedDependencies,
      output: {
        entryFileNames: "index.js",
      },
    },
  },
});

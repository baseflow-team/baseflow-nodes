import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const SharedDependencies = ["react", "react/jsx-runtime", "react/jsx-dev-runtime", "react-dom", "react-dom/client", "@baseflow/render-react"];

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../baseflow-preview/renderer",
    emptyOutDir: false,
    minify: false,
    cssMinify: false,
    rollupOptions: {
      external: SharedDependencies,
    },
  },
});

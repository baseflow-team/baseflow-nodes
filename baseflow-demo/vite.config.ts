import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
  build: {
    minify: false,
    cssMinify: false,
    rollupOptions: {
      plugins: [],
    },
  },
});

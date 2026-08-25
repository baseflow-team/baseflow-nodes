import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../baseflow-preview",
    minify: false,
    cssMinify: false,
    rollupOptions: {
      plugins: [],
    },
  },
});

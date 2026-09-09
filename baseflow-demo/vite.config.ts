import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../baseflow-preview",
    emptyOutDir: false,
    minify: false,
    cssMinify: false,
    rollupOptions: {
      plugins: [],
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](?:react|react-dom)[\\/]/,
              priority: 2,
            },
            {
              name: "flow-react",
              test: /node_modules[\\/]@baseflow[\\/]flow-react[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
});

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { RuntimeRendererUrl } from "../baseflow-node-renderer/runtimeContract.js";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "baseflow:runtime-release-marker",
      transformIndexHtml() {
        return [
          {
            tag: "meta",
            attrs: { name: "baseflow-runtime-renderer", content: RuntimeRendererUrl },
            injectTo: "head",
          },
        ];
      },
    },
  ],
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

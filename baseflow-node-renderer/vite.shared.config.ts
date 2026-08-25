import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "../baseflow-preview/renderer",
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: {
        react: resolve(import.meta.dirname, "src/shared/react.ts"),
        "react-dom": resolve(import.meta.dirname, "src/shared/reactDom.ts"),
        "react-dom-client": resolve(import.meta.dirname, "src/shared/reactDomClient.ts"),
        "react-jsx-runtime": resolve(import.meta.dirname, "src/shared/reactJsxRuntime.ts"),
        "react-jsx-dev-runtime": resolve(import.meta.dirname, "src/shared/reactJsxDevRuntime.ts"),
        "baseflow-render-react": resolve(import.meta.dirname, "src/shared/renderReact.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "shared/[name].js",
        chunkFileNames: "shared/chunks/[name]-[hash].js",
        assetFileNames: "shared/[name][extname]",
      },
    },
  },
});

import path from "node:path";
import react from "@vitejs/plugin-react";
import { replaceInFileSync } from "replace-in-file";
import externalGlobals from "rollup-plugin-external-globals";
import { defineConfig } from "vite";
import pluginExternal from "vite-plugin-external";

const cdnExternals = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-dom/client": "ReactDOM",
  dayjs: "dayjs",
  antd: "antd",
  "@baseflow/react": "Baseflow",
  "@baseflow/widgets": "BaseflowWidgets",
};

const __dirname = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    pluginExternal({ externals: cdnExternals }),
  ],
  build: {
    minify: false,
    cssMinify: false,
    rollupOptions: {
      plugins: [
        externalGlobals(cdnExternals),
        {
          name: "custom-end",
          closeBundle() {
            replaceInFileSync({
              files: path.join(__dirname, "dist/index.html"),
              from: ["react.development.js", "react-dom.development.js"],
              to: ["react.production.min.js", "react-dom.production.min.js"],
            });
          },
        },
      ],
    },
  },
});

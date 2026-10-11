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
              // 排除 out/lazy/ 下的动态 chunk（如 QuickJS 运行时），保持其懒加载
              test: /node_modules[\\/]@baseflow[\\/]flow-react[\\/](?!out[\\/]lazy[\\/])/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
});

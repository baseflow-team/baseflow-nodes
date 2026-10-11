import { basename, resolve } from "node:path";
import { defineConfig } from "vite";

const ManifestSizeWarningThreshold = 10 * 1024;

/**
 * @param {string} packageDir
 * @returns {import("vite").UserConfig}
 */
export function defineNodeManifestConfig(packageDir) {
  return defineConfig({
    configFile: false,
    root: packageDir,
    publicDir: false,
    plugins: [
      {
        name: "baseflow:validate-manifest",
        generateBundle(_options, bundle) {
          const manifest = bundle["manifest.js"];
          if (manifest?.type !== "chunk" || !manifest.exports.includes("default")) {
            this.error("manifest.js 必须有 default export");
          }
          // Rolldown 已内联的动态导入仍可能在依赖记录中指向自身。
          const dependencies = [...manifest.imports, ...manifest.dynamicImports.filter((fileName) => fileName !== manifest.fileName)];
          if (dependencies.length > 0) {
            this.error(`manifest.js 不允许依赖其它模块: ${dependencies.join(", ")}`);
          }
          const size = Buffer.byteLength(manifest.code, "utf8");
          if (size > ManifestSizeWarningThreshold) {
            const warning =
              `[WARNING] Node ${basename(packageDir)}: manifest.js is ${(size / 1024).toFixed(2)} KB (${size} bytes), which exceeds 10 KB. ` +
              "Keep the size under control and avoid complex computations in the manifest.";
            console.warn(`\n\u001b[31;4m${warning}\u001b[0m\n`);
          }
        },
      },
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    build: {
      target: "es2022",
      outDir: resolve(packageDir, "../../baseflow-preview/nodes", basename(packageDir)),
      emptyOutDir: false,
      minify: false,
      lib: {
        entry: resolve(packageDir, "src/manifest.ts"),
        formats: ["es"],
        fileName: "manifest",
      },
      rolldownOptions: {
        cwd: packageDir,
        output: {
          entryFileNames: "manifest.js",
          codeSplitting: false,
        },
      },
    },
  });
}

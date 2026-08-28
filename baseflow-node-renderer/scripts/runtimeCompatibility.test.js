// @vitest-environment jsdom

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { rollup } from "rollup";
import { describe, expect, it } from "vitest";
import { readSharedManifest } from "./sharedDependencies.js";

const RendererRoot = resolve(import.meta.dirname, "..");
const FixtureFile = resolve(RendererRoot, "testFixtures/runtime-v1/index.js");
const RealFixtureDir = resolve(RendererRoot, "testFixtures/runtime-v1-break");
const RealFixtureFile = resolve(RealFixtureDir, "index.js");
const RealFixturePackageFile = resolve(RealFixtureDir, "package.json");
const SharedDir = resolve(RendererRoot, "public/shared");
const FixtureHash = "862c536642996732094e82870008dba979687363b5864ade8aacfab747e4054a";
const RealFixtureHash = "f0ea82e636d0e91e0d86258e1d2d757be15e5a2cc7b17c92b266247c90fc3f91";
const RealFixturePackageHash = "595a195e0df8bf58f3d152ccaac68811e07e7bcd3ed9a467ef9ce7e978a389d3";

async function bundleFixture(input) {
  const sharedFiles = new Map(Object.entries(readSharedManifest()).map(([id, fileName]) => [id, resolve(SharedDir, fileName)]));
  const bundle = await rollup({
    input,
    plugins: [
      {
        name: "baseflow:test-runtime-v1-shared",
        resolveId(id) {
          return sharedFiles.get(id) ?? null;
        },
      },
    ],
  });

  try {
    const { output } = await bundle.generate({ format: "es" });
    const chunk = output.find((item) => item.type === "chunk");
    if (!chunk) throw new Error("Runtime v1 兼容测试未生成 ESM chunk");
    return import(/* @vite-ignore */ `data:text/javascript;charset=utf-8,${encodeURIComponent(chunk.code)}`);
  } finally {
    await bundle.close();
  }
}

describe("Runtime v1 历史产物兼容", () => {
  it("保持冻结产物不变", async () => {
    const source = await readFile(FixtureFile);
    expect(createHash("sha256").update(source).digest("hex")).toBe(FixtureHash);
  });

  it("使用当前 shared 完成链接、hooks 挂载和卸载", async () => {
    const fixtureModule = await bundleFixture(FixtureFile);
    const container = document.createElement("div");
    document.body.append(container);

    const root = fixtureModule.mount(container);
    expect(container.textContent).toBe("runtime-v1");
    root.unmount();
    expect(container.textContent).toBe("");
    container.remove();
  });

  it("保持官方构建生成的真实 break 产物不变并使用当前 shared 渲染", async () => {
    const [source, packageSource] = await Promise.all([readFile(RealFixtureFile), readFile(RealFixturePackageFile)]);
    expect(createHash("sha256").update(source).digest("hex")).toBe(RealFixtureHash);
    expect(createHash("sha256").update(packageSource).digest("hex")).toBe(RealFixturePackageHash);

    const fixtureModule = await bundleFixture(RealFixtureFile);
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    flushSync(() => root.render(fixtureModule.default({ nodeData: { id: "break-1", meta: { name: "循环Break" } } })));
    expect(container.textContent).toBe("break-1循环Break");
    root.unmount();
    container.remove();
  });
});

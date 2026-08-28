import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { verifyModuleGraph } from "./verifyPreview.js";

const TemporaryDirectories = [];

afterEach(async () => {
  await Promise.all(TemporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function createModule(source) {
  const directory = await mkdtemp(resolve(tmpdir(), "baseflow-verify-preview-"));
  TemporaryDirectories.push(directory);
  const entryFile = resolve(directory, "index.js");
  await writeFile(entryFile, source, "utf8");
  return entryFile;
}

describe("产物静态依赖图", () => {
  it.each(["node:fs", "file:///tmp/dependency.js", "https://esm.example.com/dependency.js"])("shared 产物拒绝协议 import %s", async (specifier) => {
    const entryFile = await createModule(`import ${JSON.stringify(specifier)};`);
    await expect(verifyModuleGraph(entryFile)).rejects.toThrow("不允许的协议 import");
  });

  it("节点产物只允许 HTTP(S) 外部 ESM", async () => {
    const entryFile = await createModule('import "https://esm.example.com/dependency.js";\nimport "http://esm.example.com/legacy.js";');
    await expect(verifyModuleGraph(entryFile, { allowedUrlProtocols: ["http:", "https:"] })).resolves.toBeUndefined();
  });

  it.each(["node:fs", "file:///tmp/dependency.js", "data:text/javascript,export default 1"])(
    "节点产物拒绝非 HTTP(S) 协议 import %s",
    async (specifier) => {
      const entryFile = await createModule(`import ${JSON.stringify(specifier)};`);
      await expect(verifyModuleGraph(entryFile, { allowedUrlProtocols: ["http:", "https:"] })).rejects.toThrow("不允许的协议 import");
    },
  );

  it("保留公共 bare import 白名单", async () => {
    const entryFile = await createModule('import React from "react";\nexport default React;');
    await expect(verifyModuleGraph(entryFile, { allowedBareImports: ["react"] })).resolves.toBeUndefined();
    await expect(verifyModuleGraph(entryFile)).rejects.toThrow('未登记的 bare import "react"');
  });
});

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { build } from "vite";
import { afterEach, expect, test } from "vitest";
import { mapPackageManifest } from "../baseflow-demo/scripts/generateMock.js";
import WorkspacePackage from "../package.json" with { type: "json" };
import { defineNodeManifestConfig } from "./defineNodeManifestConfig.js";

const ExecFile = promisify(execFile);
const WorkspaceRoot = resolve(import.meta.dirname, "..");
const Fixtures = [];
const Baseflow = {
  type: "Task",
  name: "测试节点",
  icon: "",
  desc: "测试",
  executor: {},
  defaultDsl: {
    nodes: [{ tag: "@baseflow-nodes/task", props: { input: [1, true, null] } }],
    sources: { "@baseflow-nodes/task": "@baseflow-nodes/task@1" },
  },
};

async function createFixture(baseflow = Baseflow, manifest = 'export default { type: "Task", uiForm: "index.js" };') {
  const nodeId = `build-fixture-${randomUUID()}`;
  const packageDir = resolve(WorkspaceRoot, "baseflow-nodes", nodeId);
  const outputDir = resolve(WorkspaceRoot, "baseflow-preview/nodes", nodeId);
  Fixtures.push({ packageDir, outputDir });
  await mkdir(resolve(packageDir, "src"), { recursive: true });
  await writeFile(
    resolve(packageDir, "package.json"),
    JSON.stringify({ name: `@baseflow-nodes/${nodeId}`, version: "1.0.0", baseflow, scripts: {}, peerDependencies: {} }),
  );
  await writeFile(resolve(packageDir, "src/manifest.ts"), manifest);
  return { packageDir, outputDir };
}

function runBuild(packageDir) {
  return ExecFile(process.execPath, [resolve(WorkspaceRoot, "scripts/buildNodeManifest.js")], { cwd: packageDir });
}

afterEach(async () => {
  for (const { packageDir, outputDir } of Fixtures.splice(0)) {
    await rm(packageDir, { recursive: true, force: true });
    await rm(outputDir, { recursive: true, force: true });
  }
});

test("独立打包 Manifest，保留函数、内联静态和动态依赖，并生成精简 package", async () => {
  const { packageDir, outputDir } = await createFixture(
    { ...Baseflow, runtimeVersion: "other-version" },
    'import { value } from "./value"; export default { type: "Other", value, load: () => import("./value"), hook: () => value + 1 };',
  );
  await writeFile(resolve(packageDir, "src/value.ts"), "export const value: number = 3;");
  await writeFile(resolve(packageDir, "vite.config.js"), 'throw new Error("不应加载 UI 构建配置");');
  await runBuild(packageDir);

  const packageJson = JSON.parse(await readFile(resolve(outputDir, "package.json"), "utf8"));
  expect(Object.keys(packageJson).sort()).toEqual(["baseflow", "name", "private", "publishConfig", "type", "version"]);
  expect(packageJson).toMatchObject({ private: false, publishConfig: { access: "public" }, type: "module" });
  expect(packageJson.baseflow).toEqual({
    ...Baseflow,
    runtimeVersion: WorkspacePackage.baseflowRuntimeVersion,
  });
  expect(mapPackageManifest(packageJson, "package.json").mapped).toEqual({
    type: "Task",
    name: "测试节点",
    icon: "",
    desc: "测试",
    dsl: Baseflow.defaultDsl,
  });
  const { default: manifest } = await import(pathToFileURL(resolve(outputDir, "manifest.js")).href);
  expect(manifest.type).toBe("Other");
  expect(manifest.hook()).toBe(4);
  expect((await manifest.load()).value).toBe(3);
});

test.each(Object.keys(Baseflow))("缺少必填字段 %s 时，在清理产物前终止", async (key) => {
  const baseflow = { ...Baseflow };
  delete baseflow[key];
  const { packageDir, outputDir } = await createFixture(baseflow);
  await mkdir(outputDir, { recursive: true });
  const marker = resolve(outputDir, "marker.txt");
  await writeFile(marker, "existing output");
  await assert.rejects(runBuild(packageDir), (error) => error.stderr.includes(`baseflow 缺少必填字段: ${key}`));
  expect(await readFile(marker, "utf8")).toBe("existing output");
});

test("只检查 key 存在，runtimeVersion 可省略，DSL 值保持原样", async () => {
  const baseflow = { type: "", name: "", icon: "", desc: null, executor: null, defaultDsl: null };
  const { packageDir, outputDir } = await createFixture(baseflow);
  await runBuild(packageDir);
  const packageJson = JSON.parse(await readFile(resolve(outputDir, "package.json"), "utf8"));
  expect(packageJson.baseflow).toEqual({ ...baseflow, runtimeVersion: WorkspacePackage.baseflowRuntimeVersion });
});

test("缺少默认导出时终止 Manifest 构建", async () => {
  const { packageDir } = await createFixture(Baseflow, "export const value = 1;");
  await assert.rejects(runBuild(packageDir), (error) => error.stderr.includes("manifest.js 必须有 default export"));
});

test("Manifest 仅在大于 10 KB 时警告，按 UTF-8 字节计量且继续构建", async () => {
  const { packageDir, outputDir } = await createFixture(Baseflow, 'export default { text: "" };');
  await runBuild(packageDir);
  const outputFile = resolve(outputDir, "manifest.js");
  const overhead = Buffer.byteLength(await readFile(outputFile, "utf8"));
  const cases = [
    { text: "a".repeat(10 * 1024 - overhead), warn: false },
    { text: "a".repeat(10 * 1024 - overhead + 1), warn: true },
    { text: "汉".repeat(3500), warn: true },
  ];
  for (const { text, warn } of cases) {
    await writeFile(resolve(packageDir, "src/manifest.ts"), `export default { text: ${JSON.stringify(text)} };`);
    const { stderr } = await runBuild(packageDir);
    const output = await readFile(outputFile, "utf8");
    expect(Buffer.byteLength(output)).toBe(overhead + Buffer.byteLength(text));
    expect(stderr.includes("exceeds 10 KB")).toBe(warn);
    if (warn) {
      expect(stderr).toContain(`${Buffer.byteLength(output)} bytes`);
      expect(stderr).toContain("Keep the size under control and avoid complex computations in the manifest.");
      expect(stderr).toContain("\n\u001b[31;4m[WARNING]");
      expect(stderr).toContain("\u001b[0m\n");
    }
  }
});

test.each(['import { value } from "external-module"; export default { value };', 'export default { load: () => import("external-module") };'])(
  "残留模块依赖时终止 Manifest 构建: %s",
  async (source) => {
    const { packageDir } = await createFixture(Baseflow, source);
    const config = defineNodeManifestConfig(packageDir);
    await expect(
      build({
        ...config,
        logLevel: "silent",
        build: { ...config.build, rolldownOptions: { ...config.build.rolldownOptions, external: ["external-module"] } },
      }),
    ).rejects.toThrow("manifest.js 不允许依赖其它模块: external-module");
  },
);

import { describe, expect, it } from "vitest";
import { RuntimeModuleIds } from "../runtimeContract.js";
import {
  createSharedImports,
  externalizeNodeSharedDependency,
  externalizeRendererSharedDependency,
  SharedDependencies,
  SharedDependencyIds,
} from "./sharedDependencies.js";

const RuntimeV1Dependencies = ["react", "react/jsx-runtime", "react-dom", "react-dom/client", "@baseflow/render-react"];

describe("Runtime v1 共享依赖", () => {
  it("只公开五个官方入口", () => {
    expect(RuntimeModuleIds).toEqual(RuntimeV1Dependencies);
    expect(SharedDependencyIds).toEqual(RuntimeV1Dependencies);
    expect(Object.keys(createSharedImports())).toEqual(RuntimeV1Dependencies);
  });

  it("Import Map 指向带内容哈希的 shared 入口", () => {
    const imports = createSharedImports();
    for (const { id, outputName } of SharedDependencies) {
      expect(imports[id]).not.toBe(`./shared/${outputName}.js`);
      expect(imports[id].startsWith(`./shared/${outputName}-`)).toBe(true);
      expect(imports[id].endsWith(".js")).toBe(true);
    }
  });

  it.each(RuntimeV1Dependencies)("将 %s 标记为 external", (id) => {
    expect(externalizeRendererSharedDependency(id)).toBe(true);
    expect(externalizeNodeSharedDependency(id)).toBe(true);
  });

  it.each([
    "react/jsx-dev-runtime",
    "react/compiler-runtime",
    "react-dom/server",
    "react-dom/static.browser",
    "react-dom/profiling",
    "@baseflow/render-react/style.css",
    "@baseflow/render-react/private",
  ])("拒绝未登记公共入口 %s", (id) => {
    expect(() => externalizeNodeSharedDependency(id)).toThrow(`Runtime v1 不支持公共模块入口 "${id}"`);
  });

  it.each(["react/jsx-dev-runtime", "react/compiler-runtime", "react-dom/server", "@baseflow/render-react/private"])(
    "renderer 拒绝未登记公共入口 %s",
    (id) => {
      expect(() => externalizeRendererSharedDependency(id)).toThrow(`Runtime v1 不支持公共模块入口 "${id}"`);
    },
  );

  it.each(["echarts", "./chunks/echarts.js", "https://esm.sh/echarts@6", "https://esm.sh/react@19"])("不干预非官方依赖 %s", (id) => {
    expect(externalizeRendererSharedDependency(id)).toBe(false);
    expect(externalizeNodeSharedDependency(id)).toBe(false);
  });

  it("允许 renderer 将私有样式打入自身产物", () => {
    expect(externalizeRendererSharedDependency("@baseflow/render-react/style.css")).toBe(false);
  });
});

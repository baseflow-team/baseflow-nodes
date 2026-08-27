import { afterEach, describe, expect, it, vi } from "vitest";
import { assertNodeRuntime, importNode, nodePackageUrl, nodeSourceToUrl } from "./utils";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("节点 URL", () => {
  it("解析 Baseflow 节点源", () => {
    expect(nodeSourceToUrl("#@baseflow-nodes/break@0.0.1")).toBe("/nodes/break/index.js");
  });

  it("保留完整外部 ESM URL", () => {
    const url = "https://nodes.example.com/chart@1.0.0/index.js";
    expect(nodeSourceToUrl(url)).toBe(url);
    expect(nodePackageUrl(url)).toBe("https://nodes.example.com/chart@1.0.0/package.json");
  });

  it("计算相对节点的同目录 manifest", () => {
    expect(nodePackageUrl("/nodes/break/index.js", "https://renderer.example.com/index.html")).toBe(
      "https://renderer.example.com/nodes/break/package.json",
    );
  });
});

describe("Runtime v1", () => {
  it("接受显式 Runtime v1", () => {
    expect(() => assertNodeRuntime({ baseflow: { runtimeVersion: 1 } })).not.toThrow();
  });

  it("将缺省版本作为历史 Runtime v1", () => {
    expect(() => assertNodeRuntime({ baseflow: {} })).not.toThrow();
  });

  it("拒绝不支持的 Runtime", () => {
    expect(() => assertNodeRuntime({ baseflow: { runtimeVersion: 2 } })).toThrow("节点需要 Runtime v2，当前 renderer 仅支持 Runtime v1");
  });

  it.each([null, "1", 1.1, {}])("拒绝显式无效的 Runtime 版本 %j", (runtimeVersion) => {
    expect(() => assertNodeRuntime({ baseflow: { runtimeVersion } })).toThrow("当前 renderer 仅支持 Runtime v1");
  });

  it("拒绝无效 manifest", () => {
    expect(() => assertNodeRuntime({})).toThrow("节点 package.json 缺少有效的 baseflow manifest");
  });

  it("在 import 节点前加载并检查 manifest", async () => {
    const fixtureUrl = new URL("./testFixtures/node.js", import.meta.url).href;
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ baseflow: { runtimeVersion: 1 } }), {
        headers: { "Content-Type": "application/json" },
      }),
    );

    const component = await importNode(fixtureUrl);

    expect(fetchMock).toHaveBeenCalledWith(new URL("./testFixtures/package.json", import.meta.url).href);
    expect((component as () => string)()).toBe("fixture-node");
  });

  it("为无法解析的 manifest 补充请求地址", async () => {
    const fixtureUrl = new URL("./testFixtures/node.js", import.meta.url).href;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("<!doctype html>"));

    await expect(importNode(fixtureUrl)).rejects.toThrow(`解析节点 manifest 失败 (${new URL("./testFixtures/package.json", import.meta.url).href})`);
  });
});

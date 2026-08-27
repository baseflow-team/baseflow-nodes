import type { ComponentType } from "react";
import { LegacyDefaultRuntimeVersion, RuntimeVersion } from "../runtimeContract.js";

interface NodePackageJson {
  baseflow?: {
    runtimeVersion?: unknown;
  };
}

export function nodeSourceToUrl(source: string) {
  const normalizedSource = source.startsWith("#") ? source.slice(1) : source;
  const arr = normalizedSource.split(/[/@]/);
  if (arr[1] === "baseflow-nodes") {
    return `/nodes/${arr[2]}/index.js`;
  }
  return normalizedSource;
}

export function nodePackageUrl(nodeUrl: string, baseUrl = globalThis.location?.href) {
  return new URL("package.json", new URL(nodeUrl, baseUrl)).href;
}

export function assertNodeRuntime(packageJson: NodePackageJson) {
  if (!packageJson.baseflow || typeof packageJson.baseflow !== "object") {
    throw new Error("节点 package.json 缺少有效的 baseflow manifest");
  }

  const runtimeVersion = packageJson.baseflow.runtimeVersion === undefined ? LegacyDefaultRuntimeVersion : packageJson.baseflow.runtimeVersion;
  if (runtimeVersion !== RuntimeVersion) {
    throw new Error(`节点需要 Runtime v${String(runtimeVersion)}，当前 renderer 仅支持 Runtime v${RuntimeVersion}`);
  }
}

async function loadNodePackage(nodeUrl: string) {
  const packageUrl = nodePackageUrl(nodeUrl);
  const response = await fetch(packageUrl);
  if (!response.ok) {
    throw new Error(`加载节点 manifest 失败：${response.status} ${response.statusText} (${packageUrl})`);
  }

  let packageJson: unknown;
  try {
    packageJson = await response.json();
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`解析节点 manifest 失败 (${packageUrl})：${reason}`, { cause: error });
  }
  if (!packageJson || typeof packageJson !== "object" || Array.isArray(packageJson)) {
    throw new Error(`节点 manifest 不是有效的 JSON 对象 (${packageUrl})`);
  }
  assertNodeRuntime(packageJson as NodePackageJson);
}

export async function importNode<Props>(source: string): Promise<ComponentType<Props>> {
  const url = nodeSourceToUrl(source);
  await loadNodePackage(url);
  const module = await import(/* @vite-ignore */ url);
  return module.default ?? module;
}

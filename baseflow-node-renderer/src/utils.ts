import type { ComponentType } from "react";
import { LegacyDefaultRuntimeVersion, RuntimeVersion } from "../runtimeContract.js";

interface NodePackageJson {
  baseflow?: {
    runtimeVersion?: unknown;
  };
}

/**
 * 节点来源解析为绝对入口 URL。
 *
 * 必须在这里就绝对化：manifest 走 fetch（相对文档基址解析），节点走动态 import
 * （相对打包后模块自身的 URL 解析），两者基址不同。只有先归一到同一个绝对 URL，
 * 校验的 manifest 和实际加载的模块才保证是同一份产物。
 */
export function nodeSourceToUrl(source: string, baseUrl = globalThis.location?.href) {
  const normalizedSource = source.startsWith("#") ? source.slice(1) : source;
  const arr = normalizedSource.split(/[/@]/);
  const path = arr[1] === "baseflow-nodes" ? `/nodes/${arr[2]}/index.js` : normalizedSource;
  return new URL(path, baseUrl).href;
}

export function nodePackageUrl(nodeUrl: string, baseUrl = globalThis.location?.href) {
  return new URL("package.json", new URL(nodeUrl, baseUrl)).href;
}

export function assertNodeRuntime(packageJson: NodePackageJson) {
  if (!packageJson.baseflow || typeof packageJson.baseflow !== "object") {
    throw new Error("节点 package.json 缺少有效的 baseflow manifest");
  }

  const { runtimeVersion } = packageJson.baseflow;
  if (runtimeVersion === undefined) {
    if (LegacyDefaultRuntimeVersion !== RuntimeVersion) {
      throw new Error(`历史节点按 Runtime v${LegacyDefaultRuntimeVersion} 解释，当前 renderer 仅支持 Runtime v${RuntimeVersion}`);
    }
    return;
  }

  if (!Number.isInteger(runtimeVersion) || (runtimeVersion as number) < 1) {
    throw new Error(`节点 manifest 的 baseflow.runtimeVersion 非法：${JSON.stringify(runtimeVersion) ?? String(runtimeVersion)}`);
  }
  if (runtimeVersion !== RuntimeVersion) {
    throw new Error(`节点需要 Runtime v${String(runtimeVersion)}，当前 renderer 仅支持 Runtime v${RuntimeVersion}`);
  }
}

async function loadNodePackage(nodeUrl: string) {
  const packageUrl = nodePackageUrl(nodeUrl);

  let response: Response;
  try {
    response = await fetch(packageUrl);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`节点 manifest 不可达 (${packageUrl})：${reason}`, { cause: error });
  }
  if (!response.ok) {
    throw new Error(`节点 manifest 不可达 (${packageUrl})：${response.status} ${response.statusText}`);
  }

  let packageJson: unknown;
  try {
    packageJson = await response.json();
  } catch (error) {
    // 静态站点常把未命中的路径回退成 HTML，这里补上 Content-Type 才能区分“manifest 不存在”和“JSON 写错了”
    const contentType = response.headers.get("content-type") ?? "未声明";
    throw new Error(`节点 manifest 不是有效 JSON (${packageUrl})，Content-Type: ${contentType}；请确认该节点已发布 package.json`, { cause: error });
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

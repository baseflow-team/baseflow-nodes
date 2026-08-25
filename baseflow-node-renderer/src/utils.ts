import type { ComponentType } from "react";

function nodeSourceToUrl(source: string) {
  const normalizedSource = source.startsWith("#") ? source.slice(1) : source;
  const arr = normalizedSource.split(/[/@]/);
  if (arr[1] === "baseflow-nodes") {
    return `/nodes/${arr[2]}/index.js`;
  }
  return normalizedSource;
}

export function importNode<Props>(source: string): Promise<ComponentType<Props>> {
  const url = nodeSourceToUrl(source);
  return import(/* @vite-ignore */ url).then((mod) => mod.default ?? mod);
}

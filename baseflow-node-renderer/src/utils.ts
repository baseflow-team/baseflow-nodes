import type { ComponentType } from "react";

function nodeSourceToUrl(source: string) {
  const arr = source.split(/[/@]/);
  if (arr[1] === "baseflow-nodes") {
    return `/nodes/${arr[2]}/package.json`;
  }
  return source;
}

export function importNode(source: string): Promise<ComponentType> {
  const url = nodeSourceToUrl(source);
  return import(/* @vite-ignore */ url).then((mod) => mod.default ?? mod);
}

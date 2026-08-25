import type { JsonDSL, NodeManifest } from "@baseflow/flow-react";
import { BaseWidgets } from "@baseflow/flow-react";
import { useRef } from "react";

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function useEvent<F extends Function>(fn: F): F {
  const fnRef = useRef<F>(fn);
  fnRef.current = fn;

  const memoizedFn = useRef<F>(undefined);
  if (!memoizedFn.current) {
    memoizedFn.current = function (this: any, ...args: any) {
      return fnRef.current.apply(this, args);
    } as any;
  }

  return memoizedFn.current!;
}

export interface NodeEntity {
  type: string;
  name: string;
  icon: string;
  desc: string;
  dsl: string;
}

export async function fetchNodes(): Promise<NodeEntity[]> {
  const url = "/mock.json";
  const module = await import(/* @vite-ignore */ url, { with: { type: "json" } });
  const data: { [name: string]: NodeEntity } = module.default;
  return Object.values(data)
    .map((item) => {
      const { name, desc, type, icon, dsl } = item;
      return {
        name,
        desc,
        type,
        icon,
        dsl,
      };
    })
    .filter((item) => item.dsl);
}

function nodeSourceToUrl(source: string) {
  const arr = source.split(/[/@]/);
  if (arr[1] === "baseflow-nodes") {
    return `/nodes/${arr[2]}/package.json`;
  }
  return source;
}

export function onImportNode(source: string): Promise<NodeManifest> {
  const url = nodeSourceToUrl(source);
  return import(/* @vite-ignore */ url, { with: { type: "json" } }).then(
    (mod) => {
      return mod.default.baseflow;
    },
    (err) => {
      BaseWidgets.message.error(err.message);
      throw err;
    },
  );
}

export function fetchFlow(): JsonDSL {
  const graphContent = localStorage.getItem("baseflow-dsl");
  return graphContent
    ? JSON.parse(graphContent)
    : {
        layout: "dagre",
        sources: {
          "@baseflow-nodes/flow": "@baseflow-nodes/flow@1.0.0",
          "@baseflow-nodes/start": "@baseflow-nodes/start@1.0.0",
          "@baseflow-nodes/end": "@baseflow-nodes/end@1.0.0",
        },
        nodes: {
          id: "flow",
          tag: "@baseflow-nodes/flow",
          meta: {
            name: "流程",
            width: 250,
            height: 68,
          },
          props: {},
          children: [
            {
              id: "start",
              tag: "@baseflow-nodes/start",
              meta: {
                name: "流程开始",
                width: 250,
                height: 68,
              },
              props: {},
            },
            {
              id: "end",
              tag: "@baseflow-nodes/end",
              meta: {
                name: "流程结束",
                width: 250,
                height: 68,
              },
              props: {},
            },
          ],
        },
        triggers: [],
        extend: {},
      };
}

export interface IFLow {
  id: string;
  commitId: string;
  version: string;
  released: boolean;
  flow: JsonDSL;
}

export const MockFlow: IFLow = {
  id: "xxx",
  commitId: "",
  version: "",
  released: true,
  flow: fetchFlow(),
};

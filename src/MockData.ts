import type { JsonDSL, NodeManifest } from "@baseflow/flow-react";
import { BaseWidgets } from "@baseflow/flow-react";
// import BranchNode from "./_nodes/branch/package.json";
// import BreakNode from "./_nodes/break/package.json";
// import ChoiceNode from "./_nodes/choice/package.json";
// import ContinueNode from "./_nodes/continue/package.json";
// import EndNode from "./_nodes/end/package.json";
// import FlowNode from "./_nodes/flow/package.json";
// import ForeachNode from "./_nodes/foreach/package.json";
// import HttpNode from "./_nodes/http/package.json";
// import ParallelNode from "./_nodes/parallel/package.json";
// import ReturnNode from "./_nodes/return/package.json";
// import StartNode from "./_nodes/start/package.json";
// import TaskNode from "./_nodes/task/package.json";
// import ThreadNode from "./_nodes/thread/package.json";
// import TriggerWebhookNode from "./_nodes/trigger-webhook/package.json";
// import TryCatchNode from "./_nodes/try-catch/package.json";
// import VariableNode from "./_nodes/variable/package.json";
// import VariableUpdateNode from "./_nodes/variable-update/package.json";
import type { IFLow } from "./entity";

const DevNodes: {
  [name: string]: {
    dsl: string;
  };
} = {
  "@baseflow-nodes/flow": { dsl: "" },
};

export function fetchNodes(): { name: string; dsl: string }[] {
  return Object.keys(DevNodes)
    .slice(3)
    .map((name) => {
      const item = DevNodes[name];
      const { dsl } = item;
      return {
        name,
        dsl,
      };
    });
}

function nodeSourceToUrl(source: string) {
  const arr = source.split(/[/@]/);
  const name = source.substring(0, source.lastIndexOf("@"));
  if (arr[1] === "baseflow-nodes" && DevNodes[name]) {
    return process.env.NODE_ENV === "production" ? `/nodes/${arr[2]}/package.json` : `/src/_nodes/${arr[2]}/package.json`;
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

function fetchFlow(): JsonDSL {
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

export const MockFlow: IFLow = {
  id: "xxx",
  commitId: "",
  version: "",
  released: true,
  flow: fetchFlow(),
};

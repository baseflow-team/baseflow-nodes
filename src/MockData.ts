import type { INodeConfig, JsonDSL } from "@baseflow/react";
import { BaseWidgets, getLocale } from "@baseflow/react";
import BranchNode from "./_nodes/branch/package.json";
import BreakNode from "./_nodes/break/package.json";
import ChoiceNode from "./_nodes/choice/package.json";
import ContinueNode from "./_nodes/continue/package.json";
import EndNode from "./_nodes/end/package.json";
import FlowNode from "./_nodes/flow/package.json";
import ForeachNode from "./_nodes/foreach/package.json";
import HttpNode from "./_nodes/http/package.json";
import ParallelNode from "./_nodes/parallel/package.json";
import ReturnNode from "./_nodes/return/package.json";
import StartNode from "./_nodes/start/package.json";
import TaskNode from "./_nodes/task/package.json";
import ThreadNode from "./_nodes/thread/package.json";
import TriggerWebhookNode from "./_nodes/trigger-webhook/package.json";
import TryCatchNode from "./_nodes/try-catch/package.json";
import VariableNode from "./_nodes/variable/package.json";
import VariableUpdateNode from "./_nodes/variable-update/package.json";
import type { IFLow } from "./entity";

const DevNodes: {
  [name: string]: {
    type: string;
    name: string;
    icon: string;
    desc: string;
    dsl: string;
    [key: string]: string;
  };
} = {
  [FlowNode.name]: { ...FlowNode.baseflow, dsl: "" },
  [StartNode.name]: { ...StartNode.baseflow, dsl: "" },
  [EndNode.name]: { ...EndNode.baseflow, dsl: "" },
  [TriggerWebhookNode.name]: {
    ...TriggerWebhookNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/trigger-webhook" }],
      sources: { "@baseflow-nodes/trigger-webhook": "@baseflow-nodes/trigger-webhook@*" },
    }),
  },
  [ReturnNode.name]: {
    ...ReturnNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/return" }],
      sources: { "@baseflow-nodes/return": "@baseflow-nodes/return@*" },
    }),
  },
  [VariableNode.name]: {
    ...VariableNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/variable" }],
      sources: { "@baseflow-nodes/variable": "@baseflow-nodes/variable@*" },
    }),
  },
  [VariableUpdateNode.name]: {
    ...VariableUpdateNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/variable-update" }],
      sources: { "@baseflow-nodes/variable-update": "@baseflow-nodes/variable-update@*" },
    }),
  },
  [TryCatchNode.name]: {
    ...TryCatchNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/try-catch" }],
      sources: { "@baseflow-nodes/try-catch": "@baseflow-nodes/try-catch@*" },
    }),
  },
  [ChoiceNode.name]: {
    ...ChoiceNode.baseflow,
    dsl: JSON.stringify({
      nodes: [
        { tag: "@baseflow-nodes/choice", id: "choice1", childrenIds: ["branch1", "branch2"] },
        { tag: "@baseflow-nodes/branch", id: "branch1", parentId: "choice1" },
        { tag: "@baseflow-nodes/branch", id: "branch2", parentId: "choice1", props: { default: true } },
      ],
      sources: {
        "@baseflow-nodes/choice": "@baseflow-nodes/choice@*",
        "@baseflow-nodes/branch": "@baseflow-nodes/branch@*",
      },
    }),
  },
  [BranchNode.name]: {
    ...BranchNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/branch" }],
      sources: { "@baseflow-nodes/branch": "@baseflow-nodes/branch@*" },
    }),
  },
  [ParallelNode.name]: {
    ...ParallelNode.baseflow,
    dsl: JSON.stringify({
      nodes: [
        { tag: "@baseflow-nodes/parallel", id: "parallel1", childrenIds: ["thread1", "thread2"] },
        { tag: "@baseflow-nodes/thread", id: "thread1", parentId: "parallel1" },
        { tag: "@baseflow-nodes/thread", id: "thread2", parentId: "parallel1" },
      ],
      sources: {
        "@baseflow-nodes/parallel": "@baseflow-nodes/parallel@*",
        "@baseflow-nodes/thread": "@baseflow-nodes/thread@*",
      },
    }),
  },
  [ThreadNode.name]: {
    ...ThreadNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/thread" }],
      sources: { "@baseflow-nodes/thread": "@baseflow-nodes/thread@*" },
    }),
  },
  [ForeachNode.name]: {
    ...ForeachNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/foreach" }],
      sources: { "@baseflow-nodes/foreach": "@baseflow-nodes/foreach@*" },
    }),
  },
  [ContinueNode.name]: {
    ...ContinueNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/continue" }],
      sources: { "@baseflow-nodes/continue": "@baseflow-nodes/continue@*" },
    }),
  },
  [BreakNode.name]: {
    ...BreakNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/break" }],
      sources: { "@baseflow-nodes/break": "@baseflow-nodes/break@*" },
    }),
  },
  [HttpNode.name]: {
    ...HttpNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/http" }],
      sources: { "@baseflow-nodes/http": "@baseflow-nodes/http@*" },
    }),
  },
  [TaskNode.name]: {
    ...TaskNode.baseflow,
    dsl: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/task" }],
      sources: { "@baseflow-nodes/task": "@baseflow-nodes/task@*" },
    }),
  },
};

export function fetchNodes(): { type: string; name: string; icon: string; desc: string; dsl: string }[] {
  const locale = getLocale();
  return Object.values(DevNodes)
    .slice(3)
    .map((META) => {
      const { type, icon, dsl } = META;
      return {
        type,
        icon,
        dsl,
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
      };
    });
}

function nodeSourceToUrl(source: string) {
  const arr = source.split(/[/@]/);
  const name = source.substring(0, source.lastIndexOf("@"));
  if (arr[1] === "baseflow-nodes" && DevNodes[name]) {
    return process.env.NODE_ENV === "production" ? `/nodes/${arr[2]}/index.js` : `/src/_nodes/${arr[2]}/index.ts`;
  }
  return source;
}

export function onImportNode(source: string): Promise<INodeConfig> {
  const url = nodeSourceToUrl(source);
  return import(/* @vite-ignore */ url).then(
    (mod) => {
      return mod.default;
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

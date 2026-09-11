import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Start",
  icon: "",
  desc: "流程开始：表示流程开始执行，可以定义流程入参返回数据结构.",
  executor: {
    node: "@baseflow-executors/start@0.0.1",
  },
  inputForm: "index.js",
  defaultData: {
    meta: {
      name: "流程开始",
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/start" }], sources: { "@baseflow-nodes/start": "@baseflow-nodes/start@*" } },
} as NodeManifest<{}>;

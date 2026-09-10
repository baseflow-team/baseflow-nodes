import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Return",
  icon: "",
  desc: "流程返回：流程提前终止执行并返回，可以设置返回数据",
  executor: {
    node: "@baseflow-executors/return@0.0.1",
  },
  inputForm: "index.js",
  defaultData: {
    meta: {
      name: "流程返回",
      valueReference: {
        path: "flow",
      },
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/return" }], sources: { "@baseflow-nodes/return": "@baseflow-nodes/return@0.0.1" } },
} as NodeManifest<{}>;

import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Flow",
  icon: "",
  desc: "流程：定义一个独立的流程",
  executor: {
    node: "@baseflow-executors/flow@0.0.1",
  },
  defaultData: {
    meta: {
      name: "流程",
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/flow" }], sources: { "@baseflow-nodes/flow": "@baseflow-nodes/flow@*" } },
} as NodeManifest<{}>;

import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Group",
  icon: "",
  desc: "TryCatch：提供一个可以捕获子节点运行时错误的容器节点",
  executor: {
    node: "@baseflow-executors/try-catch@0.0.1",
  },
  defaultData: {
    meta: {
      name: "TryCatch",
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/try-catch" }], sources: { "@baseflow-nodes/try-catch": "@baseflow-nodes/try-catch@*" } },
} as NodeManifest<{}>;

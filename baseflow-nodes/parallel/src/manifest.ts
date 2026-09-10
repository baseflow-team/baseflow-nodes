import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Parallel",
  icon: "",
  desc: "并行执行：可添加多个[并行分支]，多个并行分支同时执行",
  executor: {
    node: "@baseflow-executors/parallel@0.0.1",
  },
  defaultData: {
    meta: {
      name: "并行执行",
    },
    props: {},
  },
  defaultDsl: {
    nodes: [
      { tag: "@baseflow-nodes/parallel", id: "parallel1", childrenIds: ["thread1", "thread2"] },
      { tag: "@baseflow-nodes/thread", id: "thread1", parentId: "parallel1" },
      { tag: "@baseflow-nodes/thread", id: "thread2", parentId: "parallel1" },
    ],
    sources: { "@baseflow-nodes/parallel": "@baseflow-nodes/parallel@*", "@baseflow-nodes/thread": "@baseflow-nodes/thread@*" },
  },
} as NodeManifest<{}>;

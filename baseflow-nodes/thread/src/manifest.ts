import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Thread",
  icon: "",
  desc: "并行分支：放置于[并行执行]中，多个并行分支同时执行",
  executor: {
    node: "@baseflow-executors/thread@0.0.1",
  },
  defaultData: {
    meta: {
      name: "并行分支",
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/thread" }], sources: { "@baseflow-nodes/thread": "@baseflow-nodes/thread@*" } },
} as NodeManifest<{}>;

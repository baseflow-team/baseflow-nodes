import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Task",
  icon: "",
  desc: "Task任务: 测试任务",
  executor: {
    node: "@baseflow-executors/task@0.0.1",
  },
  defaultData: {
    meta: {
      name: "Task任务",
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/task" }], sources: { "@baseflow-nodes/task": "@baseflow-nodes/task@*" } },
} as NodeManifest<{}>;

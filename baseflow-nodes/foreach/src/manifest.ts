import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Loop",
  icon: "",
  desc: "Foreach循环：通过指定一个迭代源来循环执行子节点",
  executor: {
    node: "@baseflow-executors/foreach@0.0.1",
  },
  defaultData: {
    meta: {
      name: "Foreach循环",
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/foreach" }], sources: { "@baseflow-nodes/foreach": "@baseflow-nodes/foreach@*" } },
} as NodeManifest<NodeProps>;

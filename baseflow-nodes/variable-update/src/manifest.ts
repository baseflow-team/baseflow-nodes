import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "VariableUpdate",
  icon: "",
  desc: "变量修改：通过本节点可以修改[变量定义]节点中的变量值.",
  executor: {
    node: "@baseflow-executors/variable-update@0.0.1",
  },
  defaultData: {
    meta: {
      name: "变量修改",
    },
    props: {},
  },
  defaultDsl: {
    nodes: [{ tag: "@baseflow-nodes/variable-update" }],
    sources: { "@baseflow-nodes/variable-update": "@baseflow-nodes/variable-update@*" },
  },
} as NodeManifest<NodeProps>;

import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Variable",
  icon: "",
  desc: "变量定义：通过本节点可以定义多个流程变量",
  executor: {
    node: "@baseflow-executors/variable@0.0.1",
  },
  inputForm: "index.js",
  defaultData: {
    meta: {
      name: "变量定义",
      outputSchema: {
        name: "output",
        type: "ͼOBJECTͼ",
        children: [
          {
            name: "newVariable",
            type: "ͼSTRINGͼ",
          },
        ],
      },
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/variable" }], sources: { "@baseflow-nodes/variable": "@baseflow-nodes/variable@*" } },
} as NodeManifest<NodeProps>;

import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "End",
  icon: "",
  desc: "流程结束：流程正常执行完成，可以设置返回数据",
  executor: {
    node: "@baseflow-executors/end@0.0.1",
  },
  inputForm: "index.js",
  defaultData: {
    meta: {
      name: "流程结束",
      valueReference: {
        path: "flow",
      },
    },
    props: {},
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/end" }], sources: { "@baseflow-nodes/end": "@baseflow-nodes/end@*" } },
} as NodeManifest<{}>;

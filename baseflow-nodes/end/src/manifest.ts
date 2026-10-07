import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "End",
  icon: "",
  desc: "流程结束：流程正常执行完成，可以设置返回数据",
  executor: {
    node: "@baseflow-executors/end@0.0.1",
  },
  defaultData: {
    meta: {
      name: "流程返回",
      watchExternalProps: {
        flow: { outputSchema: "The flowReturnSchema has been modified and needs to be confirmed" },
      },
    },
    props: {},
  },
  uiForm: "index.js",
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/end" }], sources: { "@baseflow-nodes/end": "@baseflow-nodes/end@1" } },
} satisfies NodeManifest<NodeProps>;

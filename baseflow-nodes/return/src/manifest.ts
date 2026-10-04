import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Return",
  icon: "",
  desc: "流程返回：流程提前终止执行并返回，可以设置返回数据",
  executor: {
    node: "@baseflow-executors/return@0.0.1",
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
  updateOnSelfCreated: (nodeData, flowSchema) => {
    if (flowSchema.output) {
      if (!nodeData.props.returnValue) {
        return { updateMeta: { configurationErrors: "Please set the flow return value" } };
      } else {
        return { updateMeta: { externalNotices: { [nodeData.id]: "Please set the flow return value" } } };
      }
    } else {
      return { updateProps: { returnValue: undefined }, updateMeta: { configurationErrors: undefined, externalNotices: undefined } };
    }
  },
  uiForm: "index.js",
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/return" }], sources: { "@baseflow-nodes/return": "@baseflow-nodes/return@0.0.1" } },
} satisfies NodeManifest<NodeProps>;

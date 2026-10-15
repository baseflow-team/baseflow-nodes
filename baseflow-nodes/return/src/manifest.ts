import type { NodeManifest } from "@baseflow/node-runtime-react";
import { NodeType } from "../../Constants";
import type { NodeProps } from "./model";

export default {
  type: NodeType.Return,
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
} satisfies NodeManifest<NodeProps>;

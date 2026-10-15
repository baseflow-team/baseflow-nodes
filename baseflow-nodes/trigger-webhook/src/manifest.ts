import type { NodeManifest } from "@baseflow/node-runtime-react";
import { NodeType } from "../../Constants";
import type { DSLProps, NodeProps } from "./model";

export default {
  type: NodeType.Trigger,
  updateOnSelfCreated: (nodeData, flowSchema) => {
    if (flowSchema.input) {
      if (!nodeData.props.flowInputValue) {
        return { updateMeta: { configurationErrors: "Please set the flow input value" } };
      } else {
        return { updateMeta: { externalNotices: { [nodeData.id]: "Please set the flow input value" } } };
      }
    } else {
      return { updateProps: { flowInputValue: undefined }, updateMeta: { externalNotices: undefined } };
    }
  },
  mappingPropsOut(props): DSLProps {
    const { headers, queries, cookies, ...others } = props;
    return {
      headers: headers?.map((item) => item.value),
      queries: queries?.map((item) => item.value),
      cookies: cookies?.map((item) => item.value),
      ...others,
    };
  },
  mappingPropsIn(data: DSLProps) {
    const { headers, queries, cookies, ...others } = data;
    return {
      headers: headers?.map((item) => ({ value: item })),
      queries: queries?.map((item) => ({ value: item })),
      cookies: cookies?.map((item) => ({ value: item })),
      ...others,
    };
  },
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

import type { NodeManifest } from "@baseflow/node-runtime-react";
import { DataType } from "../../Constants";
import type { DSLProps, NodeProps } from "./model";

export default {
  type: "Trigger",
  defaultData: {
    meta: {
      name: "webhook触发器",
      watchExternalProps: {
        start: { outputSchema: "The flowInputSchema has been modified and needs to be confirmed" },
      },
      outputSchema: {
        name: "output",
        type: DataType.Object,
        children: [
          {
            name: "headers",
            type: DataType.Object,
            children: [
              {
                name: "url",
                type: DataType.String,
              },
              {
                name: "protocol",
                type: DataType.String,
              },
              {
                name: "hostname",
                type: DataType.String,
              },
              {
                name: "port",
                type: DataType.Number,
              },
              {
                name: "path",
                type: DataType.String,
              },
              {
                name: "method",
                type: DataType.String,
              },
              {
                name: "queryString",
                type: DataType.String,
              },
              {
                name: "cookieString",
                type: DataType.String,
              },
              {
                name: "authorization",
                type: DataType.String,
              },
            ],
          },
          {
            name: "params",
            type: DataType.Object,
          },
          {
            name: "queries",
            type: DataType.Object,
          },
          {
            name: "cookies",
            type: DataType.Object,
          },
          {
            name: "body",
            type: DataType.Object,
          },
        ],
      },
    },
    props: {
      methods: ["post"],
      contentType: "json",
    },
  },
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

import type { NodeManifest } from "@baseflow/node-runtime-react";
import { DataType } from "../../Constants";
import type { NodeProps } from "./model";

export default {
  type: "Trigger",
  defaultData: {
    meta: {
      name: "webhook触发器",
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
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

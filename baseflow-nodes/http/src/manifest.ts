import type { NodeManifest } from "@baseflow/node-runtime-react";
import { DataType, ValueSource } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Task",
  defaultData: {
    meta: {
      name: "HTTP请求",
      outputSchema: {
        name: "response",
        type: DataType.Object,
        children: [
          {
            name: "header",
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
      input: {
        name: "request",
        value: {
          type: DataType.Object,
          source: ValueSource.Variable,
          text: "",
        },
      },
    },
  },
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

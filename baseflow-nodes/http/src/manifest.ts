import type { NodeManifest } from "@baseflow/node-runtime-react";
import { DataType, ValueSource } from "../../Constants";
import type { NodeProps } from "./model";

export default {
  type: "Task",
  defaultData: {
    meta: {
      name: "HTTP请求",
      outputSchema: {
        name: "Response",
        type: DataType.Object,
        children: [
          {
            name: "ResponseHeader",
            type: DataType.Object,
          },
          {
            name: "ResponseBody",
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

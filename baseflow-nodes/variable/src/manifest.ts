import type { NodeManifest } from "@baseflow/node-runtime-react";
import { DataType } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Variable",
  defaultData: {
    meta: {
      name: "变量定义",
      outputSchema: {
        name: "output",
        type: DataType.Object,
        children: [
          {
            name: "???",
            type: DataType.String,
          },
        ],
      },
    },
    props: {},
  },
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

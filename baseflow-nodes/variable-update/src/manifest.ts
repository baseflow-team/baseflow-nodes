import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "VariableUpdate",
  defaultData: {
    meta: {
      name: "变量修改",
    },
    props: {},
  },
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

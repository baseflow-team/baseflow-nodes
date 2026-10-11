import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Loop",
  defaultData: {
    meta: {
      name: "Foreach循环",
      configurationErrors: "Please set the iteration source...",
    },
    props: {},
  },
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

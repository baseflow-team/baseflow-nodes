import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Branch",
  defaultData: {
    meta: {
      name: "条件分支",
    },
    props: {},
  },
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

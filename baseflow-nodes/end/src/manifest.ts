import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "End",
  defaultData: {
    meta: {
      name: "流程返回",
      watchExternalProps: {
        flow: { outputSchema: "The flowReturnSchema has been modified and needs to be confirmed" },
      },
    },
    props: {},
  },
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

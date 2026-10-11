import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Flow",
  defaultData: {
    meta: {
      name: "流程",
    },
    props: {},
  },
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

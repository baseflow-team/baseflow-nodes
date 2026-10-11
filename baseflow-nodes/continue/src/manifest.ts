import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Break",
  defaultData: {
    meta: {
      name: "循环Continue",
    },
    props: {},
  },
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

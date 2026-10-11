import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Group",
  defaultData: {
    meta: {
      name: "TryCatch",
    },
    props: {},
  },
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

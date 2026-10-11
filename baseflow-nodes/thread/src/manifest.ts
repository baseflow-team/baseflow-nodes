import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Thread",
  defaultData: {
    meta: {
      name: "并行分支",
    },
    props: {},
  },
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

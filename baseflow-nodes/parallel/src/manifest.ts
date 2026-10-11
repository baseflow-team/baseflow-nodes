import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Parallel",
  defaultData: {
    meta: {
      name: "并行执行",
    },
    props: {},
  },
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

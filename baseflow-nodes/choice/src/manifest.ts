import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Choice",
  defaultData: {
    meta: {
      name: "条件选择",
    },
    props: {},
  },
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

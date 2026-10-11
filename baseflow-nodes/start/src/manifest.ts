import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Start",
  defaultData: {
    meta: {
      name: "流程开始",
    },
    props: {},
  },
  uiForm: "index.js",
} satisfies NodeManifest<{}>;

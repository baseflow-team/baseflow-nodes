import type { NodeManifest } from "@baseflow/node-runtime-react";

export default {
  type: "Task",
  defaultData: {
    meta: {
      name: "Task任务",
    },
    props: {},
  },
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

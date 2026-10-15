import type { NodeManifest } from "@baseflow/node-runtime-react";
import { NodeType } from "../../Constants";

export default {
  type: NodeType.Break,
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

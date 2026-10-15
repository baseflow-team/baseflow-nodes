import type { NodeManifest } from "@baseflow/node-runtime-react";
import { NodeType } from "../../Constants";

export default {
  type: NodeType.Group,
  uiForm: {
    inputSchema: null,
    outputEditable: false,
  },
} satisfies NodeManifest<{}>;

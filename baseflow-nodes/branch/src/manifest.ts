import type { NodeManifest } from "@baseflow/node-runtime-react";
import { NodeType } from "../../Constants";
import type { NodeProps } from "./model";

export default {
  type: NodeType.Branch,
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

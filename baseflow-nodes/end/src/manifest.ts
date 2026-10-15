import type { NodeManifest } from "@baseflow/node-runtime-react";
import { NodeType } from "../../Constants";
import type { NodeProps } from "./model";

export default {
  type: NodeType.End,
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

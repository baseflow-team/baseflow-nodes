import type { NodeManifest } from "@baseflow/node-runtime-react";
import { NodeType } from "../../Constants";

export default {
  type: NodeType.Start,
  uiForm: "index.js",
} satisfies NodeManifest<{}>;

import type { NodeManifest } from "@baseflow/node-runtime-react";
import { NodeType } from "@baseflow/node-runtime-react";

const node: NodeManifest = {
  type: NodeType.Break,
  icon: "",
  desc: "循环Break：放置于[循环]节点中，退出整个循环",
  executor: {
    node: "@baseflow-executors/break@0.0.1",
  },
  defaultData: {
    meta: {
      name: "循环Break",
    },
    props: {},
  },
  defaultDsl: '{"nodes":[{"tag":"@baseflow-nodes/break"}],"sources":{"@baseflow-nodes/break":"@baseflow-nodes/break@*"}}',
};

export default node;

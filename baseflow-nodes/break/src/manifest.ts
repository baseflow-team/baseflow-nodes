import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Break",
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
  validate: (nodeData) => {
    const props = nodeData.props;
    if (props.default) {
      return;
    }
    if (!props.conditions) {
      return { error: "条件不能为空" };
    }
    if (typeof props.conditions !== "string") {
      for (const groups of props.conditions.groups) {
        for (const item of groups.items) {
          if (!item.source.text || !item.target.text || !item.operator) {
            return { error: "请输入" };
          }
        }
      }
    }
    return;
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/break" }], sources: { "@baseflow-nodes/break": "@baseflow-nodes/break@*" } },
} as NodeManifest<NodeProps>;

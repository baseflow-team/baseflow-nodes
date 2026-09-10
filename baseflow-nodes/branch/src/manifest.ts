import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Branch",
  icon: "",
  desc: "条件分支：放置于[条件选择]中，通过设置执行条件来决定是否执行",
  executor: {
    node: "@baseflow-executors/branch@0.0.1",
  },
  defaultData: {
    meta: {
      name: "条件分支",
    },
    props: {},
  },
  inputForm: "index.js",
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
  defaultDsl: {
    nodes: [{ tag: "@baseflow-nodes/branch" }],
    sources: {
      "@baseflow-nodes/branch": "@baseflow-nodes/branch@*",
    },
  },
} as NodeManifest<NodeProps>;

import type { Conditions, INodeData, INodeProps } from "@baseflow/node-runtime-react";

export interface NodeProps extends INodeProps {
  default?: boolean;
  conditions?: Conditions | string;
}

export function validate(nodeData: INodeData<NodeProps>) {
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
}

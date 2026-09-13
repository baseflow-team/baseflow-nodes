import type { Conditions } from "@baseflow/node-runtime-react";

export interface NodeProps {
  default?: boolean;
  conditions?: Conditions | string;
}

export function validateNodeData(props: NodeProps): string | undefined {
  if (props.default) {
    return;
  }
  if (!props.conditions) {
    return "条件不能为空";
  }
  if (typeof props.conditions !== "string") {
    for (const groups of props.conditions.groups) {
      for (const item of groups.items) {
        if (!item.source.text || !item.target.text || !item.operator) {
          return "请输入";
        }
      }
    }
  }
  return;
}

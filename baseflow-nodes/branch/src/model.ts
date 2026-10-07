import type { Conditions } from "@baseflow/node-runtime-react";
import Lang from "./i18n/en";

export interface NodeProps {
  default?: boolean;
  conditions?: Conditions | string;
}

export function validateNodeData(props: NodeProps): string | undefined {
  if (props.default) {
    if (props.conditions) {
      return Lang.conditionCannotBeSet;
    } else {
      return;
    }
  } else {
    if (!props.conditions) {
      return Lang.conditionCannotBeEmpty;
    }
    if (typeof props.conditions !== "string") {
      for (const groups of props.conditions.groups) {
        for (const item of groups.items) {
          if (!item.source.text || !item.target.text || !item.operator) {
            return Lang.require;
          }
        }
      }
    }
    return;
  }
}

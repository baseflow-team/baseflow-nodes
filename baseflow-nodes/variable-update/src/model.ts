import type { ValueConfig } from "@baseflow/node-runtime-react";
import { DataType, ValueSource } from "@baseflow/node-runtime-react";

export interface NodeProps {
  scripts?: string;
  variable?: string;
  action?: "assign" | "insert" | "remove";
  at?: number;
  removeTargets?: number | string[];
}

export interface InternalProps {
  scripts?: ValueConfig;
  variable?: ValueConfig;
  action?: "assign" | "insert" | "remove";
  at?: number;
  removeTargets?: number | { value: string; label?: string }[];
}

export function validateNodeData(props: NodeProps): string | undefined {
  if (!props.scripts && !props.variable) {
    return "Required!";
  }
  if (props.scripts) {
    if (!props.scripts) {
      return "Required!";
    }
  } else {
    if (!props.variable) {
      return "Required!";
    }
  }
  return;
}

export const InternalPropsMapping = {
  in(nodeProps: NodeProps): InternalProps {
    const { scripts, variable, action, at, removeTargets } = nodeProps;
    return {
      scripts: scripts ? { type: DataType.Any, source: ValueSource.Expression, text: scripts } : undefined,
      variable: variable ? { type: DataType.Any, source: ValueSource.Variable, text: variable } : undefined,
      action,
      at,
      removeTargets: removeTargets && (typeof removeTargets === "number" ? removeTargets : removeTargets.map((item) => ({ value: item }))),
    };
  },
  out(internalProps: InternalProps): NodeProps {
    if (internalProps.scripts) {
      const scripts = internalProps.scripts?.text;
      return { scripts };
    } else {
      const { action, at } = internalProps;
      const variable = internalProps.variable?.text;
      const removeTargets =
        internalProps.removeTargets &&
        (typeof internalProps.removeTargets === "number" ? internalProps.removeTargets : internalProps.removeTargets.map((item) => item.value));
      return { variable, action, at, removeTargets };
    }
  },
};

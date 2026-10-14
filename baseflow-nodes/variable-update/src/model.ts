import type { SchemaValue, ValueConfig } from "@baseflow/node-runtime-react";
import { formatLang } from "@baseflow/node-runtime-react";
import Lang from "./i18n/en";

export interface NodeProps {
  scripts?: ValueConfig;
  variable?: ValueConfig;
  variablePayload?: SchemaValue;
  action?: "assign" | "insert" | "remove";
  at?: number;
  removeTargets?: number | { value: string; label?: string }[];
}

export function validateNodeData(props: NodeProps): string | undefined {
  if (!props.scripts?.text && !props.variable?.text) {
    return formatLang(Lang.fieldRequired, { field: "variable" });
  }
  return;
}

export interface DSLProps {
  scripts?: string;
  variable?: string;
  variablePayload?: SchemaValue;
  action?: "assign" | "insert" | "remove";
  at?: number;
  removeTargets?: number | string[];
}

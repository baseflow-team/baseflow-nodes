import type { SchemaValue } from "@baseflow/node-runtime-react";
import Lang from "./i18n/en";

export interface NodeProps {
  source?: SchemaValue;
}

export function validateNodeData(props: NodeProps): string | undefined {
  if (!props.source?.value) {
    return Lang.iterationSourceRequire;
  }
  return;
}

export interface DSLProps {
  source?: string;
}

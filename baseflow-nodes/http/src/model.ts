import type { SchemaValue } from "@baseflow/node-runtime-react";

export interface NodeProps {
  input?: SchemaValue;
}

export function validateNodeData(props: NodeProps): string | undefined {
  if (!props.input) {
    return "Http input is required!";
  }
  return;
}

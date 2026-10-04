import type { SchemaModel, SchemaValue } from "@baseflow/node-runtime-react";
import { matchSchemaValueByModel } from "@baseflow/node-runtime-react";
import Lang from "./i18n/en";

export interface NodeProps {
  returnValue?: SchemaValue;
}

export function validateNodeData(flowReturnSchema: SchemaModel | undefined, props: NodeProps): string | undefined {
  if (flowReturnSchema) {
    if (props.returnValue) {
      return matchSchemaValueByModel(flowReturnSchema, props.returnValue) || undefined;
    } else {
      return Lang.returnValueRequire;
    }
  } else {
    if (props.returnValue) {
      return Lang.returnValueMismatch;
    }
  }
  return;
}

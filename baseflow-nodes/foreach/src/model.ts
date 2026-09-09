import type { INodeProps, SchemaValue } from "@baseflow/node-runtime-react";

export interface NodeProps extends INodeProps {
  source?: SchemaValue;
}

export interface DSLProps {
  source?: string;
}

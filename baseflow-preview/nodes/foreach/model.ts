import type { INodeProps, SchemaValue } from "@baseflow/react";

export interface NodeProps extends INodeProps {
  source?: SchemaValue;
}

export interface DSLProps {
  source?: string;
}

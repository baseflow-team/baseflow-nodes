import type { INodeProps, SchemaValue } from "@baseflow/react";

export interface NodeProps extends INodeProps {
  initialValue?: SchemaValue;
}

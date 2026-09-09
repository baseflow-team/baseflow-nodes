import type { INodeProps, SchemaValue } from "@baseflow/node-runtime-react";

export interface NodeProps extends INodeProps {
  initialValue?: SchemaValue;
}

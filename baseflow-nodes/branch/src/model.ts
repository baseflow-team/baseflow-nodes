import type { Conditions, INodeProps } from "@baseflow/node-runtime-react";

export interface NodeProps extends INodeProps {
  default?: boolean;
  conditions?: Conditions | string;
}

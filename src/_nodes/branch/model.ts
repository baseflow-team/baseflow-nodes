import type { Conditions, INodeProps } from "@baseflow/react";

export interface NodeProps extends INodeProps {
  default?: boolean;
  conditions?: Conditions | string;
}

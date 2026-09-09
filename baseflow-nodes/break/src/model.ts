import type { INodeProps } from "@baseflow/node-runtime-react";

export interface NodeProps extends INodeProps {
  conditions?: any;
  default?: boolean;
}

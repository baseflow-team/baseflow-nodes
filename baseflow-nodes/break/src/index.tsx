import type { INodeData } from "@baseflow/flow-react";
import type { FC } from "react";
import type { NodeProps } from "./model";

export default function Properties({ nodeData }: { nodeData: INodeData }) {
  return <div>{nodeData.id + nodeData.meta.name}</div>;
}

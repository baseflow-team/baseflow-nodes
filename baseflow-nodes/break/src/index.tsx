import type { INodeData } from "@baseflow/flow-react";

export default function Properties({ nodeData }: { nodeData: INodeData }) {
  return <div>{nodeData.id + nodeData.meta.name}</div>;
}

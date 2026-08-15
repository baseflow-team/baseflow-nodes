"use no memo";
import type { INodeInputPanel, SchemaModel, SchemaValue } from "@baseflow/react";
import { DataType, SchemaValueForm, useEvent, useNode } from "@baseflow/react";
import { memo } from "react";
import type { NodeProps } from "../model";

const inputSchema: SchemaModel = {
  name: "request",
  label: "Request",
  type: "ͼOBJECTͼ",
  children: [
    { name: "url", type: "ͼSTRINGͼ" },
    { name: "method", type: "ͼSTRINGͼ" },
    { name: "https", type: DataType.Bool },
    { name: "data", type: DataType.Date },
  ],
};

const Component: INodeInputPanel<NodeProps> = ({ nodeData }) => {
  const { node } = useNode(nodeData.id);
  const onInputChange = useEvent((input: SchemaValue | undefined) => {
    node.updateProps({ input });
  });
  return (
    <div>
      <SchemaValueForm schema={inputSchema} value={nodeData.props.input} onChange={onInputChange} />
    </div>
  );
};
export default memo(Component);

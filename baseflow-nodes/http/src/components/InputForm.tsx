import type { INodeData, SchemaModel, SchemaValue } from "@baseflow/node-runtime-react";
import { DataType, SchemaValueForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import type { NodeProps } from "../model";

const inputSchema: SchemaModel = {
  name: "request",
  label: "Request",
  type: DataType.Object,
  children: [
    { name: "url", type: DataType.String },
    { name: "method", type: DataType.String, enums: [{ value: "GET" }, { value: "POST" }, { value: "PUT" }, { value: "DELETE" }] },
    { name: "https", type: DataType.Bool },
  ],
};
interface Props {
  nodeData: INodeData<NodeProps>;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
}

const Component: FC<Props> = ({ nodeData, updateNodeProps }) => {
  const nodeProps = nodeData.props;
  const onInputChange = useEvent((input: SchemaValue | undefined) => {
    updateNodeProps({ input });
  });
  return (
    <div>
      <SchemaValueForm schema={inputSchema} value={nodeProps.input} onChange={onInputChange} />
    </div>
  );
};
export default memo(Component);

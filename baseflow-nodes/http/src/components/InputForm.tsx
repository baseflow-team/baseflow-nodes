import type { SchemaModel, SchemaValue } from "@baseflow/node-runtime-react";
import { DataType, SchemaValueForm, useEvent, useNodeRuntime } from "@baseflow/node-runtime-react";
import type { FC } from "react";
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

const Component: FC = () => {
  const { nodeData, updateNodeProps } = useNodeRuntime<NodeProps>();
  const onInputChange = useEvent((input: SchemaValue | undefined) => {
    updateNodeProps({ input });
  });
  return (
    <div>
      <SchemaValueForm schema={inputSchema} value={nodeData.props.input} onChange={onInputChange} />
    </div>
  );
};
export default memo(Component);

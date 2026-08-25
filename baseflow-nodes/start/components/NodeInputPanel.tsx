"use no memo";
import type { INodeInputPanel, SchemaModel } from "@baseflow/react";
import { BaseLang, DataType, SchemaModelForm, useEvent, useGraph, useNode } from "@baseflow/react";
import { Alert } from "antd";
import { memo, useState } from "react";
import type { NodeProps } from "../model";

const defaultInput: SchemaModel = { name: "input", type: DataType.Object, children: [] };
const defaultReturn: SchemaModel = { name: "return", type: DataType.Object, children: [] };

const Component: INodeInputPanel<NodeProps> = ({ nodeData }) => {
  const { graph } = useGraph();
  const { node } = useNode(nodeData.id);
  const inputSchema = graph.getInputSchema();
  const returnSchema = graph.getReturnSchema();
  const [inputSchemaChanged, setInputSchemaChanged] = useState(false);
  const [returnSchemaChanged, setReturnSchemaChanged] = useState(false);

  const onInputSchemaChange = useEvent((inputSchema: SchemaModel | undefined) => {
    setInputSchemaChanged(true);
    graph.setInputSchema(inputSchema);
    node.updateMeta({ summary: [inputSchema && "[✓入参]", returnSchema && "[✓返回]"].filter(Boolean).join(", ") });
  });

  const onReturnSchemaChange = useEvent((returnSchema: SchemaModel | undefined) => {
    setReturnSchemaChanged(true);
    graph.setReturnSchema(returnSchema);
    node.updateMeta({ summary: [inputSchema && "[✓入参]", returnSchema && "[✓返回]"].filter(Boolean).join(", ") });
  });

  return (
    <div>
      {inputSchemaChanged && <Alert style={{ marginBottom: "20px" }} title={BaseLang.inputSchemaChanged} type="warning" showIcon />}
      {returnSchemaChanged && <Alert style={{ marginBottom: "20px" }} title={BaseLang.returnSchemaChanged} type="warning" showIcon />}
      <div className="nd-form-layout">
        <div className="form-item">
          <div className="label-item">流程入参</div>
          <div className="input-item nd-schema-filled">
            <SchemaModelForm variant="filled" defaultValue={defaultInput} value={inputSchema} onChange={onInputSchemaChange} />
          </div>
        </div>
        <div className="form-item">
          <div className="label-item">流程返回</div>
          <div className="input-item nd-schema-filled">
            <SchemaModelForm variant="filled" defaultValue={defaultReturn} value={returnSchema} onChange={onReturnSchemaChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Component);

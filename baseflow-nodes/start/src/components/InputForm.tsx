import type { INodeMeta, SchemaModel } from "@baseflow/node-runtime-react";
import { DataType, SchemaModelForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";

const defaultInput: SchemaModel = { name: "input", type: DataType.Object, children: [] };
const defaultReturn: SchemaModel = { name: "return", type: DataType.Object, children: [] };

interface Props {
  flowInputSchema: SchemaModel | undefined;
  flowReturnSchema: SchemaModel | undefined;
  updateNodeMeta: (newMeta: Partial<INodeMeta>) => void;
  updateFlowInputSchema: (schema: SchemaModel | undefined) => void;
  updateFlowReturnSchema: (schema: SchemaModel | undefined) => void;
}

const Component: FC<Props> = ({ flowReturnSchema, flowInputSchema, updateNodeMeta, updateFlowInputSchema, updateFlowReturnSchema }) => {
  const onInputSchemaChange = useEvent((inputSchema: SchemaModel | undefined) => {
    updateFlowInputSchema(inputSchema);
    updateNodeMeta({ summary: [inputSchema && "[✓入参]", flowReturnSchema && "[✓返回]"].filter(Boolean).join(", ") });
  });

  const onReturnSchemaChange = useEvent((returnSchema: SchemaModel | undefined) => {
    updateFlowReturnSchema(returnSchema);
    updateNodeMeta({ summary: [flowInputSchema && "[✓入参]", returnSchema && "[✓返回]"].filter(Boolean).join(", ") });
  });

  return (
    <div>
      <div className="nd-form-layout">
        <div className="form-item">
          <div className="label-item">流程入参</div>
          <div className="input-item nd-schema-filled">
            <SchemaModelForm variant="filled" defaultValue={defaultInput} value={flowInputSchema} onChange={onInputSchemaChange} />
          </div>
        </div>
        <div className="form-item">
          <div className="label-item">流程返回</div>
          <div className="input-item nd-schema-filled">
            <SchemaModelForm variant="filled" defaultValue={defaultReturn} value={flowReturnSchema} onChange={onReturnSchemaChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Component);

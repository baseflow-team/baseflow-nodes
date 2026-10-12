import type { INodeMeta, SchemaModel } from "@baseflow/node-runtime-react";
import { DataType, SchemaModelForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import { FormItem } from "widgets-mantine";
import Lang from "../i18n/en";

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
  });

  const onReturnSchemaChange = useEvent((returnSchema: SchemaModel | undefined) => {
    updateFlowReturnSchema(returnSchema);
  });

  return (
    <div>
      <FormItem required label={Lang.flowInput}>
        <SchemaModelForm variant="filled" defaultValue={defaultInput} value={flowInputSchema} onChange={onInputSchemaChange} />
      </FormItem>
      <FormItem required label={Lang.flowOutput}>
        <SchemaModelForm variant="filled" defaultValue={defaultReturn} value={flowReturnSchema} onChange={onReturnSchemaChange} />
      </FormItem>
    </div>
  );
};
export default memo(Component);

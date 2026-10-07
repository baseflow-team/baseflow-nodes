import type { INodeMeta, SchemaModel } from "@baseflow/node-runtime-react";
import { DataType, SchemaModelForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import Lang from "../i18n/en";
import styles from "../index.module.scss";

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
      <div className={styles.FormLayout}>
        <div className="form-item">
          <div className="label-item">{Lang.flowInput}</div>
          <div className="input-item">
            <SchemaModelForm variant="filled" defaultValue={defaultInput} value={flowInputSchema} onChange={onInputSchemaChange} />
          </div>
        </div>
        <div className="form-item">
          <div className="label-item">{Lang.flowOutput}</div>
          <div className="input-item">
            <SchemaModelForm variant="filled" defaultValue={defaultReturn} value={flowReturnSchema} onChange={onReturnSchemaChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Component);

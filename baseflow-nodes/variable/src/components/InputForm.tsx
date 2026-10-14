import type { INodeData, INodeMeta, SchemaModel, SchemaToolsFilter, SchemaValue } from "@baseflow/node-runtime-react";
import { SchemaModelForm, SchemaValueForm, ValueSource } from "@baseflow/node-runtime-react";
import { Switch } from "@mantine/core";
import type { ChangeEvent, FC } from "react";
import { memo, useCallback } from "react";
import Lang from "../i18n/en";
import type { NodeProps } from "../model";
import styles from "./index.module.scss";

const toolsFilter: SchemaToolsFilter = (item, parent, path) => {
  if (!parent) {
    return { addNext: false, edit: false, delete: false };
  }
  return;
};

interface Props {
  nodeData: INodeData<NodeProps>;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
  updateNodeMeta: (newMeta: Partial<INodeMeta>) => void;
}

const Component: FC<Props> = ({ nodeData, updateNodeProps, updateNodeMeta }) => {
  const nodeProps = nodeData.props;
  const outputSchema = nodeData.meta.outputSchema!;
  const initialValue = nodeProps.initialValue;
  const showAssignment = !!initialValue;

  const onShowAssignmentChange = useCallback(
    (event: ChangeEvent<any>) => {
      const show = event.currentTarget.checked;
      if (!show) {
        updateNodeProps({ initialValue: undefined });
      } else {
        const { name, type, optional, children } = outputSchema;
        const newValue: SchemaValue = {
          name,
          value: {
            type,
            optional,
            source: ValueSource.Template,
            text: "*",
          },
          children: children?.map(({ name, type, optional }) => ({
            name: name,
            value: { type, optional, source: ValueSource.Variable, text: "" },
          })),
        };
        updateNodeProps({ initialValue: newValue });
      }
    },
    [updateNodeProps, outputSchema],
  );

  const onSchemaChange = useCallback(
    (schema?: SchemaModel) => {
      const names = (schema?.children || []).map((item) => item.name);
      const show = names.slice(0, 3);
      if (show.length < names.length) {
        show.push("...");
      }
      updateNodeMeta({ outputSchema: schema, summary: show.join(", ") });
    },
    [updateNodeMeta],
  );

  const onValueChange = useCallback(
    (initialValue?: SchemaValue) => {
      updateNodeProps({ initialValue });
    },
    [updateNodeProps],
  );

  return (
    <div className={styles.root}>
      <SchemaModelForm variant="borderless" toolsFilter={toolsFilter} value={outputSchema} onChange={onSchemaChange} />
      <div className="initial-assignment">
        <Switch checked={showAssignment} label={Lang.initialAssignment} onChange={onShowAssignmentChange} />
      </div>
      {initialValue && <SchemaValueForm variant="filled" showRootTools schema={outputSchema} value={initialValue} onChange={onValueChange} />}
    </div>
  );
};
export default memo(Component);

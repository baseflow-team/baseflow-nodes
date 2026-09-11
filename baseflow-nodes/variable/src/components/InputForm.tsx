import type { SchemaModel, SchemaToolsFilter, SchemaValue } from "@baseflow/node-runtime-react";
import { SchemaModelForm, SchemaValueForm, useNodeRuntime, ValueSource } from "@baseflow/node-runtime-react";
import { Switch } from "antd";
import type { FC } from "react";
import { memo, useCallback } from "react";
import type { NodeProps } from "../model";
import styles from "./index.module.scss";

const toolsFilter: SchemaToolsFilter = (item, parent) => {
  if (!parent) {
    return { addNext: false, edit: false, delete: false };
  }
  return;
};

const Component: FC = () => {
  const { nodeData, updateNodeProps, updateNodeMeta } = useNodeRuntime<NodeProps>();
  const nodeProps = nodeData.props;
  const outputSchema = nodeData.meta.outputSchema!;
  const initialValue = nodeProps.initialValue;
  const showAssignment = !!initialValue;

  const onShowAssignmentChange = useCallback(
    (show?: boolean) => {
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
      updateNodeMeta({ outputSchema: schema });
      const names = (schema?.children || []).map((item) => item.name);
      const show = names.slice(0, 3);
      if (show.length < names.length) {
        show.push("...");
      }
      updateNodeMeta({ summary: show.join(", ") });
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
        <Switch value={showAssignment} checkedChildren="初始赋值" unCheckedChildren="初始赋值" onChange={onShowAssignmentChange} />
      </div>
      {initialValue && <SchemaValueForm variant="filled" showRootTools schema={outputSchema} value={initialValue} onChange={onValueChange} />}
    </div>
  );
};
export default memo(Component);

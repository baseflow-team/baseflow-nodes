"use no memo";
import type { INodeInputPanel, SchemaLabelRender, SchemaModel, SchemaToolsFilter, SchemaValue } from "@baseflow/react";
import { SchemaModelForm, SchemaValueForm, useNode, ValueSource } from "@baseflow/react";
import { Switch } from "antd";
import { memo, useCallback } from "react";
import type { NodeProps } from "../model";
import styles from "./index.module.scss";

const toolsFilter: SchemaToolsFilter = (item, parent) => {
  if (!parent) {
    return { addNext: false, edit: false, delete: false };
  }
};
const schemaLabelRender: SchemaLabelRender = (item, parent) => {
  if (!parent) {
    return { name: "变量定义", label: "" };
  }
};
const valueLabelRender: SchemaLabelRender = (item, parent) => {
  if (!parent) {
    return { name: "变量初始化", label: "" };
  }
};

const Component: INodeInputPanel<NodeProps> = ({ nodeData }) => {
  const { node } = useNode(nodeData.id);
  const nodeProps = nodeData.props;
  const outputSchema = nodeData.meta.outputSchema!;
  const initialValue = nodeProps.initialValue;
  const showAssignment = !!initialValue;

  const onShowAssignmentChange = useCallback(
    (show?: boolean) => {
      if (!show) {
        node.updateProps({ initialValue: undefined });
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
        node.updateProps({ initialValue: newValue });
      }
    },
    [node, outputSchema],
  );

  const onSchemaChange = useCallback(
    (schema?: SchemaModel) => {
      node.updateOutputSchema(schema);
      const names = (schema?.children || []).map((item) => item.name);
      const show = names.slice(0, 3);
      if (show.length < names.length) {
        show.push("...");
      }
      node.updateMeta({ summary: show.join(", ") });
    },
    [node],
  );

  const onValueChange = useCallback(
    (initialValue?: SchemaValue) => {
      node.updateProps({ initialValue });
    },
    [node],
  );

  return (
    <div className={styles.variable}>
      <SchemaModelForm
        variant="borderless"
        labelRender={schemaLabelRender}
        toolsFilter={toolsFilter}
        value={outputSchema}
        onChange={onSchemaChange}
      />
      <div className="initial-assignment">
        <Switch value={showAssignment} checkedChildren="初始赋值" unCheckedChildren="初始赋值" onChange={onShowAssignmentChange} />
      </div>
      {initialValue && (
        <SchemaValueForm
          variant="filled"
          showRootTools
          labelRender={valueLabelRender}
          schema={outputSchema}
          value={initialValue}
          onChange={onValueChange}
        />
      )}
    </div>
  );
};
export default memo(Component);

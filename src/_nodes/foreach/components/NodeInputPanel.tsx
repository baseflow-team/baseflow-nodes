"use no memo";
import type { INodeInputPanel, SchemaInputPropsRender, SchemaModel, SchemaValue } from "@baseflow/react";
import { DataType, SchemaValueForm, useEvent, useNode } from "@baseflow/react";
import { memo } from "react";
import type { NodeProps } from "../model";

const inputSchema: SchemaModel = { name: "source", label: "迭代源", type: DataType.Array };

const inputPropsRender: SchemaInputPropsRender = (item) => {
  if (item.name === "source") {
    return { sourceType: "mapping" };
  }
};

const Component: INodeInputPanel<NodeProps> = ({ nodeData }) => {
  const { node } = useNode(nodeData.id);
  const onInputChange = useEvent((source: SchemaValue | undefined) => {
    if (source) {
      // children and arrayType that allows to recognize it as a mapping mode
      source = { ...source, children: [] };
    }
    node.updateProps({ source });
    const sourceVar = source?.value.text;
    if (sourceVar) {
      if (/\D/.test(sourceVar) && !sourceVar.startsWith("_number(")) {
        node.updateOutputSchema({
          name: "output",
          type: DataType.Object,
          children: [
            { name: "_item_", type: DataType.Any, direct: sourceVar },
            { name: "_key_", type: DataType.Any, direct: sourceVar },
            { name: "_length_", type: DataType.Number },
          ],
        });
      } else {
        node.updateOutputSchema({
          name: "output",
          type: DataType.Object,
          children: [
            { name: "_item_", type: DataType.Number },
            { name: "_key_", type: DataType.Number },
            { name: "_length_", type: DataType.Number },
          ],
        });
      }
    } else {
      node.updateOutputSchema(undefined);
    }
  });
  return (
    <div>
      <SchemaValueForm inputPropsRender={inputPropsRender} schema={inputSchema} value={nodeData.props.source} onChange={onInputChange} />
    </div>
  );
};
export default memo(Component);

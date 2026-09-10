import type { SchemaModel, SchemaValue, SuperInputPropsRender } from "@baseflow/node-runtime-react";
import { DataType, SchemaValueForm, useEvent, useNodeRuntime } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import type { NodeProps } from "../model";

const inputSchema: SchemaModel = { name: "source", label: "迭代源", type: DataType.Array };

const inputPropsRender: SuperInputPropsRender = (item) => {
  if (item.name === "source") {
    return { sourceType: "mapping" };
  }
  return;
};

const Component: FC = () => {
  const { nodeData, updateNodeMeta, updateNodeProps } = useNodeRuntime<NodeProps>();
  const onInputChange = useEvent((source: SchemaValue | undefined) => {
    if (source) {
      // children and arrayType that allows to recognize it as a mapping mode
      source = { ...source, children: [] };
    }
    updateNodeProps({ source });
    const sourceVar = source?.value.text;
    if (sourceVar) {
      if (/\D/.test(sourceVar) && !sourceVar.startsWith("_number(")) {
        updateNodeMeta({
          outputSchema: {
            name: "output",
            type: DataType.Object,
            children: [
              { name: "_item_", type: DataType.Any, direct: sourceVar },
              { name: "_key_", type: DataType.Any, direct: sourceVar },
              { name: "_length_", type: DataType.Number },
            ],
          },
        });
      } else {
        updateNodeMeta({
          outputSchema: {
            name: "output",
            type: DataType.Object,
            children: [
              { name: "_item_", type: DataType.Number },
              { name: "_key_", type: DataType.Number },
              { name: "_length_", type: DataType.Number },
            ],
          },
        });
      }
    } else {
      updateNodeMeta({ outputSchema: undefined });
    }
  });
  return (
    <div>
      <SchemaValueForm superInputPropsRender={inputPropsRender} schema={inputSchema} value={nodeData.props.source} onChange={onInputChange} />
    </div>
  );
};
export default memo(Component);

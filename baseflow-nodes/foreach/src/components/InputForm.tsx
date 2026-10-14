import type { INodeMeta, SchemaModel, SchemaValue, SuperInputPropsRender } from "@baseflow/node-runtime-react";
import { DataType, SchemaValueForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import Lang from "../i18n/en";
import type { NodeProps } from "../model";

const inputSchema: SchemaModel = { name: "source", label: Lang.iterationSource, type: DataType.Array, children: [] };

const inputPropsRender: SuperInputPropsRender = (item) => {
  if (item.name === "source") {
    return { sourceType: "mapping" };
  }
  return;
};

interface Props {
  nodeProps: NodeProps;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
  updateNodeMeta: (newMeta: Partial<INodeMeta>) => void;
}

const Component: FC<Props> = ({ nodeProps, updateNodeProps, updateNodeMeta }) => {
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
            name: "Output",
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
            name: "Output",
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
      <SchemaValueForm superInputPropsRender={inputPropsRender} schema={inputSchema} value={nodeProps.source} onChange={onInputChange} />
    </div>
  );
};
export default memo(Component);

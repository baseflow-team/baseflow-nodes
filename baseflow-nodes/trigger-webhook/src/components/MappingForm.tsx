import type { SchemaModel, SchemaValue } from "@baseflow/node-runtime-react";
import { SchemaValueForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import { FormItem } from "widgets-mantine";
import Lang from "../i18n/en";
import type { NodeProps } from "../model";

interface Props {
  nodeProps: NodeProps;
  flowInputSchema: SchemaModel | undefined;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
}

const Component: FC<Props> = ({ nodeProps, flowInputSchema, updateNodeProps }) => {
  const flowInputValue = nodeProps.flowInputValue;

  const onMappingChange = useEvent((flowInputValue: SchemaValue | undefined) => {
    updateNodeProps({ flowInputValue });
  });

  return (
    <div>
      {(flowInputSchema || flowInputValue) && (
        <FormItem required label={Lang.mappingFlowInput}>
          <SchemaValueForm variant="filled" schema={flowInputSchema} value={flowInputValue} onChange={onMappingChange} />
        </FormItem>
      )}
    </div>
  );
};
export default memo(Component);

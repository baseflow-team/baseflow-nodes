import type { INodeData, SchemaModel, SchemaValue } from "@baseflow/node-runtime-react";
import { SchemaValueForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import { FormItem } from "widgets-mantine";
import Lang from "../i18n/en";
import type { NodeProps } from "../model";

interface Props {
  nodeData: INodeData<NodeProps>;
  flowReturnSchema: SchemaModel | undefined;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
}

const Component: FC<Props> = ({ nodeData, flowReturnSchema, updateNodeProps }) => {
  const flowReturnValue = nodeData.props.returnValue;

  const onReturnChange = useEvent((returnValue: SchemaValue | undefined) => {
    updateNodeProps({ returnValue });
  });

  return (
    <div>
      {(flowReturnSchema || flowReturnValue) && (
        <FormItem required label={Lang.setFlowReturn}>
          <SchemaValueForm variant="filled" schema={flowReturnSchema} value={flowReturnValue} onChange={onReturnChange} />
        </FormItem>
      )}
    </div>
  );
};
export default memo(Component);

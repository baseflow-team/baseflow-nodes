import type { INodeData, INodeMeta, SchemaModel, SchemaValue } from "@baseflow/node-runtime-react";
import { SchemaValueForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";

interface Props {
  nodeData: INodeData<{}>;
  flowReturnSchema: SchemaModel | undefined;
  updateNodeMeta: (newMeta: Partial<INodeMeta>) => void;
}

const Component: FC<Props> = ({ nodeData, flowReturnSchema, updateNodeMeta }) => {
  const flowReturnValue = nodeData.meta.valueReference?.value;

  const onReturnChange = useEvent((value: SchemaValue | undefined) => {
    updateNodeMeta({ valueReference: { path: "flow", value } });
  });

  return (
    <div>
      {(flowReturnSchema || flowReturnValue) && (
        <div className="nd-form-layout">
          <div className="form-item">
            <div className="label-item require">设置返回参数</div>
            <div className="input-item">
              <SchemaValueForm variant="filled" schema={flowReturnSchema} value={flowReturnValue} onChange={onReturnChange} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default memo(Component);

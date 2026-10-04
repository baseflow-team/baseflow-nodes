import type { INodeData, SchemaModel, SchemaValue } from "@baseflow/node-runtime-react";
import { SchemaValueForm, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import Lang from "../i18n/en";
import styles from "../index.module.scss";
import type { NodeProps } from "../model";

interface Props {
  nodeData: INodeData<NodeProps>;
  flowReturnSchema: SchemaModel | undefined;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
}

const Component: FC<Props> = ({ nodeData, flowReturnSchema, updateNodeProps }) => {
  const flowReturnValue = nodeData.props.returnValue;

  const onReturnChange = useEvent((value: SchemaValue | undefined) => {
    updateNodeProps({ returnValue: value });
  });

  return (
    <div>
      {(flowReturnSchema || flowReturnValue) && (
        <div className={styles.FormLayout}>
          <div className="form-item">
            <div className="label-item require">{Lang.setFlowReturn}</div>
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

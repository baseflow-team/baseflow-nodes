import type { Conditions, INodeData } from "@baseflow/node-runtime-react";
import { ConditionSelector, useEvent } from "@baseflow/node-runtime-react";
import { Typography } from "antd";
import type { FC } from "react";
import { memo } from "react";
import type { NodeProps } from "../model";

const Component: FC<{ nodeData: INodeData<NodeProps>; updateNodeProps: (newProps: Partial<NodeProps>) => void }> = ({
  nodeData,
  updateNodeProps,
}) => {
  const nodeProps = nodeData.props;
  const onConditionsChange = useEvent((conditions: Conditions | string | undefined) => {
    updateNodeProps({ conditions });
  });

  return (
    <div>
      {nodeProps.default ? (
        <Typography.Text type="secondary">其它条件默认分支</Typography.Text>
      ) : (
        <ConditionSelector value={nodeProps.conditions} onChange={onConditionsChange} />
      )}
    </div>
  );
};
export default memo(Component);

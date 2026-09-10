import type { Conditions } from "@baseflow/node-runtime-react";
import { ConditionSelector, useNodeRuntime } from "@baseflow/node-runtime-react";
import { Typography } from "antd";
import type { FC } from "react";
import { memo } from "react";
import type { NodeProps } from "../model";
import { useEvent } from "../utils";

const Component: FC = () => {
  const { nodeData, updateNodeProps } = useNodeRuntime<NodeProps>();
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

"use no memo";
import type { Conditions, INodeInputPanel } from "@baseflow/react";
import { ConditionSelector, useEvent, useNode } from "@baseflow/react";
import { Typography } from "antd";
import { memo } from "react";
import type { NodeProps } from "../model";

const Component: INodeInputPanel<NodeProps> = ({ nodeData }) => {
  const nodeProps = nodeData.props;
  const { node } = useNode(nodeData.id);

  const onConditionsChange = useEvent((conditions: Conditions | string | undefined) => {
    node.updateProps({ conditions });
  });

  return <div>{nodeProps.default ? <Typography.Text type="secondary">其它条件默认分支</Typography.Text> : <ConditionSelector value={nodeProps.conditions} onChange={onConditionsChange} />}</div>;
};
export default memo(Component);

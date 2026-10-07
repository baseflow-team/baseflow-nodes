import type { Conditions, INodeData } from "@baseflow/node-runtime-react";
import { ConditionSelector, useEvent } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";
import Lang from "../i18n/en";
import type { NodeProps } from "../model";

interface Props {
  nodeData: INodeData<NodeProps>;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
}

const Component: FC<Props> = ({ nodeData, updateNodeProps }) => {
  const nodeProps = nodeData.props;
  const onConditionsChange = useEvent((conditions: Conditions | string | undefined) => {
    updateNodeProps({ conditions });
  });

  return (
    <div>
      {nodeProps.default ? <div>{Lang.defaultBranch}</div> : <ConditionSelector value={nodeProps.conditions} onChange={onConditionsChange} />}
    </div>
  );
};
export default memo(Component);

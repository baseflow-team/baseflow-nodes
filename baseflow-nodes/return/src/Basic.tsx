import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import { NodeNameplate } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";
import type { NodeProps } from "./model";
import { validateNodeData } from "./model";

const Component: FC<{ setup: NodeSetup<NodeProps> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, packageInfo, flowReturnSchema, updateNodeProps } = setup({
    onSubmit: () => {
      const error = validateNodeData(flowReturnSchema, nodeData.props);
      return {
        nodeData: { ...nodeData, meta: { ...nodeData.meta, configurationErrors: error || undefined } },
      };
    },
    onNavigate: (target) => {
      setCurrentTab(target);
    },
  });

  return (
    <div>
      {currentTab === "input" && <InputForm nodeData={nodeData} flowReturnSchema={flowReturnSchema} updateNodeProps={updateNodeProps} />}
      {currentTab === "output" && null}
      {currentTab === "readme" && <NodeNameplate packageInfo={packageInfo} />}
    </div>
  );
};
export default memo(Component);

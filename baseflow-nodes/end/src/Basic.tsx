import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import { NodeNameplate } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";

const Component: FC<{ setup: NodeSetup<{}> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, packageInfo, flowReturnSchema, updateNodeProps } = setup({
    onSubmit: () => {
      return {
        nodeData,
        flowReturnSchema,
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

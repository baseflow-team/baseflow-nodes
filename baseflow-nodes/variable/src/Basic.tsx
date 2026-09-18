import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";
import OutputForm from "./components/OutputForm";
import Readme from "./components/Readme";
import type { NodeProps } from "./model";

const Component: FC<{ setup: NodeSetup<NodeProps> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, updateNodeProps, updateNodeMeta } = setup({
    onSubmit: () => {
      return {
        nodeData,
      };
    },
    onNavigate: (target) => {
      setCurrentTab(target);
    },
  });

  return (
    <div>
      {currentTab === "input" && <InputForm nodeData={nodeData} updateNodeProps={updateNodeProps} updateNodeMeta={updateNodeMeta} />}
      {currentTab === "output" && <OutputForm outputSchema={nodeData.meta.outputSchema} />}
      {currentTab === "readme" && <Readme />}
    </div>
  );
};
export default memo(Component);

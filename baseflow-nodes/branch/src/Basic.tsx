import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import { NodeMock } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";
import OutputForm from "./components/OutputForm";
import Readme from "./components/Readme";
import type { NodeProps } from "./model";
import { validateNodeData } from "./model";

const Component: FC<{ setup: NodeSetup<NodeProps> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, updateNodeProps, updateNodeMeta } = setup({
    onSubmit: () => {
      const error = validateNodeData(nodeData.props);
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
      {currentTab === "input" && <InputForm nodeData={nodeData} updateNodeProps={updateNodeProps} />}
      {currentTab === "output" && <OutputForm />}
      {currentTab === "mock" && <NodeMock nodeData={nodeData} updateNodeMeta={updateNodeMeta} />}
      {currentTab === "readme" && <Readme />}
    </div>
  );
};
export default memo(Component);

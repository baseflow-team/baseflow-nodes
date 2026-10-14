import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import { NodeMock, NodeNameplate } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";
import MappingForm from "./components/MappingForm";
import type { NodeProps } from "./model";
import { validateNodeData } from "./model";

const Component: FC<{ setup: NodeSetup<NodeProps> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, packageInfo, flowInputSchema, updateNodeProps, updateNodeMeta } = setup({
    onSubmit: () => {
      const props = nodeData.props;
      const error = validateNodeData(flowInputSchema, props);
      return {
        nodeData: { ...nodeData, meta: { ...nodeData.meta, configurationErrors: error || undefined }, props },
      };
    },
    onNavigate: (target) => {
      setCurrentTab(target);
    },
  });

  return (
    <div>
      {currentTab === "input" && (
        <InputForm
          nodeProps={nodeData.props}
          outputSchema={nodeData.meta.outputSchema!}
          updateNodeProps={updateNodeProps}
          updateNodeMeta={updateNodeMeta}
        />
      )}
      {currentTab === "output" && <MappingForm nodeProps={nodeData.props} flowInputSchema={flowInputSchema} updateNodeProps={updateNodeProps} />}
      {currentTab === "mock" && <NodeMock nodeData={nodeData} updateNodeMeta={updateNodeMeta} />}
      {currentTab === "readme" && <NodeNameplate packageInfo={packageInfo} />}
    </div>
  );
};
export default memo(Component);

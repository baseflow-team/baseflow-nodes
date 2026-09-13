import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";
import OutputForm from "./components/OutputForm";
import Readme from "./components/Readme";
import type { NodeProps } from "./model";
import { validate } from "./model";

const Component: FC<{ setup: NodeSetup<NodeProps> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, flowInputSchema, flowReturnSchema, collaboratorNotices, updateNodeProps } = setup({
    onBeforeUnload: () => {
      const validateResult = validate(nodeData);
      return {
        nodeData: validateResult ? { ...nodeData, meta: { ...nodeData.meta, configurationErrors: validateResult.error } } : nodeData,
        flowInputSchema,
        flowReturnSchema,
        collaboratorNotices,
      };
    },
    onBeforeNavigate: (target) => {
      setCurrentTab(target);
    },
  });

  return (
    <div>
      {currentTab === "input" && <InputForm nodeData={nodeData} updateNodeProps={updateNodeProps} />}
      {currentTab === "output" && <OutputForm />}
      {currentTab === "readme" && <Readme />}
    </div>
  );
};
export default memo(Component);

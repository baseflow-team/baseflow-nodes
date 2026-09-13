import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";
import OutputForm from "./components/OutputForm";
import Readme from "./components/Readme";

const Component: FC<{ setup: NodeSetup<{}> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { flowInputSchema, flowReturnSchema, updateNodeMeta, updateFlowInputSchema, updateFlowReturnSchema } = setup({
    onBeforeUnload: () => {
      return {
        flowInputSchema,
        flowReturnSchema,
      };
    },
    onBeforeNavigate: (target) => {
      setCurrentTab(target);
    },
  });

  return (
    <div>
      {currentTab === "input" && (
        <InputForm
          flowInputSchema={flowInputSchema}
          flowReturnSchema={flowReturnSchema}
          updateFlowInputSchema={updateFlowInputSchema}
          updateFlowReturnSchema={updateFlowReturnSchema}
          updateNodeMeta={updateNodeMeta}
        />
      )}
      {currentTab === "output" && <OutputForm />}
      {currentTab === "readme" && <Readme />}
    </div>
  );
};
export default memo(Component);

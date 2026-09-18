import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";
import OutputForm from "./components/OutputForm";
import Readme from "./components/Readme";
import type { NodeProps } from "./model";
import { InternalPropsMapping, validateNodeData } from "./model";

const Component: FC<{ setup: NodeSetup<NodeProps> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, updateNodeMeta } = setup({
    onSubmit: () => {
      const props = InternalPropsMapping.out(internalProps);
      const error = validateNodeData(props);
      return {
        nodeData: { ...nodeData, meta: { ...nodeData.meta, configurationErrors: error || undefined }, props },
      };
    },
    onNavigate: (target) => {
      setCurrentTab(target);
    },
  });

  const [internalProps, setInternalProps] = useState(() => InternalPropsMapping.in(nodeData.props));

  return (
    <div>
      {currentTab === "input" && <InputForm internalProps={internalProps} setInternalProps={setInternalProps} updateNodeMeta={updateNodeMeta} />}
      {currentTab === "output" && <OutputForm />}
      {currentTab === "readme" && <Readme />}
    </div>
  );
};
export default memo(Component);

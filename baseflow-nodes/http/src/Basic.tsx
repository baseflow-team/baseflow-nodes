import type { NodeNavigation, NodeSetup, SchemaModel } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import InputForm from "./components/InputForm";
import OutputForm from "./components/OutputForm";
import Readme from "./components/Readme";
import type { NodeProps } from "./model";
import { validateNodeData } from "./model";

const Component: FC<{ setup: NodeSetup<NodeProps> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, updateNodeProps, updateNodeMeta } = setup({
    onBeforeUnload: () => {
      const error = validateNodeData(nodeData.props);
      return {
        nodeData: { ...nodeData, meta: { ...nodeData.meta, configurationErrors: error || undefined } },
      };
    },
    onBeforeNavigate: (target) => {
      setCurrentTab(target);
    },
  });

  const onOutputChange = useCallback((outputSchema: SchemaModel | undefined) => updateNodeMeta({ outputSchema }), [updateNodeMeta]);

  return (
    <div>
      {currentTab === "input" && <InputForm nodeData={nodeData} updateNodeProps={updateNodeProps} />}
      {currentTab === "output" && <OutputForm outputSchema={nodeData.meta.outputSchema} onChange={onOutputChange} />}
      {currentTab === "readme" && <Readme />}
    </div>
  );
};
export default memo(Component);

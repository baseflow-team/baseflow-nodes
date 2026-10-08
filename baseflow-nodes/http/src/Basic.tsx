import type { NodeNavigation, NodeSetup, SchemaModel, SchemaToolsFilter } from "@baseflow/node-runtime-react";
import { NodeMock, NodeNameplate, SchemaModelForm } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import InputForm from "./components/InputForm";
import type { NodeProps } from "./model";

const toolsFilter: SchemaToolsFilter = (item, parent) => {
  if (!parent) {
    return { addNext: false, addChild: false, edit: false, delete: false };
  }
  if (parent.name === "response") {
    return { addNext: false, addChild: true, edit: false, delete: false };
  }
  return;
};

const Component: FC<{ setup: NodeSetup<NodeProps> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { nodeData, packageInfo, updateNodeProps, updateNodeMeta } = setup({
    onSubmit: () => {
      return {
        nodeData,
      };
    },
    onNavigate: (target) => {
      setCurrentTab(target);
    },
  });

  const onOutputChange = useCallback((outputSchema: SchemaModel | undefined) => updateNodeMeta({ outputSchema }), [updateNodeMeta]);

  return (
    <div>
      {currentTab === "input" && <InputForm nodeData={nodeData} updateNodeProps={updateNodeProps} />}
      {currentTab === "output" && (
        <SchemaModelForm variant="borderless" toolsFilter={toolsFilter} value={nodeData.meta.outputSchema} onChange={onOutputChange} />
      )}
      {currentTab === "mock" && <NodeMock nodeData={nodeData} updateNodeMeta={updateNodeMeta} />}
      {currentTab === "readme" && <NodeNameplate packageInfo={packageInfo} />}
    </div>
  );
};
export default memo(Component);

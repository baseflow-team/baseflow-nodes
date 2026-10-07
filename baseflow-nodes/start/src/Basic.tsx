import type { NodeNavigation, NodeSetup } from "@baseflow/node-runtime-react";
import { NodeNameplate, SchemaShow } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo, useState } from "react";
import InputForm from "./components/InputForm";

const Component: FC<{ setup: NodeSetup<{}> }> = ({ setup }) => {
  const [currentTab, setCurrentTab] = useState<NodeNavigation>("input");
  const { packageInfo, flowInputSchema, flowReturnSchema, updateNodeMeta, updateFlowInputSchema, updateFlowReturnSchema } = setup({
    onSubmit: () => {
      return {
        flowInputSchema,
        flowReturnSchema,
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
          flowInputSchema={flowInputSchema}
          flowReturnSchema={flowReturnSchema}
          updateFlowInputSchema={updateFlowInputSchema}
          updateFlowReturnSchema={updateFlowReturnSchema}
          updateNodeMeta={updateNodeMeta}
        />
      )}
      {currentTab === "output" && flowInputSchema && <SchemaShow schema={flowInputSchema} />}
      {currentTab === "readme" && <NodeNameplate packageInfo={packageInfo} />}
    </div>
  );
};
export default memo(Component);

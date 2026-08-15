import type { INodeConfig } from "@baseflow/react";
import { FlowErrors, getLocale, getNodeDefaultSize, NodeType } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const NodeSize = getNodeDefaultSize();
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.End,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  NodeInputPanel,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize,
        valueReference: { path: "flow" },
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (nodeData.meta.configurationErrors === FlowErrors.returnSchemaChanged) {
      return FlowErrors.returnSchemaChanged;
    }
  },
};

export default config;

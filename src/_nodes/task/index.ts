import type { INodeConfig } from "@baseflow/react";
import { DataType, getLocale, getNodeDefaultSize, NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const NodeSize = getNodeDefaultSize();
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Task,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize,
        outputSchema: { name: "output", type: DataType.Bool },
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    if (!nodeData.props.input) {
      return "Task input is required!";
    }
  },
};

export default config;

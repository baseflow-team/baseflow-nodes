import type { INodeConfig } from "@baseflow/react";
import { getLocale, getNodeDefaultSize, NodeType } from "@baseflow/react";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const NodeSize = getNodeDefaultSize();
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Choice,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize,
      },
      props: {},
    };
  },
  validate() {},
};

export default config;

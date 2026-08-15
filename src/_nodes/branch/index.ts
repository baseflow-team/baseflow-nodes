import type { INodeConfig } from "@baseflow/react";
import { getLocale, getNodeDefaultSize, NodeType } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const NodeSize = getNodeDefaultSize();
const locale = getLocale();

const config: INodeConfig<NodeProps> = {
  version: PKG.version,
  type: NodeType.Branch,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  executor: PKG.executor,
  NodeInputPanel,
  defaultData({ props }) {
    return {
      meta: {
        name: (META[locale ? `${locale}_name` : "name"] || META.name) + (props?.default ? " (Else)" : ""),
        ...NodeSize,
      },
      props: {},
    };
  },
  validate({ nodeData }) {
    const props = nodeData.props;
    if (props.default) {
      return;
    }
    if (!props.conditions) {
      return "条件不能为空";
    }
    if (typeof props.conditions !== "string") {
      for (const groups of props.conditions.groups) {
        for (const item of groups.items) {
          if (!item.source.text || !item.target.text || !item.operator) {
            return "请输入";
          }
        }
      }
    }
  },
};

export default config;

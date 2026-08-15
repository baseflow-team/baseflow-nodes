import type { INodeConfig, IValueSource } from "@baseflow/react";
import { DataType, getLocale, getNodeDefaultSize, NodeType, ValueSource } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { DSLProps, NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const NodeSize = getNodeDefaultSize();
const locale = getLocale();

const config: INodeConfig<NodeProps, DSLProps> = {
  version: PKG.version,
  type: NodeType.Loop,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  NodeInputPanel,
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
  validate({ nodeData }) {
    if (!nodeData.props.source) {
      return "Foreach source is required!";
    }
  },
  propsRender: {
    out(props) {
      const source = props.source?.value.text;
      return { source };
    },
    in(dsl) {
      const { source } = dsl;
      if (source) {
        const sourceType: IValueSource = /\D/.test(source) ? ValueSource.Variable : ValueSource.Template;
        return { source: { name: "source", value: { type: DataType.Array, source: sourceType, text: source }, children: [] } };
      } else {
        return { source: undefined };
      }
    },
  },
};

export default config;

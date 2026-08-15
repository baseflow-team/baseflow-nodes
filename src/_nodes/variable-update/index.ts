import type { INodeConfig } from "@baseflow/react";
import { DataType, getLocale, getNodeDefaultSize, NodeType, ValueSource } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { DSLProps, NodeProps } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const NodeSize = getNodeDefaultSize();
const locale = getLocale();

const config: INodeConfig<NodeProps, DSLProps> = {
  version: PKG.version,
  type: NodeType.VariableUpdate,
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
    if (!nodeData.props.scripts && !nodeData.props.variable) {
      return "Required!";
    }
    if (nodeData.props.scripts) {
      if (!nodeData.props.scripts.text) {
        return "Required!";
      }
    } else {
      if (!nodeData.props.variable!.text) {
        return "Required!";
      }
    }
  },
  propsRender: {
    out(props) {
      if (props.scripts) {
        const scripts = props.scripts?.text;
        return { scripts };
      } else {
        const { action, at } = props;
        const variable = props.variable?.text;
        const removeTargets = props.removeTargets && (typeof props.removeTargets === "number" ? props.removeTargets : props.removeTargets.map((item) => item.value));
        return { variable, action, at, removeTargets };
      }
    },
    in(dsl) {
      const { scripts, variable, action, at, removeTargets } = dsl;
      return {
        scripts: scripts ? { type: DataType.Any, source: ValueSource.Expression, text: scripts } : undefined,
        variable: variable ? { type: DataType.Any, source: ValueSource.Variable, text: variable } : undefined,
        action,
        at,
        removeTargets: removeTargets && (typeof removeTargets === "number" ? removeTargets : removeTargets.map((item) => ({ value: item }))),
      };
    },
  },
};

export default config;

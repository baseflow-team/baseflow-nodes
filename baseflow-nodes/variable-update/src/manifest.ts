import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "VariableUpdate",
  icon: "",
  desc: "变量修改：通过本节点可以修改[变量定义]节点中的变量值.",
  executor: {
    node: "@baseflow-executors/variable-update@0.0.1",
  },
  defaultData: {
    meta: {
      name: "变量修改",
    },
    props: {},
  },
  validate: (nodeData) => {
    if (!nodeData.props.scripts && !nodeData.props.variable) {
      return "Required!";
    }
    if (nodeData.props.scripts) {
      if (!nodeData.props.scripts.text) {
        return "Required!";
      }
    } else {
      if (!nodeData.props.variable?.text) {
        return "Required!";
      }
    }
    return;
  },
  propsRender: {
    in: (dsl) => {
      const { scripts, variable, action, at, removeTargets } = dsl;
      return {
        scripts: scripts ? { type: "ͼANYͼ", source: "ͼEXPRESSIONͼ", text: scripts } : undefined,
        variable: variable ? { type: "ͼANYͼ", source: "ͼVARIABLEͼ", text: variable } : undefined,
        action,
        at,
        removeTargets: removeTargets && (typeof removeTargets === "number" ? removeTargets : removeTargets.map((item: string) => ({ value: item }))),
      };
    },
    out: (props) => {
      if (props.scripts) {
        const scripts = props.scripts?.text;
        return { scripts };
      } else {
        const { action, at } = props;
        const variable = props.variable?.text;
        const removeTargets =
          props.removeTargets && (typeof props.removeTargets === "number" ? props.removeTargets : props.removeTargets.map((item) => item.value));
        return { variable, action, at, removeTargets };
      }
    },
  },
  defaultDsl: {
    nodes: [{ tag: "@baseflow-nodes/variable-update" }],
    sources: { "@baseflow-nodes/variable-update": "@baseflow-nodes/variable-update@*" },
  },
} as NodeManifest<NodeProps>;

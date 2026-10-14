import type { NodeManifest } from "@baseflow/node-runtime-react";
import { DataType, ValueSource } from "../../Constants";
import type { DSLProps, NodeProps } from "./model";

export default {
  type: "VariableUpdate",
  defaultData: {
    meta: {
      name: "变量修改",
    },
    props: {},
  },
  mappingPropsOut(props): DSLProps {
    if (props.scripts) {
      const scripts = props.scripts?.text;
      return { scripts };
    } else {
      const { variablePayload, action, at } = props;
      const variable = props.variable?.text;
      const removeTargets =
        props.removeTargets && (typeof props.removeTargets === "number" ? props.removeTargets : props.removeTargets.map((item) => item.value));
      return { variable, variablePayload, action, at, removeTargets };
    }
  },
  mappingPropsIn(data: DSLProps) {
    const { scripts, variable, variablePayload, action, at, removeTargets } = data;
    return {
      scripts: scripts ? { type: DataType.Any, source: ValueSource.Expression, text: scripts } : undefined,
      variable: variable ? { type: DataType.Any, source: ValueSource.Variable, text: variable } : undefined,
      variablePayload,
      action,
      at,
      removeTargets: removeTargets && (typeof removeTargets === "number" ? removeTargets : removeTargets.map((item) => ({ value: item }))),
    };
  },
  uiForm: "index.js",
} satisfies NodeManifest<NodeProps>;

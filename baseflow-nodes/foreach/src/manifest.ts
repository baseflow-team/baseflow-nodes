import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Loop",
  icon: "",
  desc: "Foreach循环：通过指定一个迭代源来循环执行子节点",
  executor: {
    node: "@baseflow-executors/foreach@0.0.1",
  },
  inputForm: "",
  defaultData: {
    meta: {
      name: "Foreach循环",
    },
    props: {},
  },
  validate: (nodeData) => {
    if (!nodeData.props.source) {
      return { error: "Foreach source is required!" };
    }
    return;
  },
  propsRender: {
    in: (dsl) => {
      const { source } = dsl;
      if (source) {
        const sourceType = /D/.test(source) ? "ͼVARIABLEͼ" : "ͼTEMPLATEͼ";
        return { source: { name: "source", value: { type: "ͼARRAYͼ", source: sourceType, text: source }, children: [] } };
      } else {
        return { source: undefined };
      }
    },
    out: (props) => {
      const source = props.source?.value.text;
      return { source };
    },
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/foreach" }], sources: { "@baseflow-nodes/foreach": "@baseflow-nodes/foreach@*" } },
} as NodeManifest<NodeProps>;

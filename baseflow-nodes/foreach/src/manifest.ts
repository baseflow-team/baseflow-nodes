import type { IValueSource, NodeManifest } from "@baseflow/node-runtime-react";
import { DataType, ValueSource } from "../../Constants";
import type { DSLProps, NodeProps } from "./model";

export default {
  type: "Loop",
  defaultData: {
    meta: {
      name: "Foreach循环",
      configurationErrors: "Please set the iteration source...",
    },
    props: {},
  },
  uiForm: "index.js",
  mappingPropsOut(props): DSLProps {
    const source = props.source?.value.text;
    return { source };
  },
  mappingPropsIn(data: DSLProps) {
    const { source } = data;
    if (source) {
      const sourceType: IValueSource = /\D/.test(source) ? ValueSource.Variable : ValueSource.Template;
      return { source: { name: "source", value: { type: DataType.Array, source: sourceType, text: source }, children: [] } };
    } else {
      return { source: undefined };
    }
  },
} satisfies NodeManifest<NodeProps>;

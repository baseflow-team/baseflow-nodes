import type { IValueSource, SchemaValue } from "@baseflow/node-runtime-react";
import { DataType, ValueSource } from "@baseflow/node-runtime-react";
import Lang from "./i18n/en";
export interface NodeProps {
  source?: string;
}

export interface InternalProps {
  source?: SchemaValue;
}

export function validateNodeData(props: NodeProps): string | undefined {
  if (!props.source) {
    return Lang.iterationSourceRequire;
  }
  return;
}

export const InternalPropsMapping = {
  in(nodeProps: NodeProps): InternalProps {
    const { source } = nodeProps;
    if (source) {
      const sourceType: IValueSource = /\D/.test(source) ? ValueSource.Variable : ValueSource.Template;
      return { source: { name: "source", value: { type: DataType.Array, source: sourceType, text: source }, children: [] } };
    } else {
      return { source: undefined };
    }
  },
  out(internalProps: InternalProps): NodeProps {
    const source = internalProps.source?.value.text;
    return { source };
  },
};

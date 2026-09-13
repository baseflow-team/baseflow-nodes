import type { INodeMeta, SchemaModel, SchemaValue, ValueConfig } from "@baseflow/node-runtime-react";
import { DataType, KeyValues, SchemaValueForm, SuperInput, useEvent, ValueSource } from "@baseflow/node-runtime-react";
import type { RadioChangeEvent } from "antd";
import { InputNumber, Radio, Switch, Tooltip } from "antd";
import { CircleQuestionMark } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef } from "react";
import type { InternalProps } from "../model";
import styles from "./index.module.scss";

const Actions = [
  { label: "覆盖原值", value: "assign" },
  { label: "插入一段元素", value: "insert" },
  { label: "移除一段元素", value: "remove" },
];

interface Props {
  internalProps: InternalProps;
  updateInternalProps: (newProps: InternalProps) => void;
  updateNodeMeta: (newMeta: Partial<INodeMeta>) => void;
  getVariableSchema: (variable: string) => Promise<SchemaModel | undefined>;
}

const Component: FC<Props> = ({ internalProps, updateInternalProps, updateNodeMeta, getVariableSchema }) => {
  const inited = useRef(false);

  const onModeChange = useEvent((useScripts: boolean) => {
    if (useScripts) {
      updateInternalProps({
        scripts: { type: DataType.Any, source: ValueSource.Expression, text: "" },
        variable: undefined,
        action: undefined,
        at: undefined,
        removeTargets: undefined,
      });
      updateNodeMeta({ summary: "scripts" });
    } else {
      updateInternalProps({ scripts: undefined });
      updateNodeMeta({ summary: undefined });
    }
  });
  const onScriptsChange = useEvent((scripts: ValueConfig) => {
    updateInternalProps({ scripts });
  });
  const onVariableChange = useEvent((variable: ValueConfig) => {
    updateInternalProps({ variable, action: undefined, at: undefined, removeTargets: undefined });
    updateNodeMeta({ valueReference: undefined });
  });
  const onActionChange = useEvent((e: RadioChangeEvent) => {
    const action: "assign" | "insert" | "remove" = e.target.value;
    if (action === "remove") {
      updateInternalProps({ action });
      updateNodeMeta({ valueReference: undefined });
    } else {
      updateInternalProps({ action, removeTargets: undefined });
    }
  });
  const onAtChange = useEvent((at: number | null) => {
    updateInternalProps({ at: at || undefined });
  });

  const onRemoveKeysChange = useEvent((keys: { value: string; label?: string | undefined }[]) => {
    updateInternalProps({ removeTargets: keys });
  });

  const onRemoveLengthChange = useEvent((num: number | null) => {
    updateInternalProps({ removeTargets: num || undefined });
  });

  const onVariableValueChange = useEvent((value?: SchemaValue) => {
    updateNodeMeta({ valueReference: { path: internalProps.variable!.text, value } });
  });

  const variableSchema = useMemo(async () => {
    const text = internalProps.variable?.text;
    if (text) {
      const schema = await getVariableSchema(text);
      if (inited.current && schema) {
        updateNodeMeta({
          valueReference: {
            path: text,
            value: { name: schema.name, value: { type: schema.type, source: ValueSource.Variable, text: "", optional: schema.optional } },
          },
        });
      }
      return schema;
    }
    return undefined;
  }, [internalProps.variable, getVariableSchema, updateNodeMeta]);

  useEffect(() => {
    inited.current = true;
  }, []);

  return <div className={styles.root}></div>;
};
export default memo(Component);

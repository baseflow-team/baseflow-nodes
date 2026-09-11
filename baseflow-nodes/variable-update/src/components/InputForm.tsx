import type { SchemaValue, ValueConfig } from "@baseflow/node-runtime-react";
import { DataType, KeyValues, SchemaValueForm, SuperInput, useEvent, useNodeRuntime, ValueSource } from "@baseflow/node-runtime-react";
import type { RadioChangeEvent } from "antd";
import { InputNumber, Radio, Switch, Tooltip } from "antd";
import { CircleQuestionMark } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef } from "react";
import type { NodeProps } from "../model";
import styles from "./index.module.scss";

const Actions = [
  { label: "覆盖原值", value: "assign" },
  { label: "插入一段元素", value: "insert" },
  { label: "移除一段元素", value: "remove" },
];

const Component: FC = () => {
  const { nodeData, updateNodeProps, updateNodeMeta, getVariableSchema } = useNodeRuntime<NodeProps>();
  const nodeProps = nodeData.props;
  const inited = useRef(false);

  const onModeChange = useEvent((useScripts: boolean) => {
    if (useScripts) {
      updateNodeProps({
        scripts: { type: DataType.Any, source: ValueSource.Expression, text: "" },
        variable: undefined,
        action: undefined,
        at: undefined,
        removeTargets: undefined,
      });
      updateNodeMeta({ summary: "scripts" });
    } else {
      updateNodeProps({ scripts: undefined });
      updateNodeMeta({ summary: undefined });
    }
  });
  const onScriptsChange = useEvent((scripts: ValueConfig) => {
    updateNodeProps({ scripts });
  });
  const onVariableChange = useEvent((variable: ValueConfig) => {
    updateNodeProps({ variable, action: undefined, at: undefined, removeTargets: undefined });
    updateNodeMeta({ valueReference: undefined });
  });
  const onActionChange = useEvent((e: RadioChangeEvent) => {
    const action: "assign" | "insert" | "remove" = e.target.value;
    if (action === "remove") {
      updateNodeProps({ action });
      updateNodeMeta({ valueReference: undefined });
    } else {
      updateNodeProps({ action, removeTargets: undefined });
    }
  });
  const onAtChange = useEvent((at: number | null) => {
    updateNodeProps({ at: at || undefined });
  });

  const onRemoveKeysChange = useEvent((keys: { value: string; label?: string | undefined }[]) => {
    updateNodeProps({ removeTargets: keys });
  });

  const onRemoveLengthChange = useEvent((num: number | null) => {
    updateNodeProps({ removeTargets: num || undefined });
  });

  const onVariableValueChange = useEvent((value?: SchemaValue) => {
    updateNodeMeta({ valueReference: { path: nodeProps.variable!.text, value } });
  });

  const variableSchema = useMemo(async () => {
    const text = nodeProps.variable?.text;
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
  }, [nodeProps.variable, getVariableSchema, updateNodeMeta]);

  useEffect(() => {
    inited.current = true;
  }, []);

  return <div className={styles.root}></div>;
};
export default memo(Component);

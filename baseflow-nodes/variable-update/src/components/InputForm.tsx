import type { INodeMeta, SchemaModel, SchemaValue, ValueConfig } from "@baseflow/node-runtime-react";
import { DataType, KeyValues, SchemaValueForm, SuperInput, useEvent, ValueSource } from "@baseflow/node-runtime-react";
import { Group, NumberInput, Radio, Switch, Tooltip } from "@mantine/core";
import { CircleQuestionMark } from "lucide-react";
import type { ChangeEvent, FC } from "react";
import { memo, useEffect, useState } from "react";
import { FormItem } from "widgets-mantine";
import type { NodeProps } from "../model";
import styles from "./index.module.scss";

interface Props {
  nodeProps: NodeProps;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
  updateNodeMeta: (newMeta: Partial<INodeMeta>) => void;
  getVariableSchema: (variable: string) => Promise<SchemaModel | undefined>;
}

const Component: FC<Props> = ({ nodeProps, updateNodeProps, updateNodeMeta, getVariableSchema }) => {
  const [variableSchema, setVariableSchema] = useState<SchemaModel>();

  const onModeChange = useEvent((event: ChangeEvent<any>) => {
    const useScripts = event.currentTarget.checked;
    updateNodeProps({
      scripts: useScripts ? { type: DataType.Any, source: ValueSource.Expression, text: "" } : undefined,
      variable: undefined,
      variablePayload: undefined,
      action: undefined,
      at: undefined,
      removeTargets: undefined,
    });
    updateNodeMeta({ watchExternalProps: undefined, summary: useScripts ? "scripts" : undefined });
  });

  const onScriptsChange = useEvent((scripts: ValueConfig) => {
    updateNodeProps({ scripts });
  });

  const onVariableChange = useEvent((variable: ValueConfig) => {
    updateNodeProps({ scripts: undefined, variable, variablePayload: undefined, action: undefined, at: undefined, removeTargets: undefined });
    updateNodeMeta({ watchExternalProps: undefined });
    const text = variable.text;
    if (text) {
      getVariableSchema(text).then((schema) => {
        if (schema) {
          setVariableSchema(schema);
          const [nodeId] = text.split(/[.[]/, 1);
          updateNodeMeta({
            watchExternalProps: {
              [nodeId]: {
                outputSchema: "The variable schema has been modified and needs to be confirmed",
              },
            },
          });
        }
      });
    }
  });

  const onActionChange = useEvent((value: string) => {
    const action = value as "assign" | "insert" | "remove";
    if (action === "remove") {
      updateNodeProps({ action, variablePayload: undefined });
    } else if (action === "assign") {
      updateNodeProps({ action, at: undefined, removeTargets: undefined });
    } else {
      updateNodeProps({ action, removeTargets: undefined });
    }
  });

  const onAtChange = useEvent((at: number | string) => {
    updateNodeProps({ at: parseInt(`${at}`, 10) || undefined });
  });

  const onRemoveKeysChange = useEvent((keys: { value: string; label?: string | undefined }[]) => {
    updateNodeProps({ removeTargets: keys });
  });

  const onRemoveLengthChange = useEvent((num: number | string) => {
    updateNodeProps({ removeTargets: parseInt(`${num}`, 10) || undefined });
  });

  const onVariablePayloadChange = useEvent((variablePayload?: SchemaValue) => {
    updateNodeProps({ variablePayload });
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    const text = nodeProps.variable?.text;
    if (text) {
      getVariableSchema(text).then((schema) => {
        if (schema) {
          // 规范化检查，防止外部 schema 变化后，本节点 props 原值不合法
          if (schema.type === DataType.Array) {
            if (typeof nodeProps.removeTargets === "object") {
              updateNodeProps({ removeTargets: undefined });
            }
          } else if (schema.type === DataType.Map) {
            if (typeof nodeProps.removeTargets === "number" || nodeProps.at) {
              updateNodeProps({ at: undefined, removeTargets: undefined });
            }
          } else {
            if (nodeProps.action === "assign") {
              if (nodeProps.at && nodeProps.removeTargets) {
                updateNodeProps({ at: undefined, removeTargets: undefined });
              }
            } else {
              updateNodeProps({ variablePayload: undefined, action: undefined, at: undefined, removeTargets: undefined });
            }
          }

          setVariableSchema(schema);
        }
      });
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className="switch-mode">
        <Switch label="脚本模式" checked={!!nodeProps.scripts} onChange={onModeChange} />
      </div>
      {nodeProps.scripts ? (
        <FormItem required label="使用(JS)修改变量节点中的变量值">
          <SuperInput
            height={100}
            hideIcon
            runtime="script"
            brand="variable"
            dataType={DataType.Any}
            value={nodeProps.scripts}
            onChange={onScriptsChange}
          />
        </FormItem>
      ) : (
        <>
          <FormItem required label="选择要修改的变量">
            <SuperInput
              hideIcon
              sourceType="variable"
              brand="variable"
              dataType={DataType.Any}
              value={nodeProps.variable}
              onChange={onVariableChange}
            />
          </FormItem>

          {variableSchema && (
            <>
              {variableSchema.type === DataType.Array || variableSchema.type === DataType.Map ? (
                <div className="actions">
                  <Radio.Group size="xs" value={nodeProps.action || "assign"} onChange={onActionChange}>
                    <Group>
                      <Radio size="xs" label="覆盖原值" value="assign" />
                      <Radio size="xs" label="插入一段元素" value="insert" />
                      <Radio size="xs" label="移除一段元素" value="remove" />
                    </Group>
                  </Radio.Group>
                  {variableSchema.type === DataType.Array && nodeProps.action !== "assign" && (
                    <div className={`${styles.root}__position`}>
                      <Tooltip label="正数从头部开始，负数从尾部开始">
                        <CircleQuestionMark size={12} className="help-icon" />
                      </Tooltip>
                      <span>位置从</span>
                      <NumberInput size="xs" style={{ width: "60px" }} value={nodeProps.at || 0} onChange={onAtChange} />
                      <span>开始</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="actions">
                  <Radio.Group size="xs" value={nodeProps.action || "assign"} onChange={onActionChange}>
                    <Radio size="xs" label="覆盖原值" value="assign" />
                  </Radio.Group>
                </div>
              )}
              <div className={`${styles.root}__payload`}>
                {nodeProps.action !== "remove" ? (
                  <SchemaValueForm variant="filled" schema={variableSchema} value={nodeProps.variablePayload} onChange={onVariablePayloadChange} />
                ) : variableSchema.type === DataType.Array ? (
                  <div className="remove-targets">
                    <div className="title">输入要移除元素的个数：</div>
                    <NumberInput min={1} value={nodeProps.removeTargets?.toString() || 1} onChange={onRemoveLengthChange} />
                  </div>
                ) : (
                  <div className="remove-targets">
                    <div className="title">添加要移除元素的KEY：</div>
                    <KeyValues hideLabel valuePlaceholder="key" value={nodeProps.removeTargets as any} onChange={onRemoveKeysChange} />
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default memo(Component);

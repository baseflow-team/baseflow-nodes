"use no memo";
import type { INodeInputPanel, SchemaValue, ValueConfig } from "@baseflow/react";
import { DataType, KeyValues, SchemaValueForm, SuperInput, useEvent, useGraph, useNode, ValueSource } from "@baseflow/react";
import type { RadioChangeEvent } from "antd";
import { InputNumber, Radio, Switch, Tooltip } from "antd";
import { CircleQuestionMark } from "lucide-react";
import { memo, useEffect, useMemo, useRef } from "react";
import type { NodeProps } from "../model";
import styles from "./index.module.scss";

const Actions = [
  { label: "覆盖原值", value: "assign" },
  { label: "插入一段元素", value: "insert" },
  { label: "移除一段元素", value: "remove" },
];

const Component: INodeInputPanel<NodeProps> = ({ nodeData }) => {
  const { graph } = useGraph();
  const { node } = useNode(nodeData.id);
  const nodeProps = nodeData.props;
  const inited = useRef(false);

  const onModeChange = useEvent((useScripts: boolean) => {
    if (useScripts) {
      node.updateProps({
        scripts: { type: DataType.Any, source: ValueSource.Expression, text: "" },
        variable: undefined,
        action: undefined,
        at: undefined,
        removeTargets: undefined,
      });
      node.updateMeta({ summary: "scripts" });
    } else {
      node.updateProps({ scripts: undefined });
      node.updateMeta({ summary: undefined });
    }
  });
  const onScriptsChange = useEvent((scripts: ValueConfig) => {
    node.updateProps({ scripts });
  });
  const onVariableChange = useEvent((variable: ValueConfig) => {
    node.updateProps({ variable, action: undefined, at: undefined, removeTargets: undefined });
    node.updateMeta({ valueReference: undefined });
  });
  const onActionChange = useEvent((e: RadioChangeEvent) => {
    const action: "assign" | "insert" | "remove" = e.target.value;
    if (action === "remove") {
      node.updateProps({ action });
      node.updateMeta({ valueReference: undefined });
    } else {
      node.updateProps({ action, removeTargets: undefined });
    }
  });
  const onAtChange = useEvent((at: number | null) => {
    node.updateProps({ at: at || undefined });
  });

  const onRemoveKeysChange = useEvent((keys: { value: string; label?: string | undefined }[]) => {
    node.updateProps({ removeTargets: keys });
  });

  const onRemoveLengthChange = useEvent((num: number | null) => {
    node.updateProps({ removeTargets: num || undefined });
  });

  const onVariableValueChange = useEvent((value?: SchemaValue) => {
    node.updateMeta({ valueReference: { path: nodeProps.variable!.text, value } });
  });

  const variableSchema = useMemo(() => {
    const text = nodeProps.variable?.text;
    if (text) {
      const schema = graph.getVariableSchema(text);
      if (inited.current && schema) {
        node.updateMeta({
          valueReference: {
            path: text,
            value: { name: schema.name, value: { type: schema.type, source: ValueSource.Variable, text: "", optional: schema.optional } },
          },
        });
      }
      return schema;
    }
    return undefined;
  }, [node, nodeProps.variable, graph]);

  useEffect(() => {
    inited.current = true;
  }, []);

  return (
    <div className={styles.variableUpdate}>
      <div className="switch-mode">
        <Switch unCheckedChildren="脚本模式" checkedChildren="脚本模式" value={!!nodeProps.scripts} onChange={onModeChange} />
      </div>
      {nodeProps.scripts ? (
        <div className="nd-form-layout">
          <div className="form-item">
            <div className="label-item require">使用(JS)修改变量节点中的变量值</div>
            <div className="input-item">
              <SuperInput
                height={100}
                hideIcon
                runtime="script"
                brand="variable"
                dataType={DataType.Any}
                value={nodeProps.scripts}
                onChange={onScriptsChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="nd-form-layout">
          <div className="form-item">
            <div className="label-item require">选择要修改的变量</div>
            <div className="input-item">
              <SuperInput
                hideIcon
                sourceType="variable"
                brand="variable"
                dataType={DataType.Any}
                value={nodeProps.variable}
                onChange={onVariableChange}
              />
            </div>
          </div>
          {variableSchema && (
            <div className="form-item">
              {variableSchema.type === DataType.Array || variableSchema.type === DataType.Map ? (
                <div className="actions">
                  <Radio.Group options={Actions} value={nodeProps.action || "assign"} onChange={onActionChange} />
                  {variableSchema.type === DataType.Array && (nodeProps.action || "assign") !== "assign" && (
                    <div className="position">
                      <Tooltip title="正数从头部开始，负数从尾部开始">
                        <CircleQuestionMark size={12} className="help-icon" />
                      </Tooltip>
                      <span>位置从</span>
                      <InputNumber size="small" value={nodeProps.at || 0} onChange={onAtChange} />
                      <span>开始</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="actions">
                  <Radio.Group options={Actions.slice(0, 1)} value="assign" />
                </div>
              )}
              <div className="input-item">
                {nodeProps.action !== "remove" ? (
                  <SchemaValueForm
                    variant="filled"
                    schema={variableSchema}
                    value={nodeData.meta.valueReference?.value}
                    onChange={onVariableValueChange}
                  />
                  // biome-ignore lint/style/noNestedTernary: <>
                ) : variableSchema.type === DataType.Array ? (
                  <div className="remove-targets">
                    <div className="title">输入要移除元素的个数：</div>
                    <InputNumber style={{ width: "100%" }} value={nodeProps.removeTargets || (1 as any)} onChange={onRemoveLengthChange} />
                  </div>
                ) : (
                  <div className="remove-targets">
                    <div className="title">添加要移除元素的KEY：</div>
                    <KeyValues hideLabel valuePlaceholder="key" value={nodeProps.removeTargets as any} onChange={onRemoveKeysChange} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default memo(Component);

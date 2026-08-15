"use no memo";
import type { INodeInputPanel, SchemaModel } from "@baseflow/react";
import { DataType, KeyValues, RequiredRule, SchemaModelForm, useEvent, useNode } from "@baseflow/react";
import { BlurInput, PathToRegexp, StringSelect } from "@baseflow/widgets";
import type { FormInstance } from "antd";
import { Form } from "antd";
import { ClipboardCopy } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import type { NodeProps } from "../model";
import { ContentTypeOptions, DefaultHeaders, MethodOptions } from "../model";

const DefaultContentSchema: SchemaModel = { name: "body", type: DataType.Object };

function buildKeyValueSchema(keyValues?: { value: string; label?: string }[]): SchemaModel[] | undefined {
  if (keyValues) {
    const duplicates: { [key: string]: boolean } = {};
    const arr: SchemaModel[] = keyValues
      .filter((item) => {
        if (item.value && !duplicates[item.value]) {
          duplicates[item.value] = true;
          return true;
        }
        return false;
      })
      .map((item) => ({ name: item.value, type: DataType.String }));
    if (arr.length) {
      return arr;
    }
  }
}

function buildPathSchema(path?: string): SchemaModel[] | undefined {
  if (path) {
    const { keys } = PathToRegexp.pathToRegexp(path);
    const arr = keys.filter((item) => item.type === "param").map((item) => ({ name: item.name, type: DataType.String }));
    if (arr.length) {
      return arr;
    }
  }
}

function mergeSchema(outputSchema: SchemaModel, data: Partial<{ [key: string]: SchemaModel[] | undefined }>) {
  const children = outputSchema.children!;
  return {
    ...outputSchema,
    children: [
      data.headers ? { ...children[0], children: DefaultHeaders.concat(data.headers) } : children[0],
      data.params ? { ...children[1], children: data.params } : children[1],
      data.queries ? { ...children[2], children: data.queries } : children[2],
      data.cookies ? { ...children[3], children: data.cookies } : children[3],
      data.body ? { ...children[4], children: data.body } : children[4],
    ],
  };
}

const Component: INodeInputPanel<NodeProps> = ({ nodeData, rebuildKey }) => {
  const { node } = useNode(nodeData.id);
  const nodeProps = nodeData.props;
  const formRef = useRef<FormInstance>(null);
  const inited = useRef(false);

  const onFormChange = useEvent((updates: Partial<NodeProps>) => {
    node.updateProps(updates);
    const outputSchema = nodeData.meta.outputSchema!;
    if (Object.prototype.hasOwnProperty.call(updates, "path")) {
      node.updateOutputSchema(mergeSchema(outputSchema, { params: buildPathSchema(updates.path) }));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "headers")) {
      node.updateOutputSchema(mergeSchema(outputSchema, { headers: buildKeyValueSchema(updates.headers) }));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "queries")) {
      node.updateOutputSchema(mergeSchema(outputSchema, { queries: buildKeyValueSchema(updates.queries) }));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "cookies")) {
      node.updateOutputSchema(mergeSchema(outputSchema, { cookies: buildKeyValueSchema(updates.cookies) }));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "contentSchema")) {
      node.updateOutputSchema(mergeSchema(outputSchema, { body: updates.contentSchema?.children }));
    }
  });

  useEffect(() => {
    formRef.current?.validateFields();
  }, []);

  useEffect(() => {
    inited.current = true;
  }, []);

  return (
    <div>
      <Form
        ref={formRef}
        key={rebuildKey}
        className="nd-form"
        layout="vertical"
        initialValues={nodeProps}
        autoComplete="off"
        onValuesChange={onFormChange}
      >
        <Form.Item label="监听地址" tooltip="path" name="path" rules={RequiredRule}>
          <BlurInput allowClear prefix="BaseUrl / " addonAfter={<ClipboardCopy size="16px" />} placeholder="输入规划的url路径" />
        </Form.Item>
        <Form.Item label="监听方法" tooltip="method" name="methods" rules={RequiredRule}>
          <StringSelect block multiple options={MethodOptions} />
        </Form.Item>
        <Form.Item label="自定义请求头" tooltip="header" name="headers">
          <KeyValues variant="filled" hideLabel valuePlaceholder="key" />
        </Form.Item>
        <Form.Item label="Url查询参数" tooltip="query" name="queries">
          <KeyValues variant="filled" hideLabel valuePlaceholder="key" />
        </Form.Item>
        <Form.Item label="Cookies" tooltip="cookies" name="cookies">
          <KeyValues variant="filled" hideLabel valuePlaceholder="key" />
        </Form.Item>
        <Form.Item label="请求体类型" tooltip="content-type" name="contentType">
          <StringSelect variant="filled" block options={ContentTypeOptions} />
        </Form.Item>
        <Form.Item label="请求体结构" tooltip="content-schema" name="contentSchema">
          <SchemaModelForm variant="filled" defaultValue={DefaultContentSchema} />
        </Form.Item>
      </Form>
    </div>
  );
};
export default memo(Component);

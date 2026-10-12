import type { INodeMeta, SchemaModel } from "@baseflow/node-runtime-react";
import { DataType, KeyValues, SchemaModelForm, useEvent } from "@baseflow/node-runtime-react";
import { MultiSelect, Select, TextInput } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";
import { FormItem } from "widgets-mantine";
import type { IContentType, IMethod, InternalProps } from "../model";
import { ContentTypeOptions, DefaultHeaders, MethodOptions, parsePathParams } from "../model";

const DefaultContentSchema: SchemaModel = { name: "body", type: DataType.Object };

type SchemaUpdates = Partial<{ [key: string]: SchemaModel[] | undefined }>;

function buildKeyValueSchema(keyValues?: { value: string; label?: string }[], reserved: SchemaModel[] = []): SchemaModel[] | undefined {
  if (keyValues) {
    const duplicates: { [key: string]: boolean } = Object.fromEntries(reserved.map((item) => [item.name, true]));
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
  return;
}

function buildPathSchema(path?: string): SchemaModel[] | undefined {
  const params = path ? parsePathParams(path) : undefined;
  if (params?.length) {
    return params.map((name) => ({ name, type: DataType.String }));
  }
  return;
}

function getPathError(path?: string): string | null {
  if (!path) {
    return "请输入监听地址";
  }
  if (!parsePathParams(path)) {
    return "监听地址格式不正确";
  }
  return null;
}

// updates 中没有的 key 表示未修改；有 key 但值为空表示已清空，需回到默认结构。
function mergeSchema(outputSchema: SchemaModel, updates: SchemaUpdates): SchemaModel {
  return {
    ...outputSchema,
    children: outputSchema.children!.map((item) => {
      if (!Object.hasOwn(updates, item.name)) {
        return item;
      }
      const children = item.name === "headers" ? DefaultHeaders.concat(updates.headers || []) : updates[item.name];
      const { children: _, ...others } = item;
      return children?.length ? { ...others, children } : others;
    }),
  };
}

interface Props {
  internalProps: InternalProps;
  outputSchema: SchemaModel;
  setInternalProps: (newProps: InternalProps) => void;
  updateNodeMeta: (newMeta: Partial<INodeMeta>) => void;
}

const Component: FC<Props> = ({ internalProps, setInternalProps, outputSchema, updateNodeMeta }) => {
  const onFormChange = useEvent((updates: Partial<InternalProps>) => {
    setInternalProps({ ...internalProps, ...updates });
    const schemaUpdates: SchemaUpdates = {};
    if (Object.hasOwn(updates, "path")) {
      schemaUpdates.params = buildPathSchema(updates.path);
    }
    if (Object.hasOwn(updates, "headers")) {
      schemaUpdates.headers = buildKeyValueSchema(updates.headers, DefaultHeaders);
    }
    if (Object.hasOwn(updates, "queries")) {
      schemaUpdates.queries = buildKeyValueSchema(updates.queries);
    }
    if (Object.hasOwn(updates, "cookies")) {
      schemaUpdates.cookies = buildKeyValueSchema(updates.cookies);
    }
    if (Object.hasOwn(updates, "contentSchema")) {
      schemaUpdates.body = updates.contentSchema?.children;
    }
    if (Object.keys(schemaUpdates).length) {
      updateNodeMeta({ outputSchema: mergeSchema(outputSchema, schemaUpdates) });
    }
  });

  return (
    <div>
      <FormItem required label="监听地址" tooltip="path">
        <TextInput
          required
          value={internalProps.path ?? ""}
          onChange={(event) => onFormChange({ path: event.currentTarget.value })}
          error={getPathError(internalProps.path)}
          autoComplete="off"
          placeholder="输入规划的url路径"
        />
      </FormItem>
      <FormItem required label="监听方法" tooltip="methods">
        <MultiSelect
          value={internalProps.methods}
          onChange={(methods) => onFormChange({ methods: methods as IMethod[] })}
          error={internalProps.methods?.length ? null : "请选择监听方法"}
          required
          data={MethodOptions}
        />
      </FormItem>
      <FormItem label="自定义请求头" tooltip="headers">
        <KeyValues value={internalProps.headers} onChange={(headers) => onFormChange({ headers })} hideLabel valuePlaceholder="key" />
      </FormItem>
      <FormItem label="Url查询参数" tooltip="queries">
        <KeyValues
          value={internalProps.queries}
          onChange={(queries) => onFormChange({ queries })}
          variant="filled"
          hideLabel
          valuePlaceholder="key"
        />
      </FormItem>
      <FormItem label="Cookies" tooltip="cookies">
        <KeyValues
          value={internalProps.cookies}
          onChange={(cookies) => onFormChange({ cookies })}
          variant="filled"
          hideLabel
          valuePlaceholder="key"
        />
      </FormItem>
      <FormItem label="请求体类型" tooltip="contentType">
        <Select
          value={internalProps.contentType}
          onChange={(contentType) => onFormChange({ contentType: contentType as IContentType })}
          variant="filled"
          data={ContentTypeOptions}
        />
      </FormItem>
      <FormItem label="请求体结构" tooltip="contentSchema">
        <SchemaModelForm
          value={internalProps.contentSchema}
          onChange={(contentSchema) => onFormChange({ contentSchema })}
          variant="filled"
          defaultValue={DefaultContentSchema}
        />
      </FormItem>
    </div>
  );
};
export default memo(Component);

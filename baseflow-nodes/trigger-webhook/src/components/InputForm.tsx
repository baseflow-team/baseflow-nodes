import type { INodeMeta, SchemaModel } from "@baseflow/node-runtime-react";
import { DataType, formatLang, KeyValues, SchemaModelForm, useEvent } from "@baseflow/node-runtime-react";
import { MultiSelect, Select, TextInput } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";
import { FormItem } from "widgets-mantine";
import Lang from "../i18n/en";
import type { IContentType, IMethod, NodeProps } from "../model";
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
    return formatLang(Lang.fieldRequired, { field: "path" });
  }
  if (!parsePathParams(path)) {
    return Lang.pathInvalid;
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
  nodeProps: NodeProps;
  outputSchema: SchemaModel;
  updateNodeProps: (newProps: Partial<NodeProps>) => void;
  updateNodeMeta: (newMeta: Partial<INodeMeta>) => void;
}

const Component: FC<Props> = ({ nodeProps, outputSchema, updateNodeProps, updateNodeMeta }) => {
  const onFormChange = useEvent((updates: Partial<NodeProps>) => {
    updateNodeProps(updates);
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
      <FormItem required label={Lang.path} tooltip="path">
        <TextInput
          required
          value={nodeProps.path ?? ""}
          onChange={(event) => onFormChange({ path: event.currentTarget.value })}
          error={getPathError(nodeProps.path)}
          autoComplete="off"
          placeholder={Lang.pathTips}
        />
      </FormItem>
      <FormItem required label={Lang.methods} tooltip="methods">
        <MultiSelect
          value={nodeProps.methods}
          onChange={(methods) => onFormChange({ methods: methods as IMethod[] })}
          error={nodeProps.methods?.length ? null : formatLang(Lang.fieldRequired, { field: "methods" })}
          required
          data={MethodOptions}
        />
      </FormItem>
      <FormItem label={Lang.headers} tooltip="headers">
        <KeyValues value={nodeProps.headers} onChange={(headers) => onFormChange({ headers })} hideLabel valuePlaceholder="key" />
      </FormItem>
      <FormItem label={Lang.queries} tooltip="queries">
        <KeyValues value={nodeProps.queries} onChange={(queries) => onFormChange({ queries })} variant="filled" hideLabel valuePlaceholder="key" />
      </FormItem>
      <FormItem label="Cookies" tooltip="cookies">
        <KeyValues value={nodeProps.cookies} onChange={(cookies) => onFormChange({ cookies })} variant="filled" hideLabel valuePlaceholder="key" />
      </FormItem>
      <FormItem label={Lang.contentType} tooltip="contentType">
        <Select
          value={nodeProps.contentType}
          onChange={(contentType) => onFormChange({ contentType: contentType as IContentType })}
          variant="filled"
          data={ContentTypeOptions}
        />
      </FormItem>
      <FormItem label={Lang.contentSchema} tooltip="contentSchema">
        <SchemaModelForm
          value={nodeProps.contentSchema}
          onChange={(contentSchema) => onFormChange({ contentSchema })}
          variant="filled"
          defaultValue={DefaultContentSchema}
        />
      </FormItem>
    </div>
  );
};
export default memo(Component);

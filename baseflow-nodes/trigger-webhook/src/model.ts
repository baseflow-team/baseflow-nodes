import type { SchemaModel, SchemaValue } from "@baseflow/node-runtime-react";
import { DataType, formatLang, matchSchemaValueByModel } from "@baseflow/node-runtime-react";
import { pathToRegexp } from "path-to-regexp";
import Lang from "./i18n/en";

export type IMethod = "get" | "post" | "put" | "delete";

export type IContentType = "json" | "xml" | "form-data" | "form-urlencoded";

export const MethodOptions = [
  { label: "get", value: "get" },
  { label: "post", value: "post" },
  { label: "put", value: "put" },
  { label: "delete", value: "delete" },
];

export const ContentTypeOptions = [
  { label: "json", value: "json" },
  { label: "xml", value: "xml" },
  { label: "form-data", value: "form-data" },
  { label: "form-urlencoded", value: "form-urlencoded" },
];

export const DefaultHeaders: SchemaModel[] = [
  { name: "url", type: DataType.String },
  { name: "protocol", type: DataType.String },
  { name: "hostname", type: DataType.String },
  { name: "port", type: DataType.Number },
  { name: "path", type: DataType.String },
  { name: "method", type: DataType.String },
  { name: "queryString", type: DataType.String },
  { name: "cookieString", type: DataType.String },
  { name: "authorization", type: DataType.String },
];

/** 返回路径中的参数名；路径格式不合法时返回 undefined。 */
export function parsePathParams(path: string): string[] | undefined {
  try {
    return pathToRegexp(path)
      .keys.filter((item) => item.type === "param")
      .map((item) => item.name);
  } catch {
    return;
  }
}

export interface NodeProps {
  path?: string;
  methods: IMethod[];
  headers?: { value: string }[];
  queries?: { value: string }[];
  cookies?: { value: string }[];
  contentType: IContentType;
  contentSchema?: SchemaModel;
  flowInputValue?: SchemaValue; // 将本触发器输出映射到流程入参
}

export function validateNodeData(flowInputSchema: SchemaModel | undefined, props: NodeProps): string | undefined {
  if (flowInputSchema) {
    if (props.flowInputValue) {
      return matchSchemaValueByModel(flowInputSchema, props.flowInputValue) || undefined;
    } else {
      return Lang.mappingFlowInput;
    }
  } else {
    if (props.flowInputValue) {
      return Lang.flowInputValueMismatch;
    }
  }
  if (!props.path) {
    return formatLang(Lang.fieldRequired, { field: "path" });
  }
  if (!parsePathParams(props.path)) {
    return Lang.pathInvalid;
  }
  if (!props.methods?.length) {
    return formatLang(Lang.fieldRequired, { field: "methods" });
  }
  if (props.headers) {
    for (const item of props.headers) {
      if (!item.value) {
        return formatLang(Lang.fieldRequired, { field: "headers.key" });
      }
    }
  }
  if (props.queries) {
    for (const item of props.queries) {
      if (!item.value) {
        return formatLang(Lang.fieldRequired, { field: "queries.key" });
      }
    }
  }
  if (props.cookies) {
    for (const item of props.cookies) {
      if (!item.value) {
        return formatLang(Lang.fieldRequired, { field: "cookies.key" });
      }
    }
  }
  return;
}

export interface DSLProps {
  path?: string;
  methods: IMethod[];
  headers?: string[];
  queries?: string[];
  cookies?: string[];
  contentType: IContentType;
  contentSchema?: SchemaModel;
  flowInputValue?: SchemaValue; // 将本触发器输出映射到流程入参
}

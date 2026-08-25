import type { INodeProps, SchemaModel } from "@baseflow/react";
import { DataType } from "@baseflow/react";

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
export interface NodeProps extends INodeProps {
  path?: string;
  methods: IMethod[];
  headers?: { value: string }[];
  queries?: { value: string }[];
  cookies?: { value: string }[];
  contentType: IContentType;
  contentSchema?: SchemaModel;
}

export interface DSLProps {
  path?: string;
  methods: IMethod[];
  headers?: string[];
  queries?: string[];
  cookies?: string[];
  contentType: IContentType;
  contentSchema?: SchemaModel;
}

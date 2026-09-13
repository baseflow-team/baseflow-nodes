import type { SchemaModel } from "@baseflow/node-runtime-react";
import { DataType } from "@baseflow/node-runtime-react";

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

export interface NodeProps {
  path?: string;
  methods: IMethod[];
  headers?: string[];
  queries?: string[];
  cookies?: string[];
  contentType: IContentType;
  contentSchema?: SchemaModel;
}

export interface InternalProps {
  path?: string;
  methods: IMethod[];
  headers?: { value: string }[];
  queries?: { value: string }[];
  cookies?: { value: string }[];
  contentType: IContentType;
  contentSchema?: SchemaModel;
}

export function validateNodeData(props: NodeProps): string | undefined {
  if (!props.path) {
    return "监听地址不能为空";
  }
  if (!props.methods?.length) {
    return "监听方法不能为空";
  }
  if (props.headers) {
    for (const item of props.headers) {
      if (!item) {
        return "key不能为空";
      }
    }
  }
  if (props.queries) {
    for (const item of props.queries) {
      if (!item) {
        return "key不能为空";
      }
    }
  }
  return;
}

export const InternalPropsMapping = {
  in(nodeProps: NodeProps): InternalProps {
    const { headers, queries, cookies, ...others } = nodeProps;
    return {
      headers: headers?.map((item) => ({ value: item })),
      queries: queries?.map((item) => ({ value: item })),
      cookies: cookies?.map((item) => ({ value: item })),
      ...others,
    };
  },
  out(internalProps: InternalProps): NodeProps {
    const { headers, queries, cookies, ...others } = internalProps;
    return {
      headers: headers?.map((item) => item.value),
      queries: queries?.map((item) => item.value),
      cookies: cookies?.map((item) => item.value),
      ...others,
    };
  },
};

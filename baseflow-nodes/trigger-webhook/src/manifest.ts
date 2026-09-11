import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Trigger",
  icon: "",
  desc: "webhook触发器：让流程能被指定的Http请求触发",
  executor: {
    node: "@baseflow-executors/trigger-webhook@0.0.1",
  },
  inputForm: "index.js",
  defaultData: {
    meta: {
      name: "webhook触发器",
      outputSchema: {
        name: "output",
        type: "ͼOBJECTͼ",
        children: [
          {
            name: "headers",
            type: "ͼOBJECTͼ",
            children: [
              {
                name: "url",
                type: "ͼSTRINGͼ",
              },
              {
                name: "protocol",
                type: "ͼSTRINGͼ",
              },
              {
                name: "hostname",
                type: "ͼSTRINGͼ",
              },
              {
                name: "port",
                type: "ͼNUMBERͼ",
              },
              {
                name: "path",
                type: "ͼSTRINGͼ",
              },
              {
                name: "method",
                type: "ͼSTRINGͼ",
              },
              {
                name: "queryString",
                type: "ͼSTRINGͼ",
              },
              {
                name: "cookieString",
                type: "ͼSTRINGͼ",
              },
              {
                name: "authorization",
                type: "ͼSTRINGͼ",
              },
            ],
          },
          {
            name: "params",
            type: "ͼOBJECTͼ",
          },
          {
            name: "queries",
            type: "ͼOBJECTͼ",
          },
          {
            name: "cookies",
            type: "ͼOBJECTͼ",
          },
          {
            name: "body",
            type: "ͼOBJECTͼ",
          },
        ],
      },
      valueReference: {
        path: "start",
      },
    },
    props: {
      methods: ["post"],
      contentType: "json",
    },
  },
  validate: (nodeData) => {
    const props = nodeData.props;
    if (!props.path) {
      return { error: "监听地址不能为空" };
    }
    if (!props.methods?.length) {
      return { error: "监听方法不能为空" };
    }
    if (props.headers) {
      for (const item of props.headers) {
        if (!item.value) {
          return { error: "key不能为空" };
        }
      }
    }
    if (props.queries) {
      for (const item of props.queries) {
        if (!item.value) {
          return { error: "key不能为空" };
        }
      }
    }
    return;
  },
  propsRender: {
    in: (dsl) => {
      const { headers, queries, cookies, ...others } = dsl;
      return {
        headers: headers?.map((item: string) => ({ value: item })),
        queries: queries?.map((item: string) => ({ value: item })),
        cookies: cookies?.map((item: string) => ({ value: item })),
        ...others,
      };
    },
    out: (props) => {
      const { headers, queries, cookies, ...others } = props;
      return {
        headers: headers?.map((item) => item.value),
        queries: queries?.map((item) => item.value),
        cookies: cookies?.map((item) => item.value),
        ...others,
      };
    },
  },
  defaultDsl: {
    nodes: [{ tag: "@baseflow-nodes/trigger-webhook" }],
    sources: { "@baseflow-nodes/trigger-webhook": "@baseflow-nodes/trigger-webhook@*" },
  },
} as NodeManifest<NodeProps>;

import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Trigger",
  icon: "",
  desc: "webhook触发器：让流程能被指定的Http请求触发",
  executor: {
    node: "@baseflow-executors/trigger-webhook@0.0.1",
  },
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
  defaultDsl: {
    nodes: [{ tag: "@baseflow-nodes/trigger-webhook" }],
    sources: { "@baseflow-nodes/trigger-webhook": "@baseflow-nodes/trigger-webhook@*" },
  },
} as NodeManifest<NodeProps>;

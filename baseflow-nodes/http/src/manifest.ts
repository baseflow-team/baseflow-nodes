import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Task",
  icon: "",
  desc: "HTTP请求：通过置请求参数发送HTTP请求，并输出响应数据",
  executor: {
    node: "@baseflow-executors/http@0.0.1",
  },
  defaultData: {
    meta: {
      name: "HTTP请求",
      outputSchema: {
        name: "output",
        type: "ͼOBJECTͼ",
        children: [
          {
            name: "header",
            type: "ͼOBJECTͼ",
          },
          {
            name: "body",
            type: "ͼOBJECTͼ",
          },
        ],
      },
    },
    props: {},
  },
  uiForm: "index.js",
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/http" }], sources: { "@baseflow-nodes/http": "@baseflow-nodes/http@*" } },
} as NodeManifest<NodeProps>;

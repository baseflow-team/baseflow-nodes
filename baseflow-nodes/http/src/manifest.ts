import type { NodeManifest } from "@baseflow/node-runtime-react";
import type { NodeProps } from "./model";

export default {
  type: "Task",
  icon: "",
  desc: "HTTP请求：通过置请求参数发送HTTP请求，并输出响应数据",
  executor: {
    node: "@baseflow-executors/http@0.0.1",
  },
  inputForm: "index.js",
  outputForm: {
    editable: true,
    toolsFilter: (item, parent) => {
      if (!parent) {
        return { addNext: false, addChild: false, edit: false, delete: false };
      }
      if (parent.name === "response") {
        return { addNext: false, addChild: true, edit: false, delete: false };
      }
      return;
    },
  },
  readme: "M|abc\n- 发送HTTP请求目前仅支持Get Post\n- 参数请使用JSON格式\n",
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
  validate: (nodeData) => {
    if (!nodeData.props.input) {
      return { error: "Http input is required!" };
    }
    return;
  },
  defaultDsl: { nodes: [{ tag: "@baseflow-nodes/http" }], sources: { "@baseflow-nodes/http": "@baseflow-nodes/http@*" } },
} as NodeManifest<NodeProps>;

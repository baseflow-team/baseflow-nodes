import type { INodeConfig } from "@baseflow/react";
import { DataType, FlowErrors, getLocale, getNodeDefaultSize, NodeType } from "@baseflow/react";
import NodeInputPanel from "./components/NodeInputPanel";
import type { DSLProps, NodeProps } from "./model";
import { DefaultHeaders } from "./model";
import PKG from "./package.json";

const META = PKG.baseflow as { [key: string]: string };
const NodeSize = getNodeDefaultSize();
const locale = getLocale();

const config: INodeConfig<NodeProps, DSLProps> = {
  version: PKG.version,
  type: NodeType.Trigger,
  icon: META.icon,
  desc: META[locale ? `${locale}_desc` : "desc"] || META.desc,
  NodeInputPanel,
  executor: PKG.executor,
  defaultData() {
    return {
      meta: {
        name: META[locale ? `${locale}_name` : "name"] || META.name,
        ...NodeSize,
        outputSchema: {
          name: "output",
          type: DataType.Object,
          children: [
            { name: "headers", type: DataType.Object, children: DefaultHeaders },
            { name: "params", type: DataType.Object },
            { name: "queries", type: DataType.Object },
            { name: "cookies", type: DataType.Object },
            { name: "body", type: DataType.Object },
          ],
        },
        valueReference: { path: "start" },
      },
      props: {
        methods: ["post"],
        contentType: "json",
      },
    };
  },
  validate({ nodeData, graph }) {
    // inputSchemaChanged错误必须由用户确认来清除
    if (nodeData.meta.configurationErrors === FlowErrors.inputSchemaChanged) {
      return FlowErrors.inputSchemaChanged;
    }
    const props = nodeData.props;
    if (!props.path) {
      return "监听地址不能为空";
    }
    if (!props.methods?.length) {
      return "监听方法不能为空";
    }
    if (props.headers) {
      for (const item of props.headers) {
        if (!item.value) {
          return "key不能为空";
        }
      }
    }
    if (props.queries) {
      for (const item of props.queries) {
        if (!item.value) {
          return "key不能为空";
        }
      }
    }
  },
  propsRender: {
    out(props) {
      const { headers, queries, cookies, ...others } = props;
      return {
        headers: headers?.map((item) => item.value),
        queries: queries?.map((item) => item.value),
        cookies: cookies?.map((item) => item.value),
        ...others,
      };
    },
    in(dsl) {
      const { headers, queries, cookies, ...others } = dsl;
      return {
        headers: headers?.map((item) => ({ value: item })),
        queries: queries?.map((item) => ({ value: item })),
        cookies: cookies?.map((item) => ({ value: item })),
        ...others,
      };
    },
  },
};

export default config;

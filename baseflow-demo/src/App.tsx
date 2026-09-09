import type { IWidgets, SchemaModel } from "@baseflow/flow-react";
import { DataType, FlowConfigProvider } from "@baseflow/flow-react";
import { ConfigProvider } from "antd";
import { Button, confirm, DatePicker, Input, message, Segmented, Select, Spin, Switch, TextArea, TimePicker } from "widgets-antd";
import Canvas from "./Canvas";
import { MockFlow } from "./utils";

const Locale = localStorage.getItem("baseflow-locale") || "";

const widgets: Partial<IWidgets> = {
  Button,
  Spin,
  Segmented,
  Input,
  Select,
  Switch,
  TextArea,
  DatePicker,
  TimePicker,
  message,
  confirm,
};

const expressionUtils: SchemaModel = {
  name: "utils",
  type: DataType.Object,
  disabled: true,
  children: [
    {
      name: "string",
      label: "字符处理",
      type: DataType.Object,
      disabled: true,
      children: [
        { name: "camelCase", label: "camelCase([string=''])", type: DataType.String, tips: "转换字符串string为驼峰写法。" },
        { name: "capitalize", label: "capitalize([string=''])", type: DataType.String, tips: "转换字符串string首字母为大写，剩下为小写。" },
      ],
    },
    {
      name: "number",
      label: "数字计算",
      type: DataType.Object,
      disabled: true,
      children: [
        { name: "clamp", label: "clamp(number, [lower], upper)", type: DataType.Number, tips: "返回限制在 lower 和 upper 之间的值" },
        {
          name: "inRange",
          label: "inRange(number, [start=0], end)",
          type: DataType.Number,
          tips: "检查 n 是否在 start 与 end 之间，但不包括 end。 如果 end 没有指定，那么 start 设置为0。 如果 start 大于 end，那么参数会交换以便支持负范围。",
        },
      ],
    },
  ],
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 13,
        },
      }}
    >
      <FlowConfigProvider
        widgets={widgets}
        nodeRendererUrl="/node-render.html"
        monacoEditorUrl="/monaco/index.html"
        pureRunnerUrl="/pureRunner.worker-DAkP84-u.js"
        expressionUtils={expressionUtils}
        nodeOrigin="localhost"
      >
        <Canvas data={MockFlow} />
      </FlowConfigProvider>
    </ConfigProvider>
  );
}

export default App;

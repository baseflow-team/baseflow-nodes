import type { IBaseWidgets, SchemaModel } from "@baseflow/flow-react";
import { DataType, FlowConfigProvider } from "@baseflow/flow-react";
import { Button, ConfigProvider, Modal, message, Segmented, Spin, Switch } from "antd";
import { RuntimeRendererUrl } from "../../baseflow-node-renderer/runtimeContract.js";
import Canvas from "./Canvas";
import DatePicker from "./components/DatePicker";
import DescMD from "./components/DescMD";
import StringInput from "./components/StringInput";
import StringSelect from "./components/StringSelect";
import TimePicker from "./components/TimePicker";
import { MockFlow } from "./utils";

const Locale = localStorage.getItem("baseflow-locale") || "";

const widgets: Partial<IBaseWidgets> = {
  Button: Button as any,
  Spin: Spin as any,
  Segmented,
  Input: StringInput,
  Select: StringSelect,
  Switch: Switch as any,
  TextArea: StringInput as any,
  DatePicker,
  TimePicker,
  DescMD,
  message: {
    success: (text: string) => message.success(text),
    error: (text: string) => message.error(text),
    warning: (text: string) => message.warning(text),
    info: (text: string) => message.info(text),
  },
  confirm: (message: string, callback: (ok: boolean) => void, props?: { title?: string; okText?: string; cancelText?: string }) => {
    Modal.confirm({
      title: "提示",
      content: message,
      ...props,
      onOk() {
        callback(true);
      },
      onCancel() {
        callback(false);
      },
    });
  },
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
        locale={Locale}
        widgets={widgets}
        monacoEditorUrl="/monaco/index.html"
        pureRunnerUrl="/pureRunner.worker-DAkP84-u.js"
        nodeRendererUrl={RuntimeRendererUrl}
        expressionUtils={expressionUtils}
      >
        <Canvas data={MockFlow} />
      </FlowConfigProvider>
    </ConfigProvider>
  );
}

export default App;

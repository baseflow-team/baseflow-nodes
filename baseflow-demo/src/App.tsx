import type { IWidgets, SchemaModel } from "@baseflow/flow-react";
import { DataType, FlowConfigProvider } from "@baseflow/flow-react";
import { ConfigProvider, Modal, message } from "antd";
import { useCallback } from "react";
import { Button, DatePicker, Input, Segmented, Select, Spin, Switch, TextArea, TimePicker } from "widgets-antd";
import Canvas from "./Canvas";
import { MockDoc } from "./utils";

message.config({
  top: 50,
});

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
  const showMessage = useCallback((type: "success" | "error" | "warning" | "info", text: string, holdOn?: boolean) => {
    if (holdOn) {
      message[type](
        <>
          <span>{text}</span>
          <span
            style={{
              fontSize: "12px",
              display: "inline-block",
              background: "var(--bf-primary)",
              color: "#fff",
              padding: "0 10px",
              cursor: "pointer",
              marginLeft: "10px",
              borderRadius: "3px",
            }}
            onClick={() => message.destroy()}
          >
            ok
          </span>
        </>,
        0,
      );
    } else {
      message[type](text);
    }
  }, []);

  const showConfirm = useCallback(
    (message: string, callback: (ok: boolean) => void, props?: { title?: string; okText?: string; cancelText?: string }) => {
      Modal.confirm({
        title: null,
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
    [],
  );

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
        nodeRendererUrl="http://localhost:4173/node-render.html"
        monacoEditorUrl="/monaco/index.html"
        pureRunnerUrl="/pureRunner.worker-DAkP84-u.js"
        expressionUtils={expressionUtils}
        showMessage={showMessage}
        showConfirm={showConfirm}
        nodeOrigin={window.origin}
      >
        <Canvas doc={MockDoc} />
      </FlowConfigProvider>
    </ConfigProvider>
  );
}

export default App;

import type { IWidgets } from "@baseflow/node-runtime-react";
import { NodeConfigProvider } from "@baseflow/node-runtime-react";
import { Button, DatePicker, Input, Segmented, Select, Spin, Switch, TextArea, TimePicker } from "widgets-antd";
import InputForm from "./components/InputForm";

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

function App() {
  return (
    <NodeConfigProvider widgets={widgets} flowOrigin="www.baseflow.run">
      <InputForm />
    </NodeConfigProvider>
  );
}

export default App;

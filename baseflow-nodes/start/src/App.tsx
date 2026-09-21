import type { IWidgets } from "@baseflow/node-runtime-react";
import { NodeConfigProvider } from "@baseflow/node-runtime-react";
import { Button, DatePicker, Input, Segmented, Select, Spin, Switch, TextArea, TimePicker } from "widgets-antd";
import Basic from "./Basic";
import "@baseflow/node-runtime-react/style.css";

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
  return <NodeConfigProvider widgets={widgets}>{(setup) => <Basic setup={setup} />}</NodeConfigProvider>;
}

export default App;

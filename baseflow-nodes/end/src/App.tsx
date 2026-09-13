import type { IWidgets } from "@baseflow/node-runtime-react";
import { NodeConfigProvider } from "@baseflow/node-runtime-react";
import { Button, DatePicker, Input, Segmented, Select, Spin, Switch, TextArea, TimePicker } from "widgets-antd";
import NodeSettings from "./components/NodeSettings";

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
    <NodeConfigProvider widgets={widgets} flowOrigin="www.baseflow.run" onBeforeNavigate={() => undefined}>
      {(setup) => <NodeSettings setup={setup} />}
    </NodeConfigProvider>
  );
}

export default App;

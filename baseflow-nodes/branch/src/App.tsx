import type { IWidgets } from "@baseflow/node-runtime-react";
import { NodeConfigProvider } from "@baseflow/node-runtime-react";
import { Button, DatePicker, Input, MantineProvider, Segmented, Select, Spin, Switch, TextArea, TimePicker } from "widgets-mantine";
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

function App(props: { container: HTMLElement }) {
  return (
    <MantineProvider>
      <NodeConfigProvider container={props.container} widgets={widgets}>
        {(setup) => <Basic setup={setup} />}
      </NodeConfigProvider>
    </MantineProvider>
  );
}

export default App;

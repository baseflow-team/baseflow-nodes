import type { IWidgets } from "@baseflow/node-runtime-react";
import { NodeConfigProvider } from "@baseflow/node-runtime-react";
import { MantineProvider } from "@mantine/core";
import { BrandTheme, Button, DatePicker, Input, Segmented, Select, Spin, Switch, TextArea, TimePicker } from "widgets-mantine";
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
    <MantineProvider theme={BrandTheme}>
      <NodeConfigProvider container={props.container} widgets={widgets}>
        {(setup) => <Basic setup={setup} />}
      </NodeConfigProvider>
    </MantineProvider>
  );
}

export default App;

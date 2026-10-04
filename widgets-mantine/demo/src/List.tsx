import { Button, DatePicker, Input, MantineProvider, Segmented, Select, Spin, Switch, TextArea, TimePicker } from "widgets-mantine";

const SelectOptions = [{ value: "option1", label: "optionA" }];

export default function () {
  return (
    <div>
      <div>
        <h2>Button</h2>
        <div>
          <Button type="primary">primary</Button>
          <Button type="link">link</Button>
          <Button type="text">text</Button>
          <Button type="primary" size="small">
            primary
          </Button>
          <Button type="link" size="small">
            link
          </Button>
          <Button type="text" size="small">
            text
          </Button>
        </div>
      </div>
      <div>
        <h2>Input</h2>
        <Input />
        <Input variant="filled" />
      </div>
      <div>
        <h2>Select</h2>
        <Select options={SelectOptions} />
        <Select options={SelectOptions} size="small" />
        <Select options={SelectOptions} variant="borderless" />
      </div>
    </div>
  );
}

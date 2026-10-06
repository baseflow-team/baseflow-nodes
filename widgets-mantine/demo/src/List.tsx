import { Button, Input, Segmented, Select, Switch } from "widgets-mantine";

const SelectOptions = [
  { value: "option1", label: "optionA" },
  { value: "option2", label: "optionB" },
  { value: "option3", label: "optionC" },
];

export default function List() {
  return (
    <main className="WidgetsPreview">
      <header className="WidgetsPreview__header">
        <h1>widgets-mantine</h1>
        <p>基础 IWidgets 组件预览</p>
      </header>

      <section className="WidgetsPreview__section">
        <h2>Button</h2>
        <div className="WidgetsPreview__row">
          <Button type="primary">primary</Button>
          <Button>default</Button>
          <Button type="link">link</Button>
          <Button type="text">text</Button>
          <Button type="primary" size="small">
            primary
          </Button>
          <Button size="small">default</Button>
          <Button type="link" size="small">
            link
          </Button>
          <Button type="text" size="small">
            text
          </Button>
        </div>
      </section>

      <section className="WidgetsPreview__section">
        <h2>Input</h2>
        <div className="WidgetsPreview__row WidgetsPreview__row--fields">
          <Input placeholder="Default input" />
          <Input variant="filled" placeholder="Filled input" />
        </div>
      </section>

      <section className="WidgetsPreview__section">
        <h2>Select</h2>
        <div className="WidgetsPreview__row WidgetsPreview__row--fields">
          <Select options={SelectOptions} placeholder="Default select" />
          <Select options={SelectOptions} size="small" placeholder="Small select" />
          <Select options={SelectOptions} variant="borderless" placeholder="Borderless select" />
        </div>
      </section>

      <section>
        <h2>other</h2>
        <div className="WidgetsPreview__row WidgetsPreview__row--fields">
          <Switch label="启用" />
          <Switch label="启用" size="small" />
        </div>
      </section>

      <section>
        <h2>Segmented</h2>
        <div className="WidgetsPreview__row WidgetsPreview__row--fields">
          <Segmented options={SelectOptions} />
        </div>
      </section>
    </main>
  );
}

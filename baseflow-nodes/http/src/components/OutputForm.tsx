import type { SchemaModel, SchemaToolsFilter } from "@baseflow/node-runtime-react";
import { SchemaModelForm } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";

const toolsFilter: SchemaToolsFilter = (item, parent) => {
  if (!parent) {
    return { addNext: false, addChild: false, edit: false, delete: false };
  }
  if (parent.name === "response") {
    return { addNext: false, addChild: true, edit: false, delete: false };
  }
  return;
};

const Component: FC<{ outputSchema: SchemaModel | undefined; onChange: (value?: SchemaModel | undefined) => void }> = ({
  outputSchema,
  onChange,
}) => {
  return (
    <div>
      <SchemaModelForm variant="borderless" toolsFilter={toolsFilter} value={outputSchema} onChange={onChange} />
    </div>
  );
};
export default memo(Component);

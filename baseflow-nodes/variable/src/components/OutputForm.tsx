import type { SchemaModel } from "@baseflow/node-runtime-react";
import { SchemaShow } from "@baseflow/node-runtime-react";
import type { FC } from "react";
import { memo } from "react";

const Component: FC<{ outputSchema: SchemaModel | undefined }> = ({ outputSchema }) => {
  if (!outputSchema) {
    return <div className="ͼbaseflow-sr-empty"></div>;
  }
  return (
    <div>
      <SchemaShow schema={outputSchema} />
    </div>
  );
};
export default memo(Component);

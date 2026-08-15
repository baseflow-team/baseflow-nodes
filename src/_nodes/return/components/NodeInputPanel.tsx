"use no memo";
import type { INodeInputPanel, SchemaLabelRender, SchemaValue } from "@baseflow/react";
import { BaseLang, FlowErrors, SchemaValueForm, useEvent, useGraph, useNode } from "@baseflow/react";
import { Alert, Button } from "antd";
import { memo } from "react";
import type { NodeProps } from "../model";

const returnLabelRender: SchemaLabelRender = (item, parent) => {
  if (!parent) {
    return { name: "Return" };
  }
};

const Component: INodeInputPanel<NodeProps> = ({ nodeData }) => {
  const { graph } = useGraph();
  const { node } = useNode(nodeData.id);
  const returnSchema = graph.getReturnSchema();
  const returnValue = nodeData.meta.valueReference?.value;

  const onReturnChange = useEvent((value: SchemaValue | undefined) => {
    node.updateMeta({ valueReference: { path: "flow", value } });
  });

  const onConfirmed = useEvent(() => {
    node.updateErrors(undefined, "configurationErrors");
    if (!returnSchema && returnValue) {
      node.updateMeta({ valueReference: { path: "flow", value: undefined } });
    }
  });

  return (
    <div>
      {nodeData.meta.configurationErrors === FlowErrors.returnSchemaChanged && (
        <Alert
          title={BaseLang.returnSchemaChanged}
          type="warning"
          showIcon
          style={{ marginBottom: "20px" }}
          action={
            <Button size="small" type="primary" onClick={onConfirmed}>
              确认
            </Button>
          }
        />
      )}
      {(returnSchema || returnValue) && (
        <div className="nd-form-layout">
          <div className="form-item">
            <div className="label-item require">设置返回参数</div>
            <div className="input-item">
              <SchemaValueForm variant="filled" labelRender={returnLabelRender} schema={returnSchema} value={returnValue} onChange={onReturnChange} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default memo(Component);

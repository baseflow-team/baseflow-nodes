import type { CreatorPayload, FlowOptions, IFlow } from "@baseflow/flow-react";
import { Graph, HistoryTools } from "@baseflow/flow-react";
import { Modal, message, notification, Select } from "antd";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import NodeList from "../NodeList";
import type { IDoc, NodeEntity } from "../utils";
import { getLocale, useEvent } from "../utils";
import { FlowHooks } from "./FlowHooks";
import styles from "./index.module.scss";

const Component: FC<{ doc: IDoc }> = (props) => {
  const [flow, setFlow] = useState<IFlow>();
  const [flowOptions] = useState<FlowOptions>();
  const [flowHooks] = useState(new FlowHooks(props.doc));
  const [showNodeCreater, setShowNodeCreater] = useState<CreatorPayload>();

  const onInit = useCallback((flow: IFlow) => {
    // @ts-expect-error: dev test
    window.flow = flow;
    setFlow(flow);
  }, []);

  const onApplyNode = useEvent((newItem: Pick<NodeEntity, "type" | "dsl">) => {
    const { sourceNode, place } = showNodeCreater!;
    const { sources, node } = newItem.dsl;
    const result = newItem.type === "Trigger" ? flow!.insertTrigger(sources, node) : flow!.insertNode(sourceNode.getId(), place, sources, node);
    result.then(
      (changedSources) => {
        setShowNodeCreater(undefined);
        if (Object.keys(changedSources).length) {
          notification.warning({
            message: "同一个文档中同一种节点不能使用多版本，以下节点版本冲突，已自动替换",
            description: <pre>{JSON.stringify(changedSources, null, 2)}</pre>,
            placement: "top",
          });
        }
      },
      (err) => {
        message.error(err.message || err.toString());
      },
    );
  });

  return (
    <div className={styles.Canvas}>
      <div className={`${styles.Canvas}__hd`}>
        <div className="left">
          <div className="title">
            <Select
              value={getLocale()}
              options={[
                { value: "en", label: "English" },
                { value: "zh-hans", label: "中文简体" },
              ]}
              onChange={(locale) => {
                window.location.href = `?_lang_=${locale}`;
              }}
            />
          </div>
        </div>
        <div className="right">{flow && <HistoryTools flow={flow} />}</div>
      </div>
      <div className={`${styles.Canvas}__bd`}>
        <Graph flowOptions={flowOptions} initialDSL={props.doc.flow} flowHooks={flowHooks} onInit={onInit} onShowCreater={setShowNodeCreater} />
      </div>
      {showNodeCreater && (
        <Modal
          title="请选择节点"
          className={`${styles.Canvas}__creater`}
          open={true}
          width={1010}
          footer={null}
          onCancel={() => setShowNodeCreater(undefined)}
        >
          <NodeList onSelect={onApplyNode} />
        </Modal>
      )}
    </div>
  );
};

export default memo(Component);

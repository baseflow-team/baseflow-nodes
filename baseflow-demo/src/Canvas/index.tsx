import type { CreatorPayload, FlowData, FlowOptions, IFlow, INodeData } from "@baseflow/flow-react";
import { Graph, HistoryTools, jsonToFlow } from "@baseflow/flow-react";
import { Modal, message, notification, Select, Spin } from "antd";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import NodeList from "../NodeList";
import type { IDoc } from "../utils";
import { useEvent } from "../utils";
import { FlowHooks } from "./FlowHooks";
import styles from "./index.module.scss";

const Locale = localStorage.getItem("baseflow-locale") || "";

const Component: FC<{ doc: IDoc }> = (props) => {
  const [flow, setFlow] = useState<IFlow>();
  const [initFlowData] = useState<FlowData>(() => jsonToFlow(props.doc.flow));
  const [flowOptions] = useState<FlowOptions>();
  const [flowHooks] = useState(new FlowHooks(props.doc));
  const [showNodeCreater, setShowNodeCreater] = useState<CreatorPayload>();

  const onInit = useCallback((flow: IFlow) => {
    // @ts-expect-error: dev test
    window.flow = flow;
    setFlow(flow);
  }, []);

  const onApplyNode = useEvent((newItem: { type: string; dsl: string }) => {
    const { sourceNode, place } = showNodeCreater!;
    const { sources, nodes } = JSON.parse(newItem.dsl) as { sources: { [tag: string]: string }; nodes: INodeData[] };
    const result = newItem.type === "Trigger" ? flow!.applyTrigger(nodes, sources) : flow!.applyNode(sourceNode.getId(), place, nodes, sources);
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
              value={Locale}
              options={[
                { value: "en-US", label: "English" },
                { value: "zh-CN", label: "中文简体" },
                { value: "zh-TW", label: "中文繁體" },
              ]}
              onChange={(locale) => {
                localStorage.setItem("baseflow-locale", locale);
                window.location.reload();
              }}
            />
          </div>
        </div>
        <div className="right">{flow && <HistoryTools flow={flow} />}</div>
      </div>
      <div className={`${styles.Canvas}__bd`}>
        {initFlowData && flowHooks ? (
          <Graph flowOptions={flowOptions} initialData={initFlowData} flowHooks={flowHooks} onInit={onInit} onShowCreater={setShowNodeCreater} />
        ) : (
          <Spin />
        )}
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

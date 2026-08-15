import type { CreatorPayload, GraphData, IGraph, IGraphOptions, INodeData } from "@baseflow/react";
import { DslTools, Flow, getLocale, HistoryTools, useEvent } from "@baseflow/react";
import { Modal, message, notification, Select, Spin } from "antd";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import type { IFLow } from "../entity";
import NodeList from "../NodeList";
import { GraphHooks } from "./GraphHooks";
import styles from "./index.module.scss";

const Component: FC<{ data: IFLow }> = (props) => {
  const locale = getLocale();
  const [graph, setGraph] = useState<IGraph>();
  const [initGraphData] = useState<GraphData>(() => DslTools.jsonToGraph(props.data.flow));
  const [graphOptions] = useState<IGraphOptions>({});
  const [graphHooks] = useState(new GraphHooks(props.data));
  const [showNodeCreater, setShowNodeCreater] = useState<CreatorPayload>();

  const onInit = useCallback((graph: IGraph) => {
    // @ts-expect-error: dev test
    window.graph = graph;
    setGraph(graph);
  }, []);

  const onApplyNode = useEvent((newItem: { type: string; dsl: string }) => {
    const { sourceNode, place } = showNodeCreater!;
    const { sources, nodes } = JSON.parse(newItem.dsl) as { sources: { [tag: string]: string }; nodes: INodeData[] };
    const result = newItem.type === "Trigger" ? graph!.applyTrigger(nodes, sources) : graph!.applyNode(sourceNode.getId(), place, nodes, sources);
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
              value={locale}
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
        <div className="right">{graph && <HistoryTools graph={graph} />}</div>
      </div>
      <div className={`${styles.Canvas}__bd`}>{initGraphData && graphHooks ? <Flow options={graphOptions} initialData={initGraphData} graphHooks={graphHooks} onInit={onInit} onShowCreater={setShowNodeCreater} /> : <Spin />}</div>
      {showNodeCreater && (
        <Modal title="请选择节点" className={`${styles.Canvas}__creater`} open={true} width={1010} footer={null} onCancel={() => setShowNodeCreater(undefined)}>
          <NodeList onSelect={onApplyNode} />
        </Modal>
      )}
    </div>
  );
};

export default memo(Component);

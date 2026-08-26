import type { INodeData } from "@baseflow/render-react";
import styles from "./index.module.scss";

export default function Properties({ nodeData }: { nodeData: INodeData }) {
  return <div className={styles.Break}>{nodeData.id + nodeData.meta.name}</div>;
}

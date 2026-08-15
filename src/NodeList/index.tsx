import { type FC, useState } from "react";
import { fetchNodes } from "../MockData";
import styles from "./index.module.scss";

const DefaultIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSI+CiAgICA8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNNCwwIEwxNiwwIEMxOC4yMDkxMzksMCAyMCwxLjc5MDg2MSAyMCw0IEwyMCwxNiBDMjAsMTguMjA5MTM5IDE4LjIwOTEzOSwyMCAxNiwyMCBMNCwyMCBDMS43OTA4NjEsMjAgMCwxOC4yMDkxMzkgMCwxNiBMMCw0IEMwLDEuNzkwODYxIDEuNzkwODYxLDAgNCwwIFoiIGZpbGw9IiNGRjg4MDAiLz4KICAgICAgICA8cGF0aCBkPSJNMTAsMyBDMTMuODY1ODY2NywzIDE3LDYuMTM0MTMzMzQgMTcsMTAgQzE3LDEzLjg2NTg2NjcgMTMuODY1ODY2NywxNyAxMCwxNyBDNi4xMzQxMzMzNCwxNyAzLDEzLjg2NTg2NjcgMywxMCBDMyw2LjEzNDEzMzM0IDYuMTM0MTMzMzQsMyAxMCwzIFogTTEwLDUgQzcuMjM4NDYxNTQsNSA1LDcuMjM4NDYxNTQgNSwxMCBDNSwxMi43NjE1Mzg1IDcuMjM4NDYxNTQsMTUgMTAsMTUgQzEyLjc2MTUzODUsMTUgMTUsMTIuNzYxNTM4NSAxNSwxMCBDMTUsNy4yMzg0NjE1NCAxMi43NjE1Mzg1LDUgMTAsNSBaIE0xMS4zMzMzMzMzLDggQzExLjcwMTUyMzIsOCAxMiw4LjI5ODQ3NjgzIDEyLDguNjY2NjY2NjcgTDEyLDguNjY2NjY2NjcgTDEyLDExLjMzMzMzMzMgQzEyLDExLjcwMTUyMzIgMTEuNzAxNTIzMiwxMiAxMS4zMzMzMzMzLDEyIEwxMS4zMzMzMzMzLDEyIEw4LjY2NjY2NjY3LDEyIEM4LjI5ODQ3NjgzLDEyIDgsMTEuNzAxNTIzMiA4LDExLjMzMzMzMzMgTDgsMTEuMzMzMzMzMyBMOCw4LjY2NjY2NjY3IEM4LDguMjk4NDc2ODMgOC4yOTg0NzY4Myw4IDguNjY2NjY2NjcsOCBMOC42NjY2NjY2Nyw4IFoiICBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICAgIDwvZz4KPC9zdmc+";

const Component: FC<{ onSelect: (item: { type: string; dsl: string }) => void }> = ({ onSelect }) => {
  const [nodeList] = useState(fetchNodes());

  return (
    <div className={styles.NodeList}>
      {nodeList.map((item) => {
        const { name, type, desc, icon } = item;
        return (
          <div key={name} onClick={() => item.dsl && onSelect(item)}>
            <div className={`${styles.NodeList}__hd`}>
              <img className="icon" alt={name} src={icon || DefaultIcon} />
              <div className="name">{item.name}</div>
              <div className="type">{type}</div>
            </div>
            <div className={`${styles.NodeList}__bd`} title={desc}>
              {desc}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Component;

import { Spin } from "antd";
import type { FC } from "react";
import { memo } from "react";

export interface ISpinProps {
  size?: "small" | "middle";
}

const Component: FC<ISpinProps> = (props) => {
  return <Spin {...props} />;
};

export default memo(Component) as typeof Component;

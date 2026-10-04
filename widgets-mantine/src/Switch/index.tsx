import { Switch } from "antd";
import type { FC, ReactNode } from "react";
import { memo } from "react";

export interface ISwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  size?: "small" | "middle";
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
}

const Component: FC<ISwitchProps> = (props) => {
  return <Switch {...props} />;
};

export default memo(Component) as typeof Component;

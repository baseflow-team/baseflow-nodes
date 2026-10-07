import { Switch } from "antd";
import type { FC } from "react";
import { memo } from "react";

export interface ISwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  size?: "small";
  label?: string;
}

const Component: FC<ISwitchProps> = ({ value, onChange, className, size, label }) => {
  return <Switch value={value} onChange={onChange} className={className} size={size} checkedChildren={label} unCheckedChildren={label} />;
};

export default memo(Component);

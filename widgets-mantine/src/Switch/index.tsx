import { Switch } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";

export interface ISwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  size?: "small";
  label?: string;
}

const Component: FC<ISwitchProps> = (props) => {
  const { onChange, size, value, ...others } = props;

  return <Switch {...others} checked={value} size={size === "small" ? "xs" : "sm"} onChange={(event) => onChange?.(event.currentTarget.checked)} />;
};

export default memo(Component) as typeof Component;

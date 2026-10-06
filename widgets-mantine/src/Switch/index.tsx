import { Switch } from "@mantine/core";
import type { ChangeEvent, FC } from "react";
import { memo } from "react";
import { useEvent } from "../utils";
export interface ISwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  size?: "small";
  label?: string;
}

const Component: FC<ISwitchProps> = ({ onChange, size, value, className, label }) => {
  const _onChange = useEvent((event: ChangeEvent<any>) => {
    onChange?.(event.currentTarget.checked);
  });

  return <Switch className={className} label={label} checked={value} size={size === "small" ? "xs" : "sm"} onChange={_onChange} />;
};

export default memo(Component) as typeof Component;

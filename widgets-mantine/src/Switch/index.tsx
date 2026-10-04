import { Switch } from "@mantine/core";
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
  const { checkedChildren, onChange, size, unCheckedChildren, value, ...others } = props;

  return (
    <Switch
      {...others}
      checked={value}
      offLabel={unCheckedChildren}
      onLabel={checkedChildren}
      size={size === "small" ? "xs" : "sm"}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
    />
  );
};

export default memo(Component) as typeof Component;

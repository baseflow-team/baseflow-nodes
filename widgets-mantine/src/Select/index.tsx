import { MultiSelect, Select } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";

interface ISelectProps {
  value?: string | string[];
  options: {
    value: string;
    label: string;
  }[];
  onChange?: (value?: string | string[]) => void;
  size?: "small";
  variant?: "borderless";
  multiple?: boolean;
  className?: string;
  placeholder?: string;
}

const Component: FC<ISelectProps> = ({ value, multiple, ...others }) => {
  const size = others.size === "small" ? "xs" : "sm";
  const variant = others.variant === "borderless" ? "unstyled" : "default";

  if (multiple) {
    return <MultiSelect {...others} size={size} variant={variant} value={Array.isArray(value) ? value : []} />;
  }

  return (
    <Select
      {...others}
      size={size}
      variant={variant}
      value={typeof value === "string" && value ? value : null}
      onChange={(nextValue) => others.onChange?.(nextValue ?? undefined)}
    />
  );
};

export default memo(Component) as typeof Component;

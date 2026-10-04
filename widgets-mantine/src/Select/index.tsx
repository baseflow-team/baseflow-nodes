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

const Component: FC<ISelectProps> = ({ value, multiple, options, ...others }) => {
  const size = others.size === "small" ? "xs" : "sm";
  const variant = others.variant === "borderless" ? "unstyled" : "default";

  if (multiple) {
    const multipleValue = value === undefined ? undefined : Array.isArray(value) ? value : [];
    return <MultiSelect {...others} data={options} size={size} variant={variant} value={multipleValue} />;
  }

  const selectValue = value === undefined ? undefined : typeof value === "string" && value ? value : null;

  return (
    <Select
      {...others}
      data={options}
      size={size}
      variant={variant}
      value={selectValue}
      onChange={(nextValue) => others.onChange?.(nextValue ?? undefined)}
    />
  );
};

export default memo(Component) as typeof Component;

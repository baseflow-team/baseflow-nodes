import { Select } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";

interface ISelectProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  size?: "small";
  require?: boolean;
  placeholder?: string;
  borderless?: boolean;
  className?: string;
  options: {
    value: string;
    label: string;
  }[];
}

const Component: FC<ISelectProps> = ({ value, borderless, options, require, size, className, onChange, placeholder }) => {
  const _size = size === "small" ? "xs" : "sm";
  const _className = [className, borderless && "borderless"].filter(Boolean).join(" ");

  return (
    <Select
      error={require && value === null}
      className={_className}
      data={options}
      size={_size}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default memo(Component) as typeof Component;

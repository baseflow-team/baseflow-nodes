import { MultiSelect } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";

interface ISelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  size?: "small";
  placeholder?: string;
  borderless?: boolean;
  className?: string;
  options: {
    value: string;
    label: string;
  }[];
}

const Component: FC<ISelectProps> = ({ value, options, borderless, size, className, onChange, placeholder }) => {
  const _size = size === "small" ? "xs" : "sm";
  const _className = [className, borderless && "borderless"].filter(Boolean).join(" ");

  return <MultiSelect className={_className} data={options} size={_size} value={value} placeholder={placeholder} onChange={onChange} />;
};

export default memo(Component) as typeof Component;

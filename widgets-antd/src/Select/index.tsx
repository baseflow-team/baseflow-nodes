import { Select } from "antd";
import type { FC } from "react";
import { memo } from "react";

interface ISelectProps {
  value?: string | string[];
  options: {
    value: string;
    label: string;
  }[];
  onChange?: (value?: string | string[]) => void;
  size?: "small" | "middle";
  variant?: "borderless";
  multiple?: boolean;
  className?: string;
  placeholder?: string;
}

const Component: FC<ISelectProps> = ({ value, onChange, multiple, ...others }) => {
  return <Select {...others} value={value || undefined} mode={multiple ? "multiple" : undefined} />;
};

export default memo(Component) as typeof Component;

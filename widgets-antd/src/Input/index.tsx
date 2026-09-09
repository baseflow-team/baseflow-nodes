import { Input } from "antd";
import type { FC, FocusEvent } from "react";
import { memo } from "react";

export interface IInputProps {
  value?: string;
  onChange?: (value?: string) => void;
  onBlur?: (evt: FocusEvent) => void;
  variant?: "filled";
  placeholder?: string;
  className?: string;
}

const Component: FC<IInputProps> = ({ onChange, ...others }) => {
  return <Input {...others} onChange={(e) => onChange?.(e.target.value.trim())} />;
};

export default memo(Component);

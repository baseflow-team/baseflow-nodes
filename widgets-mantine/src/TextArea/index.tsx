import { Input } from "antd";
import type { FC, FocusEvent } from "react";
import { memo } from "react";

export interface ITextAreaProps {
  className?: string;
  placeholder?: string;
  rows?: number;
  variant?: "filled";
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (evt: FocusEvent) => void;
}

const Component: FC<ITextAreaProps> = ({ onChange, ...others }) => {
  return <Input.TextArea {...others} onChange={(e) => onChange?.(e.target.value.trim())} />;
};

export default memo(Component) as typeof Component;

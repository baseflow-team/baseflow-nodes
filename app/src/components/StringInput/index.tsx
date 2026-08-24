import { BaseLang } from "@baseflow/flow-react";
import { Input } from "antd";
import classnames from "classnames";
import type { CSSProperties, FC, FocusEventHandler, ReactNode } from "react";
import { memo } from "react";

export interface StringInputProps {
  value?: string;
  onChange?: (value?: string) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  prefix?: ReactNode;
  addonAfter?: ReactNode;
  allowClear?: boolean;
  block?: boolean;
  size?: "small" | "middle";
  variant?: "filled" | "borderless";
  rows?: number;
  showCount?: boolean;
  maxLength?: number;
}

const Component: FC<StringInputProps> = ({ onChange, className, block, placeholder = BaseLang.requiredPrompt, prefix, rows, ...others }) => {
  if (rows) {
    return (
      <Input.TextArea
        {...others}
        className={classnames(className, { "ͼbaseflow-sr-inputBlock": block })}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value.trim())}
        rows={rows}
        prefix={prefix ? prefix.toString() : undefined}
      />
    );
  }
  return (
    <Input
      {...others}
      className={classnames(className, { "ͼbaseflow-sr-inputBlock": block })}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value.trim())}
      prefix={prefix}
    />
  );
};

export default memo(Component);

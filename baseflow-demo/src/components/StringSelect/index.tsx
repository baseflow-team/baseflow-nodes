import { BaseLang } from "@baseflow/flow-react";
import { Select } from "antd";
import classnames from "classnames";
import type { CSSProperties, FocusEventHandler, ReactNode } from "react";
import { memo, useMemo } from "react";

export interface StringSelectProps<V extends string | string[]> {
  value?: V;
  onChange?: (value?: V) => void;
  multiple?: boolean;
  popupMatchSelectWidth?: boolean | number;
  options: Array<{ value: string; label: string }>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  showSearch?: boolean;
  prefix?: ReactNode;
  allowClear?: boolean;
  block?: boolean;
  width?: string;
  size?: "small" | "middle";
  variant?: "filled" | "borderless";
}

const Component = <V extends string | string[]>(props: StringSelectProps<V>): ReactNode => {
  const { value, className, block, multiple, width, placeholder = BaseLang.requiredPrompt, style, ...others } = props;
  const _style: CSSProperties | undefined = useMemo(() => {
    if (width || style) {
      return {
        ...style,
        width,
      };
    }
    return undefined;
  }, [width, style]);

  return (
    <Select
      {...others}
      style={_style}
      value={value || undefined}
      mode={multiple ? "multiple" : undefined}
      placeholder={placeholder}
      className={classnames(className, { "ͼbaseflow-sr-inputBlock": block })}
    />
  );
};

export default memo(Component) as typeof Component;

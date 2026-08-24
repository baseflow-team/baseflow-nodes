import { DatePicker } from "antd";
import classnames from "classnames";
import dayjs from "dayjs";
import type { CSSProperties, FC, FocusEventHandler, ReactNode } from "react";
import { memo, useMemo } from "react";

export interface DatePickerProps {
  value?: string;
  onChange?: (value?: string) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  placeholder?: string;
  showTime?: boolean;
  className?: string;
  style?: CSSProperties;
  prefix?: ReactNode;
  allowClear?: boolean;
  block?: boolean;
  size?: "small" | "middle";
  variant?: "filled" | "borderless";
}

const Component: FC<DatePickerProps> = ({ block, className, value, onChange, ...others }) => {
  const dataValue = useMemo(() => (value ? dayjs(value) : null), [value]);

  return (
    <DatePicker
      {...others}
      className={classnames(className, { "ͼbaseflow-sr-inputBlock": block })}
      value={dataValue}
      onChange={(_, date) => {
        onChange?.(date as string);
      }}
    />
  );
};

export default memo(Component);

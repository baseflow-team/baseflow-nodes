import { DatePicker } from "antd";
import dayjs from "dayjs";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { useEvent } from "../utils";

export interface IDatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  showTime?: boolean;
  placeholder?: string;
  borderless?: boolean;
  className?: string;
}

const Component: FC<IDatePickerProps> = ({ value, onChange, showTime, placeholder, borderless, className }) => {
  const _className = [className, borderless && "borderless"].filter(Boolean).join(" ");
  const _value = useMemo(() => (value ? dayjs(value) : null), [value]);
  const _onChange = useEvent((_: any, date: string | null) => {
    onChange?.(date || "");
  });

  return <DatePicker showTime={showTime} className={_className} value={_value} onChange={_onChange} placeholder={placeholder} />;
};

export default memo(Component);

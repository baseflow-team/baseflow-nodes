import { TimePicker } from "antd";
import dayjs from "dayjs";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { useEvent } from "../utils";

export interface ITimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  borderless?: boolean;
  className?: string;
}

const Component: FC<ITimePickerProps> = ({ value, onChange, borderless, placeholder, className }) => {
  const _className = [className, borderless && "borderless"].filter(Boolean).join(" ");
  const _value = useMemo(() => (value ? dayjs(value, "HH:mm:ss") : null), [value]);
  const _onChange = useEvent((_: any, date: string | null) => {
    onChange?.(date || "");
  });

  return <TimePicker className={_className} value={_value} onChange={_onChange} placeholder={placeholder} />;
};

export default memo(Component);

import { DatePicker } from "antd";
import dayjs from "dayjs";
import type { FC } from "react";
import { memo, useMemo } from "react";

export interface IDatePickerProps {
  value?: string;
  onChange?: (value?: string) => void;
  showTime?: boolean;
  placeholder?: string;
  className?: string;
}

const Component: FC<IDatePickerProps> = ({ value, onChange, ...others }) => {
  const dataValue = useMemo(() => (value ? dayjs(value) : null), [value]);

  return (
    <DatePicker
      {...others}
      value={dataValue}
      onChange={(_, date) => {
        onChange?.(date as string);
      }}
    />
  );
};

export default memo(Component) as typeof Component;

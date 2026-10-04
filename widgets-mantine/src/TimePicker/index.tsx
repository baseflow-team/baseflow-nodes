import { TimePicker } from "antd";
import dayjs from "dayjs";
import type { FC } from "react";
import { memo, useMemo } from "react";

export interface ITimePickerProps {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  className?: string;
}

const Component: FC<ITimePickerProps> = ({ value, onChange, ...others }) => {
  const dataValue = useMemo(() => (value ? dayjs(value, "HH:mm:ss") : null), [value]);
  return (
    <TimePicker
      {...others}
      value={dataValue}
      onChange={(_, date) => {
        onChange?.(date as string);
      }}
    />
  );
};

export default memo(Component);

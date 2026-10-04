import { Input } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";

export interface IDatePickerProps {
  value?: string;
  onChange?: (value?: string) => void;
  showTime?: boolean;
  placeholder?: string;
  className?: string;
}

const Component: FC<IDatePickerProps> = ({ value, onChange, showTime, ...others }) => {
  const inputValue = showTime ? value?.replace(" ", "T") : value;

  return (
    <Input
      {...others}
      type={showTime ? "datetime-local" : "date"}
      step={showTime ? 1 : undefined}
      value={inputValue ?? ""}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;
        onChange?.(showTime ? nextValue.replace("T", " ") : nextValue);
      }}
    />
  );
};

export default memo(Component) as typeof Component;

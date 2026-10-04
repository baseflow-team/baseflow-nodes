import { Input } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";

export interface ITimePickerProps {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  className?: string;
}

const Component: FC<ITimePickerProps> = ({ value, onChange, ...others }) => {
  return (
    <Input
      {...others}
      type="time"
      step={1}
      value={value ?? ""}
      onChange={(event) => {
        onChange?.(event.currentTarget.value);
      }}
    />
  );
};

export default memo(Component);

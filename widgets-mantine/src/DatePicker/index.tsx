import { Input } from "@mantine/core";
import type { ChangeEvent, FC } from "react";
import { memo } from "react";
import { useEvent } from "../utils";

export interface IDatePickerProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  showTime?: boolean;
  placeholder?: string;
  borderless?: boolean;
  className?: string;
}

const Component: FC<IDatePickerProps> = ({ value, onChange, showTime, placeholder, borderless, className }) => {
  const inputValue = showTime ? value?.replace(" ", "T") : value;
  const _className = [className, borderless && "borderless"].filter(Boolean).join(" ");

  const _onChange = useEvent((event: ChangeEvent<any>) => {
    const nextValue = event.currentTarget.value;
    onChange?.(showTime ? nextValue.replace("T", " ") : nextValue);
  });

  return (
    <Input
      className={_className}
      placeholder={placeholder}
      type={showTime ? "datetime-local" : "date"}
      step={showTime ? 1 : undefined}
      value={inputValue ?? ""}
      onChange={_onChange}
    />
  );
};

export default memo(Component);

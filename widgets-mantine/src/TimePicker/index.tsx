import { Input } from "@mantine/core";
import type { ChangeEvent, FC } from "react";
import { memo } from "react";
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
  const _onChange = useEvent((event: ChangeEvent<any>) => {
    onChange?.(event.currentTarget.value);
  });

  return <Input className={_className} type="time" step={1} placeholder={placeholder} value={value} onChange={_onChange} />;
};

export default memo(Component);

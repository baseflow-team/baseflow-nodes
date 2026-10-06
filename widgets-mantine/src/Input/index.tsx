import { TextInput } from "@mantine/core";
import type { ChangeEvent, FC, FocusEvent } from "react";
import { memo } from "react";
import { useEvent } from "../utils";

export interface IInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (evt: FocusEvent) => void;
  variant?: "filled";
  placeholder?: string;
  className?: string;
}

const Component: FC<IInputProps> = ({ value, onChange, onBlur, variant, placeholder, className }) => {
  const _onChange = useEvent((event: ChangeEvent<any>) => {
    onChange?.(event.currentTarget.value.trim());
  });

  return <TextInput className={className} value={value} onBlur={onBlur} variant={variant} placeholder={placeholder} onChange={_onChange} />;
};

export default memo(Component);

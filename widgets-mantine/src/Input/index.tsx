import { TextInput } from "@mantine/core";
import type { FC, FocusEvent } from "react";
import { memo } from "react";

export interface IInputProps {
  value?: string;
  onChange?: (value?: string) => void;
  onBlur?: (evt: FocusEvent) => void;
  variant?: "filled";
  placeholder?: string;
  className?: string;
}

const Component: FC<IInputProps> = ({ onChange, ...others }) => {
  return <TextInput {...others} onChange={(event) => onChange?.(event.currentTarget.value.trim())} />;
};

export default memo(Component);

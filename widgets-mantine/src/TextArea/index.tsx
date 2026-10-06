import { Textarea } from "@mantine/core";
import type { ChangeEvent, FC, FocusEvent } from "react";
import { memo } from "react";
import { useEvent } from "../utils";
export interface ITextAreaProps {
  className?: string;
  placeholder?: string;
  rows?: number;
  variant?: "filled";
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (evt: FocusEvent) => void;
}

const Component: FC<ITextAreaProps> = ({ value, onChange, onBlur, rows, variant, placeholder, className }) => {
  const _onChange = useEvent((event: ChangeEvent<any>) => {
    onChange?.(event.currentTarget.value.trim());
  });

  return (
    <Textarea className={className} value={value} onBlur={onBlur} rows={rows} variant={variant} placeholder={placeholder} onChange={_onChange} />
  );
};

export default memo(Component) as typeof Component;

import { Input } from "antd";
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

const Component: FC<ITextAreaProps> = ({ onChange, ...others }) => {
  const _onChange = useEvent((event: ChangeEvent<any>) => {
    onChange?.(event.currentTarget.value.trim());
  });

  return <Input.TextArea {...others} onChange={_onChange} />;
};

export default memo(Component);

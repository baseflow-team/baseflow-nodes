import { Input } from "antd";
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

const Component: FC<IInputProps> = ({ onChange, ...others }) => {
  const _onChange = useEvent((event: ChangeEvent<any>) => {
    onChange?.(event.currentTarget.value.trim());
  });

  return <Input {...others} onChange={_onChange} />;
};

export default memo(Component);

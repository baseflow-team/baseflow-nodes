import { Button } from "antd";
import type { FC, MouseEventHandler, ReactNode, Ref } from "react";
import { memo } from "react";

interface IButtonProps {
  ref?: Ref<HTMLButtonElement | null>;
  className?: string;
  size?: "small";
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  type?: "primary" | "link" | "text";
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
}

const Component: FC<IButtonProps> = (props) => {
  return <Button {...props} />;
};

export default memo(Component);

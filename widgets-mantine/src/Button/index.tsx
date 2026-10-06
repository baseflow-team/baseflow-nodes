import { Button } from "@mantine/core";
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

const Component: FC<IButtonProps> = ({ ref, className, loading, disabled, children, block, icon, iconPosition, size, type, onClick }) => {
  return (
    <Button
      ref={ref}
      className={className}
      loading={loading}
      disabled={disabled}
      fullWidth={block}
      leftSection={iconPosition !== "end" ? icon : undefined}
      rightSection={iconPosition === "end" ? icon : undefined}
      size={size === "small" ? "xs" : "sm"}
      variant={type === "primary" ? "filled" : type === "text" ? "subtle" : type === "link" ? "transparent" : "default"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default memo(Component);

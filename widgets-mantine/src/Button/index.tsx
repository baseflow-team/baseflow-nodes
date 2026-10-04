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

const Component: FC<IButtonProps> = (props) => {
  const { block, icon, iconPosition, size, type, ...others } = props;
  const variant =
    type === "primary" ? "filled" : type === "text" ? "subtle" : type === "link" ? "transparent" : type === "dashed" ? "outline" : "default";

  return (
    <Button
      {...others}
      fullWidth={block}
      leftSection={iconPosition !== "end" ? icon : undefined}
      rightSection={iconPosition === "end" ? icon : undefined}
      size={size === "small" ? "xs" : "sm"}
      variant={variant}
    />
  );
};

export default memo(Component) as typeof Component;

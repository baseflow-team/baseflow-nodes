import { Loader } from "@mantine/core";
import type { FC } from "react";
import { memo } from "react";

export interface ISpinProps {
  size?: "small" | "middle";
}

const Component: FC<ISpinProps> = (props) => {
  return <Loader size={props.size === "small" ? "xs" : "sm"} />;
};

export default memo(Component) as typeof Component;

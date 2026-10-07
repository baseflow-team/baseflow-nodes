import { Select } from "antd";
import type { FC } from "react";
import { memo } from "react";

interface ISelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  size?: "small";
  placeholder?: string;
  borderless?: boolean;
  className?: string;
  options: {
    value: string;
    label: string;
  }[];
}

const Component: FC<ISelectProps> = ({ borderless, className, ...others }) => {
  const _className = [className, borderless && "borderless"].filter(Boolean).join(" ");

  return <Select mode="multiple" className={_className} {...others} />;
};

export default memo(Component);

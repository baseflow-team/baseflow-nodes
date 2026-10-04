import { Segmented } from "antd";
import type { FC } from "react";
import { memo } from "react";

export interface ISegmentedProps {
  options: {
    label: string;
    value: string;
  }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const Component: FC<ISegmentedProps> = (props) => {
  return <Segmented {...props} />;
};

export default memo(Component) as typeof Component;

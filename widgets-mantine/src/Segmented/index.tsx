import { SegmentedControl } from "@mantine/core";
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

const Component: FC<ISegmentedProps> = ({ options, ...others }) => {
  return <SegmentedControl {...others} data={options} />;
};

export default memo(Component) as typeof Component;

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

const Component: FC<ISegmentedProps> = ({ options, value, onChange, className }) => {
  return <SegmentedControl value={value} className={className} data={options} onChange={onChange} />;
};

export default memo(Component) as typeof Component;

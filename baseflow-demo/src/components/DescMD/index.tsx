import Markdown from "markdown-to-jsx";
import type { CSSProperties, FC, MouseEvent } from "react";
import { memo } from "react";

export interface DescMDProps {
  value?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent) => void;
  onClickCapture?: (e: MouseEvent) => void;
}

const Component: FC<DescMDProps> = ({ value = "", className, ...others }) => {
  return (
    <div {...others} className={className}>
      {value.startsWith("M|") ? <Markdown>{value.substring(2)}</Markdown> : value.split("\n").map((line) => <div key={line}>{line}</div>)}
    </div>
  );
};

export default memo(Component);

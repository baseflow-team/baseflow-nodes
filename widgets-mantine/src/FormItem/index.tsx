import { Tooltip } from "@mantine/core";
import { CircleHelp } from "lucide-react";
import type { FC, ReactNode } from "react";
import { memo, useMemo } from "react";
import styles from "./index.module.scss";

interface FormItemProps {
  head?: ReactNode;
  label?: string;
  required?: boolean;
  tooltip?: string;
  children: ReactNode;
}

const Component: FC<FormItemProps> = ({ head, label, required, tooltip, children }) => {
  const _head: ReactNode = useMemo(() => {
    return head ? (
      head
    ) : label ? (
      <>
        <div className="title">{label}</div>
        {tooltip && (
          <Tooltip label={tooltip}>
            <CircleHelp className="tooltip" size={14} aria-hidden />
          </Tooltip>
        )}
        {required && <span className="required">*</span>}
      </>
    ) : null;
  }, [head, label, required, tooltip]);

  return (
    <div className={`${styles.FormItem}`}>
      <div className={`${styles.FormItem}__hd`}>{_head}</div>
      <div className={`${styles.FormItem}__bd`}>{children}</div>
    </div>
  );
};

export default memo(Component);

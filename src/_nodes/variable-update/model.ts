import type { INodeProps, ValueConfig } from '@baseflow/react';

export interface NodeProps extends INodeProps {
  scripts?: ValueConfig;
  variable?: ValueConfig;
  action?: 'assign' | 'insert' | 'remove';
  at?: number;
  removeTargets?: number | { value: string; label?: string }[];
}

export interface DSLProps {
  scripts?: string;
  variable?: string;
  action?: 'assign' | 'insert' | 'remove';
  at?: number;
  removeTargets?: number | string[];
}

import type { JsonDSL } from "@baseflow/react";

export interface IFLow {
  id: string;
  commitId: string;
  version: string;
  released: boolean;
  flow: JsonDSL;
}

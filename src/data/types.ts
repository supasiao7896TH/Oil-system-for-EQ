export type Source = "ME" | "EE" | "IE";

export type LubeType = "Oil" | "Grease" | "Other";

export interface LubricantRecord {
  id: string;
  Source: Source;
  Plant: string;
  EQ_Tag: string;
  EQ_Type: string;
  Part: string;
  GCMP_use: string;
  Lube_Type: LubeType;
  Unit: string;
  Makeup_Interval: string;
  Makeup_Qty: string;
  Replace_Interval: string;
  Replace_Qty: string;
}

export interface RevisionMeta {
  meRev: string;
  eeRev: string;
  ieRev: string;
  totalCount: number;
  generatedAt: string;
}

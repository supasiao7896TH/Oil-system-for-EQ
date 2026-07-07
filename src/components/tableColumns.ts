import type { SortColumn } from "../lib/search.ts";

export interface ColumnDef {
  key: SortColumn;
  label: string;
  width: string;
}

export const COLUMNS: ColumnDef[] = [
  { key: "score", label: "%ตรง", width: "56px" },
  { key: "Source", label: "แผนก", width: "58px" },
  { key: "Plant", label: "Plant", width: "80px" },
  { key: "EQ_Tag", label: "EQ Tag", width: "110px" },
  { key: "EQ_Type", label: "ประเภทอุปกรณ์", width: "190px" },
  { key: "Part", label: "Part / ตำแหน่ง", width: "160px" },
  { key: "GCMP_use", label: "GCMP Use (สารหล่อลื่น)", width: "200px" },
  { key: "Lube_Type", label: "ประเภท", width: "75px" },
  { key: "Replace_Qty", label: "Replace Qty", width: "100px" },
  { key: "Unit", label: "Unit", width: "60px" },
  { key: "Makeup_Interval", label: "Makeup Interval", width: "120px" },
  { key: "Makeup_Qty", label: "Makeup Qty", width: "100px" },
  { key: "Replace_Interval", label: "Replace Interval", width: "120px" },
];

export function columnLabel(key: SortColumn): string {
  return COLUMNS.find((c) => c.key === key)?.label ?? String(key);
}

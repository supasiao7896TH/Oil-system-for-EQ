import type { LubricantRecord } from "../data/types.ts";
import { scoreMatch } from "./scoring.ts";

export interface ScoredRecord extends LubricantRecord {
  score: number;
}

export type SortDirection = "asc" | "desc";
export type SortColumn = keyof ScoredRecord;

/** Scores every record against the query and returns only matches (score > 0), unsorted. */
export function searchRecords(records: LubricantRecord[], query: string): ScoredRecord[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const scored: ScoredRecord[] = [];
  for (const record of records) {
    const score = scoreMatch(trimmed, record);
    if (score > 0) scored.push({ ...record, score });
  }
  return scored;
}

export function sortRecords(
  records: ScoredRecord[],
  column: SortColumn,
  direction: SortDirection,
): ScoredRecord[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...records].sort((a, b) => {
    const av = a[column];
    const bv = b[column];
    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * sign;
    }
    return String(av).localeCompare(String(bv), undefined, { numeric: true }) * sign;
  });
}

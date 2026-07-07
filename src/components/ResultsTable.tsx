import type { ScoredRecord, SortColumn, SortDirection } from "../lib/search.ts";
import { COLUMNS } from "./tableColumns.ts";
import { HighlightedText } from "./HighlightedText.tsx";
import { ScoreRing } from "./ScoreRing.tsx";
import { SourceBadge } from "./SourceBadge.tsx";
import { LubeTypeChip } from "./LubeTypeChip.tsx";
import styles from "./ResultsTable.module.css";

interface Props {
  results: ScoredRecord[];
  query: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

const ROW_CLASS_BY_SOURCE: Record<ScoredRecord["Source"], string> = {
  ME: styles.rowME,
  EE: styles.rowEE,
  IE: styles.rowIE,
};

export function ResultsTable({ results, query, sortColumn, sortDirection, onSort }: Props) {
  const hasQuery = query.trim() !== "";

  if (results.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon} aria-hidden="true">
          {hasQuery ? "🔍" : "🏷"}
        </div>
        <p>{hasQuery ? "ไม่พบข้อมูลที่ตรงกับคำค้นหา" : "พิมพ์ EQ Tag หรือชื่ออุปกรณ์เพื่อเริ่มค้นหา"}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className="sr-only">ผลการค้นหาสารหล่อลื่นตามอุปกรณ์ เรียงตามคอลัมน์ที่เลือก</caption>
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const isSorted = sortColumn === col.key;
              return (
                <th
                  key={col.key}
                  className={styles.th}
                  style={{ width: col.width }}
                  aria-sort={isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                >
                  <button type="button" className={styles.thButton} onClick={() => onSort(col.key)}>
                    {col.label}
                    <span className={`${styles.sortArrow} ${isSorted ? styles.sortArrowActive : ""}`}>
                      {isSorted ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id} className={`${styles.row} ${ROW_CLASS_BY_SOURCE[r.Source]}`}>
              <td className={styles.cell}>
                <ScoreRing score={r.score} />
              </td>
              <td className={styles.cell}>
                <SourceBadge source={r.Source} />
              </td>
              <td className={styles.cell}>{r.Plant}</td>
              <td className={styles.cell}>
                <strong>
                  <HighlightedText text={r.EQ_Tag} query={query} />
                </strong>
              </td>
              <td className={styles.cell}>
                <HighlightedText text={r.EQ_Type} query={query} />
              </td>
              <td className={styles.cell}>{r.Part}</td>
              <td className={styles.cell}>
                <strong>
                  <HighlightedText text={r.GCMP_use} query={query} />
                </strong>
              </td>
              <td className={styles.cell}>
                <LubeTypeChip lubeType={r.Lube_Type} />
              </td>
              <td className={styles.cell}>{r.Replace_Qty}</td>
              <td className={styles.cell}>{r.Unit}</td>
              <td className={styles.cell}>{r.Makeup_Interval}</td>
              <td className={styles.cell}>{r.Makeup_Qty}</td>
              <td className={styles.cell}>{r.Replace_Interval}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import type { ReactNode } from "react";
import type { ScoredRecord, SortColumn, SortDirection } from "../lib/search.ts";
import { COLUMNS, columnLabel } from "./tableColumns.ts";
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

/** On narrow screens the table becomes a stack of cards (CSS-only); the label
 * span is hidden on desktop and shown before the value on mobile so each field
 * stays identifiable without the (hidden) column header row. */
function Cell({ column, children }: { column: SortColumn; children: ReactNode }) {
  return (
    <td className={styles.cell}>
      <span className={styles.cellLabel}>{columnLabel(column)}</span>
      <span className={styles.cellValue}>{children}</span>
    </td>
  );
}

export function ResultsTable({ results, query, sortColumn, sortDirection, onSort }: Props) {
  const hasQuery = query.trim() !== "";

  if (results.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon} aria-hidden="true">
          {hasQuery ? "🔎" : "🛢️"}
        </div>
        <p>
          {hasQuery
            ? "ไม่พบรายการที่ตรงกับคำค้น — ลองตรวจสอบรหัสอุปกรณ์อีกครั้ง"
            : "เริ่มพิมพ์ในช่องค้นหาด้านบน — ใช้รหัสอุปกรณ์ (เช่น PP-503) หรือชื่ออุปกรณ์ (เช่น Pump)"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className="sr-only">ตารางข้อมูลจุดหล่อลื่นของอุปกรณ์ที่ตรงกับคำค้น เรียงตามคอลัมน์ที่เลือก</caption>
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
              <Cell column="score">
                <ScoreRing score={r.score} />
              </Cell>
              <Cell column="Source">
                <SourceBadge source={r.Source} />
              </Cell>
              <Cell column="Plant">{r.Plant}</Cell>
              <Cell column="EQ_Tag">
                <strong>
                  <HighlightedText text={r.EQ_Tag} query={query} />
                </strong>
              </Cell>
              <Cell column="EQ_Type">
                <HighlightedText text={r.EQ_Type} query={query} />
              </Cell>
              <Cell column="Part">{r.Part}</Cell>
              <Cell column="GCMP_use">
                <strong>
                  <HighlightedText text={r.GCMP_use} query={query} />
                </strong>
              </Cell>
              <Cell column="Lube_Type">
                <LubeTypeChip lubeType={r.Lube_Type} />
              </Cell>
              <Cell column="Replace_Qty">{r.Replace_Qty}</Cell>
              <Cell column="Unit">{r.Unit}</Cell>
              <Cell column="Makeup_Interval">{r.Makeup_Interval}</Cell>
              <Cell column="Makeup_Qty">{r.Makeup_Qty}</Cell>
              <Cell column="Replace_Interval">{r.Replace_Interval}</Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

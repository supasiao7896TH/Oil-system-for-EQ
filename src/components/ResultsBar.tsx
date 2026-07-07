import type { SortColumn, SortDirection } from "../lib/search.ts";
import { columnLabel } from "./tableColumns.ts";
import styles from "./ResultsBar.module.css";

interface Props {
  shownCount: number;
  totalCount: number;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

function sortInfoText(column: SortColumn, direction: SortDirection): string {
  if (column === "score") {
    return direction === "desc" ? "เรียงจากความตรงมาก → น้อย" : "เรียงจากความตรงน้อย → มาก";
  }
  const label = columnLabel(column);
  return `เรียงตาม ${label} ${direction === "asc" ? "A→Z" : "Z→A"}`;
}

export function ResultsBar({ shownCount, totalCount, sortColumn, sortDirection }: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.count}>
        พบ <strong>{shownCount.toLocaleString("th-TH")}</strong> รายการ
        <span className={styles.total}> จากฐานข้อมูล {totalCount.toLocaleString("th-TH")} รายการ</span>
        {shownCount > 0 && <span className={styles.sortInfo}>{sortInfoText(sortColumn, sortDirection)}</span>}
      </div>
      <div className={styles.legend}>
        <div className={styles.legItem}>
          <div className={`${styles.legDot} ${styles.legExact}`} /> ตรงทั้งหมด (100%)
        </div>
        <div className={styles.legItem}>
          <div className={`${styles.legDot} ${styles.legClose}`} /> ใกล้เคียง (60–85%)
        </div>
        <div className={styles.legItem}>
          <div className={`${styles.legDot} ${styles.legPartial}`} /> เกี่ยวข้อง (35%)
        </div>
      </div>
    </div>
  );
}

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
    return direction === "desc" ? "🏆 เรียงตาม % มากที่สุดก่อน" : "เรียงตาม % น้อยที่สุดก่อน";
  }
  const label = columnLabel(column);
  return `เรียงตาม ${label} ${direction === "asc" ? "A→Z" : "Z→A"}`;
}

export function ResultsBar({ shownCount, totalCount, sortColumn, sortDirection }: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.count}>
        แสดง <strong>{shownCount.toLocaleString("th-TH")}</strong> รายการ
        <span className={styles.total}> จากทั้งหมด {totalCount.toLocaleString("th-TH")} รายการ</span>
        {shownCount > 0 && <span className={styles.sortInfo}>{sortInfoText(sortColumn, sortDirection)}</span>}
      </div>
      <div className={styles.legend}>
        <div className={styles.legItem}>
          <div className={`${styles.legDot} ${styles.legExact}`} /> 100% ตรง
        </div>
        <div className={styles.legItem}>
          <div className={`${styles.legDot} ${styles.legClose}`} /> 60-85% ใกล้เคียง
        </div>
        <div className={styles.legItem}>
          <div className={`${styles.legDot} ${styles.legPartial}`} /> 35% บางส่วน
        </div>
      </div>
    </div>
  );
}

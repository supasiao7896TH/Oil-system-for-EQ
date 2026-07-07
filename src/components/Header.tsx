import type { RevisionMeta } from "../data/types.ts";
import styles from "./Header.module.css";

interface Props {
  meta: RevisionMeta;
  resultCount: number;
}

export function Header({ meta, resultCount }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.icon} aria-hidden="true">
        🔍
      </div>
      <div>
        <h1 className={styles.title}>ระบบค้นหาสารหล่อลื่น GC-M PTA</h1>
        <p className={styles.subtitle}>
          ME Rev.{meta.meRev} · EE Rev.{meta.eeRev} · IE Rev.{meta.ieRev} — รวม{" "}
          {meta.totalCount.toLocaleString("th-TH")} รายการ
        </p>
      </div>
      <div className={styles.stats}>
        <span>พบ</span>
        <strong>{resultCount.toLocaleString("th-TH")}</strong>
        <span>รายการ</span>
      </div>
    </header>
  );
}

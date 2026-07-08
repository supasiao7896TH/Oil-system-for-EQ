import { useState } from "react";
import type { RevisionMeta } from "../data/types.ts";
import { GuideModal } from "./GuideModal.tsx";
import { OilDrumIcon } from "./OilDrumIcon.tsx";
import styles from "./Header.module.css";

interface Props {
  meta: RevisionMeta;
  resultCount: number;
}

export function Header({ meta, resultCount }: Props) {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.icon} aria-hidden="true">
        <OilDrumIcon />
      </div>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>OilMate</h1>
        <p className={styles.subtitle}>
          ผู้ช่วยงานหล่อลื่น GC-M PTA · ข้อมูล ME Rev.{meta.meRev} / EE Rev.{meta.eeRev} / IE Rev.
          {meta.ieRev} · {meta.totalCount.toLocaleString("th-TH")} รายการ
        </p>
      </div>
      <button type="button" className={styles.helpButton} onClick={() => setGuideOpen(true)} aria-label="วิธีใช้งาน">
        <span aria-hidden="true">📖</span>
        <span className={styles.helpLabel}>วิธีใช้งาน</span>
      </button>
      <div className={styles.stats}>
        <span>ผลลัพธ์</span>
        <strong>{resultCount.toLocaleString("th-TH")}</strong>
        <span>รายการ</span>
      </div>
      <GuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </header>
  );
}

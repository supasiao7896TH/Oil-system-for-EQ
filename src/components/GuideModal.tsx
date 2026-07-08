import { useEffect, useRef } from "react";
import styles from "./GuideModal.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CONTACT_INFO = "Line: supasiao · Email: Supasit.A@pttgcgroup.com";

export function GuideModal({ open, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <h2 id="guide-title">วิธีใช้งาน OilMate</h2>
          <button type="button" ref={closeButtonRef} className={styles.closeButton} onClick={onClose} aria-label="ปิดคู่มือ">
            ✕
          </button>
        </div>

        <div className={styles.dialogBody}>
          <section className={styles.section}>
            <h3>🔎 วิธีค้นหา</h3>
            <p>พิมพ์ในช่องค้นหาได้ 2 แบบ:</p>
            <ul>
              <li>
                <strong>รหัสอุปกรณ์ (EQ Tag)</strong> เช่น <code>PP-503</code>, <code>PC-201</code> — ระบบจะค้นหาทุกแผนก
                (ME/EE/IE) ที่เกี่ยวข้องกับอุปกรณ์นั้นให้อัตโนมัติ
              </li>
              <li>
                <strong>ชื่ออุปกรณ์</strong> เช่น <code>Compressor</code>, <code>Pump</code> — ค้นหาจากประเภทอุปกรณ์และชื่อสารหล่อลื่น
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>📊 ความหมายของ % ตรง</h3>
            <ul className={styles.scoreList}>
              <li>
                <span className={`${styles.dot} ${styles.dot100}`} /> <strong>100%</strong> — ตรงกับรหัสอุปกรณ์ทุกตัวอักษร
                (ต่างกันแค่หมายเลข Plant หรือตัวอักษรต่อท้ายเช่น A/B)
              </li>
              <li>
                <span className={`${styles.dot} ${styles.dot60}`} /> <strong>60–85%</strong> — ใกล้เคียง เช่น
                พิมพ์บางส่วนของรหัส หรือชื่ออุปกรณ์ตรงกันบางส่วน
              </li>
              <li>
                <span className={`${styles.dot} ${styles.dot35}`} /> <strong>35%</strong> — เกี่ยวข้องกัน แต่รหัสจากคนละแผนกเขียนไม่ตรงกันเป๊ะ
                (เช่น ME เรียก <code>PP-503</code> แต่ EE เรียก <code>PPM-503</code> สำหรับอุปกรณ์ตัวเดียวกัน)
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>📱 วิธีติดตั้งเป็นแอปบนมือถือ</h3>
            <p>
              <strong>Android (Chrome):</strong> เปิดเว็บนี้ → กดเมนู ⋮ มุมขวาบน → เลือก "ติดตั้งแอป" หรือ "Add to Home screen"
            </p>
            <p>
              <strong>iPhone (Safari):</strong> เปิดเว็บนี้ → กดปุ่มแชร์ 📤 ด้านล่าง → เลือก "Add to Home Screen"
            </p>
          </section>

          <section className={styles.section}>
            <h3>📩 แจ้งข้อมูลผิดพลาด / ติดต่อทีมงาน</h3>
            <p>{CONTACT_INFO}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

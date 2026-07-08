import { useInstallPrompt } from "../hooks/useInstallPrompt.ts";
import styles from "./InstallBanner.module.css";

export function InstallBanner() {
  const { platform, promptInstall, dismiss } = useInstallPrompt();

  if (platform === null) return null;

  return (
    <div className={styles.banner} role="region" aria-label="คำแนะนำการติดตั้งแอป">
      <span className={styles.icon} aria-hidden="true">
        📲
      </span>
      {platform === "android" ? (
        <>
          <p className={styles.text}>ติดตั้ง OilMate เป็นแอปเพื่อเปิดใช้งานได้เร็วขึ้น</p>
          <button type="button" className={styles.installButton} onClick={promptInstall}>
            ติดตั้ง
          </button>
        </>
      ) : (
        <p className={styles.text}>
          เพิ่ม OilMate ไปที่หน้าจอโฮม: แตะปุ่มแชร์ 📤 แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"
        </p>
      )}
      <button type="button" className={styles.dismissButton} onClick={dismiss} aria-label="ปิดคำแนะนำการติดตั้ง">
        ✕
      </button>
    </div>
  );
}

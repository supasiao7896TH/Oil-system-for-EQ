import styles from "./BrandFooter.module.css";

/** Personal brand credit, shown only in the results table's empty state (not a persistent
 * page-wide footer) — ported from a reusable fixed-footer snippet, with the fixed/overlay
 * positioning stripped since it renders in-flow here instead. */
export function BrandFooter() {
  return (
    <div className={styles.brandFooter}>
      <div className={styles.brandFlag} aria-hidden="true">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className={styles.brandName}>
        Supasit<span>@1981th</span>
      </span>
      <div className={styles.brandPaws} aria-hidden="true">
        <div className={styles.brandPaw}>
          <span className={styles.pad}></span>
          <span className={styles.toe1}></span>
          <span className={styles.toe2}></span>
          <span className={styles.toe3}></span>
          <span className={styles.toe4}></span>
        </div>
        <div className={styles.brandPaw}>
          <span className={styles.pad}></span>
          <span className={styles.toe1}></span>
          <span className={styles.toe2}></span>
          <span className={styles.toe3}></span>
          <span className={styles.toe4}></span>
        </div>
      </div>
    </div>
  );
}

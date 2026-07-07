import type { Source } from "../data/types.ts";
import styles from "./chips.module.css";

const CLASS: Record<Source, string> = { ME: "badgeME", EE: "badgeEE", IE: "badgeIE" };

export function SourceBadge({ source }: { source: Source }) {
  return (
    <span className={`${styles.badge} ${styles[CLASS[source]]}`} aria-label={`แผนก ${source}`}>
      {source}
    </span>
  );
}

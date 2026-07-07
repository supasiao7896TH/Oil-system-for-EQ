import styles from "./chips.module.css";

const TIER_CLASS: Array<[number, string]> = [
  [100, "ring100"],
  [85, "ring85"],
  [60, "ring60"],
  [35, "ring35"],
];

function tierClassFor(score: number): string {
  for (const [min, cls] of TIER_CLASS) {
    if (score >= min) return cls;
  }
  return "ring0";
}

export function ScoreRing({ score }: { score: number }) {
  const cls = tierClassFor(score);
  return (
    <div className={`${styles.ring} ${styles[cls]}`} aria-label={`ตรง ${score} เปอร์เซ็นต์`}>
      {score}%
    </div>
  );
}

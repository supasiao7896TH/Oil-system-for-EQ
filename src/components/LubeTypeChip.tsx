import type { LubeType } from "../data/types.ts";
import styles from "./chips.module.css";

const CLASS: Record<LubeType, string> = { Oil: "chipOil", Grease: "chipGrease", Other: "chipOther" };

export function LubeTypeChip({ lubeType }: { lubeType: LubeType }) {
  return <span className={`${styles.chip} ${styles[CLASS[lubeType]]}`}>{lubeType}</span>;
}

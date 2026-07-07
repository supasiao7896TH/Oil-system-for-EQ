import styles from "./SearchPanel.module.css";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  onClear: () => void;
}

export function SearchPanel({ query, onQueryChange, onClear }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="s_tag" className={styles.label}>
            🏷 EQUIPMENT TAG NO.
          </label>
          <input
            id="s_tag"
            type="text"
            className={styles.input}
            placeholder="พิมพ์ EQ Tag เช่น  PP-503  ,  PC-201  ,  Compressor  ,  Pump  ..."
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
        <button type="button" className={styles.clearButton} onClick={onClear}>
          🗑 ล้าง
        </button>
      </div>
    </div>
  );
}

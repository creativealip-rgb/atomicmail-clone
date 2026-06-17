import { useAppSelector } from "@/hooks/redux";
import styles from "./Sidebar.module.css";

export function AliasesList() {
  const aliases = useAppSelector((s) => s.aliases.list);

  if (aliases.length === 0) {
    return <p className={styles.empty}>No aliases yet</p>;
  }

  return (
    <ul className={styles.aliasList}>
      {aliases.map((a) => (
        <li key={a.id} className={styles.aliasItem}>
          <span className={styles.aliasDot} />
          {a.email}
        </li>
      ))}
    </ul>
  );
}

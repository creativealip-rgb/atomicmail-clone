import { NavLink } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { setActive } from "@/store/slices/foldersSlice";
import styles from "./Sidebar.module.css";

interface Props {
  label: {
    id: string;
    name: string;
    color: string;
    unreadCount: number;
  };
  count: number;
  onDelete: () => void;
}

export function LabelItem({ label, count, onDelete }: Props) {
  const dispatch = useAppDispatch();

  return (
    <li className={styles.labelItem}>
      <NavLink
        to={`/app/label/${label.id}`}
        className={({ isActive }) =>
          isActive ? `${styles.folderItem} ${styles.active}` : styles.folderItem
        }
        onClick={() => dispatch(setActive(label.id))}
      >
        <span className={styles.labelDot} style={{ background: label.color }} aria-hidden />
        <span className={styles.folderLabel}>{label.name}</span>
        {count > 0 && <span className={styles.folderBadge}>{count}</span>}
      </NavLink>
      <button
        className={styles.labelDelete}
        aria-label={`Delete label ${label.name}`}
        onClick={onDelete}
        title="Delete label"
      >
        ×
      </button>
    </li>
  );
}

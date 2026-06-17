import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setActive } from "@/store/slices/foldersSlice";
import { setPrivacyCenter } from "@/store/slices/uiSlice";
import { FolderItem } from "./FolderItem";
import { AliasesList } from "./AliasesList";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const folders = useAppSelector((s) => s.folders.list);
  const unreadCounts = useAppSelector((s) => s.folders.unreadCounts);
  const dispatch = useAppDispatch();

  return (
    <aside className={styles.sidebar} aria-label="Primary navigation">
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark}>⚛</span>
        <span className={styles.logoText}>Atomic Mail</span>
        <span className={styles.beta}>beta</span>
      </Link>

      <Link to="/app/mailbox/inbox" className={styles.compose} onClick={() => dispatch(setActive("inbox"))}>
        <span className={styles.composeIcon}>✎</span>
        Compose
      </Link>

      <button className={styles.privacyCenter} onClick={() => dispatch(setPrivacyCenter(true))}>
        🔒 PRIVACY CENTER
      </button>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>FOLDERS</span>
          <button className={styles.addButton} aria-label="Add folder">+</button>
        </div>
        <ul className={styles.folderList}>
          {folders.map((f) => (
            <FolderItem key={f.id} folder={f} count={unreadCounts[f.id] ?? 0} />
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>ALIASES</span>
          <button className={styles.addButton} aria-label="Add alias">+</button>
        </div>
        <AliasesList />
      </div>
    </aside>
  );
}

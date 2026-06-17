import { Link } from "react-router-dom";
import type { Folder } from "@ui/shared-types";
import { useAppDispatch } from "@/hooks/redux";
import { setActive } from "@/store/slices/foldersSlice";
import styles from "./Sidebar.module.css";

interface Props {
  folder: Folder;
  count: number;
}

const ICONS: Record<string, string> = {
  inbox: "📥",
  drafts: "📝",
  junk: "🚩",
  sent: "📤",
  trash: "🗑",
};

export function FolderItem({ folder, count }: Props) {
  const dispatch = useAppDispatch();

  return (
    <li>
      <Link
        to={`/app/mailbox/${folder.id}`}
        className={styles.folderItem}
        onClick={() => dispatch(setActive(folder.id))}
      >
        <span className={styles.folderIcon} aria-hidden>
          {ICONS[folder.id] ?? "📁"}
        </span>
        <span className={styles.folderLabel}>{folder.name}</span>
        {count > 0 && <span className={styles.folderBadge}>{count}</span>}
      </Link>
    </li>
  );
}

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { markAllRead } from "@/store/slices/messagesSlice";
import { fetchFolders } from "@/store/slices/foldersSlice";
import styles from "./MailboxView.module.css";

interface Props {
  activeFolder: string;
  activeLabelId: string | null;
  unreadCount: number;
}

export function ActionToolbar({ activeFolder, activeLabelId, unreadCount }: Props) {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);

  const handleMarkAll = async () => {
    if (!isAuth) return;
    if (activeLabelId) {
      await dispatch(markAllRead({ labelId: activeLabelId }));
    } else {
      await dispatch(markAllRead({ folder: activeFolder }));
    }
    // Refetch folders so unread counts refresh
    dispatch(fetchFolders());
  };

  return (
    <nav className={styles.toolbar} aria-label="Message actions">
      <button className={styles.toolbarBtn} disabled>
        <input type="checkbox" disabled /> Select all
      </button>
      <button
        className={styles.toolbarBtn}
        onClick={handleMarkAll}
        disabled={!isAuth || unreadCount === 0}
        title={unreadCount === 0 ? "No unread messages" : `Mark ${unreadCount} as read`}
      >
        📧 Mark all as read{unreadCount > 0 && ` (${unreadCount})`}
      </button>
      <button className={styles.toolbarBtn} disabled>
        Filter ▾
      </button>
    </nav>
  );
}

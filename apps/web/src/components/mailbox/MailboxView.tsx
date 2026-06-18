import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchMessages, moveMessage } from "@/store/slices/messagesSlice";
import { fetchAliases } from "@/store/slices/aliasesSlice";
import { fetchFolders, fetchLabels } from "@/store/slices/foldersSlice";
import { MessageList } from "./MessageList";
import { ActionToolbar } from "./ActionToolbar";
import styles from "./MailboxView.module.css";

interface Props {
  mailboxId: string;
  labelId?: string;
}

export function MailboxView({ mailboxId, labelId }: Props) {
  const dispatch = useAppDispatch();
  const { list, loading, error, activeFolder, activeLabelId } = useAppSelector((s) => s.messages);
  const folderList = useAppSelector((s) => s.folders.folders);
  const labelList = useAppSelector((s) => s.folders.labels);
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const demoMode = useAppSelector((s) => s.auth.demoMode) || import.meta.env.VITE_DEMO === "true";

  // Refetch whenever the active folder/label changes
  useEffect(() => {
    if (isAuth && !demoMode) {
      dispatch(fetchMessages({ folder: labelId ? undefined : mailboxId, labelId }));
    }
  }, [dispatch, isAuth, demoMode, mailboxId, labelId]);

  // Load sidebar data on mount + when auth becomes true
  useEffect(() => {
    if (isAuth && !demoMode) {
      dispatch(fetchAliases());
      dispatch(fetchFolders());
      dispatch(fetchLabels());
    }
  }, [dispatch, isAuth, demoMode]);

  if (!isAuth && !demoMode) {
    return <div className={styles.empty}>Sign in to view your inbox.</div>;
  }

  if (loading && list.length === 0) return <div className={styles.empty}>Loading…</div>;
  if (error) return <div className={styles.empty}>Failed to load: {error}</div>;

  // Determine current view title
  const folderObj = folderList.find((f) => f.id === activeFolder);
  const labelObj = labelList.find((l) => l.id === activeLabelId);
  const viewTitle = labelObj
    ? `Label: ${labelObj.name}`
    : folderObj
    ? folderObj.name
    : mailboxId === "all"
    ? "All Mail"
    : mailboxId;

  const emptyHint = labelId
    ? "Apply this label to a message from the message view."
    : mailboxId === "inbox"
    ? "Create an alias in the sidebar, set up a Gmail filter, and forward your first crypto email."
    : "Nothing here yet.";

  return (
    <div className={styles.view}>
      <div className={styles.viewHeader}>
        <h1 className={styles.viewTitle}>{viewTitle}</h1>
        <span className={styles.viewCount}>{list.length}</span>
      </div>
      <ActionToolbar
        activeFolder={activeFolder}
        activeLabelId={activeLabelId}
        unreadCount={list.filter((m) => !m.readAt).length}
      />
      {list.length === 0 ? (
        <div className={styles.empty}>
          <p>No messages.</p>
          <p className={styles.hint}>{emptyHint}</p>
        </div>
      ) : (
        <MessageList messages={list} />
      )}
    </div>
  );
}

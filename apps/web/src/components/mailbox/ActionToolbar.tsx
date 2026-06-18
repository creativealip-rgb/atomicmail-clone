import styles from "./MailboxView.module.css";

export function ActionToolbar() {
  return (
    <nav className={styles.toolbar} aria-label="Message actions">
      <button className={styles.toolbarBtn} disabled>
        <input type="checkbox" disabled /> Select all
      </button>
      <button className={styles.toolbarBtn} title="Mark all messages in this folder as read" disabled>
        📧 Mark all as read
      </button>
      <button className={styles.toolbarBtn} disabled>
        Filter ▾
      </button>
    </nav>
  );
}

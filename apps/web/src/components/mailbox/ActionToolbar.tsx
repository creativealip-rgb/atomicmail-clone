import styles from "./MailboxView.module.css";

export function ActionToolbar() {
  return (
    <nav className={styles.toolbar} aria-label="Message actions">
      <label className={styles.selectAll}>
        <input type="checkbox" /> Select all
      </label>
      <button className={styles.toolbarBtn}>📧 Mark all as read</button>
      <button className={styles.toolbarBtn}>Filter ▾</button>
    </nav>
  );
}

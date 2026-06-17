import styles from "./Spinner.module.css";

export interface SpinnerProps {
  size?: number;
  fullscreen?: boolean;
  label?: string;
}

export function Spinner({ size = 20, fullscreen, label = "Loading" }: SpinnerProps) {
  if (fullscreen) {
    return (
      <div className={styles.fullscreen} role="status" aria-live="polite">
        <div className={styles.spinner} style={{ width: size, height: size }} />
        <span className={styles.srOnly}>{label}…</span>
      </div>
    );
  }
  return (
    <span role="status" aria-live="polite">
      <div className={styles.spinner} style={{ width: size, height: size }} />
      <span className={styles.srOnly}>{label}…</span>
    </span>
  );
}

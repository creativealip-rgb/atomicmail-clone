import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <svg
          className={styles.illustration}
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.subtitle}>
          The link you followed may be broken, or the page may have been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primary}>Back to home</Link>
          <Link to="/app" className={styles.secondary}>Open inbox</Link>
        </div>
      </div>
    </div>
  );
}
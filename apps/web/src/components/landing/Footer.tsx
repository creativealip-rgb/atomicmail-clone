import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo size={28} />
          <span className={styles.copy}>Atomic Mail Clone</span>
        </div>
        <div className={styles.links}>
          <a href="https://atomicmail.io" target="_blank" rel="noreferrer">Original ↗</a>
          <a href="https://github.com/creativealip-rgb/atomicmail-clone" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="/docs/struktur.md" target="_blank" rel="noreferrer">Architecture doc</a>
          <a href="/docs/desain.md" target="_blank" rel="noreferrer">Design doc</a>
        </div>
        <p className={styles.note}>
          Unofficial reverse-engineered clone for educational purposes. Not affiliated with Atomic Mail Systems OÜ.
        </p>
      </div>
    </footer>
  );
}

import { Logo } from "./Logo";
import styles from "./Footer.module.css";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo size={28} />
          <span className={styles.copy}>Chainmail</span>
          <span className={styles.copy}>© {year}</span>
        </div>
        <div className={styles.links}>
          <a href="https://atomicmail.io" target="_blank" rel="noreferrer">Inspired by Atomic Mail ↗</a>
          <a href="https://github.com/creativealip-rgb/chainmail" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="/docs/struktur.md" target="_blank" rel="noreferrer">Architecture doc</a>
          <a href="/docs/desain.md" target="_blank" rel="noreferrer">Design doc</a>
        </div>
        <p className={styles.note}>
          Unofficial project. Not affiliated with Atomic Mail Systems OÜ. Original product at atomicmail.io.
        </p>
      </div>
    </footer>
  );
}

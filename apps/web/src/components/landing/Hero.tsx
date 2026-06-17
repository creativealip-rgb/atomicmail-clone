import { Link } from "react-router-dom";
import { Button } from "@ui/ui";
import { Logo } from "@/components/landing/Logo";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        <span className={styles.dot} />
        <span>Live demo · Boilerplate</span>
      </div>

      <h1 className={styles.title}>
        Encrypted email,
        <br />
        <span className={styles.gradient}>open source.</span>
      </h1>

      <p className={styles.subtitle}>
        A reverse-engineered clone of Atomic Mail's web client — E2E encryption,
        zero-access storage, modern React + Vite stack. Built for learning and
        self-hosting.
      </p>

      <div className={styles.cta}>
        <Link to="/app/auth/sign-in">
          <Button size="lg">Try the app →</Button>
        </Link>
        <a
          href="https://github.com/creativealip-rgb/atomicmail-clone"
          target="_blank"
          rel="noreferrer"
        >
          <Button size="lg" variant="secondary">View source</Button>
        </a>
      </div>

      <div className={styles.preview}>
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.dotR} />
            <span className={styles.dotY} />
            <span className={styles.dotG} />
            <span className={styles.url}>atomicmail-clone.168-144-37-19.sslip.io/app</span>
          </div>
          <div className={styles.windowBody}>
            <div className={styles.miniSidebar}>
              <Logo size={20} />
              <div className={styles.miniCompose}>Compose</div>
              <div className={styles.miniFolders}>
                <div className={styles.miniFolder} data-active="true">📥 Inbox 1</div>
                <div className={styles.miniFolder}>📤 Sent</div>
                <div className={styles.miniFolder}>📝 Drafts</div>
                <div className={styles.miniFolder}>🚩 Junk</div>
                <div className={styles.miniFolder}>🗑 Trash</div>
              </div>
            </div>
            <div className={styles.miniList}>
              <div className={styles.miniRow} data-unread="true">
                <span className={styles.miniAvatar} style={{ background: "linear-gradient(135deg,#C091FF,#8A8FFB)" }}>S</span>
                <div>
                  <div className={styles.miniSender}>Security Atomic Mail</div>
                  <div className={styles.miniSubject}>Did you log in from a new device?</div>
                </div>
                <div className={styles.miniTime}>16:01</div>
              </div>
              <div className={styles.miniRow}>
                <span className={styles.miniAvatar} style={{ background: "linear-gradient(135deg,#7DCFFF,#067DF7)" }}>C</span>
                <div>
                  <div className={styles.miniSender}>Community Atomic Mail</div>
                  <div className={styles.miniSubject}>Join Atomic Mail Community on Discord! 💬</div>
                </div>
                <div className={styles.miniTime}>11.04</div>
              </div>
              <div className={styles.miniRow}>
                <span className={styles.miniAvatar} style={{ background: "linear-gradient(135deg,#FF98F0,#C091FF)" }}>P</span>
                <div>
                  <div className={styles.miniSender}>Product Atomic Mail</div>
                  <div className={styles.miniSubject}>Welcome to Atomic Mail! 🚀</div>
                </div>
                <div className={styles.miniTime}>11.04</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

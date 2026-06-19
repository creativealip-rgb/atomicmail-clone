import { Link } from "react-router-dom";
import { Button } from "@ui/ui";
import { Logo } from "@/components/landing/Logo";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        <span className={styles.dot} />
        <span>Early access</span>
      </div>

      <h1 className={styles.title}>
        Your crypto receipts.
        <br />
        <span className={styles.gradient}>Parsed, encrypted, tax-ready.</span>
      </h1>

      <p className={styles.subtitle}>
        Forward emails from Coinbase, Binance, OpenSea, Etherscan. Chainmail
        turns them into a searchable archive and a Koinly-compatible CSV.
        Gmail stays primary.
      </p>

      <div className={styles.cta}>
        <Link to="/app/auth/sign-in">
          <Button size="lg">Try the demo →</Button>
        </Link>
        <a
          href="https://github.com/creativealip-rgb/chainmail"
          target="_blank"
          rel="noreferrer"
        >
          <Button size="lg" variant="secondary">Read source</Button>
        </a>
      </div>

      <div className={styles.preview}>
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.dotR} />
            <span className={styles.dotY} />
            <span className={styles.dotG} />
            <span className={styles.url}>chainmail.168-144-37-19.sslip.io/app</span>
          </div>
          <div className={styles.windowBody}>
            <div className={styles.miniSidebar}>
              <Logo size={20} />
              <div className={styles.miniCompose}>Compose</div>
              <div className={styles.miniFolders}>
                <div className={styles.miniFolder} data-active="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                  Inbox 1
                </div>
                <div className={styles.miniFolder}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Sent
                </div>
                <div className={styles.miniFolder}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Drafts
                </div>
                <div className={styles.miniFolder}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <line x1="4" y1="8" x2="20" y2="16" />
                  </svg>
                  Junk
                </div>
                <div className={styles.miniFolder}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                  Trash
                </div>
              </div>
            </div>
            <div className={styles.miniList}>
              <div className={styles.miniRow} data-unread="true">
                <span className={styles.miniAvatar} style={{ background: "linear-gradient(135deg,#0CE884,#067DF7)" }}>C</span>
                <div>
                  <div className={styles.miniSender}>Coinbase</div>
                  <div className={styles.miniSubject}>Bought 0.5 BTC · $32,145.00</div>
                </div>
                <div className={styles.miniTime}>16:01</div>
              </div>
              <div className={styles.miniRow}>
                <span className={styles.miniAvatar} style={{ background: "linear-gradient(135deg,#FBBC04,#FB8C00)" }}>B</span>
                <div>
                  <div className={styles.miniSender}>Binance</div>
                  <div className={styles.miniSubject}>Deposit 1,000 USDT received</div>
                </div>
                <div className={styles.miniTime}>11.04</div>
              </div>
              <div className={styles.miniRow}>
                <span className={styles.miniAvatar} style={{ background: "linear-gradient(135deg,#7DCFFF,#6648FF)" }}>E</span>
                <div>
                  <div className={styles.miniSender}>Etherscan</div>
                  <div className={styles.miniSubject}>Tx 0x7a3f...d92e · Confirmed</div>
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

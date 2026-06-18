import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: "📨",
    title: "Gmail forward, 30s setup",
    body: "Get a unique alias. Set a Gmail filter: 'from coinbase.com → forward to alias'. No email migration, no DNS.",
    status: "shipped",
  },
  {
    icon: "🔗",
    title: "Auto-parse on-chain receipts",
    body: "CEX trades, DEX swaps, NFT mints, airdrops, allowance changes — decoded into structured JSON. Coinbase + Binance + Etherscan at launch.",
    status: "wip",
  },
  {
    icon: "📊",
    title: "Tax-ready CSV, 1 click",
    body: "Per-year, per-exchange, per-chain rollup. Koinly & CoinTracker-compatible. Stop pasting CSVs from 5 exchanges by hand.",
    status: "wip",
  },
  {
    icon: "🔒",
    title: "Zero-access encrypted",
    body: "AES-GCM-256 + Ed25519. Ciphertext on our servers only. Your passphrase never leaves the device — we can't read your mail.",
    status: "shipped",
  },
];

const STATUS_LABEL: Record<string, string> = {
  shipped: "Live in demo",
  wip: "In progress",
};

export function Features() {
  return (
    <section id="features">
      <header className={styles.header}>
        <h2>What makes Chainmail different</h2>
        <p>
          Generic email clients ignore crypto. Crypto tax tools ignore email.
          Chainmail is the second inbox for the receipts in between.
        </p>
      </header>

      <div className={styles.grid}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.card}>
            <div className={styles.icon} aria-hidden>{f.icon}</div>
            <div className={styles.cardHeader}>
              <h3 className={styles.title}>{f.title}</h3>
              <span
                className={styles.badge}
                data-status={f.status}
                aria-label={STATUS_LABEL[f.status]}
              >
                {f.status === "shipped" ? "Live" : "WIP"}
              </span>
            </div>
            <p className={styles.body}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

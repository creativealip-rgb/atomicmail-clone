import styles from "./TrustPanel.module.css";

const ITEMS = [
  {
    title: "Server can store",
    body: "Encrypted email blobs, parsed receipt indexes, folder state, and export metadata.",
  },
  {
    title: "Server can't read",
    body: "Plaintext email body, recovery phrase, private key, or decrypted receipt details.",
  },
  {
    title: "Export formats",
    body: "Koinly-ready CSV now. CoinTracker-style rollups and per-wallet exports planned next.",
  },
  {
    title: "Supported sources",
    body: "Coinbase, Binance, Kraken, Tokocrypto, Indodax, Etherscan, Uniswap, OpenSea, Phantom, MetaMask.",
  },
];

export function TrustPanel() {
  return (
    <section className={styles.trust} aria-labelledby="trust-title">
      <div className={styles.copy}>
        <span className={styles.kicker}>Trust model</span>
        <h2 id="trust-title">Receipt archive without handing over plaintext.</h2>
        <p>
          Chainmail treats email as sensitive tax evidence. Messages stay useful
          for search and exports, while decryption stays local to your device.
        </p>
      </div>
      <div className={styles.grid}>
        {ITEMS.map((item) => (
          <article key={item.title} className={styles.card}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

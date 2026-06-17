import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: "🔒",
    title: "End-to-end encryption",
    body: "AES-GCM-256 with ECDH key exchange on secp256k1, Ed25519 signatures. Private keys never leave the device.",
  },
  {
    icon: "👤",
    title: "Hide-My-Email aliases",
    body: "Create disposable addresses that forward to your main inbox. Up to 10 free, 15 on Plus.",
  },
  {
    icon: "🛡",
    title: "Two-factor authentication",
    body: "TOTP-based 2FA with QR code setup and recovery codes. Required for sensitive actions.",
  },
  {
    icon: "🤖",
    title: "AI Helper",
    body: "Built-in summarizer, smart reply suggestions, security assistant. Plus plan only.",
  },
  {
    icon: "📨",
    title: "Send to non-users",
    body: "Encrypt by password (recipient unlocks via web link) or as a downloadable encrypted file.",
  },
  {
    icon: "🌗",
    title: "Light + dark themes",
    body: "Full design system parity across modes. System preference auto-detected, manual override available.",
  },
  {
    icon: "💬",
    title: "Realtime sync",
    body: "WebSocket via socket.io. New messages appear in the inbox within milliseconds of arrival.",
  },
  {
    icon: "📂",
    title: "Custom folders",
    body: "10 system folders (Inbox, Sent, Drafts, Trash, Junk, Archive, Flagged, Important, Unread, All) plus unlimited custom.",
  },
];

export function Features() {
  return (
    <section id="features">
      <header className={styles.header}>
        <h2>Features parity</h2>
        <p>What we extracted from the original product, built from scratch.</p>
      </header>

      <div className={styles.grid}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.card}>
            <div className={styles.icon} aria-hidden>{f.icon}</div>
            <h3 className={styles.title}>{f.title}</h3>
            <p className={styles.body}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

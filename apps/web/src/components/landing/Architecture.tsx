import styles from "./Architecture.module.css";

const LAYERS = [
  { name: "Web SPA", tech: "React 18 + Vite", detail: "5 routes, 9 Redux slices" },
  { name: "UI Kit", tech: "Radix + CSS Modules", detail: "8 accessible primitives" },
  { name: "Crypto", tech: "WebCrypto + @noble", detail: "AES-GCM · Ed25519 · secp256k1" },
  { name: "Storage", tech: "localforage → IndexedDB", detail: "encrypted message cache" },
  { name: "Realtime", tech: "Socket.IO", detail: "message:new · folder:unread" },
  { name: "API", tech: "ky + REST", detail: "api.chainmail.app" },
  { name: "Server", tech: "Postgres (implied)", detail: "encrypted blobs + pubkey dir" },
];

export function Architecture() {
  return (
    <section id="architecture">
      <header className={styles.header}>
        <h2>Architecture</h2>
        <p>4 top-level routes · 5-tier storage · zero plaintext on the server.</p>
      </header>

      <div className={styles.layers}>
        {LAYERS.map((l, i) => (
          <div key={l.name} className={styles.layer}>
            <div className={styles.layerIdx}>{String(i + 1).padStart(2, "0")}</div>
            <div className={styles.layerName}>{l.name}</div>
            <code className={styles.layerTech}>{l.tech}</code>
            <div className={styles.layerDetail}>{l.detail}</div>
          </div>
        ))}
      </div>

      <div className={styles.flow}>
        <h3 className={styles.flowTitle}>Login flow</h3>
        <pre className={styles.code}>
{`┌─────────────┐  email   ┌──────────────┐  step 2  ┌──────────────┐
│   Client    │ ───────► │   /v1/auth/  │ ───────► │  Derive KEK  │
│             │          │   sign-in    │          │  from pwd +  │
│             │          │   (step 1)   │          │  scrypt      │
└─────────────┘          └──────────────┘          └──────┬───────┘
                                                         │
                       ┌──────────────┐  password          │
                       │  POST step 2 │ ◄──────────────────┘
                       │  + signature │
                       ▼              │
                ┌──────────────┐       │
                │ HttpOnly Set │       │
                │ -Cookie      │       │
                └──────┬───────┘       │
                       │               │
                       ▼               ▼
                ┌──────────────┐  ┌──────────────┐
                │ Load keypair │  │ Unlock with │
                │ from IDB     │  │ scrypt KEK   │
                │ (encrypted)  │  │ (in-memory)  │
                └──────────────┘  └──────────────┘`}
        </pre>
      </div>
    </section>
  );
}

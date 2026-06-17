import styles from "./TechStack.module.css";

const STACK = [
  { layer: "Build", items: ["Vite 6", "TypeScript 5.7", "pnpm workspaces"] },
  { layer: "UI", items: ["React 18", "Radix UI primitives", "CSS Modules (BEM)", "Tabler Icons"] },
  { layer: "State", items: ["Redux Toolkit", "react-redux", "9 slices + socket middleware"] },
  { layer: "Network", items: ["ky (HTTP)", "swr (cache)", "socket.io-client (WS)"] },
  { layer: "Storage", items: ["IndexedDB via localforage", "HttpOnly cookies", "WebCrypto"] },
  { layer: "Editor", items: ["Jodit WYSIWYG", "Slate (advanced)"] },
  { layer: "Crypto", items: ["AES-GCM-256", "Ed25519 (sign)", "secp256k1 (ECDH)", "scrypt / pbkdf2 (KDF)"] },
  { layer: "Design", items: ["CSS custom properties", "Storybook 8.4", "light + dark + system"] },
];

export function TechStack() {
  return (
    <section id="stack">
      <header className={styles.header}>
        <h2>The stack</h2>
        <p>
          Same primitives, same architecture as the original — built with the
          modern, leaner, open-source equivalent.
        </p>
      </header>

      <div className={styles.grid}>
        {STACK.map((row) => (
          <div key={row.layer} className={styles.row}>
            <div className={styles.layer}>{row.layer}</div>
            <div className={styles.items}>
              {row.items.map((item) => (
                <span key={item} className={styles.item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

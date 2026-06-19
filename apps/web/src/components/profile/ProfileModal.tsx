import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { signOut } from "@/store/slices/authSlice";
import { lock } from "@/store/slices/encryptionSlice";
import { setActiveModal } from "@/store/slices/uiSlice";
import { isDemoMode } from "@/services/api/client";
import styles from "./ProfileModal.module.css";

function fmtKey(key: string): string {
  if (key.length <= 18) return key;
  return `${key.slice(0, 10)}…${key.slice(-6)}`;
}

export function ProfileModal() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const auth = useAppSelector((s) => s.auth);
  const keypair = useAppSelector((s) => s.encryption.keypair);
  const unlockState = useAppSelector((s) => s.encryption.unlockState);
  const aliasCount = useAppSelector((s) => s.aliases.list.length);
  const ref = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState<null | "pub" | "priv">(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        dispatch(setActiveModal(null));
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(setActiveModal(null));
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [dispatch]);

  const handleCopy = async (key: string, which: "pub" | "priv") => {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(which);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      /* clipboard blocked */
    }
  };

  const handleLock = () => {
    dispatch(lock());
    dispatch(setActiveModal(null));
  };

  const handleSignOut = () => {
    dispatch(lock());
    dispatch(signOut());
    dispatch(setActiveModal(null));
  };

  if (!user) {
    return (
      <div className={styles.backdrop} role="dialog" aria-modal aria-label="Profile">
        <div className={styles.modal} ref={ref}>
          <p className={styles.muted}>No user signed in.</p>
          <button className={styles.btnGhost} onClick={() => dispatch(setActiveModal(null))}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal aria-label="Profile">
      <div className={styles.modal} ref={ref}>
        <header className={styles.head}>
          <div className={styles.avatar} aria-hidden>{user.email.charAt(0).toUpperCase()}</div>
          <div className={styles.headText}>
            <h2 className={styles.title}>Profile</h2>
            <p className={styles.email}>{user.email}</p>
            <span className={styles.badge} data-state={unlockState}>
              <span className={styles.dot} aria-hidden />
              {unlockState === "unlocked" ? "Encryption unlocked" : "Encryption locked"}
            </span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(setActiveModal(null))}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Encryption keys</h3>
          {isDemoMode() && !auth.isAuthenticated && (
            <p className={styles.muted}>Demo mode — no real keys.</p>
          )}
          <KeyRow
            label="Public key"
            value={keypair?.publicKey ?? null}
            tone="safe"
            copied={copied === "pub"}
            onCopy={(v) => handleCopy(v, "pub")}
          />
          <KeyRow
            label="Private key"
            value={keypair?.privateKey ?? null}
            tone="secret"
            copied={copied === "priv"}
            onCopy={(v) => handleCopy(v, "priv")}
          />
          <p className={styles.hint}>
            Private key lives only in memory. Lock now to wipe it from this device.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Account</h3>
          <Row label="User ID" value={user.id} mono />
          <Row label="Aliases" value={String(aliasCount)} />
          <Row
            label="Created"
            value={new Date(user.createdAt).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
        </section>

        <footer className={styles.foot}>
          <button className={styles.btnGhost} onClick={handleLock} disabled={unlockState === "locked"}>
            Lock now
          </button>
          <button className={styles.btnDanger} onClick={handleSignOut}>
            Sign out
          </button>
        </footer>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={mono ? styles.rowValueMono : styles.rowValue}>{value}</span>
    </div>
  );
}

function KeyRow({
  label,
  value,
  tone,
  copied,
  onCopy,
}: {
  label: string;
  value: string | null;
  tone: "safe" | "secret";
  copied: boolean;
  onCopy: (v: string) => void;
}) {
  return (
    <div className={styles.keyRow} data-tone={tone}>
      <span className={styles.rowLabel}>{label}</span>
      <code className={styles.keyValue} title={value ?? ""}>
        {value ? fmtKey(value) : <span className={styles.muted}>locked</span>}
      </code>
      <button
        className={styles.copyBtn}
        onClick={() => value && onCopy(value)}
        disabled={!value}
        aria-label={`Copy ${label}`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
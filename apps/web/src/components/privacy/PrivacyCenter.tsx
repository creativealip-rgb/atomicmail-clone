import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setPrivacyCenter } from "@/store/slices/uiSlice";
import styles from "./PrivacyCenter.module.css";

export function PrivacyCenter() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.privacyCenterOpen);
  const encryption = useAppSelector((s) => s.encryption);
  const auth = useAppSelector((s) => s.auth);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={() => dispatch(setPrivacyCenter(false))}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Privacy Center</p>
            <h2 id="privacy-title">Security status</h2>
          </div>
          <button className={styles.close} type="button" onClick={() => dispatch(setPrivacyCenter(false))} aria-label="Close privacy center">
            ×
          </button>
        </header>

        <div className={styles.grid}>
          <article className={styles.card}>
            <span className={styles.label}>Account</span>
            <strong>{auth.user?.email ?? "Not signed in"}</strong>
            <p>Authenticated session protected by bearer token.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.label}>Key vault</span>
            <strong>{encryption.unlockState === "unlocked" ? "Unlocked" : "Locked"}</strong>
            <p>Private key material stays local/in-memory when unlocked.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.label}>Message storage</span>
            <strong>Encrypted at rest</strong>
            <p>Composer and receipt data use API auth; local drafts stay in browser storage.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

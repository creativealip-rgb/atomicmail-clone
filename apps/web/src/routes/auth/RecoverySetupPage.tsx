import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { clearRecoveryCode } from "@/store/slices/authSlice";
import { Logo } from "@/components/brand/Logo";
import styles from "./auth.module.css";

interface LocationState {
  recoveryCode?: string;
  email?: string;
}

export default function RecoverySetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const state = (location.state ?? {}) as LocationState;
  const recoveryCode = state.recoveryCode ?? "";
  const email = state.email ?? "";
  const [copied, setCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [showWords, setShowWords] = useState(true);

  if (!recoveryCode) {
    // User landed here without a code (e.g. refreshed). Bounce to sign-in.
    return (
      <div className={styles.authPage}>
        <Logo />
        <h1 className={styles.title}>No recovery code</h1>
        <p className={styles.subtitle}>
          A recovery code is generated only during sign-up. If you need to set up
          a new code, sign in and go to Settings.
        </p>
        <Link to="/app/auth/sign-in" className={styles.primary}>
          Go to sign in
        </Link>
      </div>
    );
  }

  const words = recoveryCode.split(" ");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const onContinue = () => {
    if (!acknowledged) return;
    dispatch(clearRecoveryCode());
    navigate("/app/mailbox/inbox", { replace: true });
  };

  return (
    <div className={styles.authPage}>
      <Logo />
      <h1 className={styles.title}>Save your recovery code</h1>
      <p className={styles.subtitle}>
        This 12-word phrase is the <strong>only way</strong> to recover your
        encrypted inbox if you forget your password. We can't reset it for you.
      </p>

      <div className={styles.recoveryWarning} role="alert">
        <strong>⚠️ Write this down or store it in a password manager.</strong>
        <br />
        If you lose both your password <em>and</em> this code, your encrypted
        messages are gone forever — even we can't read them.
      </div>

      <div className={styles.recoveryBox}>
        {showWords ? (
          <ol className={styles.wordList}>
            {words.map((w, i) => (
              <li key={i} className={styles.wordItem}>
                <span className={styles.wordNum}>{i + 1}</span>
                <span className={styles.wordText}>{w}</span>
              </li>
            ))}
          </ol>
        ) : (
          <code className={styles.codeText}>{recoveryCode}</code>
        )}
      </div>

      <div className={styles.recoveryActions}>
        <button
          type="button"
          onClick={() => setShowWords((s) => !s)}
          className={styles.secondary}
        >
          {showWords ? "Show as text" : "Show as list"}
        </button>
        <button
          type="button"
          onClick={copy}
          className={styles.secondary}
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>
      </div>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
        />
        <span>
          I have saved my recovery code in a safe place.
        </span>
      </label>

      <button
        type="button"
        disabled={!acknowledged}
        onClick={onContinue}
        className={styles.primary}
      >
        Continue to inbox →
      </button>

      <p className={styles.altLink}>
        Signed up as <strong>{email}</strong>.{" "}
        <Link to="/app/auth/sign-in">Sign in as a different user</Link>
      </p>
    </div>
  );
}

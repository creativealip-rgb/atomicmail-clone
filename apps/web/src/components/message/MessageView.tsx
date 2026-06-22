import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { ApiMessageDetail, ApiReceipt } from "@/store/slices/messagesSlice";
import { decryptMessageBody, getUnlockedKey, type KeyPair } from "@/services/crypto/vault";
import { LabelPicker } from "./LabelPicker";
import { parserMeta } from "@/services/parserRegistry";
import { push as pushToast } from "@/store/slices/notificationsSlice";
import { Skeleton, SkeletonRow } from "@/components/ui/Skeleton";
import styles from "./MessageView.module.css";

interface Props {
  messageId: string;
}

function formatAmount(n: number | string): string {
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return String(n);
  if (num === 0) return "0";
  if (Math.abs(num) < 0.0001) return num.toExponential(4);
  const fixed = num.toFixed(8).replace(/\.?0+$/, "");
  const [int = "0", dec] = fixed.split(".");
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${withCommas}.${dec}` : withCommas;
}

export function MessageView({ messageId }: Props) {
  const [msg, setMsg] = useState<ApiMessageDetail | null>(null);
  const [receipt, setReceipt] = useState<ApiReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decryptedBody, setDecryptedBody] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((s: RootState) => s.auth.user?.id);
  const demoMode = useSelector((s: RootState) => s.auth.demoMode);

  async function handleExportCsv() {
    if (exporting) return;
    setExporting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("chainmail.access");
      const year = new Date().getFullYear();
      const url = `${apiUrl}/api/receipts/export.csv?year=${year}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        alert(`Export failed: HTTP ${res.status}`);
        return;
      }
      const blob = await res.blob();
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = dlUrl;
      const dispo = res.headers.get("content-disposition") ?? "";
      const match = /filename="?([^"]+)"?/.exec(dispo);
      a.download = match?.[1] ?? `chainmail-receipts-${year}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(dlUrl), 1000);
    } catch (err) {
      alert(`Export failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setExporting(false);
    }
  }

  function notify(message: string) {
    dispatch(pushToast({ type: "info", message }));
  }

  // Fetch message + receipt
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("chainmail.access");
        const res = await fetch(`${apiUrl}/api/messages/${messageId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { message, receipt: linkedReceipt } = (await res.json()) as {
          message: ApiMessageDetail;
          receipt?: ApiReceipt;
        };
        if (cancelled) return;
        setMsg(message);
        if (linkedReceipt) setReceipt(linkedReceipt);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "unknown");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [messageId]);

  // W3.5: decrypt the envelope using the unlocked keypair (real user, not demo)
  useEffect(() => {
    if (!msg || !msg.encryptedBody || demoMode || !userId) {
      setDecryptedBody(null);
      return;
    }
    let cancelled = false;
    setDecrypting(true);
    (async () => {
      try {
        const kp = await getUnlockedKey(userId);
        if (!kp) {
          if (!cancelled) setDecryptedBody(null);
          return;
        }
        const plain = await decryptMessageBody(msg.encryptedBody as string, kp);
        if (!cancelled) setDecryptedBody(plain);
      } catch (err) {
        if (!cancelled) {
          console.error("decrypt failed", err);
          setDecryptedBody(null);
        }
      } finally {
        if (!cancelled) setDecrypting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [msg, userId, demoMode]);

  if (loading) {
    return (
      <div className={styles.view}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Skeleton width={140} height={11} style={{ marginBottom: 8 }} />
            <Skeleton width={280} height={22} />
          </div>
        </div>
        <div className={styles.body}>
          <SkeletonRow count={4} avatar />
        </div>
      </div>
    );
  }
  if (error) return <div className={styles.empty}>Failed to load: {error}</div>;
  if (!msg) return <div className={styles.empty}>Message not found</div>;

  const badge = parserMeta(msg.parserKey);
  const isOutbound = msg.direction === "outbound";

  return (
    <article className={styles.view}>
      {isOutbound && (
        <div
          className={styles.outboundBanner}
          data-status={msg.status}
          role="status"
        >
          <span className={styles.outboundIcon}>→</span>
          <strong>Outbound message</strong>
          <span>
            Status: <code>{msg.status}</code>
            {msg.statusDetail ? ` — ${msg.statusDetail}` : null}
          </span>
          {msg.status === "queued" && (
            <span className={styles.outboundHint}>
              SMTP relay ships in W6 — for now this is stored locally as a queued message.
            </span>
          )}
        </div>
      )}
      <nav className={styles.topActions} aria-label="Message toolbar">
        <button className={styles.toolbarBtn} title="Back" onClick={() => window.history.back()}>←</button>
        <button className={styles.toolbarBtn} title="Archive" onClick={() => notify("Archive action belum aktif")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="4" rx="1" />
            <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
            <path d="M10 12h4" />
          </svg>
        </button>
        <button className={styles.toolbarBtn} title="Delete" onClick={() => notify("Delete action belum aktif")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
        <button className={styles.toolbarBtn} title="More" onClick={() => notify("More actions belum aktif")}>⋮</button>
        <div className={styles.toolbarDivider} aria-hidden />
        <button className={styles.toolbarBtn} title="Reply" onClick={() => notify("Reply belum aktif")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 17 4 12 9 7" />
            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
          </svg>
        </button>
        <button className={styles.toolbarBtn} title="Reply all" onClick={() => notify("Reply all belum aktif")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 17 4 12 9 7" />
            <polyline points="13 17 8 12 13 7" />
            <path d="M20 18v-2a4 4 0 0 0-4-4H8" />
          </svg>
        </button>
        <button className={styles.toolbarBtn} title="Forward" onClick={() => notify("Forward belum aktif")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 17 20 12 15 7" />
            <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
          </svg>
        </button>
        <span className={styles.spacer} />
        <span className={styles.messageCount}>1 of 15</span>
        <button
          className={styles.exportBtn}
          title="Export all your receipts as CSV"
          onClick={handleExportCsv}
          disabled={exporting}
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </nav>

      <header className={styles.header}>
        <div className={styles.subjectRow}>
          <h1 className={styles.subject}>{msg.subject ?? "(no subject)"}</h1>
          {badge && (
            <span
              className={styles.parserBadge}
              style={{ background: badge.color }}
            >
              {badge.label}
            </span>
          )}
        </div>
        <div className={styles.senderRow}>
          <div className={styles.senderAvatar} aria-hidden>
            {(isOutbound ? msg.aliasEmail : msg.fromName ?? msg.fromAddr ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <div className={styles.senderMain}>
            <div className={styles.senderLine}>
              <strong>{isOutbound ? msg.aliasEmail : msg.fromName ?? msg.fromAddr}</strong>
              {!isOutbound && <span className={styles.fromAddr}>&lt;{msg.fromAddr}&gt;</span>}
            </div>
            <div className={styles.toLine}>
              to {(msg.toAddrs ?? []).join(", ") || "me"}
            </div>
          </div>
          <div className={styles.senderActions}>
            <time className={styles.timestamp}>{new Date(msg.receivedAt).toLocaleString()}</time>
          </div>
        </div>
      </header>

      {receipt && (
        <section className={styles.receipt} data-expanded={detailsOpen}>
          <div className={styles.receiptIcon} aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5Z" />
              <path d="M8 7h8" />
              <path d="M8 11h8" />
              <path d="M8 15h5" />
            </svg>
          </div>
          <div className={styles.receiptSummary}>
            <div className={styles.receiptEyebrow}>
              <span className={styles.receiptStatusDot} aria-hidden />
              Parsed receipt
            </div>
            <div className={styles.receiptCompactLine}>
              {receipt.amount != null && <strong className={styles.receiptAmount}>{formatAmount(receipt.amount)} {receipt.asset}</strong>}
              <span className={styles.receiptSentence}>
                {receipt.type ? `${receipt.type.toLowerCase()} ` : ""}
                {receipt.counterparty ? `on ${receipt.counterparty}` : receipt.chain ? `via ${receipt.chain}` : "transaction"}
              </span>
              <div className={styles.receiptChips}>
                {receipt.chain && <span className={styles.receiptPill}>{receipt.chain}</span>}
                {receipt.fiatAmount != null && <span className={styles.receiptTotal}>Total {receipt.fiatAmount} {receipt.fiat ?? ""}</span>}
              </div>
            </div>
          </div>
          <button
            className={styles.receiptDetails}
            title="Receipt details"
            aria-expanded={detailsOpen}
            onClick={() => setDetailsOpen((v) => !v)}
          >
            {detailsOpen ? "Hide" : "Details"}
          </button>
          {detailsOpen && (
            <dl className={styles.receiptMeta}>
              <div><dt>Type</dt><dd>{receipt.type}</dd></div>
              <div><dt>Asset</dt><dd>{receipt.amount != null ? `${formatAmount(receipt.amount)} ${receipt.asset}` : receipt.asset}</dd></div>
              <div><dt>Source</dt><dd>{receipt.counterparty ?? receipt.chain ?? "—"}</dd></div>
              <div><dt>Total</dt><dd>{receipt.fiatAmount != null ? `${receipt.fiatAmount} ${receipt.fiat ?? ""}` : "—"}</dd></div>
            </dl>
          )}
        </section>
      )}
      <section className={styles.bodyShell} aria-label="Message body">
        <div className={styles.body}>
          {decryptedBody !== null ? (
            decryptedBody.split("\n").map((line, i) => (
              <p key={i}>{line || " "}</p>
            ))
          ) : decrypting ? (
            <p className={styles.empty}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ verticalAlign: "-3px", marginRight: 6 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Decrypting…
            </p>
          ) : msg.encryptedBody && !demoMode ? (
            <p className={styles.empty}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ verticalAlign: "-3px", marginRight: 6 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Locked. Re-enter your password to read this message.
            </p>
          ) : (
            (msg.bodyText ?? "(empty body)").split("\n").map((line, i) => (
              <p key={i}>{line || " "}</p>
            ))
          )}
        </div>
      </section>
      <div className={styles.bottomActions}>
        <button className={styles.bottomReplyBtn} onClick={() => notify("Reply belum aktif")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 17 4 12 9 7" />
            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
          </svg>
          Reply
        </button>
        <button className={styles.bottomReplyBtn} onClick={() => notify("Reply all belum aktif")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 17 4 12 9 7" />
            <polyline points="13 17 8 12 13 7" />
            <path d="M20 18v-2a4 4 0 0 0-4-4H8" />
          </svg>
          Reply all
        </button>
        <button className={styles.bottomReplyBtn} onClick={() => notify("Forward belum aktif")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 17 20 12 15 7" />
            <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
          </svg>
          Forward
        </button>
      </div>
    </article>
  );
}
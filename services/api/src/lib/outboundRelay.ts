import { and, asc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { aliases, messages } from "../db/schema/index.js";
import { env } from "./env.js";

let relayTimer: NodeJS.Timeout | null = null;
let relayRunning = false;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToHtml(value: string): string {
  return `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`;
}

async function relayViaResend(row: {
  id: string;
  aliasEmail: string;
  toAddrs: string[] | null;
  subject: string | null;
  bodyText: string | null;
  bodyHtml: string | null;
}) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
  const from = env.OUTBOUND_FROM_EMAIL ?? row.aliasEmail;
  const to = row.toAddrs ?? [];
  if (to.length === 0) throw new Error("message has no recipients");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: row.subject ?? "",
      html: row.bodyHtml || textToHtml(row.bodyText ?? ""),
      text: row.bodyText ?? undefined,
      headers: {
        "X-Chainmail-Message-Id": row.id,
        "Reply-To": row.aliasEmail,
      },
    }),
  });

  const payload = await res.text();
  if (!res.ok) {
    throw new Error(`resend ${res.status}: ${payload.slice(0, 300)}`);
  }
  return payload;
}

export async function processOutboundQueue(limit = 5) {
  if (relayRunning) return { processed: 0, skipped: "already-running" };
  relayRunning = true;
  let processed = 0;

  try {
    if (!env.RESEND_API_KEY) return { processed: 0, skipped: "RESEND_API_KEY not configured" };

    const queued = await db
      .select({
        id: messages.id,
        aliasEmail: aliases.email,
        toAddrs: messages.toAddrs,
        subject: messages.subject,
        bodyText: messages.bodyText,
        bodyHtml: messages.bodyHtml,
      })
      .from(messages)
      .innerJoin(aliases, eq(messages.aliasId, aliases.id))
      .where(and(eq(messages.direction, "outbound"), eq(messages.status, "queued")))
      .orderBy(asc(messages.receivedAt))
      .limit(limit);

    for (const row of queued) {
      try {
        await relayViaResend(row);
        await db
          .update(messages)
          .set({ status: "sent", statusDetail: null })
          .where(eq(messages.id, row.id));
        processed += 1;
      } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        await db
          .update(messages)
          .set({ status: "failed", statusDetail: detail.slice(0, 500) })
          .where(eq(messages.id, row.id));
        processed += 1;
      }
    }

    return { processed };
  } finally {
    relayRunning = false;
  }
}

export function startOutboundRelay() {
  if (relayTimer) return;
  if (!env.RESEND_API_KEY) {
    console.log("[outbound-relay] disabled: RESEND_API_KEY not configured");
    return;
  }

  const tick = async () => {
    try {
      const result = await processOutboundQueue();
      if (result.processed) console.log("[outbound-relay] processed", result.processed);
    } catch (err) {
      console.error("[outbound-relay] tick failed", err);
    }
  };

  relayTimer = setInterval(tick, 15_000);
  relayTimer.unref?.();
  void tick();
  console.log("[outbound-relay] started");
}

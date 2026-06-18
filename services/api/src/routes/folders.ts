/**
 * Folders & labels routes.
 *
 * GET    /api/folders       — system folders + per-folder unread counts
 * GET    /api/labels        — user's custom labels + per-label unread counts
 * POST   /api/labels        — create custom label
 * DELETE /api/labels/:id    — delete custom label (cascades through message_labels)
 *
 * PATCH  /api/messages/:id  — move to folder, star, etc.
 * POST   /api/messages/:id/labels    — set labels on a message
 * GET    /api/messages/:id/labels    — get labels on a message
 *
 * All routes require auth.
 */
import { Hono } from "hono";
import { z } from "zod";
import { eq, and, sql, isNull, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { aliases, messages, labels, messageLabels } from "../db/schema/index.js";
import { requireAuth, type ChainmailVars } from "../middleware/auth.js";

const route = new Hono<{ Variables: ChainmailVars }>();
route.use("*", requireAuth());

// ── Constants ───────────────────────────────────────────────────
const SYSTEM_FOLDERS = [
  { id: "inbox", name: "Inbox", kind: "system" as const },
  { id: "flagged", name: "Starred", kind: "system" as const },
  { id: "important", name: "Important", kind: "system" as const },
  { id: "sent", name: "Sent", kind: "system" as const },
  { id: "drafts", name: "Drafts", kind: "system" as const },
  { id: "archive", name: "Archive", kind: "system" as const },
  { id: "junk", name: "Spam", kind: "system" as const },
  { id: "trash", name: "Trash", kind: "system" as const },
];

/** Map folder id to actual messages.folder value */
const FOLDER_TO_SQL: Record<string, string> = {
  inbox: "inbox",
  sent: "sent",
  drafts: "drafts",
  trash: "trash",
  junk: "junk",
  archive: "archive",
  // Special system views:
  flagged: "flagged",     // reserved for future use
  important: "important", // reserved for future use
};

async function userAliasIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ id: aliases.id })
    .from(aliases)
    .where(eq(aliases.userId, userId));
  return rows.map((r) => r.id);
}

// ── GET /api/folders ────────────────────────────────────────────
route.get("/folders", async (c) => {
  const userId = c.get("userId");
  const aliasIds = await userAliasIds(userId);
  if (aliasIds.length === 0) {
    return c.json({
      folders: SYSTEM_FOLDERS.map((f) => ({ ...f, unreadCount: 0 })),
    });
  }

  // Count unread per folder
  const rows = await db
    .select({
      folder: messages.folder,
      unread: sql<number>`COUNT(*) FILTER (WHERE ${messages.readAt} IS NULL)`,
      total: sql<number>`COUNT(*)`,
    })
    .from(messages)
    .where(inArray(messages.aliasId, aliasIds))
    .groupBy(messages.folder);

  const byFolder = Object.fromEntries(rows.map((r) => [r.folder, r]));

  return c.json({
    folders: SYSTEM_FOLDERS.map((f) => ({
      ...f,
      unreadCount: Number(byFolder[f.id]?.unread ?? 0),
      totalCount: Number(byFolder[f.id]?.total ?? 0),
    })),
  });
});

// ── GET /api/labels ─────────────────────────────────────────────
route.get("/labels", async (c) => {
  const userId = c.get("userId");
  const rows = await db
    .select({
      id: labels.id,
      name: labels.name,
      color: labels.color,
      createdAt: labels.createdAt,
    })
    .from(labels)
    .where(eq(labels.userId, userId))
    .orderBy(labels.name);

  // Per-label unread count: join messages, count unread
  const counts = await db
    .select({
      labelId: messageLabels.labelId,
      unread: sql<number>`COUNT(*) FILTER (WHERE ${messages.readAt} IS NULL)`,
      total: sql<number>`COUNT(*)`,
    })
    .from(messageLabels)
    .innerJoin(messages, eq(messageLabels.messageId, messages.id))
    .innerJoin(aliases, eq(messages.aliasId, aliases.id))
    .where(eq(aliases.userId, userId))
    .groupBy(messageLabels.labelId);

  const byId = Object.fromEntries(counts.map((c) => [c.labelId, c]));

  return c.json({
    labels: rows.map((l) => ({
      id: l.id,
      name: l.name,
      color: l.color,
      createdAt: l.createdAt,
      kind: "custom" as const,
      unreadCount: Number(byId[l.id]?.unread ?? 0),
      totalCount: Number(byId[l.id]?.total ?? 0),
    })),
  });
});

// ── POST /api/labels ────────────────────────────────────────────
const createLabelSchema = z.object({
  name: z.string().min(1).max(40).trim(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#6366f1"),
});

route.post("/labels", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json().catch(() => null);
  const parsed = createLabelSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid payload", issues: parsed.error.flatten() }, 400);
  }

  // Check duplicate
  const [existing] = await db
    .select({ id: labels.id })
    .from(labels)
    .where(and(eq(labels.userId, userId), eq(labels.name, parsed.data.name)))
    .limit(1);
  if (existing) {
    return c.json({ error: "label name already exists", labelId: existing.id }, 409);
  }

  const [row] = await db
    .insert(labels)
    .values({ userId, name: parsed.data.name, color: parsed.data.color })
    .returning();
  return c.json(
    { label: { ...row, kind: "custom", unreadCount: 0, totalCount: 0 } },
    201
  );
});

// ── DELETE /api/labels/:id ──────────────────────────────────────
route.delete("/labels/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "invalid id" }, 400);

  const [existing] = await db
    .select({ id: labels.id })
    .from(labels)
    .where(and(eq(labels.id, id), eq(labels.userId, userId)))
    .limit(1);
  if (!existing) return c.json({ error: "not found" }, 404);

  await db.delete(labels).where(eq(labels.id, id));
  return c.json({ ok: true, deletedId: id });
});

// ── PATCH /api/messages/:id ─────────────────────────────────────
const patchMessageSchema = z.object({
  folder: z.enum(["inbox", "sent", "drafts", "trash", "junk", "archive", "flagged", "important"]).optional(),
});

route.patch("/messages/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: "invalid id" }, 400);

  const body = await c.req.json().catch(() => null);
  const parsed = patchMessageSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid payload", issues: parsed.error.flatten() }, 400);
  }

  // Verify ownership
  const aliasIds = await userAliasIds(userId);
  const allowed = new Set(aliasIds);
  const [existing] = await db
    .select({ id: messages.id, aliasId: messages.aliasId, folder: messages.folder })
    .from(messages)
    .where(eq(messages.id, id))
    .limit(1);
  if (!existing || !allowed.has(existing.aliasId)) {
    return c.json({ error: "not found" }, 404);
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.folder) updates.folder = parsed.data.folder;

  if (Object.keys(updates).length === 0) {
    return c.json({ message: existing }, 200);
  }

  const [updated] = await db
    .update(messages)
    .set(updates)
    .where(eq(messages.id, id))
    .returning();

  return c.json({ message: updated });
});

// ── POST /api/messages/:id/labels ───────────────────────────────
const setLabelsSchema = z.object({
  labelIds: z.array(z.string().uuid()).max(50),
});

route.post("/messages/:id/labels", async (c) => {
  const userId = c.get("userId");
  const messageId = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(messageId)) return c.json({ error: "invalid id" }, 400);

  const body = await c.req.json().catch(() => null);
  const parsed = setLabelsSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid payload", issues: parsed.error.flatten() }, 400);
  }

  // Verify message ownership
  const aliasIds = await userAliasIds(userId);
  const allowed = new Set(aliasIds);
  const [msg] = await db
    .select({ id: messages.id, aliasId: messages.aliasId })
    .from(messages)
    .where(eq(messages.id, messageId))
    .limit(1);
  if (!msg || !allowed.has(msg.aliasId)) {
    return c.json({ error: "not found" }, 404);
  }

  // Verify all labels belong to user
  if (parsed.data.labelIds.length > 0) {
    const userLabels = await db
      .select({ id: labels.id })
      .from(labels)
      .where(and(eq(labels.userId, userId), inArray(labels.id, parsed.data.labelIds)));
    const ownedIds = new Set(userLabels.map((l) => l.id));
    const invalid = parsed.data.labelIds.filter((id) => !ownedIds.has(id));
    if (invalid.length > 0) {
      return c.json({ error: "unknown labelIds", invalid }, 400);
    }
  }

  // Replace assignments atomically
  await db.transaction(async (tx) => {
    await tx.delete(messageLabels).where(eq(messageLabels.messageId, messageId));
    if (parsed.data.labelIds.length > 0) {
      await tx
        .insert(messageLabels)
        .values(parsed.data.labelIds.map((labelId) => ({ messageId, labelId })));
    }
  });

  return c.json({ ok: true, messageId, labelIds: parsed.data.labelIds });
});

// ── GET /api/messages/:id/labels ────────────────────────────────
route.get("/messages/:id/labels", async (c) => {
  const userId = c.get("userId");
  const messageId = c.req.param("id");
  if (!/^[0-9a-f-]{36}$/i.test(messageId)) return c.json({ error: "invalid id" }, 400);

  const aliasIds = await userAliasIds(userId);
  const allowed = new Set(aliasIds);
  const [msg] = await db
    .select({ id: messages.id, aliasId: messages.aliasId })
    .from(messages)
    .where(eq(messages.id, messageId))
    .limit(1);
  if (!msg || !allowed.has(msg.aliasId)) {
    return c.json({ error: "not found" }, 404);
  }

  const rows = await db
    .select({
      id: labels.id,
      name: labels.name,
      color: labels.color,
    })
    .from(messageLabels)
    .innerJoin(labels, eq(messageLabels.labelId, labels.id))
    .where(eq(messageLabels.messageId, messageId));

  return c.json({ labels: rows });
});

export const foldersRoute = route;

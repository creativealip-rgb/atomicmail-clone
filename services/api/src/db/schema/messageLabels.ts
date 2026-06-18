import { pgTable, uuid, primaryKey, timestamp, index } from "drizzle-orm/pg-core";
import { messages } from "./messages.js";
import { labels } from "./labels.js";

/**
 * Many-to-many between messages and labels.
 * Composite PK on (messageId, labelId) prevents duplicate assignments.
 */
export const messageLabels = pgTable(
  "message_labels",
  {
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    labelId: uuid("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.messageId, t.labelId] }),
    labelIdx: index("message_labels_label_idx").on(t.labelId),
  })
);

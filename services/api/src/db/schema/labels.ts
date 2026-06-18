import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users.js";

/**
 * Custom user-defined labels (color-coded tags).
 * Distinct from system folders (inbox/sent/drafts/trash/junk/archive/flagged).
 */
export const labels = pgTable(
  "labels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull().default("#6366f1"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("labels_user_idx").on(t.userId),
    nameIdx: index("labels_user_name_idx").on(t.userId, t.name),
  })
);

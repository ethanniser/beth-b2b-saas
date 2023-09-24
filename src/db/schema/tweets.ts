import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { user } from ".";

export const tweets = sqliteTable(
  "tweet",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    authorId: text("author_id").notNull(),
    content: text("content").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      authorIdx: index("author_idx").on(table.authorId),
      createdAtIdx: index("created_at_idx").on(table.createdAt),
    };
  },
);
export type Tweet = typeof tweets.$inferSelect;
export type InsertTweet = typeof tweets.$inferInsert;

export const insertTweetSchema = createInsertSchema(tweets);
export const selectTweetSchema = createSelectSchema(tweets);

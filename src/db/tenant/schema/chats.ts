import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tickets } from "./tickets";

export const chats = sqliteTable(
  "chats",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

    ticket_id: integer("ticket_id").notNull(),
    message: text("message").notNull(),

    sender: text("status", {
      enum: ["employee", "costomer"],
    }).notNull(),
    timestamp: integer("timestamp", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    ticket_id_index: index("ticket_id_index").on(table.ticket_id),
    timestamp_index: index("timestamp_index").on(table.timestamp),
  }),
);

export const chatsRelations = relations(chats, ({ one }) => ({
  ticket: one(tickets, {
    fields: [chats.ticket_id],
    references: [tickets.id],
  }),
}));

export type Chat = typeof chats.$inferSelect;

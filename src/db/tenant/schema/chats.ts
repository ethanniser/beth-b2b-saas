import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { tickets } from "./tickets";

export const chats = sqliteTable(
  "chat",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    ticket_id: integer("ticket_id").notNull(),
    sender: text("sender", {
      enum: ["employee", "customer"],
    }).notNull(),
    message: text("message").notNull(),
    timestamp: integer("timestamp", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      ticket_id_idx: index("ticket_id_idx").on(table.ticket_id),
    };
  },
);

export const chatsRelations = relations(chats, ({ one }) => ({
  ticket: one(tickets, {
    fields: [chats.ticket_id],
    references: [tickets.id],
  }),
}));

export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;

export const insertChatSchema = createInsertSchema(chats);
export const selectChatSchema = createSelectSchema(chats);

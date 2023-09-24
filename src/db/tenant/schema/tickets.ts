import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { chats } from "./chats";

export const tickets = sqliteTable(
  "tickets",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    assigned_employee_id: text("assigned_employee_id"),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    status: text("status", {
      enum: ["open", "closed"],
    })
      .notNull()
      .$default(() => "open"),
    created_at: integer("created_at", { mode: "timestamp" })
      .notNull()

      .$defaultFn(() => new Date()),
    updated_at: integer("updated_at", { mode: "timestamp" }),
    closed_at: integer("closed_at", { mode: "timestamp" }),
  },
  (table) => ({
    status_index: index("status_index").on(table.status),
  }),
);

export const ticketsRelations = relations(tickets, ({ many }) => ({
  chats: many(chats),
}));

export type Ticket = typeof tickets.$inferSelect;

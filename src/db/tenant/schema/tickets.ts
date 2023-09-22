import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { chats } from "./chats";

export const tickets = sqliteTable(
  "tickets",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    // * References employee user id from primary database
    assigned_employee_user_id: text("assigned_employee_user_id").notNull(),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    status: text("status", { enum: ["open", "closed"] })
      .notNull()
      .default("open"),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp" }),
  },
  (table) => {
    return {
      assigned_employee_user_id_idx: index("assigned_employee_user_id_idx").on(
        table.assigned_employee_user_id,
      ),
      status_idx: index("status_idx").on(table.status),
    };
  },
);

export const ticketsRelations = relations(tickets, ({ many }) => ({
  chats: many(chats),
}));

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

export const insertTicketSchema = createInsertSchema(tickets);
export const selectTicketSchema = createSelectSchema(tickets);

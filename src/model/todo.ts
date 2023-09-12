import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const todos = sqliteTable("todo", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
});

export type Todo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;

export const insertTodoSchema = createInsertSchema(todos);
export const selectTodoSchema = createSelectSchema(todos);

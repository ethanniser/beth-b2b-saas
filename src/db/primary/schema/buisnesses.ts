import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { user } from ".";

export const buisnesses = sqliteTable("buisnesses", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  database_url: text("database_url").notNull(),
  database_auth_token: text("database_auth_token").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});
export type Buisness = typeof buisnesses.$inferSelect;
export type InsertBuisness = typeof buisnesses.$inferInsert;

export const insertBuisnessSchema = createInsertSchema(buisnesses);
export const selectBuisnessSchema = createSelectSchema(buisnesses);

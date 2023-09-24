import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { user } from ".";

export const organizations = sqliteTable("organizations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  database_name: text("database_name").notNull(),
  database_auth_token: text("database_auth_token").notNull(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(user),
}));

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

export const insertOrganizationSchema = createInsertSchema(organizations);
export const selectOrganizationSchema = createSelectSchema(organizations);

import { relations } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { buisnesses } from ".";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  role: text("role", { enum: ["admin", "user"] })
    .notNull()
    .default("user"),

  // google auth stuff
  email: text("email").notNull(),
  name: text("name").notNull(),
  picture: text("picture").notNull(),

  // relations
  buisnessId: integer("buisness_id", { mode: "number" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

export const userRelations = relations(user, ({ one }) => ({
  buisness: one(buisnesses, {
    fields: [user.buisnessId],
    references: [buisnesses.id],
  }),
}));

export const session = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
});

export const key = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  hashedPassword: text("hashed_password"),
});

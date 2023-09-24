import { relations } from "drizzle-orm";
import { user } from "./auth";
import { tweets } from "./tweets";

export { tweets } from "./tweets";

export { key, session, user } from "./auth";

export const userRelations = relations(user, ({ many }) => ({
  tweets: many(tweets),
}));

export const tweetsRelations = relations(tweets, ({ one }) => ({
  author: one(user, {
    fields: [tweets.authorId],
    references: [user.id],
  }),
}));

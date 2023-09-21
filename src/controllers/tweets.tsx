import { Elysia, t } from "elysia";
import { authed } from "../auth/middleware";
import { TweetCard } from "../components/tweets";
import { ctx } from "../context";
import { tweets } from "../db/schema/tweets";

export const tweetsController = new Elysia({
  prefix: "/tweets",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .post(
    "/",
    async ({ session, db, body, set, log }) => {
      if (!session) {
        set.status = "Unauthorized";
        set.headers["HX-Redirect"] = "/signin";
        return "Sign in to post a tweet.";
      }

      const [tweet] = await db
        .insert(tweets)
        .values({
          authorId: session.user.userId,
          content: body.content,
        })
        .returning();

      if (!tweet) {
        throw new Error("Failed to create tweet");
      }

      return <TweetCard {...tweet} />;
    },
    {
      body: t.Object({
        content: t.String({
          minLength: 1,
          maxLength: 280,
        }),
      }),
    },
  );

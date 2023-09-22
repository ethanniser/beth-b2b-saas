import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { authed } from "../auth/middleware";
import { AdditionalTweetList, TweetCard } from "../components/tweets";
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
  .get(
    "/",
    async ({ query: { after } }) => {
      const date = new Date(after);

      return <AdditionalTweetList after={date} />;
    },
    {
      query: t.Object({
        after: t.String({
          format: "date-time",
        }),
      }),
    },
  )
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

      return (
        <TweetCard
          content={tweet.content}
          createdAt={tweet.createdAt}
          author={{ handle: session.user.handle }}
          id={tweet.id}
        />
      );
    },
    {
      body: t.Object({
        content: t.String({
          minLength: 1,
          maxLength: 280,
        }),
      }),
    },
  )
  .delete(
    "/:tweetId",
    async ({ session, db, params: { tweetId }, set, log }) => {
      if (!session) {
        set.status = "Unauthorized";
        return (
          <div id="tweetDeleteError" class="text-center text-red-500">
            Unauthorized
          </div>
        );
      }

      const [tweet] = await db
        .select()
        .from(tweets)
        .where(eq(tweets.id, tweetId));

      log.debug(tweet);

      if (!tweet) {
        set.status = "Not Found";
        return (
          <div id="tweetDeleteError" class="text-center text-red-500">
            Tweet not found
          </div>
        );
      }

      if (tweet.authorId !== session.user.userId) {
        set.status = "Unauthorized";
        return (
          <div id="tweetDeleteError" class="text-center text-red-500">
            Unauthorized
          </div>
        );
      }

      await db.delete(tweets).where(eq(tweets.id, tweetId));
    },
    {
      params: t.Object({
        tweetId: t.Numeric(),
      }),
    },
  );

import { db } from "../db";
import { tweets } from "../db/schema/tweets";

export function TweetCard({
  author: { handle },
  createdAt,
  content,
  id,
}: {
  createdAt: Date;
  content: string;
  author: {
    handle: string;
  };
  id: number;
}) {
  return (
    <div
      class="rounded-lg border p-4 shadow-md"
      id={`tweet-${id}`}
      hx-ext="response-targets"
    >
      <h2 class="text-xl font-bold" safe>
        @{handle}
      </h2>
      <p class="text-gray-700" safe>
        {content}
      </p>
      <div class="flex flex-row justify-between">
        <span class="text-sm text-gray-500">{createdAt.toLocaleString()}</span>
        <button
          class="i-lucide-x text-lg text-red-500"
          hx-delete={`/api/tweets/${id}`}
          hx-target={`#tweet-${id}`}
          hx-swap="outerHTML"
          hx-target-4xx="next #tweetDeleteError"
          hx-confirm="Are you sure you want to delete this tweet?"
        />
      </div>
      <div id="tweetDeleteError" />
    </div>
  );
}

export async function InitialTweetList() {
  const tweetData = await db.query.tweets.findMany({
    limit: 5,
    orderBy: (tweets, { desc }) => [desc(tweets.createdAt)],
    with: {
      author: {
        columns: {
          handle: true,
        },
      },
    },
  });

  const lastTweetTime = tweetData[tweetData.length - 1]?.createdAt;

  return (
    <>
      <div class="space-y-4" id="tweetList">
        {tweetData.map((tweet) => (
          <TweetCard {...tweet} />
        ))}
        <div
          hx-get={`/api/tweets?after=${lastTweetTime?.toISOString()}`}
          hx-swap="beforeend"
          hx-target="#tweetList"
          hx-trigger="revealed"
        />
      </div>
    </>
  );
}

export async function AdditionalTweetList({ after }: { after: Date }) {
  const tweetData = await db.query.tweets.findMany({
    where: (tweets, { lt }) => lt(tweets.createdAt, after),
    limit: 5,
    orderBy: (tweets, { desc }) => [desc(tweets.createdAt)],
    with: {
      author: {
        columns: {
          handle: true,
        },
      },
    },
  });

  const lastTweetTime = tweetData[tweetData.length - 1]?.createdAt;

  return (
    <>
      {tweetData.map((tweet) => (
        <TweetCard {...tweet} />
      ))}
      {lastTweetTime && (
        <div
          hx-get={`/api/tweets?after=${lastTweetTime.toISOString()}`}
          hx-swap="beforeend"
          hx-target="#tweetList"
          hx-trigger="revealed"
        />
      )}
    </>
  );
}

export function TweetCreationForm() {
  return (
    <div class="rounded-lg border p-4 shadow-md">
      <h2 class="mb-4 text-xl font-bold">Create a new Tweet</h2>
      <form
        hx-post="/api/tweets"
        hx-swap="afterbegin"
        hx-target="#tweetList"
        _="on submit target.reset()"
      >
        <label class="mb-2 block text-sm font-bold" for="content">
          Tweet:
        </label>
        <input
          class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
          name="content"
          required="true"
        />
        <button
          class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          type="submit"
        >
          Post Tweet
        </button>
      </form>
    </div>
  );
}

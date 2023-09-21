import { db } from "../db";
import { tweets, type Tweet } from "../db/schema/tweets";

export function TweetCard({ authorId, createdAt, content }: Tweet) {
  return (
    <div class="rounded-lg border p-4 shadow-md">
      <h2 class="text-xl font-bold" safe>
        {authorId}
      </h2>
      <p class="text-gray-700" safe>
        {content}
      </p>
      <span class="text-sm text-gray-500">
        {new Date(createdAt).toLocaleString()}
      </span>
    </div>
  );
}

export async function TweetList() {
  const tweetData = await db.select().from(tweets).limit(10);

  return (
    <div class="space-y-4" id="tweetList">
      {tweetData.map((tweet) => (
        <TweetCard {...tweet} />
      ))}
    </div>
  );
}

export function TweetCreationForm() {
  return (
    <div class="rounded-lg border p-4 shadow-md">
      <h2 class="mb-4 text-xl font-bold">Create a new Tweet</h2>
      <form hx-post="/api/tweets" hx-swap="afterend" hx-target="#tweetList">
        <label class="mb-2 block text-sm font-bold" for="content">
          Tweet:
        </label>
        <textarea
          class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
          name="content"
          rows="3"
          required="true"
          _="on submit reset me"
        ></textarea>
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

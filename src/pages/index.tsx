import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { renderToString } from "beth-jsx";
import { persistedCache, revalidateTag } from "../beth/cache";

const start = Date.now();

const getTime = async () => (Date.now() - start) / 1000;

const cachedGetTime = persistedCache(getTime, "getTime", {
  tags: ["time"],
  revalidate: 2,
});

export const index = new Elysia()
  .use(ctx)
  .onRequest(({ request }) => {
    const revalidate = request.headers.get("HX-Revalidate");
    if (revalidate) {
      const tags = JSON.parse(revalidate);
      tags.forEach((tag: string) => {
        revalidateTag(tag);
      });
    }
  })
  .get("/test", async () => {
    const time = await cachedGetTime();
    return renderToString(() => <p safe>{time}</p>);
  })
  .get("/", async ({ set }) => {
    set.headers["content-type"] = "text/html";
    return renderToString(() => (
      <BaseHtml>
        <h1>cache revalidates on two second interval</h1>
        <button hx-get="/test" hx-target="#foo" hx-swap="beforeend">
          click me to get time (cached)
        </button>
        <br />
        <br />
        <button
          hx-get="/test"
          hx-target="#foo"
          hx-swap="beforeend"
          hx-revalidate="time"
        >
          click me (revalidate now)
        </button>
        <div id="foo"></div>
      </BaseHtml>
    ));
  });

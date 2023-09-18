import { persistedCache, revalidateTag } from "beth-stack/cache";
import { renderToStream, renderToString, Suspense } from "beth-stack/jsx";
import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";

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
      if (!Array.isArray(tags)) {
        return;
      }
      tags.forEach((tag) => {
        if (typeof tag !== "string") {
          return;
        }
        revalidateTag(tag);
      });
    }
  })
  .get("/test", async ({ html }) => {
    const time = await cachedGetTime();
    return html(() => <p>{time}</p>);
  })
  .get("/", async ({ html }) => {
    return html(() => (
      <BaseHtml>
        <h1>cache revalidates every two seconds</h1>
        <button hx-get="/test" hx-target="#foo" hx-swap="beforeend">
          click me to get time since start (cached)
        </button>
        <br />
        <div>hot reload</div>
        <br />
        <button
          hx-get="/test"
          hx-target="#foo"
          hx-swap="beforeend"
          hx-revalidate="time"
        >
          click me to get time since start (revalidate now)
        </button>
        <div id="foo"></div>
      </BaseHtml>
    ));
  })
  .get("/test2", async () => {
    return renderToStream(() => <App2 />);
  });

function wait(ms: number): Promise<number> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(ms);
    }, ms),
  );
}

export async function Wait({ ms }: { ms: number }) {
  const data = await wait(ms);

  return <div>loaded in: {data}ms</div>;
}

const App2 = () => (
  <BaseHtml>
    <div>
      <p>I am sent immediately</p>
      <Suspense fallback={<div>Loading...</div>}>
        <Wait ms={1000} />
        <div>hello</div>
      </Suspense>
      <p>hey me too!</p>
      <Suspense fallback={<div>loading 2...</div>}>
        <Wait ms={2000} />
        <div>hello two!</div>
        <Suspense fallback={<div>loading 3...</div>}>
          <Wait ms={3000} />
          <div>hello three!</div>
        </Suspense>
      </Suspense>
    </div>
  </BaseHtml>
);

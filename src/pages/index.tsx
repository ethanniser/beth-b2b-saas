import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";

export const index = new Elysia({
  name: "@pages/index",
})
  .use(ctx)
  .get("/", async ({ html, db, log, config }) => {
    const start = performance.now();
    // const todos = await db().query.todos.findMany();
    log.info(`query took ${performance.now() - start}ms`);

    const res = await fetch("https://api.turso.tech/v1/groups", {
      headers: {
        Authorization: `Bearer ${config.env.TURSO_API_TOKEN}`,
      },
    });
    const json = await res.text();

    return html(() => (
      <BaseHtml>
        <h1>hi!</h1>
        {/* <p safe>{JSON.stringify(todos)}</p> */}
        <p safe>{JSON.stringify(json)}</p>
      </BaseHtml>
    ));
  });

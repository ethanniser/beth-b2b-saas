import { staticPlugin } from "@elysiajs/static";
// import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { config } from "./config";
import { ctx } from "./context";
import { api } from "./controllers/*";
import { todos } from "./db/schema";
import { pages } from "./pages/*";


const app = new Elysia({
  name: "@app/app",
})
  // .use(swagger())
  //@ts-expect-error
  // .use(staticPlugin())
  // .use(api)
  // .use(pages)
  .use(ctx)
  .get("/create", async (ctx) => {
    const todo = await ctx.db.insert(todos).values({ content: "Hello World" }).returning();

    return todo;
  })
  .get("/all", async (ctx) => {
    const result = await ctx.db.select().from(todos);
    return result
  })
  .onStart(() => {
    if (config.env.NODE_ENV === "development") {
      void fetch("http://localhost:3001/restart");
      console.log("🦊 Triggering Live Reload");
    }
  })
  .onError(({ code, error, request }) => {
    console.error(` ${request.method} ${request.url}`, code, error);
  })
  .listen(3000);

export type App = typeof app;

console.log(
  `app is listening on http://${app.server?.hostname}:${app.server?.port}`,
);
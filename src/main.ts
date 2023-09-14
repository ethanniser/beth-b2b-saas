import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import { api } from "./controllers/*";
import { config } from "./config";
import { pages } from "./pages/*";

const app = new Elysia()
  // @ts-expect-error idk why this is broken
  .use(swagger())
  // @ts-expect-error idk why this is broken
  .use(staticPlugin())
  .use(api)
  .use(pages)
  .onStart(() => {
    if (config.env.NODE_ENV === "development") {
      void fetch("http://localhost:3001/restart");
      console.log("🦊 Triggering Live Reload");
    }
  })
  .listen(3000);

export type App = typeof app;

console.log(
  `app is listening on http://${app.server?.hostname}:${app.server?.port}`
);

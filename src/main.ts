import { Elysia } from "elysia";
// import { swagger } from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import { api } from "./controllers/*";
import { config } from "./config";
import { pages } from "./pages/*";

const app = new Elysia()
  // .use(swagger())
  .use(staticPlugin())
  .use(api)
  .use(pages)
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
  `app is listening on http://${app.server?.hostname}:${app.server?.port}`
);

import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import { api } from "./controllers";
import { autoroutes } from "elysia-autoroutes";
import { config } from "./config";

const app = new Elysia({
  name: "@app/main",
})
  // @ts-expect-error idk why this is broken
  .use(swagger())
  .use(staticPlugin())
  .use(api)
  .use(
    autoroutes({
      routesDir: "./pages",
    })
  )
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

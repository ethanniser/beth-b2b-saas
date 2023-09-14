import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import { todosService } from "./handlers/todos";
import { pages } from "./pages";

const app = new Elysia({
  name: "@app/main",
})
  // @ts-expect-error idk why this is broken
  .use(swagger())
  .use(staticPlugin())
  .use(todosService)
  .use(pages)
  .listen(3000);

export type App = typeof app;

console.log(
  `app is listening on http://${app.server?.hostname}:${app.server?.port}`
);

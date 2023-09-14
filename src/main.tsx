import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import { todosService } from "./services/todos";
import { BaseHtml } from "./components/base";
import Html from "@kitajs/html";

const app = new Elysia({
  name: "@app/main",
})
  // @ts-expect-error idk why this is broken
  .use(swagger())
  .use(staticPlugin())
  .use(todosService)
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <body
          class="flex w-full h-screen justify-center items-center"
          hx-get="/todos"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </BaseHtml>
    )
  )
  .listen(3000);

export type App = typeof app;

console.log(
  `app is listening on http://${app.server?.hostname}:${app.server?.port}`
);

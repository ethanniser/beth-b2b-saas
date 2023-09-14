import { Elysia } from "elysia";
import { ctx } from "../context";
import Html from "@kitajs/html";
import { BaseHtml } from "../components/base";

export const pages = new Elysia({
  name: "@app/pages",
})
  .use(ctx)
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <div
          class="flex w-full h-screen justify-center items-center"
          hx-get="/todos"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </BaseHtml>
    )
  );

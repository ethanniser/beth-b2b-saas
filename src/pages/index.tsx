import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";

export const index = new Elysia().use(ctx).get("/", ({ html }) =>
  html(
    <BaseHtml>
      <div
        class="flex w-full h-screen justify-center items-center"
        hx-get="/api/todos"
        hx-swap="innerHTML"
        hx-trigger="load"
      />
    </BaseHtml>
  )
);

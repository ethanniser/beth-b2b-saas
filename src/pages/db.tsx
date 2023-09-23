import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";

export const db = new Elysia().use(ctx).get("/test", async ({ html }) => {
  return html(() => (
    <BaseHtml>
      <div class="flex flex-col items-center py-3">
        <button
          hx-post="/api/db/test"
          hx-target="#result"
          hx-swap="innerHTML"
          hx-indicator="#spinner"
        >
          Click me
        </button>
        <div
          id="spinner"
          class="i-lucide-loader-2 text-2x htmx-indicator animate-spin"
        />
        <div id="result" />
      </div>
    </BaseHtml>
  ));
});

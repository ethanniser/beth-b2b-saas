import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";

export const index = new Elysia({
  name: "@pages/index",
})
  .use(ctx)
  .get("/", async ({html}) => {

    return html(() => (
      <BaseHtml>
        <h1>hi!</h1>
      </BaseHtml>
    ));
  });

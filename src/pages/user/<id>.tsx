import Elysia from "elysia";
import { BaseHtml } from "../../components/base";
import { ctx } from "../../context";

export const id = new Elysia({
  name: "@pages/user/[id]",
})
  .use(ctx)
  .get("/user/:id", async ({ html, params: { id } }) => {
    return html(() => (
      <BaseHtml>
        <h1>hi: {id}!</h1>
      </BaseHtml>
    ));
  });

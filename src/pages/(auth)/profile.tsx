import Elysia from "elysia";
import { BaseHtml } from "../../components/base";
import { ctx } from "../../context";

export const profile = new Elysia()
  .use(ctx)
  .get("/profile", async ({ auth, html, request }) => {
    const authRequest = auth.handleRequest(request);

    const session = await authRequest.validate();
    return html(() =>
      session ? <div>Hello {session.user.email}</div> : <div>Not logged in</div>
    );
  });

import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { DashBoard } from "../components/dashboard";
import { ctx } from "../context";

export const dashboard = new Elysia()
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get("/dashboard", async ({ html, session, set }) => {
    if (!session) {
      set.redirect = "/login";
      set.headers["HX-Location"] = "/";
      return;
    }

    return html(() => (
      <BaseHtml>
        <DashBoard>
          <main class="flex-1 p-5">
            <h2 class=" text-xl" safe>
              Welcome back, {session.user.name}
            </h2>
            <p>Here is the overview of your account:</p>
            <div class=" grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div class="rounded-md border p-5">
                <h3 class=" text-lg">Total Users</h3>
                <p>500</p>
              </div>
              <div class="rounded-md border p-5">
                <h3 class=" text-lg">New Users Today</h3>
                <p>50</p>
              </div>
              <div class="rounded-md border p-5">
                <h3 class=" text-lg">Active Users</h3>
                <p>350</p>
              </div>
            </div>
          </main>
        </DashBoard>
      </BaseHtml>
    ));
  });

import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { redirect } from "../lib";

export const newUser = new Elysia()
  .use(ctx)
  .get("/new-user", async ({ html, session, set, headers }) => {
    if (!session) {
      redirect(
        {
          set,
          headers,
        },
        "/login",
      );
      return;
    }

    return html(() => (
      <BaseHtml>
        <main class="flex w-full flex-col items-center justify-center gap-5">
          <h1 safe class="text-3xl font-bold">
            hi new user {session.user.name}
          </h1>
          <p>Do you want to join or create a organization?</p>
          <form
            class="flex flex-col items-center justify-center gap-5"
            hx-post="/api/organization"
          >
            <input name="organizationName" placeholder="organization name" />
            <button type="submit">create organization</button>
          </form>
          <form
            class="flex flex-col items-center justify-center gap-5"
            hx-post="/api/organization/join"
          >
            <input name="organizationCode" placeholder="organization code" />
            <button type="submit">join organization</button>
          </form>
        </main>
      </BaseHtml>
    ));
  });

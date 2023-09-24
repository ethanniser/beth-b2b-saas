import Elysia from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { organizations } from "../db/primary/schema";
import { redirect } from "../lib";

export const newUser = new Elysia()
  .use(ctx)
  .get("/new-user", async ({ html, session, set, headers, db }) => {
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

    const orgId = session.user.organization_id;

    if (orgId) {
      const organization = await db.query.organizations.findFirst({
        where: (organizations, { eq }) => eq(organizations.id, orgId),
      });

      if (organization) {
        redirect(
          {
            set,
            headers,
          },
          "/dashboard",
        );
        return;
      }
    }

    return html(() => (
      <BaseHtml>
        <main
          class="flex h-screen w-full flex-col items-center justify-center gap-5 bg-gray-200"
          hx-ext="response-targets"
        >
          <h1 safe class="text-center text-3xl font-semibold">
            Thanks for signing up {session.user.name}, please create or join an
            organization to get started!
          </h1>
          <form
            class="w-96 space-y-3 rounded-lg bg-white p-8 shadow-md"
            hx-post="/api/organization"
            hx-target-4xx="#errorMessageCreate"
            hx-target-5xx="#errorMessageCreate"
            hx-swap="innerHTML"
          >
            <label
              for="organizationName"
              class="block text-sm font-medium text-gray-600"
            >
              Organization Name (numbers and letters only)
            </label>
            <input
              type="text"
              name="organizationName"
              id="organizationName"
              placeholder="Enter organization name"
              required="true"
              minlength="1"
              maxlength="30"
              pattern="[a-zA-Z0-9]+"
              class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              type="submit"
              data-loading-disable
              class="flex w-full items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Create Organization
              <div
                data-loading
                class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
              />
            </button>
            <div class=" text-red-400" id="errorMessageCreate" />
          </form>
          <form
            hx-post="/api/organization/join"
            hx-swap="innerHTML"
            hx-target-4xx="#errorMessageJoin"
            hx-target-5xx="#errorMessageJoin"
            class="w-96 space-y-3 rounded-lg bg-white p-8 shadow-md"
            data-loading-states
          >
            <label
              for="joinCode"
              class="block text-sm font-medium text-gray-600"
            >
              Join with Code (get from organization admin)
            </label>
            <input
              type="text"
              name="organizationCode"
              placeholder="Enter code"
              required="true"
              pattern="^org-[a-z0-9]{7}$"
              class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              data-loading-disable
              class="flex w-full items-center justify-center rounded-md bg-green-600 p-2 text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Join Organization
              <div
                data-loading
                class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
              />
            </button>
            <div id="errorMessageJoin" class=" text-red-500"></div>
          </form>
        </main>
      </BaseHtml>
    ));
  });

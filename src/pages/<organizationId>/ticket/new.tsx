import { Elysia, t } from "elysia";
import { BaseHtml } from "../../../components/base";
import { ctx } from "../../../context";

export const newRoute = new Elysia().use(ctx).get(
  "/:orgId/ticket/new",
  async ({ db, set, headers, html, config, params }) => {
    const organization = await db.query.organizations.findFirst({
      where: (organizations, { eq }) => eq(organizations.id, params.orgId),
    });
    if (!organization) {
      return html(() => (
        <BaseHtml>
          <div class="flex h-screen flex-col items-center justify-center">
            <h1 class="text-5xl">
              Organization not found, is the link correct?
            </h1>
          </div>
        </BaseHtml>
      ));
    }

    return html(() => (
      <BaseHtml>
        <main
          class="flex h-screen w-full flex-col items-center justify-center gap-5 bg-gray-200"
          hx-ext="response-targets"
        >
          <h1 safe class="text-center text-3xl font-semibold">
            Submit a new ticket for {organization.name}
          </h1>
          <form
            class="w-96 space-y-3 rounded-lg bg-white p-8 shadow-md"
            hx-post="/api/ticket"
            hx-target-4xx="#errorMessage"
            hx-target-5xx="#errorMessage"
            hx-swap="innerHTML"
          >
            <label
              for="subject"
              class="block text-sm font-medium text-gray-600"
            >
              Subject
            </label>
            <input
              type="text"
              name="subject"
              placeholder="Enter a subject for your ticket"
              required="true"
              minlength="3"
              maxlength="40"
              class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <label
              for="description"
              class="block text-sm font-medium text-gray-600"
            >
              Description
            </label>
            <textarea
              name="description"
              placeholder="Please describe your issue in detail"
              required="true"
              minlength="10"
              maxlength="500"
              rows="5"
              class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="hidden"
              name="organizationId"
              value={organization.id.toString()}
            />

            <button
              type="submit"
              data-loading-disable
              class="flex w-full items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Submit Ticket
              <div
                data-loading
                class="i-lucide-loader-2 ml-2 animate-spin text-2xl"
              />
            </button>
            <div class=" text-red-400" id="errorMessage" />
          </form>
        </main>
      </BaseHtml>
    ));
  },
  {
    params: t.Object({
      orgId: t.Numeric(),
    }),
  },
);

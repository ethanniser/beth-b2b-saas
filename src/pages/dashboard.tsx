import { and, eq, gt, lt, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import { FancyLink } from "../components";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { tickets } from "../db/tenant/schema";
import { redirect } from "../lib";

export const dashboard = new Elysia()
  .use(ctx)
  .get("/dashboard", async ({ db, session, set, headers, html }) => {
    if (!session) {
      redirect({ set, headers }, "/login");
      return;
    }

    const orgId = session.user.organization_id;

    if (!orgId) {
      redirect({ set, headers }, "/new-user");
      return;
    }

    const organization = await db.query.organizations.findFirst({
      where: (organizations, { eq }) => eq(organizations.id, orgId),
    });

    if (!organization) {
      redirect({ set, headers }, "/new-user");
      return;
    }

    const { tenantDb } = getTenantDb({
      dbName: organization.database_name,
      authToken: organization.database_auth_token,
    });

    const [[openTickets], [closedTicketsInLastWeek]] = await tenantDb.batch([
      tenantDb
        .select({
          count: sql<number>`count(*)`,
        })
        .from(tickets)
        .where(eq(tickets.status, "open")),
      tenantDb
        .select({
          count: sql<number>`count(*)`,
        })
        .from(tickets)
        .where(
          and(
            eq(tickets.status, "closed"),
            gt(
              tickets.closed_at,
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            ),
            lt(tickets.closed_at, new Date(Date.now())),
          ),
        ),
    ]);

    const openTicketCount = openTickets?.count ?? 0;
    const closedTicketCountInLastWeek = closedTicketsInLastWeek?.count ?? 0;

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main class="flex-1 space-y-4 py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <div>
                <h2 class="text-5xl" safe>
                  Welcome, {session.user.name}
                </h2>
                <p class="text-xl">Here is the overview of your account:</p>
              </div>

              <div class="pr-10 text-right text-5xl" safe>
                {organization.name}
              </div>

              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            <div class="grid grid-cols-1 gap-5 px-5 md:grid-cols-2 lg:grid-cols-3">
              <Card
                name="Unclosed Tickets"
                value={openTicketCount.toString()}
                href="/tickets"
              />
              <Card
                name="Tickets Closed Today"
                value={closedTicketCountInLastWeek.toString()}
                href="/tickets"
              />
              <Card
                name="Customer Satisfaction This Week"
                value="50%"
                href="#"
              />
            </div>
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });

function Card({
  name,
  value,
  href,
}: {
  name: string;
  value: string;
  href: string;
}) {
  return (
    <div class="relative rounded-md border p-5 ">
      <h3 class="text-xl">{name}</h3>
      <p class="font-bold">{value}</p>
      <FancyLink text="View" href={href} />
    </div>
  );
}

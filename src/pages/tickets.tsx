import Elysia from "elysia";
import { FancyLink } from "../components";
import { BaseHtml } from "../components/base";
import { Dashboard } from "../components/dashboard";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { Ticket, tickets } from "../db/tenant/schema/tickets";
import { redirect } from "../lib";

export const ticketsRoute = new Elysia()
  .use(ctx)
  .get("/tickets", async ({ db, session, set, headers, html, config }) => {
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

    const tickets = await tenantDb.query.tickets.findMany({
      orderBy: (tickets, { desc }) => desc(tickets.created_at),
    });

    return html(() => (
      <BaseHtml>
        <Dashboard>
          <main class="flex-1 space-y-4 py-5">
            <div class="relative flex items-center justify-between px-6 py-3">
              <h2 class="text-5xl" safe>
                Manage Your Tickets - {organization.name}
              </h2>
              <div class="absolute inset-x-0 bottom-0 h-1 shadow-md"></div>
            </div>

            {!tickets || tickets.length === 0 ? (
              <div class="px-6 py-5 text-center">
                <p class="text-xl">You have no tickets.</p>
              </div>
            ) : (
              <div class="grid grid-cols-1 gap-5 px-6 md:grid-cols-2 lg:grid-cols-3">
                {tickets.map((ticket) => (
                  <TicketCard ticket={ticket} orgId={orgId} />
                ))}
              </div>
            )}
          </main>
        </Dashboard>
      </BaseHtml>
    ));
  });

function TicketCard({ ticket, orgId }: { ticket: Ticket; orgId: number }) {
  return (
    <div class="relative h-40 rounded-md border p-5 shadow-lg">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold">{ticket.subject}</h3>
        {ticket.status === "open" ? (
          <span class="rounded-full bg-yellow-100 px-3 py-1  font-semibold text-yellow-700">
            {ticket.status}
          </span>
        ) : (
          <span class="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
            {ticket.status}
          </span>
        )}
      </div>
      <p class="text-lg text-gray-500" safe>
        {ticket.description}
      </p>
      <p class="text-gray-500" safe>
        {ticket.created_at.toLocaleString()}
      </p>
      <FancyLink href={`/${orgId}/ticket/${ticket.id}`} text="View Ticket" />
    </div>
  );
}

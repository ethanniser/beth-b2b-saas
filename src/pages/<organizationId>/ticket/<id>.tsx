import { Elysia, t } from "elysia";
import { BaseHtml } from "../../../components/base";
import { Dashboard } from "../../../components/dashboard";
import { ctx } from "../../../context";
import { Organization } from "../../../db/primary/schema/organization";
import { getTenantDb } from "../../../db/tenant";
import { Chat } from "../../../db/tenant/schema/chats";
import { Ticket, tickets } from "../../../db/tenant/schema/tickets";
import { redirect } from "../../../lib";

export const id = new Elysia().use(ctx).get(
  "/:orgId/ticket/:ticketId",
  async ({ db, session, set, headers, html, config, params }) => {
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

    const { tenantDb } = getTenantDb({
      dbName: organization.database_name,
      authToken: organization.database_auth_token,
    });

    const ticket = await tenantDb.query.tickets.findFirst({
      where: (tickets, { eq }) => eq(tickets.id, params.ticketId),
      with: {
        chats: true,
      },
    });

    if (!ticket) {
      return html(() => (
        <BaseHtml>
          <div class="flex h-screen flex-col items-center justify-center">
            <h1 class="text-5xl">Ticket not found, is the link correct?</h1>
          </div>
        </BaseHtml>
      ));
    }

    if (session && session?.user.organization_id !== organization.id) {
      redirect(
        {
          set,
          headers,
        },
        "/dashboard",
      );
      return;
    }

    return html(() => (
      <BaseHtml>
        {session ? (
          <Dashboard>
            <ChatPage
              ticket={ticket}
              employee={true}
              organization={organization}
              chats={ticket.chats}
            />
          </Dashboard>
        ) : (
          <ChatPage
            ticket={ticket}
            organization={organization}
            chats={ticket.chats}
          />
        )}
      </BaseHtml>
    ));
  },
  {
    params: t.Object({
      orgId: t.Numeric(),
      ticketId: t.Numeric(),
    }),
  },
);

function ChatPage({
  ticket,
  employee,
  organization,
  chats,
}: {
  ticket: Ticket;
  employee?: boolean;
  organization: Organization;
  chats: Chat[];
}) {
  return (
    <div class="flex h-screen flex-col">
      <div class="flex items-center justify-between border-b border-gray-300 p-4">
        <div>
          <h1 class="flex items-center gap-4 text-3xl font-bold">
            <span safe>Subject - {ticket.subject}</span>
            {ticket.status === "open" ? (
              <span class="rounded-full bg-yellow-100 px-3 py-1  font-semibold text-yellow-700">
                {ticket.status}
              </span>
            ) : (
              <span class="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
                {ticket.status}
              </span>
            )}
          </h1>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex flex-row items-center gap-5">
            <div safe class="text-2xl text-gray-600">
              Organization: {organization.name}
              {employee ? " - Employee" : "- Customer"}
            </div>
            <button
              hx-post={
                ticket.status === "open"
                  ? `/api/ticket/close`
                  : `/api/ticket/open`
              }
              hx-vals={`
                {
                  "organizationId": ${organization.id},
                  "ticketId": ${ticket.id}
                }
              `}
              class={`
              ${
                ticket.status === "open"
                  ? "bg-green-500 hover:bg-green-700"
                  : "bg-yellow-500 hover:bg-yellow-700"
              }
              rounded-md bg-gray-800 px-4 py-2 text-white`}
            >
              {ticket.status === "open" ? "Close Ticket" : "Reopen Ticket"}
            </button>
          </div>
          {!employee && (
            <a href="/" class="text-blue-600 hover:underline">
              Looking for employee view?{" "}
            </a>
          )}
        </div>
      </div>
      <div
        id="chatMessages"
        class="flex-1 overflow-y-auto p-4"
        _="
        on load set my scrollTop to my scrollHeight end
        on htmx:afterSettle set my scrollTop to my scrollHeight end
        "
      >
        {chats.map((chat) => (
          <ChatBubble chat={chat} />
        ))}
        {ticket.status === "closed" && (
          <div class="relative mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            This ticket is closed at{" "}
            {ticket.closed_at ? ticket.closed_at.toLocaleString() : "never?"}
          </div>
        )}
      </div>
      <div hx-ext="response-targets">
        <form
          hx-post="/api/chat"
          hx-target="#chatMessages"
          hx-swap="beforeend"
          hx-target-4xx="#errorMessage"
          hx-target-5xx="#errorMessage"
          data-loading-states
          class="flex items-center justify-between border-t border-gray-300 p-4"
          _="on submit me.reset()"
        >
          <input
            name="message"
            type="text"
            minlength="1"
            maxlength="500"
            disabled={ticket.status === "closed"}
            required="true"
            placeholder="Type your message here..."
            class="flex-1 rounded-md border border-gray-300 p-2
            focus:outline-none focus:ring-2 focus:ring-gray-600
            "
          />
          <input
            type="hidden"
            name="role"
            value={employee ? "employee" : "costomer"}
          />
          <input
            type="hidden"
            name="organizationId"
            value={organization.id.toString()}
          />
          <input type="hidden" name="ticketId" value={ticket.id.toString()} />
          <button
            data-loading-disable
            id="chatSubmit"
            type="submit"
            class="ml-4 rounded-md bg-gray-800 
            px-4
            py-2 text-white hover:bg-gray-700"
            disabled={ticket.status === "closed"}
          >
            Send
          </button>
        </form>
        <div id="errorMessage" class=" text-red-500"></div>
      </div>
    </div>
  );
}

export function ChatBubble({ chat }: { chat: Chat }) {
  return (
    <div
      class={`flex ${
        chat.sender === "employee" ? "justify-start" : "justify-end"
      } my-2`}
    >
      <div
        class={`rounded-lg px-4 py-2 text-lg shadow ${
          chat.sender === "costomer" ? "bg-gray-200" : "bg-gray-700 text-white"
        }`}
      >
        <span safe>{chat.message}</span>
        <div
          class={`mt-2 text-xs ${
            chat.sender === "costomer" ? "text-gray-600" : "text-gray-300"
          }`}
        >
          {chat.timestamp.toLocaleString()}
          sp
        </div>
      </div>
    </div>
  );
}

import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { chats, tickets } from "../db/tenant/schema";
import { redirect } from "../lib";
import { ChatBubble } from "../pages/<organizationId>/ticket/<id>";

export const chatController = new Elysia({
  prefix: "/chat",
})
  .use(ctx)
  .post(
    "/",
    async ({ db, body, set, headers }) => {
      const organization = await db.query.organizations.findFirst({
        where: (organizations, { eq }) =>
          eq(organizations.id, body.organizationId),
      });

      if (!organization) {
        set.status = "Forbidden";
        return;
      }

      const { tenantDb } = getTenantDb({
        dbName: organization.database_name,
        authToken: organization.database_auth_token,
      });

      const result = await tenantDb.batch([
        tenantDb
          .insert(chats)
          .values({
            message: body.message,
            sender: body.role,
            ticket_id: body.ticketId,
          })
          .returning(),
        tenantDb
          .update(tickets)
          .set({
            updated_at: new Date(),
          })
          .where(eq(tickets.id, body.ticketId)),
      ]);

      const chat = result[0][0];

      if (!chat) {
        set.status = "Internal Server Error";
        return "Internal Server Error";
      }

      return <ChatBubble chat={chat} />;
    },
    {
      body: t.Object({
        organizationId: t.Numeric(),
        ticketId: t.Numeric(),
        message: t.String({
          minLength: 1,
          maxLength: 500,
        }),
        role: t.Union([t.Literal("employee"), t.Literal("costomer")]),
      }),
    },
  );

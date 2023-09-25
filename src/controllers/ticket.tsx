import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { getTenantDb } from "../db/tenant";
import { tickets } from "../db/tenant/schema";
import { redirect } from "../lib";

export const ticketController = new Elysia({
  prefix: "/ticket",
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

      const [ticket] = await tenantDb
        .insert(tickets)
        .values({
          description: body.description,
          subject: body.subject,
        })
        .returning();

      if (!ticket) {
        set.status = "Internal Server Error";
        return;
      }

      redirect(
        {
          set,
          headers,
        },
        `/${organization.id}/ticket/${ticket.id}`,
      );
    },
    {
      body: t.Object({
        organizationId: t.Numeric(),
        subject: t.String({
          minLength: 3,
          maxLength: 40,
        }),
        description: t.String({
          minLength: 10,
          maxLength: 500,
        }),
      }),
    },
  )
  .post(
    "/open",
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

      const [ticket] = await tenantDb
        .update(tickets)
        .set({
          status: "open",
          closed_at: null,
        })
        .where(eq(tickets.id, body.ticketId))
        .returning();

      if (!ticket) {
        set.status = "Internal Server Error";
        return;
      }

      redirect(
        {
          set,
          headers,
        },
        `/${organization.id}/ticket/${ticket.id}`,
      );
    },
    {
      body: t.Object({
        organizationId: t.Numeric(),
        ticketId: t.Numeric(),
      }),
    },
  )
  .post(
    "/close",
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

      const [ticket] = await tenantDb
        .update(tickets)
        .set({
          status: "closed",
          closed_at: new Date(),
        })
        .where(eq(tickets.id, body.ticketId))
        .returning();

      if (!ticket) {
        set.status = "Internal Server Error";
        return;
      }

      redirect(
        {
          set,
          headers,
        },
        `/${organization.id}/ticket/${ticket.id}`,
      );
    },
    {
      body: t.Object({
        organizationId: t.Numeric(),
        ticketId: t.Numeric(),
      }),
    },
  );

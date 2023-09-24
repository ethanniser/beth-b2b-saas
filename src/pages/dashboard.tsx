import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
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

    return html(() => (
      <BaseHtml>
        <h1>
          {organization.name} - {session.user.name}
        </h1>
      </BaseHtml>
    ));
  });

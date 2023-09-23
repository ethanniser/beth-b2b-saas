import Elysia from "elysia";
import { ctx } from "../context";
import { getTenantDb, pushToTenantDb } from "../db/tenant";
import { tickets } from "../db/tenant/schema";

export const dbController = new Elysia({
  prefix: "/db",
})
  .use(ctx)
  .post("/test", async ({ turso }) => {
    const {
      database: { Name },
    } = await turso.databases.create({
      name: "org3",
      group: "test",
    });

    const { jwt } = await turso.logicalDatabases.mintAuthToken(
      "ethanniser",
      Name,
    );

    await pushToTenantDb({
      dbName: Name,
      authToken: jwt,
    });

    const test = getTenantDb({
      dbName: Name,
      authToken: jwt,
    });

    const result = await test.tenantDb
      .insert(tickets)
      .values({
        assigned_employee_user_id: "ethanniser",
        description: "test",
        subject: "test",
      })
      .returning();

    return <p>{JSON.stringify(result)}</p>;
  });

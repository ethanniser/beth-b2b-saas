import { pushToTenantDb } from ".";
import { db } from "../primary";

const organizations = await db.query.organizations.findMany();

organizations.forEach(async (org) => {
  await pushToTenantDb({
    dbName: org.database_name,
    authToken: org.database_auth_token,
    input: true,
  });
  console.log("pushed to tenant db", org.database_name);
});

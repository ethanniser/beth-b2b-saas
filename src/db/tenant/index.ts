import { unlinkSync } from "fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function getTenantDb({
  database_url,
  database_auth_token,
}: {
  database_url: string;
  database_auth_token: string;
}) {
  const client = createClient({
    url: database_url,
    authToken: database_auth_token,
  });

  const db = drizzle(client, { schema, logger: true });

  return {
    tenantClient: client,
    tenantDb: db,
    [Symbol.dispose]: () => client.close(),
  } as const;
}

const getConfigText = ({
  url,
  authToken,
}: {
  url: string;
  authToken: string;
}) => `
  export default {
  schema: "./src/db/primary/schema/index.ts",
  driver: "turso",
  dbCredentials: {
    url: "${url}",
    authToken: "${authToken}",
  },
  tablesFilter: ["!libsql_wasm_func_table"],
}`;

export async function pushToTenantDb({
  url,
  authToken,
}: {
  url: string;
  authToken: string;
}) {
  const schemaPath = "./src/db/tenant/schema/index.ts";
  const configPath = "./src/db/tenant/temp-drizzle.config.ts";

  const command = [
    "bunx",
    "drizzle-kit",
    "push:sqlite",
    // "--driver=turso",
    // "--tablesFilter=!libsql_wasm_func_table",
    // `--schema=${schemaPath}`,
    // `--url=${url}`,
    // `--authToken=${authToken}`,
    `--config=${configPath}`,
  ];

  await Bun.write(
    configPath,
    getConfigText({
      authToken,
      url,
    }),
  );

  return new Promise<void>((resolve, reject) => {
    Bun.spawn(command, {
      onExit(subprocess, exitCode, signalCode, error) {
        if (error || exitCode !== 0) {
          console.error(error);
          unlinkSync(configPath);
          reject({
            error,
            exitCode,
            signalCode,
          });
        }
        unlinkSync(configPath);
        resolve();
      },
    });
  });
}

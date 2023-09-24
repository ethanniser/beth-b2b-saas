import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { config } from "../../config";
import * as schema from "./schema";

const options = (() => {
  switch (config.env.DATABASE_CONNECTION_TYPE) {
    case "local":
      return {
        url: "file:local.sqlite",
      };
    case "remote":
      return {
        url: config.env.DATABASE_URL,
        authToken: config.env.DATABASE_AUTH_TOKEN!,
      };
    case "local-replica":
      return {
        url: "file:local.sqlite",
        syncUrl: config.env.DATABASE_URL,
        authToken: config.env.DATABASE_AUTH_TOKEN!,
      };
  }
})();

export const client = createClient(options);

await client.sync();

export const db = drizzle(client, { schema, logger: true });

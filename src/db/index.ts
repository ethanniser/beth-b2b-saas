import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { config } from "../config";
import * as schema from "./schema";

export const client = createClient({
  url: config.env.DATABASE_URL,
  authToken: config.env.DATABASE_AUTH_TOKEN,
  // syncUrl: config.env.SYNC_URL,
});

// if (config.env.SYNC_URL) await client.sync();

export const db = drizzle(client, { schema, logger: true });

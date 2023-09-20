import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { config } from "../config";
import * as schema from "./schema";

const remoteOptions = {
  url: config.env.DATABASE_URL,
  authToken: config.env.DATABASE_AUTH_TOKEN,
};

const localOptions = {
  url: "file:local.sqlite",
  authToken: config.env.DATABASE_AUTH_TOKEN,
  syncUrl: config.env.DATABASE_URL,
};

export const client = createClient(localOptions);

await client.sync();

export const db = drizzle(client, { schema, logger: true });

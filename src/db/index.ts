import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schemas";
import { config } from "../config";

const client = createClient({
  url: config.env.DATABASE_URL!,
  authToken: config.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema, logger: true });

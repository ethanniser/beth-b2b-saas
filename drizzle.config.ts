import type { Config } from "drizzle-kit";
import { config } from "./src/config";

export default {
  schema: "./src/model/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: config.env.DATABASE_URL,
    authToken: config.env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config;

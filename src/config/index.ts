import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  server: {
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    // SYNC_URL: z.string().optional(),
    NODE_ENV: z.enum(["development", "production"]),
    COOKIE_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});

const args = {
  // watch: process.argv.includes("--watch"),
  // liveReload: true,
};

export const config = {
  env,
  args,
};

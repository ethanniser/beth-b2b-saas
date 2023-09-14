import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { argumentParser } from "zodcli";

const env = createEnv({
  server: {
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
  },
  runtimeEnv: process.env,
});

// const args = argumentParser({
//   options: z.object({}),
// }).parse(process.argv.slice(2));

export const config = {
  env,
  // args,
};

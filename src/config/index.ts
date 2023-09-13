import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { argumentParser } from "zodcli";

const env = createEnv({
  server: {
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
  },
  runtimeEnv: process.env,
});

const args = argumentParser({
  options: z.object({ foo: z.string().optional() }).strict(),
}).parse(process.argv.slice(2));

export const config = {
  env,
  args,
};

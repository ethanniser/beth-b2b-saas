import { logger } from "@bogeychan/elysia-logger";
import { Logger } from "@bogeychan/elysia-logger/types";
import { cron } from "@elysiajs/cron";
import { HoltLogger } from "@tlscipher/holt";
import { bethStack } from "beth-stack/elysia";
import { Elysia } from "elysia";
import pretty from "pino-pretty";
import { auth } from "../auth";
import { config } from "../config";
import { client, db } from "../db";

const stream = pretty({
  colorize: true,
});

const loggerConfig =
  config.env.NODE_ENV === "development"
    ? {
        level: config.env.LOG_LEVEL,
        stream,
      }
    : { level: config.env.LOG_LEVEL };

export const ctx = new Elysia({
  name: "@app/ctx",
})
  .decorate("db", db)
  .decorate("config", config)
  .decorate("auth", auth)
  .use(bethStack())
  .use(logger(loggerConfig))
  .use(
    // @ts-expect-error
    config.env.NODE_ENV === "development"
      ? new HoltLogger().getLogger()
      : (a) => a,
  )
  .use(
    // @ts-expect-error
    config.env.DATABASE_CONNECTION_TYPE === "local-replica"
      ? cron({
          name: "heartbeat",
          pattern: "*/2 * * * * *",
          run() {
            const now = performance.now();
            console.log("Syncing database...");
            void client.sync().then(() => {
              console.log(`Database synced in ${performance.now() - now}ms`);
            });
          },
        })
      : (a) => a,
  )
  .onStart(({ log }) => {
    if (log && config.env.NODE_ENV === "production") {
      log.info("Server started");
    }
  })
  .onStop(({ log }) => {
    if (log && config.env.NODE_ENV === "production") {
      log.info("Server stopped");
    }
  })
  .onRequest(({ log, request }) => {
    if (log && config.env.NODE_ENV === "production") {
      log.debug(`Request received: ${request.method}: ${request.url}`);
    }
  })
  .onResponse(({ log, request, set }) => {
    if (log && config.env.NODE_ENV === "production") {
      log.debug(`Response sent: ${request.method}: ${request.url}`);
    }
  })
  .onError(({ log, error }) => {
    if (log && config.env.NODE_ENV === "production") {
      log.error(error);
    }
  });

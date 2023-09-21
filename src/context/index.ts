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

function optionallyUse(condition: boolean, middleware: any): any {
  return condition ? middleware : (a: any) => a;
}

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
  .use(
    // @ts-expect-error
    config.env.NODE_ENV === "production"
      ? (
          e: Elysia<
            "",
            {
              request: {
                log: Logger;
              };
              store: {};
            }
          >,
        ) =>
          e
            .onStart(({ log }) => log.info("Server starting"))
            .onStop(({ log }) => log.info("Server stopping"))
            .onRequest(({ log, request }) => {
              console.log(typeof log);
              log.debug(`Request received: ${request.method}: ${request.url}`);
            })
            .onResponse(({ log, request, set }) => {
              log.debug(
                `Response sent: ${request.method}: ${request.url} with status ${set.status}`,
              );
            })
            .onError(({ log, error }) => log.error(error))
      : (a) => a,
  );

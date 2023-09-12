import { Elysia } from "elysia";
import { logger } from "@bogeychan/elysia-logger";
import pretty from "pino-pretty";
import { html } from "@elysiajs/html";
import { env } from "../config";
import { db } from "../model/store";

const stream = pretty({
  colorize: true,
});

export const ctx = new Elysia({
  name: "@app/ctx",
})
  .use(
    logger({
      level: env.LOG_LEVEL,
      stream,
    })
  )
  .use(html())
  .decorate("db", db)
  .decorate("config", env)
  .onStart(({ log }) => log.info("Server starting"))
  .onStop(({ log }) => log.info("Server stopping"))
  .onRequest(({ log, request }) =>
    log.debug(`Request received: ${request.method}: ${request.url}`)
  )
  .onResponse(({ log, response }) =>
    log.debug(`Response sent: ${response.statusCode}`)
  )
  .onError(({ log, error }) => log.error(error));

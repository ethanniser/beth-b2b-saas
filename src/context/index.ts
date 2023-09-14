import { Elysia } from "elysia";
import { logger } from "@bogeychan/elysia-logger";
import pretty from "pino-pretty";
import { config } from "../config";
import { db } from "../db";
import "@kitajs/html/htmx";

const stream = pretty({
  colorize: true,
});

export const ctx = new Elysia({
  name: "@app/ctx",
})
  .use(
    logger({
      level: config.env.LOG_LEVEL,
      stream,
    })
  )
  .decorate("db", db)
  .decorate("config", config)
  .decorate(
    "html",
    (html: string) =>
      new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf8" },
      })
  );
// .onStart(({ log }) => log.info("Server starting"))
// .onStop(({ log }) => log.info("Server stopping"))
// .onRequest(({ log, request }) => {
//   log.debug(`Request received: ${request.method}: ${request.url}`);
// });
// .onResponse(({ log, request, set }) => {
//   log.debug(
//     `Response sent: ${request.method}: ${request.url} with status ${set.status}`
//   );
// });
// .onError(({ log, error }) => log.error(error));

export type ElysiaApp = typeof ctx;
export type GetHandler = Parameters<typeof ctx.get>[1];
export type PostHandler = Parameters<typeof ctx.post>[1];
export type PutHandler = Parameters<typeof ctx.put>[1];
export type DelHandler = Parameters<typeof ctx.delete>[1];
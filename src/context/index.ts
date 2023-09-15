import { Elysia } from "elysia";
// import { logger } from "@bogeychan/elysia-logger";
// import pretty from "pino-pretty";
import { config } from "../config";
import { client, db } from "../db";
import "@kitajs/html/register";
import "@kitajs/html/htmx";
import { auth } from "../auth";
// import { cron } from "@elysiajs/cron";

// const stream = pretty({
//   colorize: true,
// });

export const ctx = new Elysia({
  name: "@app/ctx",
  cookie: {
    secrets: config.env.COOKIE_SECRET,
    sign: "session",
  },
})
  // .use(
  //   logger({
  //     level: config.env.LOG_LEVEL,
  //     stream,
  //   })
  // )
  // .use(
  //   cron({
  //     name: "heartbeat",
  //     pattern: "*/1 * * * * *",
  //     run() {
  //       if (config.env.SYNC_URL) {
  //         const now = performance.now();
  //         console.log("Syncing database...");
  //         void client.sync().then(() => {
  //           console.log(`Database synced in ${performance.now() - now}ms`);
  //         });
  //       }
  //     },
  //   })
  // )
  .decorate("db", db)
  .decorate("config", config)
  .decorate("auth", auth)
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

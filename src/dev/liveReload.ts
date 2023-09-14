import { Elysia, ws } from "elysia";
import { type ElysiaWS } from "elysia/ws";
import { watch } from "chokidar";

let wsConnections = new Set<ElysiaWS<any>>();

watch("src/**/*.{ts,tsx}").on("all", (event, path) => {
  console.log("sending event");
  wsConnections.forEach((connection) => {
    connection.send("refresh");
  });
});

const app = new Elysia()
  .use(ws())
  .ws("/ws", {
    open(ws) {
      console.log("open");
      wsConnections.add(ws);
    },
    close(ws) {
      console.log("close");
      wsConnections.delete(ws);
    },
    message(ws, message) {
      console.log("message", message);
    },
  })
  .listen(3001);

console.log(
  `🦊 Livereload running ${app.server?.hostname}:${app.server?.port}`
);

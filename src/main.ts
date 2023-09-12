import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import { todosController } from "./controllers/todos";

const app = new Elysia({
  name: "@app/main",
})
  .use(swagger())
  .use(staticPlugin())
  .use(todosController)
  .listen(3000);

console.log(`app is listening on ${app.server?.hostname}:${app.server?.port}`);

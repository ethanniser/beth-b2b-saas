import Elysia from "elysia";
import { todosController } from "./todos";

// import { authController } from "./auth";

export const api = new Elysia({
  prefix: "/api",
}).use(todosController);
// .use(authController);

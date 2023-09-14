import Elysia from "elysia";
import { todosService as todosController } from "./todos";

export const api = new Elysia({
  name: "@app/api",
  prefix: "/api",
}).use(todosController);

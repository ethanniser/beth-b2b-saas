import Elysia from "elysia";
import { todosController } from "./todos";

export const api = new Elysia({
  prefix: "/api",
}).use(todosController);

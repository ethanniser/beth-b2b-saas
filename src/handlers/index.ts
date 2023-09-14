import Elysia from "elysia";
import { todosService } from "./todos";

export const api = new Elysia({
  name: "@app/api",
  prefix: "/api",
}).use(todosService);

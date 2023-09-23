import Elysia from "elysia";
import { authController } from "./auth";
import { dbController } from "./db";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(dbController);

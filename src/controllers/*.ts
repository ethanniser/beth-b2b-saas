import Elysia from "elysia";
import { authController } from "./auth";

export const api = new Elysia({
  prefix: "/api",
}).use(authController);

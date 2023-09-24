import Elysia from "elysia";
import { authController } from "./auth";
import { organizationsController } from "./organization";
import { ticketController } from "./ticket";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(organizationsController)
  .use(ticketController);

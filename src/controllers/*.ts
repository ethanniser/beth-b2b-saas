import Elysia from "elysia";
import { authController } from "./auth";
import { chatController } from "./chat";
import { organizationsController } from "./organization";
import { ticketController } from "./ticket";

export const api = new Elysia({
  prefix: "/api",
})
  .use(chatController)
  .use(authController)
  .use(organizationsController)
  .use(ticketController);

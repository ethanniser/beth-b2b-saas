import { Elysia } from "elysia";

export const authController = new Elysia({
  prefix: "/auth",
}).post("/signup", "signup");

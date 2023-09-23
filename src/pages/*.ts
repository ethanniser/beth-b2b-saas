import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { dashboard } from "./dashboard";
import { db } from "./db";
import { index } from "./index";

export const pages = new Elysia()
  .use(index)
  .use(authGroup)
  .use(db)
  .use(dashboard);

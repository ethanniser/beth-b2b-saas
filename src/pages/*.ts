import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { index } from "./index";
import { user } from "./user/*";

export const pages = new Elysia({
  name: "@pages/root",
})
  .use(index)
  .use(authGroup)
  .use(user);

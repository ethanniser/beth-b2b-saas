import Elysia from "elysia";
import { id } from "./<id>";

export const user = new Elysia({
  name: "@pages/user/*",
})
  .use(id)

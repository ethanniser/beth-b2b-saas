import Elysia from "elysia";
// import { signup } from "./signup";

import { signin } from "./signin";

export const authGroup = new Elysia().use(signin);

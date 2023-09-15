import Elysia from "elysia";
import { signup } from "./signup";
import { profile } from "./profile";
import { signin } from "./signin";

export const authGroup = new Elysia().use(signup).use(signin).use(profile);

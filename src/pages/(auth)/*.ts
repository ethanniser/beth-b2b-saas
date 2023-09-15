import Elysia from "elysia";
import { signup } from "./signup";
import { profile } from "./profile";

export const authGroup = new Elysia().use(signup).use(profile);

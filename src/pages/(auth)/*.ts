import Elysia from "elysia";
import { login } from "./login";

export const authGroup = new Elysia().use(login);

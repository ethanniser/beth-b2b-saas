import Elysia from "elysia";
import { login } from "./signin";

export const authGroup = new Elysia().use(login);

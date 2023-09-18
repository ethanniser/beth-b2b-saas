import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { index } from "./index";

export const pages = new Elysia().use(index).use(authGroup);

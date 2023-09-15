import Elysia from "elysia";
import { index } from "./index";
import { authGroup } from "./(auth)/*";

export const pages = new Elysia().use(index).use(authGroup);

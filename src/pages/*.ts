import Elysia from "elysia";
import { index } from "./index";

export const pages = new Elysia().use(index);

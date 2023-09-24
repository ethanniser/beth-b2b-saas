import Elysia from "elysia";
import { ticket } from "./ticket/*";

export const orgId = new Elysia().use(ticket);

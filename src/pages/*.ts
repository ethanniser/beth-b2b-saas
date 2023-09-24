import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { orgId } from "./<organizationId>/*";
import { dashboard } from "./dashboard";
import { index } from "./index";
import { newUser } from "./new-user";
import { organization } from "./organization";
import { tickets } from "./tickets";

export const pages = new Elysia()
  .use(index)
  .use(tickets)
  .use(orgId)
  .use(organization)
  .use(authGroup)
  .use(newUser)
  .use(dashboard);

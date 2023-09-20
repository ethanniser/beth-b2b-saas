import { libsql } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { elysia, web } from "lucia/middleware";
import { config } from "../config";
import { client } from "../db";

const envAliasMap = {
  production: "PROD",
  development: "DEV",
} as const;

const envAlias = envAliasMap[config.env.NODE_ENV];

export const auth = lucia({
  env: envAlias,
  middleware: web(),
  sessionCookie: {
    expires: false,
  },
  adapter: libsql(client, {
    user: "user",
    key: "user_key",
    session: "user_session",
  }),

  getUserAttributes: (data) => {
    return {
      email: data.email,
    };
  },
});

export type Auth = typeof auth;

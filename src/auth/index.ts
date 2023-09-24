import { libsql } from "@lucia-auth/adapter-sqlite";
import { github } from "@lucia-auth/oauth/providers";
import { lucia, Middleware } from "lucia";
import { config } from "../config";
import { client } from "../db";

const envAliasMap = {
  production: "PROD",
  development: "DEV",
} as const;

const envAlias = envAliasMap[config.env.NODE_ENV];

type ElysiaContext = {
  request: Request;
  set: {
    headers: Record<string, string> & {
      ["Set-Cookie"]?: string | string[];
    };
    status?: number | undefined | string;
    redirect?: string | undefined;
  };
};

export const elysia = (): Middleware<[ElysiaContext]> => {
  return ({ args }) => {
    const [{ request, set }] = args;
    return {
      request,
      setCookie: (cookie) => {
        const setCookieHeader = set.headers["Set-Cookie"] ?? [];
        const setCookieHeaders: string[] = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];
        setCookieHeaders.push(cookie.serialize());
        set.headers["Set-Cookie"] = setCookieHeaders;
      },
    };
  };
};

export const auth = lucia({
  env: envAlias,
  middleware: elysia(),
  adapter: libsql(client, {
    user: "user",
    key: "user_key",
    session: "user_session",
  }),
  getUserAttributes: (data) => {
    return {
      handle: data.handle,
    };
  },
});

export type Auth = typeof auth;

export const githubAuth = github(auth, {
  clientId: config.env.GITHUB_CLIENT_ID,
  clientSecret: config.env.GITHUB_CLIENT_SECRET,
});

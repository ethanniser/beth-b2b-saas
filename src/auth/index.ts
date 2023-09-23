import { libsql } from "@lucia-auth/adapter-sqlite";
import { google } from "@lucia-auth/oauth/providers";
import { lucia, Middleware } from "lucia";
import { config } from "../config";
import { client } from "../db/primary";

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
      name: data.name,
      email: data.email,
      picture: data.picture,
      id: data.id,
      role: data.role,
      buisnessId: data.buisnessId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
});

export type Auth = typeof auth;

export const googleAuth = google(auth, {
  clientId: config.env.GOOGLE_CLIENT_ID,
  clientSecret: config.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/api/auth/login/google/callback",
});

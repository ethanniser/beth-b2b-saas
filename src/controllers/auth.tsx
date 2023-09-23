import { OAuthRequestError } from "@lucia-auth/oauth";
import { Elysia, t } from "elysia";
import { LuciaError } from "lucia";
import { parseCookie, serializeCookie } from "lucia/utils";
import { googleAuth } from "../auth";
import { config } from "../config";
import { ctx } from "../context";

export const authController = new Elysia({
  prefix: "/auth",
})
  .use(ctx)
  .get("/test", () => "test")
  .get("/signout", async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    if (!session) {
      ctx.set.redirect = "/";
      ctx.set.headers["HX-Location"] = "/";
      return;
    }

    await ctx.auth.invalidateSession(session.sessionId);

    const sessionCookie = ctx.auth.createSessionCookie(null);

    ctx.set.headers["Set-Cookie"] = sessionCookie.serialize();
    ctx.set.redirect = "/";
    ctx.set.headers["HX-Location"] = "/";
  })
  .get("/login/google", async ({ set }) => {
    const [url, state] = await googleAuth.getAuthorizationUrl();

    const stateCookie = serializeCookie("github_oauth_state", state, {
      maxAge: 60 * 60,
      secure: config.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
    });

    set.headers["Set-Cookie"] = stateCookie;
    set.redirect = url.toString();
  })
  .get(
    "/login/google/callback",
    async ({ request, log, path, query, set, auth }) => {
      const { code, state } = query;

      const cookies = parseCookie(request.headers.get("Cookie") ?? "");
      const storedState = cookies.github_oauth_state;

      if (!storedState || !state || storedState !== state || !code) {
        set.status = 400;
        return "Invalid state";
      }

      try {
        const { getExistingUser, googleUser, createUser } =
          await googleAuth.validateCallback(code);

        const getUser = async () => {
          const existingUser = await getExistingUser();
          if (existingUser) return existingUser;
          const user = await createUser({
            attributes: {
              email: googleUser.email ?? null,
              name: googleUser.name,
              picture: googleUser.picture,
              role: "user",
              createdAt: Math.floor(Date.now() / 1000),
            },
          });
          return user;
        };

        const user = await getUser();
        const session = await auth.createSession({
          userId: user.userId,
          attributes: {},
        });
        const sessionCookie = auth.createSessionCookie(session);
        // redirect to profile page
        return new Response(null, {
          headers: {
            Location: "/",
            "Set-Cookie": sessionCookie.serialize(), // store session cookie
          },
          status: 302,
        });
      } catch (e) {
        if (e instanceof OAuthRequestError) {
          // invalid code
          set.status = 400;
          return e.message;
        }
        set.status = 500;
        log.error(e);
        return "Internal server error";
      }
    },
  );

import { OAuthRequestError } from "@lucia-auth/oauth";
import Elysia from "elysia";
import { parseCookie, serializeCookie } from "lucia/utils";
import { githubAuth } from "../../auth";
import { BaseHtml } from "../../components/base";
import { config } from "../../config";
import { ctx } from "../../context";

export const login = new Elysia()
  .use(ctx)
  .get("/login", async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();
    if (session) {
      ctx.set.redirect = "/";
      return;
    }

    return ctx.html(() => (
      <BaseHtml>
        <div
          class="flex h-screen w-full flex-col items-center justify-center bg-gray-200"
          hx-ext="response-targets"
        >
          <div class="p-4">
            <a
              href="/"
              class="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Go Home
            </a>
          </div>
          <form
            hx-post="/api/auth/signInOrUp"
            hx-swap="innerHTML"
            hx-target-4xx="#errorMessage"
            class="w-96 rounded-lg bg-white p-8 shadow-md"
          >
            <div class="mb-4">
              <label
                for="handle"
                class="mb-2 block text-sm font-medium text-gray-600"
              >
                Handle
              </label>
              <input
                type="text"
                name="handle"
                id="handle"
                placeholder="Enter your handle"
                class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div class="mb-4">
              <label
                for="password"
                class="mb-2 block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                class="w-full rounded-md border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div class="flex flex-col gap-2">
              <button
                type="submit"
                name="action"
                value="signin"
                class="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
              >
                Sign In
              </button>
              <button
                type="submit"
                name="action"
                value="signup"
                class="w-full rounded-md bg-green-600 p-2 text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Sign Up
              </button>
              <a
                hx-boost="false"
                href="/login/github"
                class="display-block rounded-lg bg-gray-800 p-2 text-center text-white transition duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Sign In with Github
                <div class="i-logos-github-icon inline-block text-2xl" />
              </a>
            </div>
            <div id="errorMessage" class="pt-4 text-red-500"></div>
          </form>
        </div>
      </BaseHtml>
    ));
  })
  .get("/login/github", async ({ set }) => {
    const [url, state] = await githubAuth.getAuthorizationUrl();

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
    "/login/github/callback",
    async ({ request, log, path, query, set, auth }) => {
      const { code, state } = query;

      const cookies = parseCookie(request.headers.get("Cookie") ?? "");
      const storedState = cookies.github_oauth_state;

      if (!storedState || !state || storedState !== state || !code) {
        set.status = 400;
        return "Invalid state";
      }

      try {
        const { getExistingUser, githubUser, createUser } =
          await githubAuth.validateCallback(code);

        const getUser = async () => {
          const existingUser = await getExistingUser();
          if (existingUser) return existingUser;
          const user = await createUser({
            attributes: {
              handle: githubUser.login,
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

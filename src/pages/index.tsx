import { Suspense } from "beth-stack/jsx";
import { Elysia } from "elysia";
import { authed } from "../auth/middleware";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";

export const index = new Elysia()
  .use(ctx)
  .get("/", async ({ html, session, db }) => {
    return html(() => (
      <BaseHtml>
        <div class="flex flex-col items-center py-3">
          {session ? (
            <>
              <h1 class="text-2xl font-bold text-gray-800" safe>
                Hi! {session.user.name}
              </h1>
              <a
                href="/dashboard"
                class="mt-4 rounded-lg bg-green-500 px-4 py-2 text-white transition duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Visit Dashboard
              </a>
              <a
                href="/api/auth/signout"
                class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Sign Out
              </a>
            </>
          ) : (
            <a
              href="/api/auth/login/google"
              hx-boost="false"
              class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Sign In
            </a>
          )}
        </div>
      </BaseHtml>
    ));
  });

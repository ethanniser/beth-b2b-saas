import Elysia from "elysia";
import { BaseHtml } from "../../components/base";
import { ctx } from "../../context";

export const signin = new Elysia().use(ctx).get("/signin", ({ html }) =>
  html(() => (
    <BaseHtml>
      <div class="flex h-screen w-full flex-col items-center justify-center bg-gray-200">
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
          <button
            type="submit"
            name="action"
            value="signin"
            class="mb-2 w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
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
          <div id="errorMessage" class="mt-4 text-red-500"></div>
        </form>
      </div>
    </BaseHtml>
  )),
);

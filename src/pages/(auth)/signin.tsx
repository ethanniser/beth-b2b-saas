import Elysia from "elysia";
import { BaseHtml } from "../../components/base";
import { ctx } from "../../context";

export const signin = new Elysia().use(ctx).get("/signin", ({ html }) =>
  html(
    <BaseHtml>
      <div class="flex w-full h-screen bg-gray-200 justify-center items-center">
        <form
          hx-post="/api/auth/signin"
          hx-swap="afterend"
          class="bg-white p-8 rounded-lg shadow-md w-96"
        >
          <div class="mb-4">
            <label
              for="email"
              class="block text-sm font-medium text-gray-600 mb-2"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter your email"
              class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
          <div class="mb-4">
            <label
              for="password"
              class="block text-sm font-medium text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
          >
            Sign In
          </button>
        </form>
      </div>
    </BaseHtml>
  )
);

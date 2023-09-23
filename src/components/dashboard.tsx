import { PropsWithChildren } from "beth-stack/jsx";

export function DashBoard({ children }: PropsWithChildren) {
  return (
    <div class="flex h-screen w-full flex-col md:flex-row">
      <nav class="w-full bg-gray-800 p-5 text-white lg:w-64">
        <h1 class="text-2xl">Dashboard</h1>
        <ul class="space-y-2">
          <li>
            <a class="flex items-center gap-3 py-2 hover:underline" href="#">
              <div class="i-lucide-home text-xl" />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a class="flex items-center gap-3 py-2 hover:underline" href="#">
              <div class="i-lucide-user-2 text-xl" />
              <span>Users</span>
            </a>
          </li>
          <li>
            <a
              class="hover:underlines flex items-center gap-3 py-2 hover:underline"
              href="#"
            >
              <div class="i-lucide-settings text-xl" />
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a
              class="hover:underlines flex items-center gap-3 py-2 hover:underline"
              href="/api/auth/signout"
            >
              <div class="i-lucide-log-out text-xl" />
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}

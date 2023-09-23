import { PropsWithChildren } from "beth-stack/jsx";

export function DashBoard({ children }: PropsWithChildren) {
  return (
    <div class="flex h-screen w-full flex-col md:flex-row">
      <nav class="w-full bg-gray-800 p-5 text-white lg:w-64">
        <h1 class="text-4xl">Dashboard</h1>
        <ul class="space-y-6 pt-4">
          <DashBoardItem text="Home" logo="i-lucide-home" href="/dashboard" />
          <DashBoardItem
            text="Tickets"
            logo="i-lucide-messages-square"
            href="/tickets"
          />
          <DashBoardItem
            text="Settings"
            logo="i-lucide-settings"
            href="/settings"
          />
          <DashBoardItem
            text="Logout"
            logo="i-lucide-log-out"
            href="/api/auth/signout"
          />
          <DashBoardItem
            text="Need Help?"
            logo="i-lucide-mail-question"
            href="https://twitter.com/ethanniser"
          />
        </ul>
      </nav>
      {children}
    </div>
  );
}

function DashBoardItem({
  text,
  logo,
  href,
}: {
  text: string;
  logo: string;
  href: string;
}) {
  return (
    <li>
      <a
        class="flex items-center gap-3 py-2 text-2xl font-light hover:underline"
        href={href}
      >
        <div class={logo} />
        <span>{text}</span>
      </a>
    </li>
  );
}

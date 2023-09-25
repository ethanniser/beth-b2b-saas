export function FancyLink({ text, href }: { text: string; href: string }) {
  return (
    <a
      href={href}
      class="group absolute bottom-3 right-3 flex flex-row items-center
          gap-3 rounded-lg bg-gray-200 px-4
          py-2
          text-gray-700 transition duration-200 hover:bg-gray-300 hover:text-gray-800
        "
    >
      <span safe>{text}</span>
      <div class="i-lucide-arrow-up-right transform transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

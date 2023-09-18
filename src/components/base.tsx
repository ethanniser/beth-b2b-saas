import { type PropsWithChildren } from "beth-stack/jsx";
import { liveReloadScript } from "beth-stack/dev";
import { htmxExtensionScript } from "beth-stack";
import { config } from "../config";

const safeScript =
  config.env.NODE_ENV === "development" ? liveReloadScript() : "";

export const BaseHtml = ({ children }: PropsWithChildren) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>THE BETH STACK</title>
      <script src="https://unpkg.com/htmx.org@1.9.5"></script>
      <script>{htmxExtensionScript}</script>
      <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
      />
      <link rel="stylesheet" href="/public/dist/unocss.css" />
      <script>{safeScript}</script>
    </head>
    <body hx-ext="revalidate">{children}</body>
  </html>
);

import { liveReloadScript } from "beth-stack/dev";
import { type PropsWithChildren } from "beth-stack/jsx";
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
      <script>htmx.config.globalViewTransitions = true;</script>
      <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/loading-states.js"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
      <style>
        {`
          [data-loading] {
            display: none;
          }
        `}
      </style>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
      />
      <link rel="stylesheet" href="/public/dist/unocss.css" />
      <script type="text/hyperscript">
        {`
        def copySelectorToClipboard(selector)
          get the innerHTML of selector
          call navigator.clipboard.writeText(the result)
        end
      `}
      </script>
      <script>{safeScript}</script>
    </head>
    <body hx-boost="true" hx-ext="loading-states">
      {children}
    </body>
  </html>
);

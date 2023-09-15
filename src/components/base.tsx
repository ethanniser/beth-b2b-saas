import { type PropsWithChildren } from "@kitajs/html";
import { config } from "../config";

export const BaseHtml = ({ children }: PropsWithChildren) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>THE BETH STACK</title>
      <script src="https://unpkg.com/htmx.org@1.9.5"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
      />
      <link rel="stylesheet" href="/public/dist/unocss.css" />
      <script>
        {`
        (function () {
          let socket = new WebSocket("ws://localhost:3001/ws");

          socket.onopen = function(e) {
            console.log("connected")
          };

          socket.onmessage = function(event) {
            location.reload();
          };

          socket.onclose = function(event) {
            console.log("closed");
          };

          socket.onerror = function(error) {
            console.log("error: " + error.message);
          };
        })();
        `}
      </script>
    </head>
    <body>{children}</body>
  </html>
);

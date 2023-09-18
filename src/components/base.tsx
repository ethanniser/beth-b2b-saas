import { type PropsWithChildren } from "beth-stack/jsx";
import { config } from "../config";

export const BaseHtml = ({ children }: PropsWithChildren) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>THE BETH STACK</title>
      <script src="https://unpkg.com/htmx.org@1.9.5"></script>
      <script>
        {`
        (function () {
          htmx.defineExtension("revalidate", {
            onEvent: function (name, evt) {
              if (name === "htmx:configRequest") {
                var revalidationTag = evt.srcElement.getAttribute("hx-revalidate");
                console.log("revalidationTag", revalidationTag) 
                if (revalidationTag) {
                  // Split the string into an array based on comma and trim spaces
                  var tags = revalidationTag.split(',').map(function(tag) {
                      return tag.trim();
                  });

                  // Convert array to JSON and set it to the header
                  evt.detail.headers["HX-Revalidate"] = JSON.stringify(tags);
                }
              }
            },
          });
        })();
        `}
      </script>
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
    <body hx-ext="revalidate">{children}</body>
  </html>
);

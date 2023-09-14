import Html from "@kitajs/html";
import { config } from "../config";

export const BaseHtml = ({ children }: Html.PropsWithChildren) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>THE BETH STACK</title>
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
      />
      <link rel="stylesheet" href="/public/dist/unocss.css" />
      <script>
        {`
        (function () {
            var consoleOutput = document.getElementById('consoleOutput');

            if (!window.console) {
                window.console = {};
            }

            var oldConsoleLog = console.log;

            console.log = function (message) {
                // Append the log message to the consoleOutput div
                if (consoleOutput) {
                    var logMessage = document.createElement('p');
                    logMessage.textContent = message;
                    consoleOutput.appendChild(logMessage);
                }

                // Call the original console.log function
                oldConsoleLog.apply(console, arguments);
            };

            // You can do the same for other console methods like error, warn, etc. if needed

        })()
        `}
      </script>
      <script>
        {`
        (function () {
          let socket = new WebSocket("ws://localhost:3001/ws");

          socket.onopen = function(e) {
            console.log("connected")
          };

          socket.onmessage = function(event) {
            console.log(event.data);
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
    <body>
      <div
        id="consoleOutput"
        style="background-color: #f0f0f0; padding: 10px;"
      ></div>
      <script>console.log("Hello from the client side!");</script>
      {children}
    </body>
  </html>
);

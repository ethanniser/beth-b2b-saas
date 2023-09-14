import { GetHandler } from "../context";
import Html from "@kitajs/html";
import { BaseHtml } from "../components/base";

export const get: GetHandler = ({ html }) =>
  html(
    <BaseHtml>
      <div
        class="flex w-full h-screen justify-center items-center"
        hx-get="/api/todos"
        hx-swap="innerHTML"
        hx-trigger="load"
      />
    </BaseHtml>
  );

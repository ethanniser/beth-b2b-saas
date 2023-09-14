type RoutesByType<
  Schema extends Record<string, unknown>,
  Type extends "get" | "post" | "put" | "delete" | "patch"
> = RemoveSlash<
  keyof {
    [key in keyof Schema as Schema[key] extends { [key in Type]: unknown }
      ? key
      : never]: true;
  }
>;

type RemoveSlash<S extends string> = S extends `${infer T}/` ? T : S;

declare namespace JSX {
  type Schema = import("./main").App["meta"]["schema"];

  type PostRoutes = RoutesByType<Schema, "post">;
  type GetRoutes = RoutesByType<Schema, "get">;
  type PutRoutes = RoutesByType<Schema, "put">;
  type DeleteRoutes = RoutesByType<Schema, "delete">;
  type PatchRoutes = RoutesByType<Schema, "patch">;

  interface HtmlTag extends Htmx.Attributes {
    ["hx-get"]?: GetRoutes;
    ["hx-post"]?: PostRoutes;
    ["hx-put"]?: PutRoutes;
    ["hx-delete"]?: DeleteRoutes;
    ["hx-patch"]?: PatchRoutes;
  }
}

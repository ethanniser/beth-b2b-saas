import type {
  DecoratorBase,
  DefinitionBase,
  Handler,
  InputSchema,
  LocalHook,
  MergeSchema,
  RouteBase,
  RouteSchema,
  UnwrapRoute,
} from "elysia/types";
import { type Elysia, t } from "elysia";

type RouteArgs<
  BasePath extends string,
  Decorators extends DecoratorBase,
  Definitions extends DefinitionBase,
  ParentSchema extends RouteSchema,
  Routes extends RouteBase,
  Path extends string,
  LocalSchema extends InputSchema<keyof Definitions["type"] & string>,
  Route extends MergeSchema<
    UnwrapRoute<LocalSchema, Definitions["type"]>,
    ParentSchema
  >,
  Function extends Handler<Route, Decorators, `${BasePath}${Path}`>
> = {
  handler: Function;
  hooks?: LocalHook<
    LocalSchema,
    Route,
    Decorators,
    Definitions["error"],
    `${BasePath}${Path}`
  >;
};

export function elysiaHandler<
  BasePath extends string,
  Decorators extends DecoratorBase,
  Definitions extends DefinitionBase,
  ParentSchema extends RouteSchema,
  Routes extends RouteBase,
  Path extends string,
  LocalSchema extends InputSchema<keyof Definitions["type"] & string>,
  Route extends MergeSchema<
    UnwrapRoute<LocalSchema, Definitions["type"]>,
    ParentSchema
  >,
  Function extends Handler<Route, Decorators, `${BasePath}${Path}`>
>(
  elysiaInstance: Elysia<
    BasePath,
    Decorators,
    Definitions,
    ParentSchema,
    Routes
  >,
  path: Path,
  obj: RouteArgs<
    BasePath,
    Decorators,
    Definitions,
    ParentSchema,
    Routes,
    Path,
    LocalSchema,
    Route,
    Function
  >
) {
  return obj;
}

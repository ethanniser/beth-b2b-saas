import Elysia from "elysia";
import { ctx } from "../context";
import { insertTodoSchema } from "../model/todo";
import { TodoItem } from "../views/todoItem";
import Html from "@kitajs/html";
import { db as works } from "../model/store";

export const todosController = new Elysia({
  name: "@app/todos",
  prefix: "/todos",
})
  .use(ctx)
  .model({
    todo: insertTodoSchema,
  })
  .get("/", async ({ log, db }) => {
    console.log("db", db === works);
    log.info("get todos");
    const todos = await works.query.todos.findMany();

    return (
      <div hx-get="/todos">
        {todos.map((todo) => (
          <TodoItem {...todo} />
        ))}
      </div>
    );
  });

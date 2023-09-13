import Elysia from "elysia";
import { ctx } from "../context";
import { insertTodoSchema } from "../model/todo";
import { TodoItem } from "../views/todoItem";
import Html from "@kitajs/html";
import { db } from "../model/store";

export const todosController = new Elysia({
  name: "@app/todos",
  prefix: "/todos",
})
  .use(ctx)
  .model({
    todo: insertTodoSchema,
  })
  .get("/", async ({ log }) => {
    log.info("get todos");
    const todos = await db.query.todos.findMany();

    return (
      <div>
        {todos.map((todo) => (
          <TodoItem {...todo} />
        ))}
      </div>
    );
  });

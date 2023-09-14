import { Elysia, t } from "elysia";
import { ctx } from "../context";
import { insertTodoSchema, todos } from "../db/schemas/todos";
import { TodoItem, TodoForm, TodoList } from "../components/todos";

import { db } from "../db";
import { eq } from "drizzle-orm";

export const todosController = new Elysia({
  prefix: "/todos",
})
  .use(ctx)
  .get("/", async () => {
    const data = await db.select().from(todos).limit(10);
    return <TodoList todos={data} />;
  })
  .post(
    "/toggle/:id",
    async ({ params }) => {
      const [oldTodo] = await db
        .select()
        .from(todos)
        .where(eq(todos.id, params.id));

      if (!oldTodo) {
        throw new Error("Todo not found");
      }

      const [newTodo] = await db
        .update(todos)
        .set({ completed: !oldTodo.completed })
        .where(eq(todos.id, params.id))
        .returning();

      if (!newTodo) {
        throw new Error("Todo not found");
      }

      return <TodoItem {...newTodo} />;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      await db.delete(todos).where(eq(todos.id, params.id));
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    "",
    async ({ body }) => {
      const content = {
        beth: "Learn the BETH stack",
        vim: "Learn vim",
        like: "Like the video",
        sub: "Subscribe to Ethan",
      };

      const [newTodo] = await db
        .insert(todos)
        .values({ content: content[body.content] })
        .returning();

      if (!newTodo) {
        throw new Error("Todo not found");
      }

      return <TodoItem {...newTodo} />;
    },
    {
      body: t.Object({
        content: t.Union([
          t.Literal("beth"),
          t.Literal("vim"),
          t.Literal("like"),
          t.Literal("sub"),
        ]),
      }),
    }
  );

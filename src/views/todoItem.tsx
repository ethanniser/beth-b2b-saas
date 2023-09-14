import type { Todo } from "../model/todo";
import Html from "@kitajs/html";

export const TodoItem = (todo: Todo) => {
  return (
    <li>
      <input type="checkbox" checked={todo.completed} />
      <span>{todo.content}</span>
    </li>
  );
};

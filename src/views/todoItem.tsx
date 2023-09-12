import type { Todo } from "../model/todo";

export const TodoItem = (todo: Todo) => {
  return (
    <li>
      <input type="checkbox" checked={todo.done} />
      <span>{todo.content}</span>
    </li>
  );
};

import { db } from ".";
import { todos } from "../todo";

await db.batch([
  db.insert(todos).values({
    content: "Learn the beth stack",
  }),
  db.insert(todos).values({
    content: "Learn vim",
  }),
  db.insert(todos).values({
    content: "subscribe to ethan",
  }),
]);

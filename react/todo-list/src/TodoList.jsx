import { useContext } from "react";
import { TodoItem } from "./TodoItem";
import { CollectionCtx } from "./Context";

export function TodoList() {
  const [todoList, ,] = useContext(CollectionCtx);

  return (
    <ul className="list">
      {todoList.length === 0 && "No Todos"}
      {todoList.map((todo) => {
        return (
          <TodoItem
            {...todo}
            key={todo._id}
          />
        );
      })}
    </ul>
  );
}

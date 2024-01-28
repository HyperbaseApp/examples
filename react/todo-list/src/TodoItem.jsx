import { useContext, useState } from "react";
import { CollectionCtx } from "./Context";

export function TodoItem({ completed, _id, title }) {
  const [, todoListCollection, refreshTodoList] = useContext(CollectionCtx);

  const [todoTitle, setTodoTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  async function toggleCheckTodo(checked) {
    await todoListCollection.updateOne(_id, {
      completed: checked,
    });
    await refreshTodoList();
  }

  async function saveEditTodo() {
    await todoListCollection.updateOne(_id, {
      title: todoTitle,
    });
    await refreshTodoList();
    setIsEditing(false);
  }

  async function removeTodo() {
    await todoListCollection.deleteOne(_id);
    await refreshTodoList();
  }

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => toggleCheckTodo(e.target.checked)}
          className="input-checkbox"
        />
      </label>
      {!isEditing ? (
        todoTitle
      ) : (
        <input
          type="text"
          onChange={(e) => setTodoTitle(e.target.value)}
          value={todoTitle}
        />
      )}
      {!isEditing ? (
        <>
          <button onClick={() => setIsEditing(true)} className="btn btn-warn">
            Edit
          </button>
          <button onClick={removeTodo} className="btn btn-danger">
            Delete
          </button>
        </>
      ) : (
        <>
          <button onClick={saveEditTodo} className="btn btn-green">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="btn btn-warn">
            Cancel
          </button>
        </>
      )}
    </li>
  );
}

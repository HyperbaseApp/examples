import { useContext, useState } from "react";
import { CollectionCtx } from "./Context";

export function NewTodoForm() {
  const [, todoListCollection, refreshTodoList] = useContext(CollectionCtx);

  const [newItem, setNewItem] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (newItem === "") return;

    await todoListCollection.insertOne({
      id: crypto.randomUUID(),
      title: newItem,
    });

    await refreshTodoList();

    setNewItem("");
  }

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
      <div className="form-row">
        <label htmlFor="item">New Item</label>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          type="text"
          id="item"
        />
      </div>
      <button className="btn">Add</button>
    </form>
  );
}

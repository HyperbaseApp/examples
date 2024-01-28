import { useEffect, useState } from "react";
import { NewTodoForm } from "./NewTodoForm";
import "./styles.css";
import { TodoList } from "./TodoList";
import { CollectionCtx } from "./Context";
import Hyperbase from "./hyperbase/hyperbase";
import hyperbaseCollections from "./hyperbase/hyperbaseCollections.json";
import hyperbaseConfig from "./hyperbase/hyperbaseConfig.json";

export default function App() {
  const [todoListCollection, setTodoListCollection] = useState();

  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const hyperbase = new Hyperbase();
    (async () => {
      await hyperbase.init(hyperbaseConfig);
      const collection = await hyperbase.setCollection(
        hyperbaseCollections.todo_list
      );
      setTodoListCollection(collection);
    })();
  }, []);

  useEffect(() => {
    if (!todoListCollection) return;
    refreshTodoList();
  }, [todoListCollection]);

  async function refreshTodoList() {
    const todoList = await todoListCollection.findMany({
      orders: [
        {
          field: "_id",
          kind: "asc",
        },
      ],
    });
    setTodoList(todoList.data);
  }

  return (
    <CollectionCtx.Provider
      value={[todoList, todoListCollection, refreshTodoList]}
    >
      <NewTodoForm />
      <h1 className="header">Todo List</h1>
      <TodoList />
    </CollectionCtx.Provider>
  );
}

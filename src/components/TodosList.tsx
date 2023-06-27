import React from "react";

interface Todo {
  _id: string;
  text: string;
  complete: boolean;
  userID: string;
}

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setEditTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TodosList: React.FC<Props> = ({ todos, setTodos, setEditTodo }) => {
  const handleComplete = async (todo: Todo): Promise<void> => {
    // PUT: Toggle the completed state
    const updatedTodoResponse = await fetch(
      `http://localhost:8080/todo/complete/${todo._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedTodo = await updatedTodoResponse.json();

    await sleep(1000);

    // GET: Fetch the updated todo list
    const refreshTodoResponse = await fetch(
      `http://localhost:8080/todo?userID=${updatedTodo.userID}`,
      {
        method: "GET",
      }
    );

    const refreshedTodos = await refreshTodoResponse.json();

    // Save the updated todo list
    setTodos([...refreshedTodos]);
  };

  const handleDelete = async (todo: Todo): Promise<void> => {
    // fetch with a DELETE method
    const deletedTodoResponse = await fetch(
      `http://localhost:8080/todo/${todo._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const deletedTodo = await deletedTodoResponse.json();

    // GET: Fetch the updated todo list
    const refreshTodoResponse = await fetch(
      `http://localhost:8080/todo?userID=${deletedTodo.userID}`,
      {
        method: "GET",
      }
    );

    const refreshedTodos = await refreshTodoResponse.json();

    // Save the updated todo list
    setTodos(refreshedTodos);
  };

  return (
    <div>
      {todos.map((todo) => (
        <li className="list-item" key={todo._id}>
          <input
            type="text"
            value={todo.text}
            className={`list ${todo.complete ? "complete" : ""}`}
            onChange={(event) => event.preventDefault()}
          />
          <div>
            <button
              className="button-complete task-button"
              onClick={() => handleComplete(todo)}
            >
              <i className="fa fa-check-circle"></i>
            </button>
            <button
              className="button-delete task-button"
              onClick={() => handleDelete(todo)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </li>
      ))}
    </div>
  );
};

export default TodosList;

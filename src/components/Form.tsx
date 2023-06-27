import React, { useEffect, ChangeEvent, FormEvent, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface FormProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  editTodo: Todo | null;
  setEditTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  userID: string;
  setUserID: React.Dispatch<React.SetStateAction<string>>;
}

interface Todo {
  userID: SetStateAction<string>;
  id: string;
  title: string;
  completed: boolean;
}

const Form: React.FC<FormProps> = ({
  input,
  setInput,
  todos,
  setTodos,
  editTodo,
  setEditTodo,
  userID,
  setUserID,
}) => {
  const updateTodo = (title: string, id: string, completed: boolean) => {
    const newTodo = todos.map((todo) =>
      todo.id === id ? { ...todo, title, completed } : todo
    );
    setTodos(newTodo);
    setEditTodo(null);
  };

  useEffect(() => {
    if (editTodo) {
      setInput(editTodo.title);
    } else {
      setInput('');
    }
  }, [setInput, editTodo]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editTodo) {
      // POST: Create a new todo
      const newTodoResponse = await fetch('http://localhost:8080/todo', {
        method: 'POST',
        body: JSON.stringify({
          text: input,
          complete: false,
          userID: userID || undefined,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const newTodo: Todo = await newTodoResponse.json();

      // If this is the first todo, save the user ID
      if (!userID) {
        setUserID(newTodo.userID);
      }

      // GET: Fetch the updated todo list
      const refreshTodoResponse = await fetch(
        `http://localhost:8080/todo?userID=${newTodo.userID}`,
        {
          method: 'GET',
        }
      );
      const refreshedTodos: Todo[] = await refreshTodoResponse.json();

      // Save the updated todo list
      setTodos(refreshedTodos);

      // Clear the input
      setInput('');
    } else {
      updateTodo(input, editTodo.id, editTodo.completed);
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        type="text"
        placeholder="Enter a Todo..."
        className="task-input"
        value={input}
        required
        onChange={onInputChange}
      />
      <button className="button-add" type="submit">
        {editTodo ? 'OK' : 'Add'}
      </button>
    </form>
  );
};

export default Form;

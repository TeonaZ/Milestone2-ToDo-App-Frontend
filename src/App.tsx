import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Form from './components/Form';
import TodosList from './components/TodosList';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

function App(): JSX.Element {
  const initialState: Todo[] = JSON.parse(localStorage.getItem('todos')) || [];
  const [todos, setTodos] = useState<Todo[]>(initialState);
  const [userID, setUserID] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  useEffect(() => {
    console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="container">
      <div className="app-wrapper">
        <div>
          <Header />
        </div>
        <div>
          <Form
            input={input}
            setInput={setInput}
            todos={todos}
            setTodos={setTodos}
            editTodo={editTodo}
            setEditTodo={setEditTodo}
            userID={userID}
            setUserID={setUserID}
          />
        </div>
        <div>
          <TodosList
            todos={todos}
            setTodos={setTodos}
            setEditTodo={setEditTodo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;


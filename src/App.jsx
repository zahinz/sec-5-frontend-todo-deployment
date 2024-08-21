import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://sec-5-backend-todo-deployment.onrender.com';

export default function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/todo`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, registerData);
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      fetchTodos();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTodos([]);
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/todo`, newTodo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTodo({ title: '', description: '' });
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleUpdateTodo = async (id, updatedTodo) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/todo/${id}`, updatedTodo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Todo App</h1>
      {!user ? (
        <div>
          <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              style={{ marginRight: '10px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              style={{ marginRight: '10px' }}
            />
            <button type="submit">Login</button>
          </form>
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
              type="text"
              placeholder="Username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              style={{ marginRight: '10px' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              style={{ marginRight: '10px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              style={{ marginRight: '10px' }}
            />
            <button type="submit">Register</button>
          </form>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.username}! <button onClick={handleLogout}>Logout</button></p>
          <form onSubmit={handleCreateTodo} style={{ marginBottom: '20px' }}>
            <h2>Create Todo</h2>
            <input
              type="text"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              style={{ marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              style={{ marginRight: '10px' }}
            />
            <button type="submit">Add Todo</button>
          </form>
          <h2>Your Todos</h2>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <button onClick={() => handleUpdateTodo(todo.id, { ...todo, status: !todo.status })}>
                  {todo.status ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
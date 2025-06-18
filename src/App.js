import React, { useState, useEffect } from 'react';
import { db, auth, provider } from './firebase';
import {collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import {signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);

  // Google Sign in
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setTodos([]);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Fetch only logged-in user's todos
  const fetchTodos = async () => {
    if (!user) return;

    const q = query(collection(db, "todos"), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setTodos(items);
  };

  // Add a new todo
  const addTodo = async () => {
    if (task.trim() === '' || !user) return;
    await addDoc(collection(db, "todos"), {
      task,
      email: user.email,
    });
    setTask('');
    fetchTodos();
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    fetchTodos();
  };

  //  auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load todos when user logs in
  useEffect(() => {
    if (user) fetchTodos();
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>ToDo App</h1>

      {!user ? (
        <div>
          <p>Please sign in to continue</p>
          <button onClick={handleLogin}>Sign in with Google</button>
        </div>
      ) : (
        <>
          <p>Welcome, {user.displayName} ({user.email})</p>
          <button onClick={handleLogout}>Logout</button>

          <br /><br />
          <input
            type="text"
            value={task}
            placeholder="Enter task..."
            onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={addTodo}>Add Task</button>

          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.task}
                <button onClick={() => deleteTodo(todo.id)}>❌</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

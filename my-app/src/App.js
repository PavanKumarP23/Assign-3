import React, { useReducer, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import { UserContext, UserProvider } from './UserContext';
import useLocalStorage from './useLocalStorage';
import './App.css'; 

function taskReducer(tasks, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [...tasks, { title: action.title, completed: false }];
    case 'TOGGLE_TASK':
      return tasks.map((task, index) =>
        index === action.index ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return tasks.filter((_, index) => index !== action.index);
    default:
      return tasks;
  }
}

function TaskManager() {
  const [tasks, dispatch] = useReducer(taskReducer, [], () => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const { user } = useContext(UserContext);
  const taskInputRef = useRef(null);

  const addTask = useCallback(() => {
    const title = taskInputRef.current.value;
    if (title) {
      dispatch({ type: 'ADD_TASK', title });
      taskInputRef.current.value = '';
    }
  }, []);

  const toggleTask = useCallback(index => {
    dispatch({ type: 'TOGGLE_TASK', index });
  }, []);

  const deleteTask = useCallback(index => {
    dispatch({ type: 'DELETE_TASK', index });
  }, []);

  const totalTasks = useMemo(() => tasks.length, [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    taskInputRef.current.focus();
  }, []);

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      <p className="user-welcome">Welcome, {user}</p>
      <div className="task-input">
        <input ref={taskInputRef} type="text" placeholder="Add new task" />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <span
              className={`task-title ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(index)}
            >
              {task.title}
            </span>
            <button className="delete-button" onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="task-stats">
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <TaskManager />
    </UserProvider>
  );
}

export default App;

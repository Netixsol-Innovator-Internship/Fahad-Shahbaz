// src/App.tsx
import React, { useState, useEffect } from "react";
import { Task } from "./types";

const STORAGE_KEY = "tasks";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://fahad-week4-day1-todoback.vercel.app";

  // Load tasks from localStorage (and then sync with backend)
  useEffect(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      setTasks(JSON.parse(localData));
    }
    fetchTasks();
  }, []);

  // Keep localStorage in sync whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.warn("Offline, using local data");
        } finally {
      setLoading(false);
        }
      };

      const addTask = async () => {
        if (!title.trim()) {
      alert("Enter a title");
      return;
        }

        const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
        };

        setTasks([...tasks, newTask]);
        setTitle("");

        try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const savedTask = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? savedTask : t))
      );
        } catch {
      console.warn("Saved locally");
        }
      };

      const toggleTask = async (id: number) => {
        const prev = tasks;
        const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTasks(updated);

        try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to update task on server");
      const updatedTask = await res.json();
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
        } catch (err) {
      console.warn("Toggle failed, restored", err);
      setTasks(prev);
        }
      };

      const deleteTask = async (id: number) => {
        setTasks(tasks.filter((t) => t.id !== id));

        try {
      await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE",
      });
        } catch {
      console.warn("Delete saved locally");
        }
      };

      const completedCount = tasks.filter((t) => t.completed).length;
      const pendingCount = tasks.length - completedCount;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Todo</h1>
          <p className="text-sm text-gray-500">Monochrome task manager</p>
        </div>
          </div>

          <div className="text-right">
        <div className="text-sm text-gray-600">Total</div>
        <div className="text-lg font-medium text-gray-900">{tasks.length}</div>
          </div>
        </header>

        <main className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          {/* Add Task Input */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <label htmlFor="new-task" className="sr-only">
          New task
        </label>
        <input
          id="new-task"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition text-sm"
        />
        <button
          onClick={addTask}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-900 transition shadow"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add
        </button>
          </div>

          {/* Loading */}
          {loading && (
        <div className="flex items-center justify-center py-4">
          <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
          )}

          {/* Task List */}
          <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {tasks.length === 0 && !loading ? (
          <li className="py-8 text-center text-gray-500">
            No tasks, add one.
          </li>
        ) : null}

        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="w-5 h-5 rounded border-gray-300 text-black bg-white focus:ring-0"
              aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
            />
            <span
              className={`text-sm sm:text-base truncate ${
            task.completed ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              {task.title}
            </span>
          </label>
            </div>

            <div className="flex items-center gap-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              task.completed ? "bg-gray-100 text-gray-600" : "bg-gray-800 text-white"
            }`}
          >
            {task.completed ? "Done" : "Active"}
          </span>

          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition"
            aria-label={`Delete ${task.title}`}
            title="Delete"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
            </div>
          </li>
        ))}
          </ul>

          {/* Stats */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-sm font-semibold text-gray-900">{completedCount}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-sm font-semibold text-gray-900">{pendingCount}</div>
        </div>

        <div className="ml-auto sm:ml-0">
          <button
            onClick={() => {
          if (!window.confirm("Clear all?")) return;
          setTasks([]);
            }}
            className="text-xs text-gray-600 hover:text-gray-800 transition"
          >
            Clear all
          </button>
        </div>
          </div>
        </main>

        <footer className="mt-4 text-center text-xs text-gray-400">
          Saved locally
        </footer>
      </div>
    </div>
  );
};

export default App;

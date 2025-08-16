import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/tasks");
        const list = Array.isArray(res.data?.data) ? res.data.data : res.data;
        setTasks(list || []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert(err.response?.data?.message || "Failed to fetch tasks");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [navigate]);

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await api.post("/api/tasks", { title: newTask });
      const created = res.data?.data ?? res.data;
      setTasks((prev) => [...prev, created]);
      setNewTask("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add task");
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => (t.id ?? t._id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Toggle complete
  const handleToggleCompleted = async (task) => {
    try {
      const id = task.id ?? task._id;
      const updated = { ...task, completed: !task.completed };
      const res = await api.put(`/api/tasks/${id}`, updated);
      const saved = res.data?.data ?? res.data;
      setTasks((prev) => prev.map((t) => ((t.id ?? t._id) === id ? saved : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading tasks...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAddTask}
        className="flex gap-4 mb-6"
      >
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task…"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {/* List */}
      {!tasks || tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add one!</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => {
            const id = task.id ?? task._id;
            return (
              <li
                key={id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md shadow-sm bg-white"
              >
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!task.completed}
                    onChange={() => handleToggleCompleted(task)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span
                    className={`${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </span>
                </label>
                <button
                  onClick={() => handleDeleteTask(id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

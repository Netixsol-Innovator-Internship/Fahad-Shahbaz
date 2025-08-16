import { useState } from "react";
import axios from "../services/api";

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/tasks", { title, completed: false });
      onTaskAdded(response.data.data); // callback to refresh task list
      setTitle("");
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddTask} className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="New task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="flex-1 p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add"}
      </button>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </form>
  );
}

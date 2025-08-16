import axios from "../services/api";

export default function TaskList({ tasks = [], onTaskDeleted, onTaskUpdated }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      onTaskDeleted(id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleToggleCompleted = async (task) => {
    try {
      const updated = { ...task, completed: !task.completed };
      const response = await axios.put(`/api/tasks/${task.id}`, updated);
      onTaskUpdated(response.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  if (!tasks.length) return <p>No tasks found.</p>;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center p-2 border rounded"
        >
          <div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleCompleted(task)}
              className="mr-2"
            />
            <span className={task.completed ? "line-through" : ""}>
              {task.title}
            </span>
          </div>
          <button
            onClick={() => handleDelete(task.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

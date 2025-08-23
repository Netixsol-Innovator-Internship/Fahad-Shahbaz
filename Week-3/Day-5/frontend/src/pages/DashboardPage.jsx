// src/pages/DashboardPage.jsx
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../api/apiSlice";
import EditTaskModal from "../components/EditTaskModel";
import Loader from "../components/Loader";

const DashboardPage = () => {
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  let userId;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  const {
    data: tasksData,
    isLoading,
    isError,
  } = useGetTasksQuery(userId, { skip: !userId });
  const tasks = tasksData?.data || [];
  const [updateTaskMutation] = useUpdateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async (taskId, updatedTaskData) => {
    try {
      await updateTaskMutation({ taskId, updatedTaskData, token }).unwrap();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      setError(err?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    let confirmDelete = confirm("Do you really want to delete this task?");
    if (confirmDelete) {
      try {
        await deleteTaskMutation({ taskId, token }).unwrap();
        setIsModalOpen(false);
        setEditingTask(null);
      } catch (err) {
        setError(err?.data?.message || "Failed to delete task");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6">
        Your Task Dashboard
      </h1>
      <div className="flex justify-end items-center mb-6">
        <Link
          to="/addTask"
          className="px-6 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
        >
          Add Task
        </Link>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-5 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {task.task}
            </h2>
            <p className="text-gray-600 mb-4">{task.description}</p>

            <div className="flex justify-between items-center">
              {/* Smaller status label */}
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded 
            ${
              task.completed
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
              >
                {task.completed ? "✓ Completed" : "⏳ Pending"}
              </span>

              {/* Button row (left aligned) */}
              <div className="flex gap-2 mts-4">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-8">No tasks found.</p>
      )}
      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateTask}
        task={editingTask}
      />
    </div>
  );
};

export default DashboardPage;

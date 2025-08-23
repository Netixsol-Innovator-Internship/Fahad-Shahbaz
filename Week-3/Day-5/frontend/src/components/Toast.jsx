const Toast = ({ message, type = "success", onClose }) => {
  if (!message) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow text-white ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <span>{message}</span>
      <button
        className="ml-4 px-2 py-1 bg-black bg-opacity-20 rounded cursor-pointer"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

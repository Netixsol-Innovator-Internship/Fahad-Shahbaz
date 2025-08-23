import React from "react";

const BlockUnblockModal = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen || !user) return null;
  const action = user.isBlocked ? "Unblock" : "Block";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{action} User</h3>
        <p className="mb-4">
          Are you sure you want to {action.toLowerCase()}{" "}
          <span className="font-semibold">{user.name}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-4 py-2 ${
              user.isBlocked ? "bg-green-600" : "bg-red-600"
            } text-white rounded`}
            onClick={() => {
              onConfirm(user._id);
              onClose();
            }}
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUnblockModal;

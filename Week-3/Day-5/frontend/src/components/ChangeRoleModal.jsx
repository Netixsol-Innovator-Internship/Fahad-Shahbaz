import React from "react";

const ChangeRoleModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  availableRoles,
}) => {
  const [selectedRole, setSelectedRole] = React.useState(user?.role || "user");

  React.useEffect(() => {
    setSelectedRole(user?.role || "user");
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...user, role: selectedRole });
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 cursor-pointer">Change Role</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Select Role</label>
            <select
              className="w-full border px-2 py-1 rounded cursor-pointer"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeRoleModal;

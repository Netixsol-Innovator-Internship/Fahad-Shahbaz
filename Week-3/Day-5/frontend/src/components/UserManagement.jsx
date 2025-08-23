import { useAuth } from "../contexts/AuthContext";
import ChangeRoleModal from "./ChangeRoleModal";
import BlockUnblockModal from "./BlockUnblockModal";
import Toast from "./Toast";
import { useState } from "react";
import {
  useGetUsersQuery,
  useChangeUserRoleMutation,
  useBlockUnblockUserMutation,
} from "../api/apiSlice";

const UserManagement = () => {
  const { role } = useAuth();
  const { data: response, isLoading, isError, error } = useGetUsersQuery();
  const [changeUserRole] = useChangeUserRoleMutation();
  const [blockUnblockUser] = useBlockUnblockUserMutation();

  const userList = response?.data || [];

  const [isChangeRoleOpen, setChangeRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBlockUnblockOpen, setBlockUnblockOpen] = useState(false);
  const [blockUser, setBlockUser] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Helper functions for role-based permissions
  const canChangeRole = (targetRole) => {
    if (role === "admin") return targetRole === "user";
    if (role === "superadmin")
      return targetRole === "user" || targetRole === "admin";
    return false;
  };

  const canBlockUnblock = (targetRole) => {
    // Only allow blocking/unblocking users (not admins/superadmins)
    return targetRole === "user";
  };

  const handleChangeRole = async (updatedUser) => {
    try {
      await changeUserRole({
        id: updatedUser._id,
        newRole: updatedUser.role,
      }).unwrap();

      setToast({
        message: `Role changed to ${updatedUser.role} for ${updatedUser.name}`,
        type: "success",
      });
    } catch (error) {
      setToast({
        message: error?.data?.message || "Failed to change role",
        type: "error",
      });
    }
  };

  const handleBlockUnblock = async (id) => {
    try {
      const user = userList.find((u) => u._id === id);
      const action = user.isBlocked ? "unblock" : "block";

      await blockUnblockUser({
        id,
        action,
      }).unwrap();

      setToast({
        message: `${user.isBlocked ? "Unblocked" : "Blocked"} ${user.name}`,
        type: "success",
      });
    } catch (error) {
      setToast({
        message: error?.data?.message || "Failed to update user status",
        type: "error",
      });
    }
  };

  const getAvailableRoles = (targetRole) => {
    if (role === "admin") return ["user"];
    if (role === "superadmin") {
      if (targetRole === "user") return ["user", "admin"];
      if (targetRole === "admin") return ["admin", "user", "superadmin"];
    }
    return [targetRole];
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError)
    return (
      <div>Error loading users: {error?.data?.message || error?.message}</div>
    );

  const groupedUsers = {
    user: userList.filter((u) => u.role === "user"),
    admin: userList.filter((u) => u.role === "admin"),
    superadmin: userList.filter((u) => u.role === "superadmin"),
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      {Object.entries(groupedUsers).map(([roleName, users]) => (
        <div key={roleName} className="mb-8">
          <h3 className="text-2xl font-extrabold mb-4 capitalize text-gray-700 tracking-wide">
            {roleName}s
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl shadow-lg bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-4 px-6 border-b-2 border-gray-200 text-gray-900 text-lg font-semibold text-left">
                    Name
                  </th>
                  <th className="py-4 px-6 border-b-2 border-gray-200 text-gray-900 text-lg font-semibold text-left">
                    Email
                  </th>
                  <th className="py-4 px-6 border-b-2 border-gray-200 text-gray-900 text-lg font-semibold text-left">
                    Role
                  </th>
                  <th className="py-4 px-6 border-b-2 border-gray-200 text-gray-900 text-lg font-semibold text-left">
                    Status
                  </th>
                  <th className="py-4 px-6 border-b-2 border-gray-200 text-gray-900 text-lg font-semibold text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all duration-200 rounded-xl"
                  >
                    <td className="py-3 px-6 border-b border-gray-100 text-left">
                      {user.name}
                    </td>
                    <td className="py-3 px-6 border-b border-gray-100 text-left">
                      {user.email}
                    </td>
                    <td className="py-3 px-6 border-b border-gray-100 text-left">
                      {user.role}
                    </td>
                    <td className="py-3 px-6 border-b border-gray-100 text-left">
                      {user.isBlocked ? "Blocked" : "Active"}
                    </td>
                    <td className="py-3 px-6 border-b border-gray-100 text-left">
                      {/* Change Role button, role-based */}
                      {canChangeRole(user.role) && (
                        <button
                          className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                          onClick={() => {
                            setSelectedUser(user);
                            setChangeRoleOpen(true);
                          }}
                        >
                          Change Role
                        </button>
                      )}
                      {/* Block/Unblock button, role-based */}
                      {canBlockUnblock(user.role) && (
                        <button
                          className={`px-4 py-2 rounded-full shadow ${
                            user.isBlocked ? "bg-green-200" : "bg-red-200"
                          } text-gray-800 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200`}
                          onClick={() => {
                            setBlockUser(user);
                            setBlockUnblockOpen(true);
                          }}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <ChangeRoleModal
        isOpen={isChangeRoleOpen}
        onClose={() => setChangeRoleOpen(false)}
        onSubmit={handleChangeRole}
        user={selectedUser}
        availableRoles={
          selectedUser ? getAvailableRoles(selectedUser.role) : []
        }
      />
      <BlockUnblockModal
        isOpen={isBlockUnblockOpen}
        onClose={() => setBlockUnblockOpen(false)}
        onConfirm={handleBlockUnblock}
        user={blockUser}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
};

export default UserManagement;

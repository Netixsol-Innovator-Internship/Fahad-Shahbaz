import React from "react";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useBlockUnblockUserMutation,
} from "../services/api";

const roleOptionsForSuperAdmin = ["admin", "user"];
const roleOptionsForAdmin = ["user"]; // Admin can only change roles to user

const GetUsers = () => {
  const { data, error, isLoading } = useGetUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [blockUnblockUser] = useBlockUnblockUserMutation();

  const currentUserRole = localStorage.getItem("roleOfTheUser"); // "superAdmin" or "admin"

  // Role change permission logic
  const canChangeRole = (currentUserRole, targetUserRole) => {
    // No one can change superAdmin roles
    if (targetUserRole === "superAdmin") return false;

    // SuperAdmin can change admin and user roles
    if (currentUserRole === "superAdmin") return true;

    // Admin can only change user roles (not admin or superAdmin)
    if (currentUserRole === "admin" && targetUserRole === "user") return true;

    return false;
  };

  // Block/unblock permissions logic
  const canBlockUnblock = (currentUserRole, targetUserRole) => {
    // No one can block/unblock superAdmin
    if (targetUserRole === "superAdmin") return false;

    // SuperAdmin can block/unblock anyone except superAdmin
    if (currentUserRole === "superAdmin") return true;

    // Admin can only block/unblock users
    if (currentUserRole === "admin" && targetUserRole === "user") return true;

    return false;
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ id: userId, newRole }).unwrap();
      alert("Role updated successfully");
    } catch (err) {
      alert(err?.data?.message || "Failed to update role");
    }
  };

  const handleBlockChange = async (userId, action) => {
    try {
      await blockUnblockUser({ id: userId, action }).unwrap();
      alert(`User ${action}ed successfully`);
    } catch (err) {
      alert(err?.data?.message || "Failed to update block status");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">Error loading users.</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-light tracking-wide">User Management</h1>
          <p className="text-gray-400 mt-1">
            Manage user roles and permissions
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="border border-gray-200">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 grid grid-cols-12 gap-4 text-sm font-light text-gray-700 border-b border-gray-200">
            <div className="col-span-4">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-4">Actions</div>
          </div>

          {/* User Rows */}
          {data?.data?.map((user, index) => {
            const canEditRole = canChangeRole(currentUserRole, user.role);
            const canEditBlock = canBlockUnblock(currentUserRole, user.role);

            return (
              <div
                key={user._id}
                className={`px-6 py-6 grid grid-cols-12 gap-4 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* User Info */}
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-light text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-light ${
                      user.role === "superAdmin"
                        ? "bg-black text-white"
                        : user.role === "admin"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-light ${
                      user.isBlocked
                        ? "bg-gray-800 text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-4 flex space-x-4">
                  {canEditRole && (
                    <select
                      className="border border-gray-300 bg-white px-3 py-1 text-sm font-light focus:border-black focus:ring-0"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      {currentUserRole === "superAdmin"
                        ? roleOptionsForSuperAdmin.map((roleOpt) => (
                            <option key={roleOpt} value={roleOpt}>
                              {roleOpt}
                            </option>
                          ))
                        : roleOptionsForAdmin.map((roleOpt) => (
                            <option key={roleOpt} value={roleOpt}>
                              {roleOpt}
                            </option>
                          ))}
                    </select>
                  )}

                  {canEditBlock && (
                    <select
                      className="border border-gray-300 bg-white px-3 py-1 text-sm font-light focus:border-black focus:ring-0"
                      value={user.isBlocked ? "block" : "unblock"}
                      onChange={(e) =>
                        handleBlockChange(user._id, e.target.value)
                      }
                    >
                      <option value="unblock">Unblock</option>
                      <option value="block">Block</option>
                    </select>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GetUsers;

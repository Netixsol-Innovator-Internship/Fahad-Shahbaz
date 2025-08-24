import React from "react";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useBlockUnblockUserMutation,
} from "../services/api";

const roleOptionsForSuperAdmin = ["admin", "user"];
const roleOptionsForAdmin = ["user"];

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
      <div className="bg-black text-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-light tracking-wide">
            User Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Manage user roles and permissions
          </p>
        </div>
      </div>

      {/* Users Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden lg:block border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 border-b border-gray-200">
            <div className="col-span-4">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-4">Actions</div>
          </div>

          {/* Desktop User Rows */}
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
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
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
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      user.isBlocked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-4 flex space-x-3">
                  {canEditRole && (
                    <select
                      className="border border-gray-300 bg-white px-3 py-2 text-sm rounded-md focus:border-black focus:ring-1 focus:ring-black cursor-pointer"
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
                      className="border border-gray-300 bg-white px-3 py-2 text-sm rounded-md focus:border-black focus:ring-1 focus:ring-black cursor-pointer"
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

        {/* Mobile Card View - Visible on mobile and tablet */}
        <div className="lg:hidden space-y-4">
          {data?.data?.map((user) => {
            const canEditRole = canChangeRole(currentUserRole, user.role);
            const canEditBlock = canBlockUnblock(currentUserRole, user.role);

            return (
              <div
                key={user._id}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
              >
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-lg font-medium">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-lg">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role and Status */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Role:
                    </span>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
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
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Status:
                    </span>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        user.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {(canEditRole || canEditBlock) && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Actions
                    </h4>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      {canEditRole && (
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Change Role
                          </label>
                          <select
                            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm rounded-md focus:border-black focus:ring-1 focus:ring-black"
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
                        </div>
                      )}

                      {canEditBlock && (
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Block Status
                          </label>
                          <select
                            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm rounded-md focus:border-black focus:ring-1 focus:ring-black"
                            value={user.isBlocked ? "block" : "unblock"}
                            onChange={(e) =>
                              handleBlockChange(user._id, e.target.value)
                            }
                          >
                            <option value="unblock">Unblock</option>
                            <option value="block">Block</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GetUsers;

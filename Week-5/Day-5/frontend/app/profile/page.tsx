"use client";

import { ProfileLayout } from "@/components/profile/profile-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
} from "@/lib/api/usersApiSlice";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, isAuthenticated, token } = useAppSelector(
    (state) => state.auth
  );

  // Fetch additional user details if needed
  const {
    data: userDetails,
    isLoading,
    error,
    refetch,
  } = useGetUserQuery(user?._id || "", {
    skip: !user?._id || !token,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // If token becomes available after mount (rehydration), trigger a refetch
  useEffect(() => {
    if (user?._id && token) {
      refetch();
    }
  }, [user?._id, token, refetch]);

  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();
  const [changePassword, { isLoading: changing }] = useChangePasswordMutation();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false as boolean);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
  });
  const displayUser = userDetails || user;

  return (
    <ProtectedRoute>
      <ProfileLayout>
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="flex items-center justify-between p-3 border-b bg-[#2E3D83] text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-700"
                onClick={() => setEditing((e) => !e)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                      Could not refresh profile from server. Showing saved info.
                    </div>
                  )}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={
                          displayUser?.profileImage ||
                          "/professional-man-profile-photo.png"
                        }
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6 flex-1">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Full Name
                        </Label>
                        {editing ? (
                          <input
                            className="mt-1 w-full rounded border px-3 py-2"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                          />
                        ) : (
                          <p className="text-gray-900 mt-1">
                            {displayUser?.name || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Email
                        </Label>
                        {editing ? (
                          <input
                            type="email"
                            className="mt-1 w-full rounded border px-3 py-2"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                          />
                        ) : (
                          <p className="text-gray-900 mt-1">
                            {displayUser?.email || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Mobile Number
                        </Label>
                        {editing ? (
                          <input
                            className="mt-1 w-full rounded border px-3 py-2"
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                          />
                        ) : (
                          <p className="text-gray-900 mt-1">
                            {displayUser?.phone || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Role
                        </Label>
                        <p className="text-gray-900 mt-1">
                          {displayUser?.role || "User"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Member Since
                        </Label>
                        <p className="text-gray-900 mt-1">
                          {displayUser?.createdAt
                            ? new Date(
                                displayUser.createdAt
                              ).toLocaleDateString()
                            : "Not available"}
                        </p>
                      </div>
                      <div className="flex items-end">
                        <Label className="text-sm font-medium text-gray-600">
                          Account Status
                        </Label>
                        <div className="text-gray-900 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    {editing && (
                      <div className="mt-4 flex gap-3">
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              if (!user?._id) return;
                              await updateUser({
                                id: user._id,
                                ...form,
                              }).unwrap();
                              setEditing(false);
                            } catch (e) {
                              // optionally show toast
                            }
                          }}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditing(false);
                            setForm({
                              name: displayUser?.name || "",
                              email: displayUser?.email || "",
                              phone: (displayUser as any)?.phone || "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b bg-[#2E3D83] text-white">
              <h2 className="text-lg font-semibold">Password</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              <form
                className="grid gap-4 max-w-md"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formEl = e.currentTarget as HTMLFormElement;
                  const currentPassword = (
                    formEl.elements.namedItem(
                      "currentPassword"
                    ) as HTMLInputElement
                  ).value;
                  const newPassword = (
                    formEl.elements.namedItem("newPassword") as HTMLInputElement
                  ).value;
                  const confirmNewPassword = (
                    formEl.elements.namedItem(
                      "confirmNewPassword"
                    ) as HTMLInputElement
                  ).value;
                  if (!user?._id) return;
                  if (newPassword !== confirmNewPassword) {
                    toast({
                      title: "Password mismatch",
                      description: "New passwords do not match",
                      variant: "destructive",
                    });
                    return;
                  }
                  try {
                    await changePassword({
                      id: user._id,
                      currentPassword,
                      newPassword,
                      confirmNewPassword,
                    }).unwrap();
                    formEl.reset();
                    toast({
                      title: "Password updated",
                      description: "Your password has been changed.",
                    });
                  } catch (err: any) {
                    // Attempt to surface server message
                    const message =
                      err?.data?.message ||
                      err?.error ||
                      err?.message ||
                      "Please try again";
                    toast({
                      title: "Update failed",
                      description: String(message),
                      variant: "destructive",
                    });
                  }
                }}
              >
                <div>
                  <Label
                    className="text-sm font-medium text-gray-600"
                    htmlFor="currentPassword"
                  >
                    Current Password
                  </Label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    className="mt-1 w-full rounded border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <Label
                    className="text-sm font-medium text-gray-600"
                    htmlFor="newPassword"
                  >
                    New Password
                  </Label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="mt-1 w-full rounded border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <Label
                    className="text-sm font-medium text-gray-600"
                    htmlFor="confirmNewPassword"
                  >
                    Confirm New Password
                  </Label>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    className="mt-1 w-full rounded border px-3 py-2"
                    required
                  />
                </div>
                <div className="pt-2">
                  <Button className="bg-[#2E3D83] cursor-pointer hover:bg-blue-800" type="submit" disabled={changing}>
                    {changing ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ProfileLayout>
    </ProtectedRoute>
  );
}

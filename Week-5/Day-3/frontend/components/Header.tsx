"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsProvider";

export default function Header({ title }: { title?: string }) {
  const { token, logout, user } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between gap-6 mb-4 max-w-[1400px] mx-auto my-7">
      <div className="flex items-center gap-3">
        <div className="hidden md:block w-11 h-11 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500" />
        <div>
          <div className="font-extrabold text-blue-600">RealtimeHub</div>
          <div className="small muted">Comments & Notifications</div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {/* Profile page button if logged in, login/register button if logged out */}
        {token ? (
          <button
            onClick={() => router.push(`/users/${user?.id}`)}
            aria-label="Profile"
            title="Profile"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-0 cursor-pointer"
          >
            {/* Profile icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            aria-label="Login or Register"
            title="Login or Register"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-0 cursor-pointer"
          >
            {/* Login/Register icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </button>
        )}
        {/* Notification bell: only show if logged in */}
        {token && (
          <div className="relative">
            <button
              onClick={() => router.push("/notifications")}
              aria-label="Notifications"
              title="Notifications"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-0 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1.5 font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        )}
        {/* Logout button: only show if logged in */}
        {token && (
          <button
            onClick={logout}
            aria-label="Logout"
            title="Logout"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-0 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../../lib/hooks";
import { setCredentials } from "../../lib/slices/authSlice";

export function AuthPersistence({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check for stored authentication data on app load
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        dispatch(setCredentials({ user, token }));
      } catch (error) {
        // Clean up corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

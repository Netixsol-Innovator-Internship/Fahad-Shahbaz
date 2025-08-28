"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../lib/config";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<{
    id?: string;
    username?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = window.sessionStorage.getItem("token");
      if (t && t.trim() !== "") {
        setTokenState(t);
      } else {
        // Clear invalid token from storage
        window.sessionStorage.removeItem("token");
        setTokenState(null);
      }
    }
  }, []);

  const setToken = useCallback((t: string | null) => {
    if (typeof window !== "undefined") {
      if (t) window.sessionStorage.setItem("token", t);
      else window.sessionStorage.removeItem("token");
    }
    setTokenState(t);
  }, []);

  const setUser = useCallback(
    (u: { id?: string; username?: string; email?: string } | null) => {
      setUserState(u);
      if (typeof window !== "undefined") {
        if (u) window.sessionStorage.setItem("user", JSON.stringify(u));
        else window.sessionStorage.removeItem("user");
      }
    },
    []
  );

  useEffect(() => {
    // if token exists try to load user from sessionStorage or backend
    if (!token) return;
    if (typeof window === "undefined") return;
    const s = window.sessionStorage.getItem("user");
    if (s) {
      try {
        const parsed = JSON.parse(s);
        setUserState(parsed);
        return;
      } catch (e) {
        // fallthrough
      }
    }

    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const j = await res.json();
          setUserState(j.user || j);
          if (typeof window !== "undefined")
            window.sessionStorage.setItem("user", JSON.stringify(j.user || j));
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [token]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    // simple reload to reset client state and sockets
    if (typeof window !== "undefined") window.location.href = "/login";
  }, [setToken, setUser]);

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

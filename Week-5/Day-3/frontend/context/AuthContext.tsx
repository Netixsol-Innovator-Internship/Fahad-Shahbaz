"use client";

import React, { createContext, useContext } from "react";

export type AuthContextShape = {
  token: string | null;
  user: { id?: string; username?: string; email?: string } | null;
  setToken: (t: string | null) => void;
  setUser: (
    u: { id?: string; username?: string; email?: string } | null
  ) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextShape>({
  token: null,
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;

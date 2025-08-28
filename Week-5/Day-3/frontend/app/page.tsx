"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const token = typeof window !== "undefined" ? window.sessionStorage.getItem("token") : null;
    if (token) {
      window.location.href = "/comments";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return null;
}

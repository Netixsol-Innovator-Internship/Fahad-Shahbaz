"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredMsg, setRegisteredMsg] = useState<string | null>(null);
  const { setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Show success message if redirected from register
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "1")
        setRegisteredMsg("Account created. Please login.");
    }
  }, []);

  async function login() {
    setError(null);
    if (!email || !password) return setError("Provide email and password");
    setLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        }/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const j = await res.json();
      if (res.ok && j?.token) {
        setToken(j.token);
        // if backend returns user payload, persist it via sessionStorage (AuthProvider watches token)
        if (j?.user && typeof window !== "undefined")
          window.sessionStorage.setItem("user", JSON.stringify(j.user));
        router.push("/comments");
      } else {
        setError(j?.message || "Login failed");
      }
    } catch (e) {
      setError("Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#f7f9fc] flex items-start justify-center">
      <div className="app-container">
        <Header />
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-bold">Sign in</h2>
          {registeredMsg && (
            <div
              className="muted"
              style={{ color: "var(--success)", marginTop: 8 }}
            >
              {registeredMsg}
            </div>
          )}

          <label className="small muted" style={{ marginTop: 12 }}>
            Email
          </label>
          <input
            className="form-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <label className="small muted" style={{ marginTop: 12 }}>
            Password
          </label>
          <input
            className="form-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          {error && (
            <div
              role="alert"
              className="muted"
              style={{ color: "var(--danger)", marginTop: 12 }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 16,
            }}
          >
            <button onClick={login} className="btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <div className="small muted" style={{ marginTop: 6 }}>
              <a
                href="/register"
                style={{ color: "var(--primary)", textDecoration: "underline" }}
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

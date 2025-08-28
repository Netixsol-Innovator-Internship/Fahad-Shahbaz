"use client";

import { useState } from "react";
import Header from "../../components/Header";
import { BACKEND_URL } from "../../lib/config";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function validate() {
    if (!username.trim()) return "Username is required";
    // basic email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  }

  async function register() {
    setError(null);
    const v = validate();
    if (v) return setError(v);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });
      const j = await res.json();
      if (res.ok && j) {
        // registration success -> go to login with a success flag
        router.push("/login?registered=1");
      } else {
        setError(j?.message || "Registration failed");
      }
    } catch (e) {
      setError("Registration error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#f7f9fc] flex items-start justify-center">
      <div className="app-container">
        <Header />
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-bold">Create your account</h2>
          <p className="muted small" style={{ marginTop: 6 }}>
            Pick a public username and a secure password.
          </p>

          <label
            htmlFor="username"
            className="small muted"
            style={{ marginTop: 12 }}
          >
            Username
          </label>
          <input
            id="username"
            className="form-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-required
            aria-describedby="username-hint"
          />
          <div id="username-hint" className="muted small">
            Short and unique (public).
          </div>

          <label
            htmlFor="email"
            className="small muted"
            style={{ marginTop: 12 }}
          >
            Email
          </label>
          <input
            id="email"
            className="form-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            aria-required
          />

          <label
            htmlFor="password"
            className="small muted"
            style={{ marginTop: 12 }}
          >
            Password
          </label>
          <input
            id="password"
            className="form-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            aria-required
            aria-describedby="pw-hint"
          />
          <div id="pw-hint" className="muted small">
            Minimum 6 characters.
          </div>

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
            <button
              onClick={register}
              className="btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Creating..." : "Create account"}
            </button>
            <div className="small muted" style={{ marginTop: 6 }}>
              <a
                href="/login"
                style={{ color: "var(--primary)", textDecoration: "underline" }}
              >
                Back to login
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

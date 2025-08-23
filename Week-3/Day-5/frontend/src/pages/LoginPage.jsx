import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/apiSlice";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error, setError, role } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState({});
  const [loginMutation] = useLoginMutation();

  const handleValue = (e) => {
    setState((s) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email = "", password = "" } = state;

    // Simple frontend validation
    if (!email || !password) {
      return setError("Please enter both email and password.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }

    try {
      setLoading(true);
      const response = await loginMutation({ email, password }).unwrap();
      const token = response.token;
      localStorage.setItem("token", token);
      setError("");
      // Role-based redirect
      if (response.role === "admin" || response.role === "superAdmin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
      login(token, response.role); // update context
    } catch (err) {
      setError(err?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <input
            name="email"
            onChange={handleValue}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            onChange={handleValue}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-black/80 transition cursor-pointer"
          >
            Login
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-500">
              Sign-up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

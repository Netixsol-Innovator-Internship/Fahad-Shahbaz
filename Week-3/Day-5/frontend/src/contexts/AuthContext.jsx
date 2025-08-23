import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useLoginMutation } from "../api/apiSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const logout = useCallback(() => {
    console.log("Logging out user");
    localStorage.removeItem("token");
    localStorage.removeItem("idOfTheUser");
    setIsAuthenticated(false);
    setRole("user");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      console.log("Checking token...", token);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            console.log("Token expired");
            logout();
          } else {
            console.log(
              "Token valid, setting authenticated and role:",
              decoded.role
            );
            setIsAuthenticated(true);
            setRole(decoded.role || "user");
          }
        } catch (e) {
          console.error("Invalid token:", e);
          logout();
        }
      } else {
        console.log("No token found");
        setIsAuthenticated(false);
        setRole("user");
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(interval);
  }, [logout]);

  const [loginMutation] = useLoginMutation();

  const login = async (email, password) => {
    setError("");
    try {
      setLoading(true);
      console.log("Attempting login for:", email);
      const response = await loginMutation({ email, password }).unwrap();
      console.log("Login response:", response);

      const token = response.token;
      localStorage.setItem("token", token);
      const id = response.user.id;
      localStorage.setItem("idOfTheUser", id);

      // Decode token to get user role
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      setRole(decoded.role || "user");

      setError("");
      setIsAuthenticated(true);
      console.log("Authentication state set to true");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setIsAuthenticated(false);
      setError(err?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        loading,
        error,
        setError,
        role,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

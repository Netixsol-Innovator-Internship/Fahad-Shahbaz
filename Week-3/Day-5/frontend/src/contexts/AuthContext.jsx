// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLoginMutation } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [loginMutation, { isLoading: loading }] = useLoginMutation();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      console.log("Checking token...", token);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000; // in seconds

          if (decoded.exp < currentTime) {
            console.log("Token expired");
            logout();
          } else {
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error("Invalid token:", e);
          logout();
        }
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(interval); // cleanup
  }, []);

  const login = async (email, password) => {
    setError("");
    try {
      const response = await loginMutation({
        email,
        password,
      }).unwrap();

      console.log("response", response);
      const token = response.token; //  get token from response
      localStorage.setItem("token", token); // store it

      const id = response.user.id;
      const role = response.user.role;

      localStorage.setItem("idOfTheUser", id);
      localStorage.setItem("roleOfTheUser", role);

      console.log("role", role);
      console.log("id", id);
      console.log("token", token); //  log it

      setError("");
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
      console.log("err", err);
      setError(err.data?.message || "Login failed");
    }
  };

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("idOfTheUser");
    localStorage.removeItem("roleOfTheUser");
    setIsAuthenticated(false);
    navigate("/login");
  }

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

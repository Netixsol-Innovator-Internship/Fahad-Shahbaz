import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Protected route that requires authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Protected route that requires admin or superadmin role
export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin" && role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Route that redirects authenticated users away (for login/signup pages)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./src/pages/LoginPage";
// import LoginPage from "./pages/LoginPage";
import SignupPage from "./src/pages/SignupPage";
import Navbar from "./src/components/Navbar";
import { useAuth } from "./src/contexts/AuthContext";
import { useEffect, useState } from "react";
import AccessoriesPage from "./src/pages/AccessoriesPage";
import CollectionsPage from "./src/pages/CollectionsPage";
import CartPage from "./src/pages/CartPage";
import Footer from "./src/components/Footer";
import ProductDetailPage from "./src/pages/ProductDetailPage";
import AdminPage from "./src/dashboard/AdminPage";
import AddProductPage from "./src/dashboard/AddProductPage";
import GetProducts from "./src/dashboard/GetProducts";
import GetUsers from "./src/dashboard/GetUsers";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    const role = localStorage.getItem("roleOfTheUser");
    setIsAdmin(role === "admin" || role === "superAdmin");
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CollectionsPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signUp"
          element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route
          path="/add-product"
          element={isAdmin ? <AddProductPage /> : <Navigate to="/" />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/getUsers"
          element={isAdmin ? <GetUsers /> : <Navigate to="/" />}
        />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route
          path="/admin-products"
          element={isAdmin ? <GetProducts /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPage /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

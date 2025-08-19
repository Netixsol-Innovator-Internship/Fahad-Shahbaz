import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AddTaskPage from "./pages/AddTaskPage";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import AccessoriesPage from "./pages/AccessoriesPage";
import CollectionsPage from "./pages/CollectionsPage";
import CartPage from "../src/pages/CartPage";
import Footer from "./components/Footer";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      {/* <Router> */}
      {/* {isAuthenticated && <Navbar />} */}
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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        {/* <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/addTask"
          element={isAuthenticated ? <AddTaskPage /> : <Navigate to="/login" />}
        /> */}
      </Routes>
      {/* </Router> */}
      <Footer />
    </>
  );
  // return(
  //   <AccessoriesPage />
  // )
}

export default App;

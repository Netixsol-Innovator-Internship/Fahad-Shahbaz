import { useState } from "react";
import ProductManagement from "../components/ProductManagement";
import UserManagement from "../components/UserManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "products"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "users" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "users" && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;

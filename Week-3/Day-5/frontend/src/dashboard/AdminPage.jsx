import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-light tracking-wide">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your store operations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Product */}
          <div className="group border border-gray-200 hover:border-black transition-colors duration-200 shadow-md">
            <Link to="/add-product" className="block p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                  <span className="text-white text-xl">+</span>
                </div>
              </div>
              <h3 className="text-xl font-light mb-2">Add Product</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Create new products and manage inventory for your store catalog.
              </p>
            </Link>
          </div>

          {/* View Users */}
          <div className="group border border-gray-200 hover:border-black transition-colors duration-200 shadow-md">
            <Link to="/getUsers" className="block p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                  <span className="text-white text-xl">👤</span>
                </div>
              </div>
              <h3 className="text-xl font-light mb-2">User Management</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                View and manage registered users and their access permissions.
              </p>
            </Link>
          </div>

          {/* See Products */}
          <div className="group border border-gray-200 hover:border-black transition-colors duration-200 shadow-md">
            <Link to="/admin-products" className="block p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gray-600 flex items-center justify-center">
                  <span className="text-white text-xl">📦</span>
                </div>
              </div>
              <h3 className="text-xl font-light mb-2">Product Catalog</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Edit, remove, or update existing products in your inventory.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

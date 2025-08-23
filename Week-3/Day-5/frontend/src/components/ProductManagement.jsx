import React, { useState } from "react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { useAuth } from "../contexts/AuthContext";
import Toast from "./Toast";
import { useGetProductsForAdminQuery } from "../api/apiSlice";

const ProductManagement = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetProductsForAdminQuery();

  // Extract products from the response
  const products = response?.data || [];

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleAddProduct = (newProduct) => {
    // Refresh will be handled by RTK Query cache invalidation
    setToast({ message: "Product added successfully!", type: "success" });
  };

  const handleEditProduct = (updatedProduct) => {
    // Refresh will be handled by RTK Query cache invalidation
    setToast({ message: "Product updated successfully!", type: "success" });
  };

  const handleDeleteProduct = (id) => {
    // Refresh will be handled by RTK Query cache invalidation
    setToast({ message: "Product deleted successfully!", type: "success" });
  };

  const { role } = useAuth();

  if (isLoading) return <div>Loading products...</div>;
  if (isError)
    return (
      <div>
        Error loading products: {error?.data?.message || error?.message}
      </div>
    );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Product Management</h2>
      {/* Add Product button for admin and superAdmin */}
      {(role === "admin" || role === "superadmin") && (
        <button
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
          onClick={() => setAddModalOpen(true)}
        >
          Add Product
        </button>
      )}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditProduct}
        product={selectedProduct}
      />
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        product={deleteProduct}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl shadow-lg bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-6 border-b-2 border-gray-200 text-gray-900 text-lg font-semibold text-left">
                Title
              </th>
              <th className="py-4 px-6 border-b-2 border-gray-200 text-gray-900 text-lg font-semibold text-left">
                Price
              </th>
              <th className="py-4 px-6 border-b-2 border-gray-200 text-gray-900 text-lg font-semibold text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all duration-200 rounded-xl"
              >
                <td className="py-3 px-6 border-b border-gray-100 text-left">
                  {product.name}
                </td>
                <td className="py-3 px-6 border-b border-gray-100 text-left">
                  ${product.price}
                </td>
                <td className="py-3 px-6 border-b border-gray-100 text-left">
                  {(role === "admin" || role === "superadmin") && (
                    <button
                      className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                      onClick={() => {
                        setSelectedProduct(product);
                        setEditModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {role === "superadmin" && (
                    <button
                      className="px-4 py-2 bg-red-200 text-gray-800 rounded-full shadow hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                      onClick={() => {
                        setDeleteProduct(product);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;

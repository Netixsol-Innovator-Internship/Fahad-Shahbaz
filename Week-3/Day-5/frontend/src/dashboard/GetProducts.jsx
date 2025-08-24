import React, { useState } from "react";
import {
  useGetProductsForAdminQuery,
  useDeleteProductMutation,
  useUpdateProductMutation, // ✅ You'll need this
} from "../services/api";
import { Navigate } from "react-router-dom";

const GetProducts = () => {
  const role = localStorage.getItem("roleOfTheUser");

  const { data, error, isLoading } = useGetProductsForAdminQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "", price: "" });
  };

  const handleInputChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (id) => {
    console.log("id", id);
    try {
      const updatedProduct = {
        updatedName: editForm.name,
        updatedDescription: editForm.description,
        updatedPrice: editForm.price,
      };

      console.log("🔄 Sending update:", { id, ...updatedProduct });
      const result = await updateProduct({ id, ...updatedProduct }).unwrap();
      console.log("✅ Update successful:", result);

      alert("✅ Product updated successfully!");
      setEditingId(null);
    } catch (err) {
      console.log("❌ Update failed:", err);

      if (err.data?.message) {
        alert(`Failed: ${err.data.message}`);
      } else if (err.status) {
        alert(`Failed: Error ${err.status}`);
      } else {
        alert("Failed to update product. Please check console for details.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this product?");
    if (!confirm) return;
    try {
      await deleteProduct(id).unwrap();
      alert("❌ Product deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">Failed to load products.</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-light tracking-wide">
            Product Management
          </h1>
          <p className="text-gray-400 mt-1">
            Edit and manage your product catalog
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.data?.map((product) => {
            const isEditing = editingId === product._id;

            return (
              <div
                key={product._id}
                className="border border-gray-200 group hover:border-black transition-colors hover:shadow-md"
              >
                <div className="aspect-square bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-black focus:ring-0"
                        placeholder="Product name"
                      />
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-black focus:ring-0 
                        resize-none"
                        placeholder="Description"
                      />
                      <input
                        name="price"
                        type="number"
                        value={editForm.price}
                        onChange={handleInputChange}
                        className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-black focus:ring-0"
                        placeholder="Price"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-light mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      <p className="text-black font-light">${product.price}</p>
                    </>
                  )}

                  <div className="mt-6 flex space-x-4">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(product._id)}
                          className="bg-black text-white px-4 py-2 text-sm font-light hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="border border-gray-300 text-gray-700 px-4 py-2 text-sm font-light hover:border-black transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(product)}
                          className="border border-gray-300 text-gray-700 px-4 py-2 text-sm font-light hover:border-black transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        {role === "superAdmin" && (
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-gray-800 text-white px-4 py-2 text-sm font-light hover:bg-black transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GetProducts;

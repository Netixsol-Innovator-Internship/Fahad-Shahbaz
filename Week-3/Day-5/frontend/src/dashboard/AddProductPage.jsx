import React, { useState } from "react";
import { useAddProductMutation } from "../services/api";

const AddProductPage = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    origin: "",
    flavor: "",
    qualities: "",
    caffeine: "",
    allergens: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Unauthorized access, please login.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      const res = await addProduct(data).unwrap();
      console.log(res);
      alert("✅ Product added successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-6">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-2xl font-light tracking-wide">Add Product</h1>
          <p className="text-gray-400 mt-1">Create a new product entry</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          encType="multipart/form-data"
        >
          {/* Basic Information Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-light mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-0"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-light text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-0 resize-none"
                required
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-light mb-6">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "category", label: "Category" },
                { name: "origin", label: "Origin" },
                { name: "flavor", label: "Flavor" },
                { name: "qualities", label: "Qualities" },
                { name: "caffeine", label: "Caffeine" },
                { name: "allergens", label: "Allergens" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-0"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="pb-8">
            <h3 className="text-lg font-light mb-6">Product Image</h3>
            <div className="flex items-start space-x-6">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:text-sm file:font-light file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                />
              </div>
              {preview && (
                <div className="w-24 h-24 border border-gray-300">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white px-8 py-3 font-light hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;

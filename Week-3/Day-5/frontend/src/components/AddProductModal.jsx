import React from "react";
import { useAddProductMutation } from "../api/apiSlice";

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [formData, setFormData] = React.useState({
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
  const [image, setImage] = React.useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      await addProduct(formDataToSend).unwrap();
      onSubmit(); // Trigger success toast
      setFormData({
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
      setImage(null);
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      // Handle error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Add Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name *</label>
            <input
              type="text"
              name="name"
              className="w-full border px-2 py-1 rounded"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description *</label>
            <textarea
              name="description"
              className="w-full border px-2 py-1 rounded"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Price *</label>
            <input
              type="number"
              name="price"
              className="w-full border px-2 py-1 rounded"
              value={formData.price}
              onChange={handleInputChange}
              min="100"
              max="10000"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Category *</label>
            <input
              type="text"
              name="category"
              className="w-full border px-2 py-1 rounded"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Origin</label>
            <input
              type="text"
              name="origin"
              className="w-full border px-2 py-1 rounded"
              value={formData.origin}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Flavor</label>
            <input
              type="text"
              name="flavor"
              className="w-full border px-2 py-1 rounded"
              value={formData.flavor}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Qualities</label>
            <input
              type="text"
              name="qualities"
              className="w-full border px-2 py-1 rounded"
              value={formData.qualities}
              onChange={handleInputChange}
              placeholder="Comma separated values"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Caffeine Level</label>
            <select
              name="caffeine"
              className="w-full border px-2 py-1 rounded"
              value={formData.caffeine}
              onChange={handleInputChange}
            >
              <option value="">Select caffeine level</option>
              <option value="None">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Allergens</label>
            <input
              type="text"
              name="allergens"
              className="w-full border px-2 py-1 rounded"
              value={formData.allergens}
              onChange={handleInputChange}
              placeholder="Comma separated values"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Image *</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border px-2 py-1 rounded"
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

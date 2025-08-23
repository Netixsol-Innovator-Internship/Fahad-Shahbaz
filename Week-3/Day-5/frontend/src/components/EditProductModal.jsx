import React from "react";

const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [title, setTitle] = React.useState(product?.title || "");
  const [price, setPrice] = React.useState(product?.price || "");

  React.useEffect(() => {
    setTitle(product?.title || "");
    setPrice(product?.price || "");
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...product, title, price });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Edit Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Price</label>
            <input
              type="number"
              className="w-full border px-2 py-1 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;

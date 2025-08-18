import mongoose from "mongoose";

// Product schema for store items
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

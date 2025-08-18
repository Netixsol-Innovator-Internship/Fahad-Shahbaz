import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Represents an item in the cart
const cartItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
    min: 1,
  },
});

// Represents a user's cart
const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
});

export default mongoose.model("Cart", cartSchema);

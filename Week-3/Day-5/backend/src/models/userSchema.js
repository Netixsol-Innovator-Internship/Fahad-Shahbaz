import mongoose from "mongoose";

const Schema = mongoose.Schema;

// User schema for authentication and roles
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

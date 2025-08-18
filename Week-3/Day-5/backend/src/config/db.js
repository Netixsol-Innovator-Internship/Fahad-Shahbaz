import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.error("Error while connecting to database:", err);
  }
};

export default connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://muhammadfahadintern:fahad123@cluster0.ug19bpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Database Connected");
  } catch (err) {
    console.error("Error while connecting database:", err);
  }
};

module.exports = connectDB;

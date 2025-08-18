import express from "express";
import { swaggerUi, swaggerSpec } from "./src/docs/swagger.js";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import ErrorResponse from "./src/utils/errorResponse.js";
import connectDB from "./src/config/db.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Enabling CORS for all origins
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Swagger UI endpoint
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Health check route
app.get("/", (req, res) => {
  console.log(`app working`);
  res.status(200).json({
    success: true,
    message: "Everything is working",
    data: {},
  });
});

// Handle non-existing routes
app.use((req, res, next) => {
  const error = new ErrorResponse("Can't find this route", 404, [], false);
  return next(error);
});

// Central error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  const status = typeof error.code === "number" ? error.code : 500;
  const message = error.message || "Internal server error";
  const data = error.data || {};
  const success = typeof error.success !== "undefined" ? error.success : false;
  res.status(status).json({
    success,
    message,
    data,
    status,
  });
});

// Start the server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

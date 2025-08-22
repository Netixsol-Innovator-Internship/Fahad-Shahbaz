import express from "express";
import { swaggerSpec } from "./src/docs/swagger.js";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import ErrorResponse from "./src/utils/errorResponse.js";
import connectDB from "./src/config/db.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// Enabling CORS for all origins (MUST be before any routes)
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve Swagger spec as JSON
app.get("/api-docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Serve Swagger UI using CDN
app.get("/api-docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            SwaggerUIBundle({
              url: '/api-docs/swagger.json',
              dom_id: '#swagger-ui',
              presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
              layout: 'StandaloneLayout'
            });
          }
        </script>
      </body>
    </html>
  `);
});

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

export default app;

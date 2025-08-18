import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Docs",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:8000", // Works for local + deployed
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Load all route files in project
  apis: [path.join(__dirname, "../**/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi, swaggerSpec };

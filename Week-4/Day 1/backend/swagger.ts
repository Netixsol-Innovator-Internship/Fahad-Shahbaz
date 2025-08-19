const path = require("path");
const fs = require("fs");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Try several places where source files (with JSDoc) might be at runtime.
const possibleApis = [
  path.join(process.cwd(), "server.ts"),
  path.join(process.cwd(), "server.js"),
  path.join(process.cwd(), "dist", "server.js"),
  path.join(process.cwd(), "**", "*.ts"),
  path.join(process.cwd(), "**", "*.js"),
];

// Filter to only include patterns/files that exist or are globs
const apis = possibleApis.filter((p) => {
  // keep globs (contain *) or existing files
  if (p.includes("*")) return true;
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasks API",
      version: "1.0.0",
      description: "A simple Tasks API",
    },
  },
  apis,
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  default: swaggerUi,
  swaggerSpec,
};

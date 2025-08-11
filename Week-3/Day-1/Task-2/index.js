import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { v4 as uuidv4 } from "uuid"; // For UUID IDs

const app = express();
app.use(express.json()); // Middleware

// In-memory data
let tasks = [];

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Task Manager API - Internship Task", version: "1.0.0" },
  },
  apis: ["./index.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - completed
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         completed:
 *           type: boolean
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks (optional search by title)
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter tasks by title
 *     responses:
 *       200:
 *         description: List of tasks
 */
app.get("/api/tasks", (req, res) => {
  let result = tasks;
  if (req.query.title) {
    const search = req.query.title.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(search));
  }
  res.json({
    success: true,
    data: result,
    message: "Tasks fetched successfully",
  });
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task)
    return res
      .status(404)
      .json({ success: false, data: null, message: "Task not found" });
  res.json({ success: true, data: task, message: "Task fetched successfully" });
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Add a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created
 */
app.post("/api/tasks", (req, res) => {
  const { title, completed } = req.body;
  if (typeof title !== "string" || typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ success: false, data: null, message: "Invalid input" });
  }
  const newTask = { id: uuidv4(), title, completed };
  tasks.push(newTask);
  res.status(201).json({
    success: true,
    data: newTask,
    message: "Task created successfully",
  });
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */
app.put("/api/tasks/:id", (req, res) => {
  const { title, completed } = req.body;
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task)
    return res
      .status(404)
      .json({ success: false, data: null, message: "Task not found" });
  if (typeof title !== "string" || typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ success: false, data: null, message: "Invalid input" });
  }
  task.title = title;
  task.completed = completed;
  res.json({ success: true, data: task, message: "Task updated successfully" });
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1)
    return res
      .status(404)
      .json({ success: false, data: null, message: "Task not found" });
  const deleted = tasks.splice(index, 1)[0];
  res.json({
    success: true,
    data: deleted,
    message: "Task deleted successfully",
  });
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get statistics of tasks
 *     responses:
 *       200:
 *         description: Task statistics
 */
app.get("/api/stats", (req, res) => {
  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;
  res.json({
    success: true,
    data: { total, completed: completedCount, pending: pendingCount },
    message: "Task stats fetched successfully",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, data: null, message: "Internal Server Error" });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

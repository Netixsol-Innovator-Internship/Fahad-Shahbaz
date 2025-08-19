const express = require("express");
const cors = require("cors");
const swaggerUi = require("./swagger").default;
const { swaggerSpec } = require("./swagger");
import type { Request, Response } from "express";
import type { Task } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

let tasks: Task[] = [];
let nextId = 1;

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         completed:
 *           type: boolean
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
app.post("/api/tasks", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTask: Task = { id: nextId++, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

/**
 * Toggle task completed
 */
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.completed = !task.completed;
  res.json(task);
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
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: No content
 */
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).send();
});

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

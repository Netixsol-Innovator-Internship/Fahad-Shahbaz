// src/routes/userRoutes.js
import express from "express";
import { check } from "express-validator";
import { signup, login } from "../controllers/userController.js";
const router = express.Router();

// router.get("/", usersControllers.getUsers);

router.post(
  "/register",
  [
    check("name").trim().notEmpty().withMessage("Name is required"),
    check("email").normalizeEmail().isEmail().withMessage("Email is required"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail().withMessage("Email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

export default router;

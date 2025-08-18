import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import ErrorResponse from "../utils/errorResponse.js";
import dotenv from "dotenv";
dotenv.config();

const adminEmails = ["admin@mail.com", "admin2@mail.com"];
const JWT_KEY = process.env.JWT_KEY;
const SALT_ROUNDS = 10;

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 *       422:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new ErrorResponse(
      "Invalid signup data.",
      422,
      errors.array(),
      false
    );

    return next(error);
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new ErrorResponse(
        "User already exists with this email.",
        409,
        {},
        false
      );
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const role = adminEmails.includes(email) ? "admin" : "user";

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await createdUser.save();

    const token = jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    const error = new ErrorResponse(
      "Signing up failed, please try again later.",
      500,
      {},
      false
    );
    return next(error);
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       422:
 *         description: Invalid credentials or validation failed
 *       500:
 *         description: Server error
 */

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new ErrorResponse(
      "Invalid Credentials.",
      422,
      errors.array(),
      false
    );

    return next(error);
  }

  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!existingUser || !isValidPassword) {
      const error = new ErrorResponse(
        "Invalid Credentials.",
        422,
        errors.array(),
        false
      );

      return next(error);
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "User LoggedIn Succesfully",
      user: {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    const error = new ErrorResponse(
      "Invalid Credentials.",
      422,
      errors.array(),
      false
    );

    return next(error);
  }
};

export { signup, login };

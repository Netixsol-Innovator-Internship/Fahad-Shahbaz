// src/routes/userRoutes.js
const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/userController");
const { checkAuth } = require("../middlewares/verifyToken");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  checkAuth,
  requireRole("admin", "superadmin"),
  usersControllers.getUsers
);

router.post(
  "/register",
  [
    check("name").trim().notEmpty().withMessage("Name is required"),
    check("email").trim().isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  usersControllers.signup
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  usersControllers.login
);

router.patch(
  "/:id/role",
  checkAuth,
  requireRole("superadmin", "admin"),
  usersControllers.changeUserRole
);
router.patch(
  "/:id/block",
  checkAuth,
  requireRole("superadmin", "admin"),
  usersControllers.blockUnblockUser
);

module.exports = router;

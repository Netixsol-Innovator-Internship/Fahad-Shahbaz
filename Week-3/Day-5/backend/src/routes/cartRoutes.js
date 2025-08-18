import express from "express";
import { checkAuth } from "../middlewares/verifyToken.js";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeItemFromCart,
} from "../controllers/cartController.js";
const router = express.Router();

router.post("/add", checkAuth, addToCart);
router.get("/", checkAuth, getCart);
router.put("/update-quantity", checkAuth, updateQuantity);
router.delete("/removeItem", checkAuth, removeItemFromCart);

export default router;

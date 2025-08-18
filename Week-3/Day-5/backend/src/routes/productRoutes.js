import express from "express";
import {
  getProducts,
  getProductsByCategory,
  getProductsByID,
  createProduct,
  updateProducts,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/multerCloudinary.js";
import { checkAuth, checkAdmin } from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/category/:category", getProductsByCategory);

// protectedRoutes
router.post("/", checkAuth, checkAdmin, upload.single("image"), createProduct);
router.get("/:id", getProductsByID);
router.put("/:id", checkAuth, checkAdmin, updateProducts);
router.delete("/:id", checkAuth, checkAdmin, deleteProduct);

export default router;

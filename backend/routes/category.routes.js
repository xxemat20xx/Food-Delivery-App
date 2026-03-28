import express from "express";

import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";

import { verifyToken, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);

router.post(
  "/create-category",
  verifyToken,
  authorize("admin", "staff"),
  createCategory,
);

router.put(
  "/update-category/:id",
  verifyToken,
  authorize("admin", "staff"),
  updateCategory,
);

router.delete(
  "/delete-category/:id",
  authorize("admin", "staff"),
  verifyToken,
  deleteCategory,
);

export default router;

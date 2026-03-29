import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controller/order.controller.js";

import { verifyToken, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/get-my-order", verifyToken, getMyOrders);
router.get("/get-order/:id", verifyToken, getOrder);
router.post("/create-order", verifyToken, createOrder);

router.get(
  "/get-all-order",
  verifyToken,
  authorize("admin", "staff"),
  getAllOrders,
);

router.put(
  "/update-order/:id",
  verifyToken,
  authorize("admin", "staff"),
  updateOrderStatus,
);

export default router;

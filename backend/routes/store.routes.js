import express from "express";

import {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
} from "../controller/store.controller.js";

import { verifyToken, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// public routes
router.get("/", getStores);
router.get("/:idOrSlug", getStore);

// admin/staff routes
router.post(
  "/create-store",
  verifyToken,
  authorize("admin", "staff"),
  createStore,
);

router.put(
  "/admin/update-store/:id",
  verifyToken,
  authorize("admin", "staff"),
  updateStore,
);

router.delete(
  "/admin/delete-store/:id",
  verifyToken,
  authorize("admin", "staff"),
  deleteStore,
);

export default router;

import express from "express";

import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controller/items.controller.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItem);

router.post("/create-item", upload.single("image"), createItem);
router.put("/update-item/:id", upload.single("image"), updateItem);
router.delete("/delete-item/:id", deleteItem);

export default router;

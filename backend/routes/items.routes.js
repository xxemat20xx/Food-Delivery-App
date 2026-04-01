import express from "express";

import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controller/items.controller.js";

const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItem);

router.post("/create-item", createItem);
router.put("/update-item/:id", updateItem);
router.delete("/delete-item/:id", deleteItem);

export default router;

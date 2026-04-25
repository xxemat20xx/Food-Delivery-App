import express from "express";
import { handleWebhook } from "../controller/webhook.controller.js";

const router = express.Router();
router.post(
  "/payment",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

export default router;

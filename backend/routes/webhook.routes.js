import express from "express";
import { handleWebhook } from "../controller/webhook.controller.js";

const router = express.Router();

// Force capture of raw body for signature verification
router.post(
  "/payment",
  express.raw({
    type: "application/json",
    verify: (req, res, buf) => {
      req.rawBody = buf; // explicitly store the buffer
    },
  }),
  handleWebhook,
);

export default router;

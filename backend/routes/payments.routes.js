import express from "express";
import { createCheckout } from "../controller/payment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", verifyToken, createCheckout);

export default router;

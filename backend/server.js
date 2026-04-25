import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { redisClient } from "./config/redis.js";

// redis
try {
  await redisClient.connect();
  console.log("✅ Redis connected");
} catch (err) {
  console.error("❌ Redis failed:", err.message);
}

// routes
import authRoutes from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/items.routes.js";
import orderRoutes from "./routes/order.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

// passport config
import passport from "passport";
import "./config/passport.js";

const app = express();

const PORT = process.env.PORT || 5000;

// cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

//increase body size limit
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/settings", settingsRoutes);

// payment routes
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

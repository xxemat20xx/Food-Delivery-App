import express from "express";
import http from "http";
import { initializeSocket } from "./socket.js";
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
const server = http.createServer(app);

// init socket.io
const { io, notifyOrderUpdate } = initializeSocket(server);
app.set("notifyOrderUpdate", notifyOrderUpdate); // make helper available in controllers

// cors
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://food-delivery-app-green-eight.vercel.app", // Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

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

//health
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Authentication middleware (uses cookie)
  io.use(async (socket, next) => {
    try {
      // Extract accessToken from cookie header
      const cookie = socket.handshake.headers.cookie;
      let token = null;
      if (cookie) {
        const match = cookie.match(/accessToken=([^;]+)/);
        if (match) token = match[1];
      }
      if (!token) {
        return next(new Error("Authentication error: token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return next(new Error("Authentication error: user not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;

    console.log(`Socket connected: ${user._id} (${user.role})`);

    // Join rooms based on role and store
    socket.join(`role:${user.role}`);
    if (user.role === "staff" && user.storeId) {
      socket.join(`store:${user.storeId}`);
    }

    if (user.role === "admin" || user.role === "staff") {
      socket.join("admin:all_orders");
    }

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${user._id}`);
    });
  });

  // Helper function to emit order updates
  const notifyOrderUpdate = (order, previousStatus) => {
    const eventData = {
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      updatedAt: order.updatedAt,
      previousStatus,
    };

    if (order.store) {
      io.to(`store:${order.store}`).emit("order:status_update", eventData);
    }
    io.to("admin:all_orders").emit("order:status_update", eventData);
  };

  return { io, notifyOrderUpdate };
};

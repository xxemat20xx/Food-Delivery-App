import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
// export const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });

// export const connectRedis = async () => {
//   try {
//     await redisClient.connect();
//     console.log("✅ Redis connected");
//   } catch (err) {
//     console.error("❌ Redis error:", err.message);
//   }
// };

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Redis error:", err.message);
  }
};
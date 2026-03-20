import { redisClient } from "../config/redis.js";
export const rateLimiter = ({
  keyPrefix,
  limit = 5,
  windowSeconds = 60,
  getKey = (req) => req.ip,
  message = "Too many requests. Try again later.",
}) => {
  return async (req, res, next) => {
    try {
      const identifier = getKey(req);
      const key = `${keyPrefix}:${identifier}`;

      let attempts = await redisClient.incr(key);
      if (attempts === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (attempts > limit) {
        return res.status(429).json({ message });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next(); // don't block request if Redis fails
    }
  };
};
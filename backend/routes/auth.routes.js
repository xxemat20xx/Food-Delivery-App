import express from "express";
import passport from "passport";

import {
  register,
  verify,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controller/auth.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

// cookie
import { cookieOptions } from "../utils/cookie.js";

// token
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

// rate limiter
import { rateLimiter } from "../middleware/rateLimiter.js";

const forgotPasswordLimiter = rateLimiter({
  keyPrefix: "forgot",
  limit: 3,
  windowSeconds: 900, // 15 minutes
  getKey: (req) => `${req.body.email || "unknown"}:${req.ip}`,
  message: "Too many password reset requests. Try again after 15 minutes.",
});

const loginLimiter = rateLimiter({
  keyPrefix: "login",
  limit: 5,
  windowSeconds: 300, // 5 min
  getKey: (req) => `${req.body.email || "unknown"}:${req.ip}`,
  message: "Too many login attempts. Try again later.",
});

const registerLimiter = rateLimiter({
  keyPrefix: "register",
  limit: 3,
  windowSeconds: 300, // 5 min
  getKey: (req) => req.ip,
  message: "Too many accounts created. Try again later.",
});

const verifyLimiter = rateLimiter({
  keyPrefix: "verify",
  limit: 5,
  windowSeconds: 300,
  getKey: (req) => req.ip,
  message: "Too many verification attempts.",
});

const authRoutes = express.Router();

authRoutes.post("/register", registerLimiter, register);
authRoutes.post("/verify", verifyLimiter, verify);
authRoutes.post("/login", loginLimiter, loginUser);
authRoutes.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

authRoutes.post("/reset-password/:token", resetPassword);
authRoutes.post("/logout", logoutUser);
authRoutes.post("/refresh", refreshAccessToken);

// protected routes
authRoutes.get("/me", verifyToken, checkAuth);

// google login
authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}`);
  },
);

export default authRoutes;

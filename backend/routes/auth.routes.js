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

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/verify", verify);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.post("/refresh", refreshAccessToken);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password/:token", resetPassword);

// protected routes
authRoutes.get("/me", verifyToken, checkAuth);

// google login
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
    failureRedirect: "http://localhost:5173/login",
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

    res.redirect("http://localhost:5173/dashboard");
  },
);

export default authRoutes;

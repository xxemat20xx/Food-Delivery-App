import express from "express";

import {
  register,
  verify,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controller/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/verify", verify);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.post("/refresh", refreshAccessToken);

export default authRoutes;

import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

export const generateRefreshToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

import React from "react";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { redisClient } from "../config/redis.js";

import { sendEmail } from "../utils/emails.js";
import { VerifyEmail, ResetPasswordEmail } from "../utils/emailTemplate.js";

import { generateOTP, hashOTP } from "../utils/otpHelper.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { generateResetToken } from "../utils/resetToken.js";
import { cookieOptions } from "../utils/cookie.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exist.",
      });
    }

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    await redisClient.setEx(`otp:${email}`, 600, hashedOTP); 
    await redisClient.setEx(`otpAttempts:${email}`, 600, "0");

    const user = await User.create({
      name,
      email,
      password,
      hashedOTP,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    try {
      // Send email directly as React component (Resend handles rendering)
      await sendEmail(
        email,
        "Verify your email",
        React.createElement(VerifyEmail, { otp }),
      );
    } catch (emailError) {
      await User.findByIdAndDelete(user._id); // rollback if email fails
      console.log(emailError);
      throw new Error("Email sending failed");
    }

    res.status(201).json({
      message: "Account created. Please verify your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select("+otpHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get stored OTP hash from Redis
    const storedOTP = await redisClient.get(`otp:${email}`);

    if (!storedOTP) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    // Track OTP attempts
    let attempts = parseInt(await redisClient.get(`otpAttempts:${email}`) || "0");
    if (attempts >= 5) {
      return res.status(429).json({ message: "Too many verification attempts. Try again later." });
    }

    const hashed = hashOTP(otp);

    if (hashed !== storedOTP) {
      await redisClient.incr(`otpAttempts:${email}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid - verify user
    user.isVerified = true;
    await user.save();

    // Clear OTP and attempts from Redis
    await redisClient.del(`otp:${email}`);
    await redisClient.del(`otpAttempts:${email}`);

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Verify email first",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 86400000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 86400000,
    });

    res.json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Cooldown check
    const cooldownKey = `forgot:cooldown:${email}:${req.ip}`;
    const cooldown = await redisClient.ttl(cooldownKey);

    if (cooldown > 0) {
      return res.status(429).json({
        message: `Please wait ${cooldown}s before requesting again`,
      });
    }

    const user = await User.findOne({ email });

    // ✅ Prevent email enumeration
    if (!user) {
      return res.json({
        message: "If this email exists, a reset link was sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    // ✅ Only one active token
    await redisClient.set(`reset:${email}`, hashed, { EX: 600 });

    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await sendEmail(
        email,
        "Reset Password",
        ResetPasswordEmail({ resetUrl }),
      );

      // ✅ Set cooldown AFTER success
      await redisClient.setEx(cooldownKey, 30, "1");

      res.json({
        message: "A reset link was sent to your email",
      });
    } catch (emailError) {
      await redisClient.del(`reset:${email}`);
      console.error("Failed to send reset email:", emailError);

      res.status(500).json({
        message: "Failed to send reset email. Please try again.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const keys = await redisClient.keys("reset:*");

    let email = null;

    for (const key of keys) {
      const value = await redisClient.get(key);
      if (value === hashed) {
        email = key.split(":")[1];
        break;
      }
    }

    if (!email) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const user = await User.findOne({ email });

    user.password = password;
    await user.save();

    await redisClient.del(`reset:${email}`);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 86400000,
    });

    res.json({ message: "Token refreshed" });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.json({ message: "Logged out" });
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

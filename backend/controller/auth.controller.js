import React from "react";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, hashOTP } from "../utils/otpHelper.js";
import { sendEmail } from "../utils/emails.js";
import { VerifyEmail } from "../utils/emailTemplate.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
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
    const otpHash = hashOTP(otp);

    const user = await User.create({
      name,
      email,
      password,
      otpHash,
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

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Request new OTP.",
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(429).json({
        message: "OTP expired. Request new OTP.",
      });
    }

    const hashedOTP = hashOTP(String(otp));

    if (hashedOTP !== user.otpHash) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // success
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;

    await user.save();

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
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email",
      });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {};

export const resetPassword = async (req, res) => {};

export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.json({
    message: "Logged out successfully",
  });
};

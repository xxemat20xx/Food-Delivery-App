import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateOTP, hashOTP } from "../utils/otpHelper.js";
import { sendEmail } from "../utils/emails.js";
import { VerifyEmail } from "../utils/emailTemplate.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { cookieOptions } from "../utils/cookieOptions.js";

export const register = async (req, res) => {};

export const VerifyEmail = async (req, res) => {};

export const loginUser = async (req, res) => {};

export const forgotPassword = async (req, res) => {};

export const resetPassword = async (req, res) => {};

export const refreshAccessToken = async (req, res) => {};

export const logoutUser = async (req, res) => {};

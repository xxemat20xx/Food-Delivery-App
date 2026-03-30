import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
  Fade,
} from "@mui/material";
import { Mail, Lock, X, Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ open, onClose }) => {
  const [mode, setMode] = useState("login"); // login | signup | forgot | verify
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  const { login, register, forgotPassword, verifyEmail, isLoading  } = useAuthStore();

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#e5e7eb",
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(6px)",
      borderRadius: "10px",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
      "&:hover fieldset": { borderColor: "#f59e0b" },
      "&.Mui-focused fieldset": {
        borderColor: "#f59e0b",
        boxShadow: "0 0 0 1px #f59e0b33",
      },
    },
    "& .MuiInputLabel-root": { color: "#9ca3af" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f59e0b" },
  };

  // 🔁 cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setOtp("");
    setErrors({});
  };

  const closeModal = () => {
    resetFields();
    setMode("login");
    onClose();
  };

  const validate = () => {
    let err = {};

    if (!email.includes("@")) err.email = "Invalid email";
    if (mode !== "forgot" && mode !== "verify" && password.length < 6)
      err.password = "Minimum 6 characters";

    if (mode === "verify" && otp.length < 4)
      err.otp = "Invalid OTP";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await login({ email, password });

    if (res !== undefined) {
      closeModal();
      navigate("/");
    }
  };

  // ✅ SIGNUP → SWITCH TO OTP MODE
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await register({ email, password });

    if (res) {
      setMode("verify"); // 🔥 go to OTP screen
    }
  };

  // ✅ VERIFY OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await verifyEmail({ email, otp });

    if (res) {
      setMode("login");
      setOtp("");
    }
  };

  // ✅ RESEND OTP (reuse forgotPassword or make separate endpoint)
  const handleResendOTP = async () => {
    if (cooldown > 0) return;

    await forgotPassword({ email }); // you can replace with resend OTP API
    setCooldown(30);
  };

  // ✅ FORGOT PASSWORD
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await forgotPassword({ email });

    if (res) {
      setMode("login");
    }
  };

  const getTitle = () => {
    if (mode === "signup") return "Create Account";
    if (mode === "forgot") return "Reset Password";
    if (mode === "verify") return "Verify Account";
    return "Welcome Back";
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(16px)",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        },
      }}
    >
      <DialogContent sx={{ p: 4, position: "relative", color: "#e5e7eb" }}>
        
        {/* Close */}
        <IconButton
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#9ca3af",
            "&:hover": { color: "#f59e0b", transform: "rotate(90deg)" },
          }}
        >
          <X size={20} />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h5"
          textAlign="center"
          mb={3}
          sx={{
            fontWeight: 800,
            background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {getTitle()}
        </Typography>

        <Fade in timeout={300} key={mode}>
          <Box
            component="form"
            onSubmit={
              mode === "login"
                ? handleLogin
                : mode === "signup"
                ? handleSignup
                : mode === "verify"
                ? handleVerify
                : handleForgot
            }
          >
            {/* Email */}
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              disabled={mode === "verify"}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#9ca3af" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            {mode === "login" || mode === "signup" ? (
              <TextField
                label="Password"
                type={showPass ? "text" : "password"}
                fullWidth
                margin="normal"
                value={password}
                autoComplete=""
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                sx={inputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#9ca3af" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPass(!showPass)}
                        edge="end"
                        sx={{ color: "#9ca3af" }}
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : null}

            {/* OTP */}
            {mode === "verify" && (
              <TextField
                label="Enter OTP"
                fullWidth
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={!!errors.otp}
                helperText={errors.otp}
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: "center",
                    letterSpacing: "10px",
                    fontSize: "20px",
                  },
                }}
                sx={inputStyle}
              />
            )}

            {/* Button */}
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: 700,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#1f2937",
                position: "relative",
              }}
            >
              {isLoading ? (
                <CircularProgress size={22} sx={{ color: "#1f2937" }} />
              ) : mode === "login" ? (
                "Sign In"
              ) : mode === "signup" ? (
                "Create Account"
              ) : mode === "verify" ? (
                "Verify OTP"
              ) : (
                "Send Reset Link"
              )}
            </Button>

            {/* RESEND OTP */}
            {mode === "verify" && (
              <Typography
                mt={2}
                textAlign="center"
                sx={{ color: "#9ca3af", cursor: "pointer" }}
                onClick={handleResendOTP}
              >
                {cooldown > 0
                  ? `Resend OTP in ${cooldown}s`
                  : "Resend OTP"}
              </Typography>
            )}
          </Box>
        </Fade>

        {/* Links */}
        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "#9ca3af" }}
        >
          {mode === "login" && (
            <>
              <span
                onClick={() => setMode("forgot")}
                style={{ cursor: "pointer", color: "#f59e0b" }}
              >
                Forgot Password?
              </span>
              <br />
              Don&apos;t have an account?{" "}
              <span
                onClick={() => setMode("signup")}
                style={{ cursor: "pointer", color: "#f59e0b" }}
              >
                Sign up
              </span>
            </>
          )}

          {mode !== "login" && (
            <span
              onClick={() => setMode("login")}
              style={{ cursor: "pointer", color: "#f59e0b" }}
            >
              Back to Login
            </span>
          )}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
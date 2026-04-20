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
import { Mail, Lock, X, Eye, EyeOff, ArrowLeft } from "lucide-react";

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

  const { login, register, forgotPassword, verifyEmail, isLoading } = useAuthStore();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await login({ email, password });
    if (res !== undefined) {
      closeModal();
      navigate("/");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await register({ email, password });
    if (res) setMode("verify");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await verifyEmail({ email, otp });
    if (res) {
      setMode("login");
      setOtp("");
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    await forgotPassword({ email });
    setCooldown(30);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await forgotPassword({ email });
    if (res) setMode("login");
  };

  const getTitle = () => {
    if (mode === "signup") return "Create Account";
    if (mode === "forgot") return "Reset Password";
    if (mode === "verify") return "Verify Account";
    return "Welcome Back";
  };

  // Custom styling for TextField to match glass/amber theme
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#e5e7eb",
      backgroundColor: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(4px)",
      borderRadius: "12px",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
      "&:hover fieldset": { borderColor: "#f59e0b" },
      "&.Mui-focused fieldset": {
        borderColor: "#f59e0b",
        boxShadow: "0 0 0 1px #f59e0b33",
      },
    },
    "& .MuiInputLabel-root": { color: "#9ca3af" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f59e0b" },
    "& .MuiFormHelperText-root": { marginLeft: 0, fontSize: "0.7rem" },
  };

  // OTP specific style (centered, large tracking)
  const otpInputStyle = {
    ...inputStyle,
    "& .MuiOutlinedInput-input": {
      textAlign: "center",
      letterSpacing: "8px",
      fontSize: "1.2rem",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(17, 24, 39, 0.9)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* Close button */}
        <IconButton
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#9ca3af",
            zIndex: 10,
            "&:hover": { color: "#f59e0b", transform: "rotate(90deg)" },
            transition: "all 0.2s",
          }}
        >
          <X size={20} />
        </IconButton>

        <Box sx={{ p: 4 }}>
          {/* Title */}
          <Typography
            variant="h5"
            textAlign="center"
            mb={3}
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
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
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Email */}
              <TextField
                label="Email"
                fullWidth
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
              {(mode === "login" || mode === "signup") && (
                <TextField
                  label="Password"
                  type={showPass ? "text" : "password"}
                  fullWidth
                  value={password}
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
              )}

              {/* OTP */}
              {mode === "verify" && (
                <TextField
                  label="Enter OTP"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  error={!!errors.otp}
                  helperText={errors.otp}
                  inputProps={{ maxLength: 6 }}
                  sx={otpInputStyle}
                />
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                sx={{
                  mt: 1,
                  py: 1.3,
                  fontWeight: 700,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  color: "#1f2937",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "#1f2937" }} />
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

              {/* Resend OTP */}
              {mode === "verify" && (
                <Typography
                  textAlign="center"
                  sx={{
                    color: cooldown > 0 ? "#6b7280" : "#f59e0b",
                    cursor: cooldown > 0 ? "not-allowed" : "pointer",
                    fontSize: "0.8rem",
                    "&:hover": { textDecoration: cooldown > 0 ? "none" : "underline" },
                  }}
                  onClick={handleResendOTP}
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </Typography>
              )}
            </Box>
          </Fade>

          {/* Footer Links */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            {mode === "login" && (
              <>
                <Typography
                  variant="body2"
                  sx={{ color: "#9ca3af", display: "inline-block" }}
                >
                  Don't have an account?{" "}
                </Typography>
                <Typography
                  variant="body2"
                  component="span"
                  onClick={() => setMode("signup")}
                  sx={{ color: "#f59e0b", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                >
                  Sign up
                </Typography>
                <br />
                <Typography
                  variant="body2"
                  component="span"
                  onClick={() => setMode("forgot")}
                  sx={{ color: "#f59e0b", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                >
                  Forgot password?
                </Typography>
              </>
            )}
            {mode !== "login" && (
              <Typography
                variant="body2"
                component="span"
                onClick={() => setMode("login")}
                sx={{
                  color: "#f59e0b",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <ArrowLeft size={14} /> Back to Login
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
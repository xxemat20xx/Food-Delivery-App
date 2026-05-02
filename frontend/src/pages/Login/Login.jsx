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
  Divider,
} from "@mui/material";
import { Mail, Lock, X, Eye, EyeOff, ArrowLeft } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ open, onClose }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  // 👇 Get OAuth pending state and actions from store
  const {
    login,
    register,
    forgotPassword,
    verifyEmail,
    isLoading,
    isOAuthPending,
    setOAuthPending,
  } = useAuthStore();

  // cooldown timer
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
    if (mode === "verify" && otp.length < 4) err.otp = "Invalid OTP";
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

  const handleGoogleLogin = () => {
    setOAuthPending(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  const getTitle = () => {
    if (mode === "signup") return "Create Account";
    if (mode === "forgot") return "Reset Password";
    if (mode === "verify") return "Verify Account";
    return "Welcome Back";
  };

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

              {mode === "login" && (
                <>
                  <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }}>
                    <Typography variant="caption" sx={{ color: "#9ca3af" }}>OR</Typography>
                  </Divider>
                  <Button
                    fullWidth
                    onClick={handleGoogleLogin}
                    disabled={isOAuthPending}
                    startIcon={
                      isOAuthPending ? (
                        <CircularProgress size={18} sx={{ color: "#1f2937" }} />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3.97C17.782 2.095 15.054 1 12 1 7.392 1 3.39 3.6 1.463 7.314l3.803 2.45z"
                          />
                          <path
                            fill="#34A853"
                            d="M22.486 12.205c0-.752-.069-1.505-.205-2.227H12v4.636h5.929c-.278 1.5-1.11 2.766-2.352 3.618l3.68 2.83c2.176-2.001 3.229-4.945 3.229-8.857z"
                          />
                          <path
                            fill="#4A90E2"
                            d="M5.266 14.235A7.027 7.027 0 0 1 4.909 12c0-.788.127-1.547.357-2.235L1.463 7.314A11.935 11.935 0 0 0 0 12c0 1.929.467 3.75 1.281 5.358l3.985-3.123z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M12 23c2.94 0 5.447-.99 7.435-2.673l-3.68-2.83c-1.042.686-2.374 1.09-3.755 1.09-2.668 0-4.947-1.6-5.956-3.934l-3.802 2.45C3.39 20.4 7.392 23 12 23z"
                          />
                        </svg>
                      )
                    }
                    sx={{
                      backgroundColor: "#fff",
                      color: "#1f2937",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "12px",
                      py: 1.2,
                    }}
                  >
                    {isOAuthPending ? "Redirecting..." : "Continue with Google"}
                  </Button>
                </>
              )}
            </Box>
          </Fade>

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
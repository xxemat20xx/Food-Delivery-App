import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Mail, Lock, X, Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const LoginModal = ({ open, onClose }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuthStore();

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

  const resetFields = () => {
    setEmail("");
    setPassword("");
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
    if (mode !== "forgot" && password.length < 6)
      err.password = "Minimum 6 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const fakeDelay = () => new Promise((res) => setTimeout(res, 1000));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await fakeDelay();

    const success = login({ email, password });

    setLoading(false);

    if (success) {
      resetFields();
      setMode("login");
      onClose();
    } else {
      setErrors({ password: "Invalid credentials" });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await fakeDelay();

    console.log("Signup:", { email, password });

    setLoading(false);
    resetFields();
    setMode("login");
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await fakeDelay();

    console.log("Reset link sent:", email);

    setLoading(false);
    resetFields();
    setMode("login");
  };

  const getTitle = () => {
    if (mode === "signup") return "Create Account";
    if (mode === "forgot") return "Reset Password";
    return "Welcome Back";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
                : handleForgot
            }
          >
            {/* Email */}
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
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

            {/* Password (not in forgot) */}
            {mode !== "forgot" && (
              <TextField
                label="Password"
                type={showPass ? "text" : "password"}
                fullWidth
                margin="normal"
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

            {/* Button */}
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: 700,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#1f2937",
                boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
                "&:hover": { transform: "translateY(-1px)" },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#1f2937" }} />
              ) : mode === "login" ? (
                "Sign In"
              ) : mode === "signup" ? (
                "Create Account"
              ) : (
                "Send Reset Link"
              )}
            </Button>
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
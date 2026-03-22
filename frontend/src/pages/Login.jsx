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
} from "@mui/material";
import { Mail, Lock, X } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const LoginModal = ({ open, onClose }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuthStore();

  // ✅ Input styling (FIXED placement)
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#e5e7eb",
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(6px)",
      borderRadius: "10px",

      "& fieldset": {
        borderColor: "rgba(255,255,255,0.1)",
      },

      "&:hover fieldset": {
        borderColor: "#f59e0b",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#f59e0b",
        boxShadow: "0 0 0 1px #f59e0b33",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#9ca3af",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#f59e0b",
    },
  };

  const resetFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login({ email, password });

    if (success) {
      resetFields();
      setMode("login");
      onClose();
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup:", { email, password });
    resetFields();
    setMode("login");
  };

  const handleForgot = (e) => {
    e.preventDefault();
    console.log("Reset link sent:", email);
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
        
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#9ca3af",
            transition: "0.2s",
            "&:hover": {
              color: "#f59e0b",
              transform: "rotate(90deg)",
            },
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
            letterSpacing: 0.5,
          }}
        >
          {getTitle()}
        </Typography>

        {/* LOGIN */}
        {mode === "login" && (
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              fullWidth
              required
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#9ca3af" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              fullWidth
              required
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} color="#9ca3af" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: 700,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#1f2937",
                boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-1px) scale(1.01)",
                  boxShadow: "0 6px 25px rgba(245,158,11,0.5)",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <Box component="form" onSubmit={handleSignup}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={inputStyle}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={inputStyle}
            />

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: 700,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#1f2937",
                boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 25px rgba(245,158,11,0.5)",
                },
              }}
            >
              Create Account
            </Button>
          </Box>
        )}

        {/* FORGOT */}
        {mode === "forgot" && (
          <Box component="form" onSubmit={handleForgot}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={inputStyle}
            />

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: 700,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#1f2937",
                boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 25px rgba(245,158,11,0.5)",
                },
              }}
            >
              Send Reset Link
            </Button>
          </Box>
        )}

        {/* LINKS */}
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
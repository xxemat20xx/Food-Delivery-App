import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Mail, Lock } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login } = useAuthStore();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const success = login({ email, password });
    if(success){
      setEmail("");
      setPassword("");
      navigate('/dashboard')
    }

  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          mb={4}
          sx={{ fontWeight: 600, color: "#333" }}
        >
          Welcome Back
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          fullWidth
          required
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail size={20} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          fullWidth
          required
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={20} />
              </InputAdornment>
            ),
          }}
        />
      <Button
        type="submit" 
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 4, py: 1.5 }}
      >
        Sign In
      </Button>
      
      </form>

        <Typography
          variant="body2"
          sx={{
            mt: 3,
            textAlign: "center",
            color: "gray.600",
            "& a": {
              textDecoration: "none",
              color: "#667eea",
              fontWeight: 500,
              "&:hover": { textDecoration: "underline" },
            },
          }}
        >
          <a href="/forgot-password">Forgot Password?</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
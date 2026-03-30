import { axiosInstance } from "../axiosInstance";

export const login = (credentials) =>
  axiosInstance.post("/auth/login", credentials);

export const register = (userData) =>
  axiosInstance.post("/auth/register", userData);

export const getProfile = () => axiosInstance.get("/auth/me");

export const verifyEmail = (data) => axiosInstance.post("/auth/verify", data);

export const forgotPassword = (data) =>
  axiosInstance.post("/auth/forgot-password", data);

export const resetPassword = (token, data) =>
  axiosInstance.post(`/auth/reset-password/${token}`, data);

export const logout = () => axiosInstance.post("/auth/logout");

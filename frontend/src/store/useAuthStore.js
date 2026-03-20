import { create } from "zustand";
import { axiosInstance } from "../instances/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,
  isLoading: false,
  isAuthenticated: false,

  register: async ({ name, email, password }) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || "Registration failed";
    }
  },

  verifyEmail: async ({ email, otp }) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post("/auth/verify", {
        email,
        otp,
      });

      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || "Verification failed";
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post("/forgot-password", { email });

      set({ isLoading: false });
      res.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || "Request failed";
    }
  },

  resetPassword: async ({ token, newPassword }) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password: newPassword,
      });
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || "Reset failed";
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post("/auth/login", { email, password });

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || "Login failed";
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error(error);
    }
  },

  // CHECK AUTH (used when app loads)
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const res = await axiosInstance.get("/auth/me");

      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));

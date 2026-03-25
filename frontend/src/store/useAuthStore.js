import { create } from "zustand";
import { axiosInstance } from "../instances/axiosInstance";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,
  isLoading: false,
  isAuthenticated: false,
  message: null,
  error: null,

  register: async ({ name, email, password }) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      const message = res.data.message;

      set({ isLoading: false, message });

      toast.success(message);

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";

      set({ isLoading: false, error: message });

      toast.error(message);
    }
  },

  verifyEmail: async ({ email, otp }) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/auth/verify", {
        email,
        otp,
      });

      const message = res.data.message;

      set({ isLoading: false, message });

      toast.success(message);

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";

      set({ isLoading: false, error: message });

      toast.error(message);
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/auth/forgot-password", { email });

      set({ isLoading: false });

      const message = res.data.message;

      toast.success(message); // ✅ use backend message
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Request failed";

      set({
        isLoading: false,
        error: message,
      });

      toast.error(message);
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
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const message = res.data.message;

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        message,
      });

      toast.success(message);

      return res.data; // ✅ ADD THIS
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";

      set({ isLoading: false, error: message });

      toast.error(message);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({
        user: null,
        isAuthenticated: false,
      });
      toast.success("Logout successfull");
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

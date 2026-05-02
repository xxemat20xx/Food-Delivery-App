import { create } from "zustand";
import { toast } from "react-toastify";
import * as authApi from "../api/endpoints/authApi";
import { useNavigate } from "react-router-dom";

export const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,
  isLoading: false,
  isAuthenticated: false,
  message: null,
  error: null,

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });

      const res = await authApi.register(userData);

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: res.data.message,
      });

      toast.success(res.data.message);

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";

      set({ isLoading: false, error: message });
    }
  },

  verifyEmail: async ({ email, otp }) => {
    try {
      set({ isLoading: true, error: null });

      const res = await authApi.verifyEmail({ email, otp });

      const message = res.data.message;

      set({ isLoading: false, message });

      toast.success(message);

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";

      set({ isLoading: false, error: message });
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      set({ isLoading: true, error: null });

      const res = await authApi.forgotPassword({ email });

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
    }
  },
  resetPassword: async ({ token, newPassword }) => {
    try {
      set({ isLoading: true });

      const res = await authApi.resetPassword({ token, newPassword });
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || "Reset failed";
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await authApi.login(data);

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        message: res.data.message,
      });

      toast.success(res.data.message);

      return res.data; // ✅ ADD THIS
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";

      set({ isLoading: false, error: message });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      set({
        user: null,
        isAuthenticated: false,
      });
      toast.success("Logout successful");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // CHECK AUTH (used when app loads)
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const res = await authApi.getProfile();

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
  clearError: () => set({ error: null }),
}));

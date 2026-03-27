import { create } from "zustand";
import { axiosInstance } from "../instances/axiosInstance";

export const useStoreStore = create((set) => ({
  stores: [],
  loading: false,
  error: null,

  fetchStores: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get("/stores");

      set({
        stores: res.data, // 🔥 THIS IS CRITICAL
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

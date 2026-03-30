import { create } from "zustand";
import { axiosInstance } from "../api/axiosInstance";

export const useStoreStore = create((set) => ({
  stores: [],
  loading: false,
  error: null,

  fetchStores: async (lat, lng) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get("/stores", {
        params: { lat, lng },
      });

      set({
        stores: res.data.data,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

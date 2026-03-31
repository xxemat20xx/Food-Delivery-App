import { create } from "zustand";
import { axiosInstance } from "../api/axiosInstance";
import * as storeApi from "../api/endpoints/storeApi";

export const useStoreStore = create((set) => ({
  stores: [],
  loading: false,
  error: null,
  selectedStore: null,
  count: 0,

  // ✅ GET ALL
  fetchStores: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await storeApi.fetchStores(params);

      if (res.data.success) {
        set({
          stores: res.data.data,
          count: res.data.count || res.data.data.length,
          loading: false,
        });
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        set({
          stores: [],
          count: 0,
          error: "No stores available",
          loading: false,
        });
      } else {
        set({
          error:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch stores",
          loading: false,
        });
      }
    }
  },

  // ✅ GET SINGLE
  fetchStoreByIdOrSlug: async (idOrSlug) => {
    set({ loading: true, error: null });

    try {
      const res = await storeApi.fetchStore(idOrSlug);

      if (res.data.success) {
        set({
          selectedStore: res.data.data,
          loading: false,
        });
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch store",
        loading: false,
      });
    }
  },

  // ✅ CREATE
  createStore: async (payload) => {
    set({ loading: true, error: null });

    try {
      const res = await storeApi.createStore(payload);

      if (res.data.success) {
        const newStore = res.data.data;

        set((state) => ({
          stores: [newStore, ...state.stores], // prepend
          count: state.count + 1,
          loading: false,
        }));

        return newStore;
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create store",
        loading: false,
      });
      throw error;
    }
  },

  // ✅ UPDATE
  updateStore: async (id, payload) => {
    set({ loading: true, error: null });

    try {
      const res = await storeApi.updateStore(id, payload);

      if (res.data.success) {
        const updatedStore = res.data.data;

        set((state) => ({
          stores: state.stores.map((store) =>
            store._id === id ? updatedStore : store,
          ),
          selectedStore:
            state.selectedStore?._id === id
              ? updatedStore
              : state.selectedStore,
          loading: false,
        }));

        return updatedStore;
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update store",
        loading: false,
      });
      throw error;
    }
  },

  // ✅ DELETE (soft delete: isActive = false)
  deleteStore: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await storeApi.deleteStore(id);

      if (res.data.success) {
        set((state) => ({
          stores: state.stores.filter((store) => store._id !== id),
          count: state.count - 1,
          selectedStore:
            state.selectedStore?._id === id ? null : state.selectedStore,
          loading: false,
        }));

        return true;
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete store",
        loading: false,
      });
      throw error;
    }
  },

  // helpers
  setSelectedStore: (store) => set({ selectedStore: store }),
  clearSelectedStore: () => set({ selectedStore: null }),
}));

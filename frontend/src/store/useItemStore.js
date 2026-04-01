import { create } from "zustand";
import * as itemsApi from "../api/endpoints/itemsApi";

export const useItemStore = create((set, get) => ({
  items: [],
  item: null,
  loading: false,
  error: null,

  // filters
  selectedCategory: null,
  selectedStore: null,

  // =========================
  // GET ALL ITEMS
  fetchItems: async (storeId, categoryId) => {
    set({ loading: true });
    try {
      const params = {};
      if (storeId) params.storeId = storeId;
      if (categoryId) params.category = categoryId;
      const res = await itemsApi.fetchItems({ params });
      set({ items: res.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch items",
        loading: false,
      });
    }
  },

  // =========================
  // GET SINGLE ITEM
  // =========================
  fetchItem: async (id) => {
    set({ loading: true, error: null });

    try {
      const { data } = await itemsApi.fetchItem(id);

      set({
        item: data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch item",
        loading: false,
      });
    }
  },

  // =========================
  // CREATE ITEM (ADMIN)
  // =========================
  createItem: async (formData) => {
    set({ loading: true, error: null });

    try {
      const { data } = await itemsApi.createItem(formData);

      set((state) => ({
        items: [...state.items, data.data],
        loading: false,
      }));

      return { success: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create item";

      set({ error: message, loading: false });

      return { success: false, message };
    }
  },

  // =========================
  // UPDATE ITEM (ADMIN)
  // =========================
  updateItem: async (id, updatedData) => {
    set({ loading: true, error: null });

    try {
      const { data } = await itemsApi.updateItem(id, updatedData);

      set((state) => ({
        items: state.items.map((item) => (item._id === id ? data.data : item)),
        item: data.data,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update item";

      set({ error: message, loading: false });

      return { success: false, message };
    }
  },

  // =========================
  // DELETE ITEM (SOFT DELETE)
  // =========================
  deleteItem: async (id) => {
    set({ loading: true, error: null });

    try {
      await itemsApi.deleteItem(id);

      set((state) => ({
        items: state.items.filter((item) => item._id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete item";

      set({ error: message, loading: false });

      return { success: false, message };
    }
  },

  // =========================
  // FILTER HELPERS
  // =========================
  setCategory: (category) => set({ selectedCategory: category }),
  setStore: (storeId) => set({ selectedStore: storeId }),

  // =========================
  // RESET
  // =========================
  clearItem: () => set({ item: null }),
}));

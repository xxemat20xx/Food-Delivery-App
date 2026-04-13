import { create } from "zustand";
import * as categoryApi from "../api/endpoints/categoryApi";
import axios from "axios";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (storeId) => {
    set({ loading: true });
    try {
      const params = storeId ? { storeId } : {};
      const res = await categoryApi.getCategories({ params });
      set({ categories: res.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch categories",
        loading: false,
      });
    }
  },

  createCategory: async (categoryData) => {
    set({ loading: true });
    try {
      const res = await categoryApi.createCategory(categoryData);
      set((state) => ({
        categories: [...state.categories, res.data.data],
        loading: false,
      }));
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create category",
        loading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ loading: true });
    try {
      const res = await categoryApi.updateCategory(id, categoryData);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? res.data.data : cat,
        ),
        loading: false,
      }));
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update category",
        loading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      await categoryApi.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete category",
        loading: false,
      });
      throw error;
    }
  },
}));

// store/useOrderStore.js
import { create } from "zustand";
import * as orderApi from "../api/endpoints/orderApi";

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: null,

  // Fetch all orders for the logged-in user
  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await orderApi.fetchMyOrders();
      set({ orders: res.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch orders";
      set({ error: message, loading: false });
    }
  },

  // Fetch a single order by ID
  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await orderApi.fetchOrderById(id);
      set({ currentOrder: res.data.data, loading: false });
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch order";
      set({ error: message, loading: false });
      throw error;
    }
  },

  // Create a new order (used during checkout)
  //   createOrder: async (orderData) => {
  //     set({ loading: true, error: null });
  //     try {
  //       const res = await orderApi.createOrder(orderData);
  //       set({ loading: false });
  //       return res.data.data;
  //     } catch (error) {
  //       const message = error.response?.data?.message || "Failed to create order";
  //       set({ error: message, loading: false });
  //       throw error;
  //     }
  //   },

  // Clear current order (after viewing)
  clearCurrentOrder: () => set({ currentOrder: null }),

  // Reset orders (e.g., on logout)
  resetOrders: () =>
    set({ orders: [], currentOrder: null, error: null, pagination: null }),
}));

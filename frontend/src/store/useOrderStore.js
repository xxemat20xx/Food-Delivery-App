// store/useOrderStore.js
import { create } from "zustand";
import * as orderApi from "../api/endpoints/orderApi";

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Fetch all orders for the logged-in user
  fetchMyOrders: async (page = 1, limit = 5) => {
    set({ loading: true, error: null });
    try {
      const res = await orderApi.fetchMyOrders(page, limit);
      set({
        orders: res.data.data,
        pagination: res.data.pagination,
        loading: false,
      });
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
  fetchAllOrders: async (page = 1, limit = 20, sort = "-createdAt") => {
    set({ loading: true, error: null });
    try {
      const res = await orderApi.fetchAllOrders(page, limit, sort);
      set({
        orders: res.data.data,
        pagination: res.data.pagination,
        loading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch orders";
      set({ error: message, loading: false });
    }
  },
  updateOrderOptimistically: (updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === updatedOrder.orderId
          ? {
              ...order,
              status: updatedOrder.status,
              paymentStatus: updatedOrder.paymentStatus,
            }
          : order,
      ),
    })),
  updateOrderStatus: async (orderId, newStatus) => {
    set({ loading: true, error: null });
    try {
      const res = await orderApi.updateOrderStatus(orderId, newStatus);
      // Optimistically update local order
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
        loading: false,
      }));
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update status";
      set({ error: message, loading: false });
      throw error;
    }
  },
  cancelPendingOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      await orderApi.cancelPendingOrder(orderId);
      set({ loading: false });

      set((state) => ({
        orders: state.orders.filter((order) => order._id !== orderId),
      }));
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cancel order";
      set({ error: message, loading: false });
      throw error;
    }
  },

  // Clear current order (after viewing)
  clearCurrentOrder: () => set({ currentOrder: null }),

  // Reset orders (e.g., on logout)
  resetOrders: () =>
    set({ orders: [], currentOrder: null, error: null, pagination: null }),
}));

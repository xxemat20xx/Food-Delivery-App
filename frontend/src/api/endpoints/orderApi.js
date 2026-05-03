import { axiosInstance } from "../axiosInstance";

export const fetchMyOrders = (page = 1, limit = 5) =>
  axiosInstance.get("/order/get-my-order", { params: { page, limit } });

export const fetchOrderById = (id) =>
  axiosInstance.get(`/order/get-order/${id}`);

export const fetchAllOrders = (page = 1, limit = 20, sort = "-createdAt") =>
  axiosInstance.get("/order/get-all-order", { params: { page, limit, sort } });

export const updateOrderStatus = (orderId, status) =>
  axiosInstance.put(`/order/update-order/${orderId}`, { status });

export const cancelPendingOrder = (orderId) =>
  axiosInstance.delete(`/order/cancel-pending/${orderId}`);

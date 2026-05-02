import { axiosInstance } from "../axiosInstance";

export const fetchMyOrders = (page = 1, limit = 5) =>
  axiosInstance.get("/order/get-my-order", { params: { page, limit } });

export const fetchOrderById = (id) =>
  axiosInstance.get(`/order/get-order/${id}`);

import { axiosInstance } from "../axiosInstance";

export const fetchMyOrders = () => axiosInstance.get("/order/get-my-order");

export const fetchOrderById = (id) =>
  axiosInstance.get(`/order/get-order/${id}`);

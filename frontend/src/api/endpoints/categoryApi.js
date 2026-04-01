import { axiosInstance } from "../axiosInstance";

export const getCategories = () => axiosInstance.get("/");
export const getCategory = (id) => axiosInstance.get(`/${id}`);

export const createCategory = (payload) =>
  axiosInstance.post("/create-category", payload);

export const updateCategory = (id, payload) =>
  axiosInstance.put(`/update-category/${id}`, payload);

export const deleteCategory = (id) =>
  axiosInstance.delete(`delete-category/${id}`);

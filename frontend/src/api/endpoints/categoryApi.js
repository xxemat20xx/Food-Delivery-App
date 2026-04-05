import { axiosInstance } from "../axiosInstance";

export const getCategories = (config = {}) => {
  return axiosInstance.get("/category", config);
};
export const getCategory = (id) => axiosInstance.get(`/${id}`);

export const createCategory = (payload) =>
  axiosInstance.post("/category/create-category", payload);

export const updateCategory = (id, payload) =>
  axiosInstance.put(`/category/update-category/${id}`, payload);

export const deleteCategory = (id) =>
  axiosInstance.delete(`/category/delete-category/${id}`);

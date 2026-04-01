import { axiosInstance } from "../axiosInstance";

export const fetchItems = (config) => axios.get("/api/items", config);

export const fetchItem = (id) => axios.get(`/api/items/${id}`);

export const createItem = (data) => axios.post("/api/items/create-item", data);

export const updateItem = (id, data) =>
  axios.put(`/api/admin/items/${id}`, data);

export const deleteItem = (id) => axios.delete(`/api/admin/items/${id}`);

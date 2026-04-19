import { axiosInstance } from "../axiosInstance";

// ✅ GET ALL STORES (with optional query params: lat, lng, maxDistance)
export const fetchStores = (params = {}) =>
  axiosInstance.get("/stores", { params });

// ✅ GET SINGLE STORE (by ID or slug)
export const fetchStore = (idOrSlug) =>
  axiosInstance.get(`/stores/${idOrSlug}`);

// ✅ CREATE STORE
export const createStore = (payload) =>
  axiosInstance.post("/stores/create-store", payload);

// ✅ UPDATE STORE
export const updateStore = (id, payload) =>
  axiosInstance.put(`/stores/admin/update-store/${id}`, payload);

// ✅ DELETE STORE (soft delete)
export const deleteStore = (id) =>
  axiosInstance.delete(`/stores/admin/delete-store/${id}`);

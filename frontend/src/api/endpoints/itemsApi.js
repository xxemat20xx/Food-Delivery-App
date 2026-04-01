import axiosInstance from "../axiosInstance";

// =========================
// GET ALL ITEMS
// =========================
export const fetchItems = (params) => axiosInstance.get("/items", { params });

// =========================
// GET SINGLE ITEM
// =========================
export const fetchItem = (id) => axiosInstance.get(`/items/${id}`);

// =========================
// CREATE ITEM (ADMIN)
// =========================
export const createItem = (data) => axiosInstance.post("/create-item", data);

// =========================
// UPDATE ITEM (ADMIN)
// =========================
export const updateItem = (id, data) =>
  axiosInstance.put(`/update-item/${id}`, data);

// =========================
// DELETE ITEM (SOFT DELETE)
// =========================
export const deleteItem = (id) => axiosInstance.delete(`/delete-item/${id}`);

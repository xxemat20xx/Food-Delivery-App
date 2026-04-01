import { axiosInstance } from "../axiosInstance";

// ✅ GET ALL ITEMS
export const fetchItems = () => axiosInstance.get("/items");

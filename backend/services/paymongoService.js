import axios from "axios";

const PAYMONGO_API = "https://api.paymongo.com/v1";

const paymongoAxios = axios.create({
  baseURL: PAYMONGO_API,
  auth: {
    username: process.env.PAYMONGO_SECRET_KEY,
    password: "",
  },
  headers: { "Content-Type": "application/json" },
});

export const createCheckoutSession = async (payload) => {
  const response = await paymongoAxios.post("/checkout_sessions", payload);
  return response.data;
};

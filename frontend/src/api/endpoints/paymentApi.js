import { axiosInstance } from "../axiosInstance";

export const createCheckoutSession = async (cartData) => {
  const response = await axiosInstance.post(
    "/payments/create-checkout-session",
    cartData,
  );
  return response.data;
};

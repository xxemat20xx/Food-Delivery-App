import { create } from "zustand";
import * as paymentApi from "../api/endpoints/paymentApi";

export const useCheckoutStore = create((set, get) => ({
  // State
  isLoading: false,
  error: null,
  checkoutUrl: null,
  orderId: null,

  // Mock cart data for testing
  testCartData: {
    items: [
      { _id: "item1", name: "Cappuccino", quantity: 2, price: 150 },
      { _id: "item2", name: "Croissant", quantity: 1, price: 80 },
    ],
    totalAmount: 380,
    userEmail: "test@example.com",
    userId: "USER_ID_HERE",
    storeId: "STORE_ID_HERE",
  },

  // Actions
  setTestData: (data) => set({ testCartData: data }),

  createCheckoutSession: async (cartData = null) => {
    set({ isLoading: true, error: null });
    try {
      const dataToSend = cartData || get().testCartData;
      const result = await paymentApi.createCheckoutSession(dataToSend);
      // result already contains { checkout_url, orderId }
      set({
        checkoutUrl: result.checkout_url,
        orderId: result.orderId,
        isLoading: false,
      });
      return result;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },
  redirectToCheckout: async () => {
    const { checkoutUrl } = get();
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      const data = await get().createCheckoutSession();
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    }
  },

  reset: () =>
    set({
      isLoading: false,
      error: null,
      checkoutUrl: null,
      orderId: null,
    }),
}));

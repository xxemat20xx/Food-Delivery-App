import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      storeId: null, // current store for cart (all items must be from same store)

      addToCart: (item, quantity = 1, customizations = []) => {
        const currentStore = get().storeId;
        // Check if adding from a different store
        if (currentStore && currentStore !== item.storePrices[0].store) {
          if (
            window.confirm(
              "Your cart contains items from another store. Clear cart and add new?",
            )
          ) {
            get().clearCart();
          } else {
            return;
          }
        }

        const existingIndex = get().items.findIndex(
          (i) =>
            i._id === item._id &&
            JSON.stringify(i.customizations) === JSON.stringify(customizations),
        );

        let newItems;
        if (existingIndex >= 0) {
          newItems = [...get().items];
          newItems[existingIndex].quantity += quantity;
        } else {
          const cartItem = {
            _id: item._id,
            name: item.name,
            price: item.storePrices[0]?.price || item.basePrice,
            quantity,
            customizations,
          };
          newItems = [...get().items, cartItem];
        }

        set({
          items: newItems,
          storeId: item.storePrices[0]?.store,
        });
      },

      removeFromCart: (index) => {
        const newItems = get().items.filter((_, i) => i !== index);
        set({
          items: newItems,
          storeId: newItems.length > 0 ? get().storeId : null,
        });
      },

      updateQuantity: (index, quantity) => {
        const newItems = [...get().items];
        newItems[index].quantity = quantity;
        set({ items: newItems });
      },

      clearCart: () => set({ items: [], storeId: null }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage", // key in localStorage
    },
  ),
);

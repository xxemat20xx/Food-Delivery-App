import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      storeId: null, // current store for cart (all items must be from same store)

      addToCart: (item, quantity = 1, customizations = []) => {
        const currentStore = get().storeId;
        const itemStore = item.storePrices[0]?.store;

        // Check if adding from a different store
        if (currentStore && currentStore !== itemStore) {
          if (
            window.confirm(
              "Your cart contains items from another store. Clear cart and add new?",
            )
          ) {
            get().clearCart();
            // Continue to add after clearing
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
        let addedAsNew = false;

        if (existingIndex >= 0) {
          // Update existing item quantity
          newItems = [...get().items];
          newItems[existingIndex].quantity += quantity;
          toast.success(`Added ${quantity} more ${item.name} to cart`);
        } else {
          // Add as new item
          const cartItem = {
            _id: item._id,
            name: item.name,
            price: item.storePrices[0]?.price || item.basePrice,
            quantity,
            customizations,
            image: item.image,
          };
          newItems = [...get().items, cartItem];
          addedAsNew = true;
          toast.success(`${item.name} added to cart`);
        }

        set({
          items: newItems,
          storeId: itemStore,
        });
      },

      removeFromCart: (index) => {
        const newItems = get().items.filter((_, i) => i !== index);
        set({
          items: newItems,
          storeId: newItems.length > 0 ? get().storeId : null,
        });
        toast.info("Item removed from cart");
      },

      updateQuantity: (index, quantity) => {
        const newItems = [...get().items];
        const oldQty = newItems[index].quantity;
        newItems[index].quantity = quantity;
        set({ items: newItems });
        if (quantity > oldQty) {
          toast.success(`Quantity increased to ${quantity}`);
        } else if (quantity < oldQty) {
          toast.info(`Quantity decreased to ${quantity}`);
        }
      },

      clearCart: () => {
        set({ items: [], storeId: null });
        toast.info("Cart cleared");
      },

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage", // key in localStorage
    },
  ),
);

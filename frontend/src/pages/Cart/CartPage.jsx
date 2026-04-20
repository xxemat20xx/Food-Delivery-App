import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import LoginModal from "../../pages/Login/Login"; // adjust path if needed

const CartPage = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    storeId,
  } = useCartStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // After login, if checkout was pending, navigate to checkout
  useEffect(() => {
    if (user && pendingCheckout) {
      setPendingCheckout(false);
      navigate("/checkout");
    }
  }, [user, pendingCheckout, navigate]);

  const handleProceedToCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
      setPendingCheckout(true);
    } else {
      navigate("/checkout");
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    setPendingCheckout(false); // cancel pending checkout if modal closed without login
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart size={22} />
          Your Cart
        </h1>

        <button
          onClick={clearCart}
          className="text-red-400 hover:text-red-300 transition text-sm"
        >
          Clear All
        </button>
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <ShoppingBag size={50} className="mb-3 opacity-50" />
          <p className="text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-4 bg-[var(--color-primary)] px-4 py-2 rounded-lg"
          >
            Browse Menu
          </button>
        </div>
      )}

      {/* CART ITEMS */}
      {items.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-[#2a2a2a] p-4 rounded-2xl flex items-center gap-4"
              >
                {/* IMAGE */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      No Img
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-400">
                    ₱{item.price} each
                  </p>

                  <p className="text-sm text-[var(--color-primary)] mt-1">
                    Subtotal: ₱{item.price * item.quantity}
                  </p>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(index, Math.max(1, item.quantity - 1))
                    }
                    className="bg-gray-700 p-2 rounded-lg"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-6 text-center">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(index, item.quantity + 1)
                    }
                    className="bg-gray-700 p-2 rounded-lg"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-400 hover:text-red-300 ml-3"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="bg-[#1f1f1f] p-5 rounded-2xl h-fit sticky top-20">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            {storeId && (
              <p className="text-xs text-gray-400 mb-3">
                Cart locked to store ID: {storeId}
              </p>
            )}

            <div className="flex justify-between mb-4">
              <span>Total Items</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between mb-6 text-lg font-bold">
              <span>Total</span>
              <span>₱{getTotal()}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-[var(--color-primary)] py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/menu")}
              className="w-full mt-3 border border-white/10 py-2 rounded-xl text-sm text-gray-300 hover:text-white"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onClose={handleLoginModalClose}
      />
    </div>
  );
};

export default CartPage;
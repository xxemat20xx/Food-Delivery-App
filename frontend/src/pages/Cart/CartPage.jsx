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
import LoginModal from "../../pages/Login/Login";

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
    setPendingCheckout(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            <ShoppingCart size={24} />
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
            <ShoppingBag size={60} className="mb-4 opacity-40" />
            <p className="text-xl font-medium">Your cart is empty</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Browse Menu
            </button>
          </div>
        )}

        {/* CART ITEMS */}
        {items.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-amber-500/40 transition"
                >
                  {/* IMAGE */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
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
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">₱{item.price} each</p>
                    <p className="text-sm text-amber-400 mt-1">
                      Subtotal: ₱{item.price * item.quantity}
                    </p>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(index, Math.max(1, item.quantity - 1))
                      }
                      className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart size={18} className="text-amber-400" />
                Order Summary
              </h2>

              {storeId && (
                <p className="text-xs text-gray-500 mb-3">
                  Cart locked to store ID: {storeId}
                </p>
              )}

              <div className="flex justify-between mb-3">
                <span>Total Items</span>
                <span>{items.length}</span>
              </div>

              <div className="flex justify-between border-t border-gray-700 pt-3 mb-5 text-xl font-bold">
                <span>Total</span>
                <span className="text-amber-400">₱{getTotal()}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3 rounded-xl font-bold hover:shadow-lg transition"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/menu")}
                className="w-full mt-3 border border-gray-700 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:border-gray-500 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal open={showLoginModal} onClose={handleLoginModalClose} />
    </div>
  );
};

export default CartPage;
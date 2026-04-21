import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import PayButton from "./PayButton";

const CheckoutPage = () => {
  const { items, getTotal, storeId, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
    if (!user) {
      navigate("/cart");
    }
  }, [items, user, navigate]);

  if (items.length === 0 || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b border-gray-800 py-2">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-amber-400">₱{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between text-xl font-bold pt-3">
                <span>Total</span>
                <span className="text-amber-400">₱{getTotal()}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <p className="text-gray-400 mb-6">
              You will be redirected to PayMongo secure checkout.
            </p>
            <PayButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
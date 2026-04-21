import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { CheckCircle, ShoppingBag } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (orderId) {
      // Clear cart after successful payment
      clearCart();
    }
  }, [orderId, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-300 mb-4">
          Your order has been confirmed.
        </p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-6">
            Order ID: <span className="text-amber-400 font-mono">{orderId}</span>
          </p>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black py-2 rounded-xl font-semibold hover:shadow-lg transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-gray-700 text-gray-300 py-2 rounded-xl hover:border-amber-500 hover:text-white transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
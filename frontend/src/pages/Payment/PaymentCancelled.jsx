import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";
import { useAuthStore } from "../../store/useAuthStore";

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cancelPendingOrder } = useOrderStore();

  useEffect(() => {
    if (!user || !orderId) return;

    const cancelOrder = async () => {
      try {
        await cancelPendingOrder(orderId);
      } catch (error) {
        console.error("Failed to cancel order:", error);
      
      }
    };

    cancelOrder();
  }, [orderId, user, cancelPendingOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 flex items-center justify-center">
      <div className="text-center bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 max-w-md">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Payment Cancelled</h2>
        <p className="text-gray-300">You have cancelled the payment. Your order has been removed.</p>
        <button
          onClick={() => navigate("/cart")}
          className="mt-6 bg-amber-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-amber-400 transition"
        >
          Return to Cart
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelled;
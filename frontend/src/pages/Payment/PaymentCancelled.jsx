import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, ShoppingBag } from "lucide-react";

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-300 mb-4">
          Your payment was not completed. No charges were made.
        </p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-6">
            Order ID: <span className="text-amber-400 font-mono">{orderId}</span>
          </p>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black py-2 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Return to Cart
          </button>
          <button
            onClick={() => navigate("/menu")}
            className="border border-gray-700 text-gray-300 py-2 rounded-xl hover:border-amber-500 hover:text-white transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
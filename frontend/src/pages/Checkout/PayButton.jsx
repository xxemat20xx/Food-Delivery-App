import { useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../../store/useCheckoutStore";

const PayButton = () => {
  const { items, getTotal, storeId } = useCartStore();
  const { user } = useAuthStore();
  const { createCheckoutSession, isLoading, error } = useCheckoutStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePay = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!storeId) {
      alert("Store information missing");
      return;
    }

    setLoading(true);
    try {
      // Prepare payload from actual cart data
      const payload = {
        items: items.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotal(),
        userEmail: user.email,
        userId: user._id,
        storeId: storeId,
      };

      // Create checkout session
      const result = await createCheckoutSession(payload);
      
      // Redirect to PayMongo checkout page
      if (result?.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message || "Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePay}
        disabled={loading || isLoading}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3 rounded-xl font-bold disabled:opacity-50 transition"
      >
        {loading || isLoading ? "Processing..." : `Pay ₱${getTotal().toFixed(2)}`}
      </button>
      <button
        onClick={() => navigate("/cart")}
        className="w-full bg-gray-500 hover:bg-gray-600 text-slate-300 py-3 rounded-xl font-bold transition mt-3"
      >
        Cancel
      </button>
    </>
  );
};

export default PayButton;
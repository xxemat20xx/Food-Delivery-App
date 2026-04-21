import { useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const PayButton = () => {
  const { items, getTotal, storeId } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePay = async () => {
    console.log(user.email)
    console.log(storeId)
  };

  return (
    <>
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3 rounded-xl font-bold disabled:opacity-50 transition"
    >
      {loading ? "Processing..." : `Pay ₱${getTotal().toFixed(2)}`}
    </button>
    <button 
    onClick={() => navigate('/cart')}
    className="w-full bg-gray-500 hover:bg-gray-600 text-slate-300 py-3 rounded-xl font-bold transition mt-3">
      Cancel
    </button>
    </>
  );
};

export default PayButton;
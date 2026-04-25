import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Package,
  MapPin,
  Calendar,
  CreditCard,
  ArrowLeft,
  Coffee,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentOrder, fetchOrderById, loading, error } = useOrderStore();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (id) {
      fetchOrderById(id);
    }
  }, [id, user, navigate, fetchOrderById]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
      case "preparing":
        return <Coffee className="h-5 w-5 text-purple-400" />;
      case "ready":
        return <Package className="h-5 w-5 text-indigo-400" />;
      case "delivered":
        return <Truck className="h-5 w-5 text-green-400" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      preparing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      ready: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-gray-400 mb-4">{error || "Unable to load order details"}</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-amber-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-amber-400 transition"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition mb-6"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl px-4 py-2 mb-4">
            <Package className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Order Details
            </h1>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-3">
            <p className="text-gray-400 font-mono text-sm">Order ID: {currentOrder._id}</p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(currentOrder.createdAt)}
            </p>
          </div>
        </div>

        {/* Order status card */}
        <div className={`rounded-2xl border p-6 mb-6 ${getStatusColor(currentOrder.status)}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon(currentOrder.status)}
            <div>
              <div className="font-semibold text-lg capitalize">{currentOrder.status}</div>
              <div className="text-sm opacity-75">
                {currentOrder.status === "pending" && "Your order is being processed"}
                {currentOrder.status === "confirmed" && "Order confirmed, preparing soon"}
                {currentOrder.status === "preparing" && "Your order is being prepared"}
                {currentOrder.status === "ready" && "Order is ready for pickup/delivery"}
                {currentOrder.status === "delivered" && "Order completed"}
                {currentOrder.status === "cancelled" && "Order cancelled"}
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column – Items & Summary */}
          <div className="space-y-6">
            {/* Items list */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Coffee size={18} className="text-amber-400" />
                Items
              </h2>
              <div className="space-y-3">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-800 last:border-0">
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">Quantity: {item.quantity}</div>
                      {item.customizations?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.customizations.map((c, i) => (
                            <span key={i}>{c.name}: {c.option}{i < item.customizations.length-1 && ", "}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-amber-400 font-medium">
                      ₱{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 pt-3 border-t border-gray-800 space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>₱{currentOrder.subtotal || currentOrder.total}</span>
                </div>
                {currentOrder.tax > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Tax</span>
                    <span>₱{currentOrder.tax}</span>
                  </div>
                )}
                {currentOrder.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Delivery Fee</span>
                    <span>₱{currentOrder.deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-amber-400">₱{currentOrder.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column – Store & Payment */}
          <div className="space-y-6">
            {/* Store info */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-amber-400" />
                Store
              </h2>
              <div className="space-y-2 text-sm">
                <p className="text-white font-medium">{currentOrder.store?.name || "Inarawan Coffee"}</p>
                <p className="text-gray-400">{currentOrder.store?.address || "Store address not available"}</p>
                {currentOrder.store?.phone && (
                  <p className="text-gray-400">📞 {currentOrder.store.phone}</p>
                )}
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-amber-400" />
                Payment
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Method</span>
                  <span className="text-white capitalize">{currentOrder.paymentMethod || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-medium ${currentOrder.paymentStatus === "paid" ? "text-green-400" : "text-yellow-400"}`}>
                    {currentOrder.paymentStatus?.toUpperCase() || "PENDING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery address (if available) */}
            {currentOrder.deliveryAddress && (
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-amber-400" />
                  Delivery Address
                </h2>
                <p className="text-gray-300 text-sm">
                  {currentOrder.deliveryAddress.street}, {currentOrder.deliveryAddress.city}, {currentOrder.deliveryAddress.postalCode}
                </p>
                {currentOrder.specialInstructions && (
                  <div className="mt-3 pt-2 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">Special Instructions:</p>
                    <p className="text-white text-sm mt-1">{currentOrder.specialInstructions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
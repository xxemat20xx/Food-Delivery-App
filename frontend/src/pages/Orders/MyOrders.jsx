import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useOrderStore } from "../../store/useOrderStore";
import { 
  Package, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ChevronRight,
  Home,
  ShoppingBag 
} from "lucide-react";

const MyOrders = () => {
  const { user } = useAuthStore();
  const { orders, fetchMyOrders, loading } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user, fetchMyOrders]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400",
      confirmed: "bg-blue-500/20 text-blue-400",
      preparing: "bg-purple-500/20 text-purple-400",
      ready: "bg-indigo-500/20 text-indigo-400",
      delivered: "bg-green-500/20 text-green-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const getPaymentStatusColor = (status) => {
    return status === "paid"
      ? "bg-green-500/20 text-green-400"
      : "bg-yellow-500/20 text-yellow-400";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Skeleton loader
  const SkeletonOrder = () => (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="p-5 border-b border-gray-800 bg-gray-900/40">
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 bg-gray-700 rounded"></div>
          <div className="h-5 w-20 bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="h-4 w-full bg-gray-700 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-700 rounded mt-4"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back button */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl px-4 py-2 mb-2">
              <Package className="h-6 w-6 text-amber-400" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                My Orders
              </h1>
            </div>
            <p className="text-gray-400 text-sm ml-1">
              {orders.length > 0 && `${orders.length} order${orders.length > 1 ? 's' : ''} found`}
            </p>
          </div>
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700 transition border border-gray-700 text-gray-300 hover:text-amber-400"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-6">
            <SkeletonOrder />
            <SkeletonOrder />
            <SkeletonOrder />
          </div>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-16 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No orders yet</p>
            <p className="text-gray-500 text-sm mt-1">Looks like you haven't placed any orders.</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders grid */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition duration-300 hover:shadow-xl"
              >
                {/* Order header */}
                <div className="p-5 border-b border-gray-800 bg-gray-900/40 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} />
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="text-sm font-mono text-amber-400 bg-black/20 px-2 py-1 rounded">
                      #{order._id.slice(-8)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Order body */}
                <div className="p-5 space-y-4">
                  {/* Items list */}
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          {item.quantity} × {item.name}
                        </span>
                        <span className="text-amber-400 font-medium">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Store and totals */}
                  <div className="flex flex-wrap justify-between items-end pt-2 border-t border-gray-800 mt-2">
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin size={14} />
                      {order.store?.name || "Store"}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        Total: ₱{order.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 justify-end">
                        <CreditCard size={12} />
                        {order.paymentMethod.toUpperCase() || "Not specified"}
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="mt-2 w-full flex items-center justify-center gap-1 text-amber-400 hover:text-amber-300 text-sm font-medium transition"
                  >
                    View Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
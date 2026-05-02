import { useEffect, useState, useMemo } from "react";
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
  ShoppingBag,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X
} from "lucide-react";

const MyOrders = () => {
  const { user } = useAuthStore();
  const { orders, pagination, fetchMyOrders, loading } = useOrderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const limit = pagination.limit || 5;

  useEffect(() => {
    if (user) {
      fetchMyOrders(currentPage, limit);
    }
  }, [user, currentPage, limit, fetchMyOrders]);

  // Client-side filtering: search + date range
  const filteredOrders = useMemo(() => {
    let result = orders;

    // 1. Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((order) => {
        const orderIdMatch = order._id.slice(-8).toLowerCase().includes(term);
        const storeMatch = order.store?.name?.toLowerCase().includes(term);
        const itemMatch = order.items.some(item => 
          item.name.toLowerCase().includes(term)
        );
        return orderIdMatch || storeMatch || itemMatch;
      });
    }

    // 2. Date range filter
    if (startDate || endDate) {
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
        if (startDate && endDate) {
          const start = new Date(startDate).setHours(0, 0, 0, 0);
          const end = new Date(endDate).setHours(0, 0, 0, 0);
          return orderDate >= start && orderDate <= end;
        } else if (startDate) {
          const start = new Date(startDate).setHours(0, 0, 0, 0);
          return orderDate >= start;
        } else if (endDate) {
          const end = new Date(endDate).setHours(0, 0, 0, 0);
          return orderDate <= end;
        }
        return true;
      });
    }

    return result;
  }, [orders, searchTerm, startDate, endDate]);

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      // Optionally clear filters when changing page? Not clearing here, but could.
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

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

  const hasActiveFilters = searchTerm || startDate || endDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back button and filters */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl px-4 py-2 mb-2">
              <Package className="h-6 w-6 text-amber-400" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                My Orders
              </h1>
            </div>
            <p className="text-gray-400 text-sm ml-1">
              {pagination.total > 0 && `${pagination.total} order${pagination.total > 1 ? 's' : ''} found`}
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

        {/* Filter bar */}
        <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800 p-4 mb-8 flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Order ID, store, or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition text-sm"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-6">
            <SkeletonOrder />
            <SkeletonOrder />
            <SkeletonOrder />
          </div>
        )}

        {/* Empty state (no orders at all) */}
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

        {/* No results after filters */}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800">
            <Search className="h-14 w-14 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No orders match your filters</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting the date range or search term.</p>
            <button
              onClick={clearFilters}
              className="mt-6 bg-amber-500/20 text-amber-400 px-6 py-2 rounded-xl font-semibold hover:bg-amber-500 hover:text-black transition"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Orders grid (filtered) */}
        {!loading && filteredOrders.length > 0 && (
          <>
            <div className="space-y-6">
              {filteredOrders.map((order) => (
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
                          {order.paymentMethod || "Not specified"}
                        </div>
                      </div>
                    </div>

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

            {/* Pagination controls (only when no active filters) */}
            {!hasActiveFilters && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronsLeft size={18} />
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {pagination.pages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => goToPage(pagination.pages)}
                  disabled={currentPage === pagination.pages}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
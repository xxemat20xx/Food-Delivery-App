import { useEffect, useState, useMemo } from "react";
import { useOrderStore } from "../../store/useOrderStore";
import { useStoreStore } from "../../store/useStoreStore";
import { useSocket } from "../../hooks/useSocket";
import {
  Package,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  TrendingUp,
  ShoppingBag,
  Coffee,
  Loader2,
} from "lucide-react";

const OrderMonitoringDashboard = () => {
  const { orders, fetchAllOrders, updateOrderStatus, loading } = useOrderStore();
  const { stores, fetchStores } = useStoreStore();
  const socket = useSocket();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStoreId, setFilterStoreId] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load initial data
  useEffect(() => {
    fetchAllOrders(1, 100);
    fetchStores();
  }, []);

  // Real‑time updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = () => {
      fetchAllOrders(1, 100);
      setLastUpdated(new Date());
    };

    socket.on("order:status_update", handleOrderUpdate);
    return () => socket.off("order:status_update", handleOrderUpdate);
  }, [socket, fetchAllOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filterStatus !== "all" && order.status !== filterStatus) return false;
      if (filterStoreId && order.store?._id !== filterStoreId) return false;
      return true;
    });
  }, [orders, filterStatus, filterStoreId]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const preparing = orders.filter((o) => o.status === "preparing").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return { total, pending, preparing, delivered };
  }, [orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-yellow-400" />;
      case "confirmed": return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case "preparing": return <Package className="h-4 w-4 text-purple-400" />;
      case "ready": return <Truck className="h-4 w-4 text-indigo-400" />;
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      preparing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      ready: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return classes[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusOptions = [
    "pending", "confirmed", "preparing", "ready", "delivered", "cancelled",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <Package className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Order Monitoring
              </h1>
              <p className="text-gray-400 text-sm">
                Real‑time dashboard – updates automatically
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={() => {
                fetchAllOrders(1, 100);
                setLastUpdated(new Date());
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700 transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-400 opacity-70" />
            </div>
          </div>
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400 opacity-70" />
            </div>
          </div>
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Preparing</p>
                <p className="text-2xl font-bold text-purple-400">{stats.preparing}</p>
              </div>
              <Coffee className="h-8 w-8 text-purple-400 opacity-70" />
            </div>
          </div>
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Delivered</p>
                <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
              </div>
              <Truck className="h-8 w-8 text-green-400 opacity-70" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterStatus === status
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                      : "bg-gray-800/60 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
          <div className="relative">
            <select
              value={filterStoreId}
              onChange={(e) => setFilterStoreId(e.target.value)}
              className="px-4 py-1.5 rounded-full bg-gray-800/60 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer pr-8"
            >
              <option value="">All Stores</option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-900/40 rounded-2xl border border-gray-800 p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-5 w-24 bg-gray-700 rounded"></div>
                  <div className="h-5 w-20 bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-700 rounded"></div>
                  <div className="h-4 w-48 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800">
            <Package className="h-14 w-14 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No orders found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/20 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/50 border-b border-gray-800">
                <tr className="text-left text-gray-300">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Store</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-800/40 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 font-mono text-amber-400 text-xs">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {order.user?.name || order.user?.email || "Guest"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {order.store?.name || "Store"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ₱{order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(order.status)}
                        <span
                          className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          disabled={updatingOrderId === order._id}
                          className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:ring-2 focus:ring-amber-500"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            (window.location.href = `/order/${order._id}`)
                          }
                          className="text-blue-400 hover:text-blue-300 transition"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderMonitoringDashboard;
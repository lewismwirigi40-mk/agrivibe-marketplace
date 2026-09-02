// src/pages/dashboard/orders.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Sparkles,
  Award,
  TrendingUp,
  Star,
  Truck,
  MapPin,
  ArrowRight,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";

// ... rest of your code

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get("/orders/my-orders");
      const ordersData = response.data.orders || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort orders
  useEffect(() => {
    let result = [...orders];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(
        (order) =>
          order.order_number
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.id?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Sorting
    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime(),
        );
        break;
      case "amount-high":
        result.sort((a, b) => (b.total || 0) - (a.total || 0));
        break;
      case "amount-low":
        result.sort((a, b) => (a.total || 0) - (b.total || 0));
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime(),
        );
        break;
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, sortBy, orders]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      delivered: CheckCircle,
      pending: Clock,
      processing: Package,
      shipped: Truck,
      cancelled: XCircle,
    };
    return icons[status?.toLowerCase()] || Clock;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      refunded: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
    },
    {
      label: "Processing",
      value: orders.filter((o) => o.status === "processing").length,
      icon: Package,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">
              View all your orders and track status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-agrivibe-green/10 text-agrivibe-green rounded-full text-sm font-medium">
              <ShoppingBag className="w-4 h-4" />
              {orders.length} Total Orders
            </span>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== FILTERS ====== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">🟡 Pending</option>
                <option value="processing">🔵 Processing</option>
                <option value="shipped">🟣 Shipped</option>
                <option value="delivered">🟢 Delivered</option>
                <option value="cancelled">🔴 Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== ORDERS TABLE ====== */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Orders Found
            </h3>
            <p className="text-gray-500 text-lg mb-8">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Start shopping to see your orders here"}
            </p>
            {searchTerm || statusFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-agrivibe-green font-medium hover:underline"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-agrivibe-green/30 transition-all hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Order ID
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Date
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Total
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Payment
                    </th>
                    <th className="text-right text-sm font-semibold text-gray-600 px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => {
                      const StatusIcon = getStatusIcon(order.status);
                      const statusColor = getStatusColor(order.status);
                      const paymentColor = getPaymentStatusColor(
                        order.payment_status,
                      );

                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                #{order.order_number || order.id.slice(0, 8)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-900">
                                {new Date(
                                  order.created_at,
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(
                                  order.created_at,
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-agrivibe-green">
                              {formatCurrency(order.total)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusColor}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${paymentColor}`}
                            >
                              {order.payment_status === "paid" ? "✅" : "⏳"}
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300"
                            >
                              <Eye className="w-4 h-4" />
                              Details
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ====== ORDER COUNT ====== */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ====== ORDER DETAILS MODAL ====== */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Order #
                      {selectedOrder.order_number ||
                        selectedOrder.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Information
                    </h4>
                    <p className="text-sm text-gray-900">
                      {selectedOrder.customer?.name || "Customer"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.customer?.email || ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.customer?.phone || ""}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h4>
                    <p className="text-sm text-gray-900">
                      {selectedOrder.delivery_address || "No address provided"}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Items
                  </h4>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">
                            Product
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-2">
                            Qty
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-2">
                            Price
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-2">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item: any, i: number) => (
                          <tr
                            key={i}
                            className="border-b border-gray-200 last:border-0"
                          >
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {item.product?.name || "Product"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700 text-right">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(selectedOrder.payment_status)}`}
                    >
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-agrivibe-green">
                      {formatCurrency(selectedOrder.total)}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

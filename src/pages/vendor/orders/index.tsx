// src/pages/vendor/orders/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  ChevronDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Package,
  Truck,
  User,
  Calendar,
  DollarSign,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Printer,
  MapPin,
  Phone,
  Mail,
  Copy,
  ChevronRight,
  TrendingUp,
  Star,
  Users,
  Box,
  FileText,
  MessageCircle,
  Send,
  Edit,
  Trash2,
  Loader2,
  Zap,
  Crown,
  Award,
} from "lucide-react";
import VendorLayout from "../../../components/VendorLayout";
import api from "../../../services/api";

export default function VendorOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/vendor/orders");
      const ordersData = response.data.orders || response.data || [];
      setOrders(ordersData);

      // Calculate stats
      const pending = ordersData.filter(
        (o: any) => o.status === "pending" || o.order?.status === "pending",
      ).length;
      const processing = ordersData.filter(
        (o: any) =>
          o.status === "processing" || o.order?.status === "processing",
      ).length;
      const shipped = ordersData.filter(
        (o: any) => o.status === "shipped" || o.order?.status === "shipped",
      ).length;
      const completed = ordersData.filter(
        (o: any) => o.status === "completed" || o.order?.status === "completed",
      ).length;
      const cancelled = ordersData.filter(
        (o: any) => o.status === "cancelled" || o.order?.status === "cancelled",
      ).length;

      // Calculate total revenue from completed orders
      const totalRevenue = ordersData
        .filter(
          (o: any) =>
            o.status === "completed" || o.order?.status === "completed",
        )
        .reduce(
          (sum: number, o: any) =>
            sum + (o.total_amount || o.order?.total_amount || 0),
          0,
        );

      setStats({
        total: ordersData.length,
        pending,
        processing,
        shipped,
        completed,
        cancelled,
        totalRevenue,
      });
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      setError(error.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      pending: {
        label: "Pending",
        icon: Clock,
        color:
          "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30",
      },
      processing: {
        label: "Processing",
        icon: Loader2,
        color:
          "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30",
      },
      shipped: {
        label: "Shipped",
        icon: Truck,
        color:
          "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30",
      },
      completed: {
        label: "Completed",
        icon: CheckCircle,
        color:
          "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30",
      },
      cancelled: {
        label: "Cancelled",
        icon: XCircle,
        color:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30",
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.status || order.order?.status || "";
    const customerName =
      order.order?.user?.first_name || order.user?.first_name || "";
    const customerEmail = order.order?.user?.email || order.user?.email || "";
    const orderId = order.id || order.order?.id || "";

    const matchesSearch =
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || orderStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Orders
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your store orders
              <span className="ml-2 text-xs text-gray-400">
                ({stats.total} total)
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Orders",
              value: stats.total,
              icon: ShoppingBag,
              color: "from-blue-500 to-blue-600",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "Revenue",
              value: formatCurrency(stats.totalRevenue),
              icon: DollarSign,
              color: "from-green-500 to-emerald-500",
              bg: "bg-green-50 dark:bg-green-500/10",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "from-yellow-500 to-orange-500",
              bg: "bg-yellow-50 dark:bg-yellow-500/10",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: CheckCircle,
              color: "from-emerald-500 to-green-500",
              bg: "bg-emerald-50 dark:bg-emerald-500/10",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 dark:border-white/10 p-4`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-white/10 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <div className="relative sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== ORDERS TABLE ====== */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-white/10">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {search || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "You haven't received any orders yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Order ID
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Customer
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Items
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Total
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Date
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    const orderData = order.order || order;
                    const orderStatus =
                      order.status || orderData.status || "pending";
                    const customer = orderData.user || order.user || {};

                    return (
                      <motion.tr
                        key={order.id || orderData.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                            #
                            {orderData.id?.slice(0, 8) ||
                              order.id?.slice(0, 8) ||
                              "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {customer.first_name} {customer.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {customer.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {orderData.items?.length || order.items?.length || 0}{" "}
                          items
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(
                              orderData.total_amount || order.total_amount || 0,
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(orderStatus)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(orderData.created_at || order.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====== ORDER DETAIL MODAL ====== */}
        <AnimatePresence>
          {showDetailModal && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-agrivibe-green to-emerald-500 px-6 py-5 sticky top-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          Order #{selectedOrder.id?.slice(0, 8) || "N/A"}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {formatDate(selectedOrder.created_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Status & Total */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-xs text-gray-400">Order Status</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                        {formatCurrency(selectedOrder.total_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-400">Name</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedOrder.user?.first_name}{" "}
                          {selectedOrder.user?.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedOrder.user?.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedOrder.user?.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedOrder.shipping_address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-agrivibe-green text-white rounded-xl font-semibold hover:bg-agrivibe-green/90 transition-colors">
                      <Truck className="w-4 h-4" />
                      Update Status
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </VendorLayout>
  );
}

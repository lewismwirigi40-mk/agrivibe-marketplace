// src/pages/vendor/orders/[id].tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Navigation,
  Shield,
  Sparkles,
  Eye,
  Send,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  UserPlus,
  Store,
} from "lucide-react";
import VendorLayout from "../../../components/VendorLayout";
import api from "../../../services/api";

export default function VendorOrderDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [delivery, setDelivery] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      fetchAvailableDrivers();
      fetchDeliveryStatus();
    }
  }, [id]);

  // ============================================
  // ✅ FETCH ORDER DETAILS - UPDATED
  // ============================================
  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // ✅ FIXED: Use the orders endpoint
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order || response.data);
      setStatus(response.data.order?.status || "pending");
    } catch (error: any) {
      console.error("Failed to fetch order:", error);
      setError(error.response?.data?.error || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ FETCH AVAILABLE DRIVERS - UPDATED
  // ============================================
  const fetchAvailableDrivers = async () => {
    try {
      // ✅ FIXED: Use the correct endpoint
      const response = await api.get("/driver/available");
      setDrivers(response.data.drivers || []);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
      // Fallback: try alternative endpoint
      try {
        const fallbackResponse = await api.get("/deliveries/available-drivers");
        setDrivers(fallbackResponse.data.drivers || []);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }
  };

  // ============================================
  // ✅ FETCH DELIVERY STATUS - UPDATED
  // ============================================
  const fetchDeliveryStatus = async () => {
    try {
      // ✅ FIXED: Use the correct endpoint
      const response = await api.get(`/deliveries/order/${id}`);
      setDelivery(response.data.delivery || null);
    } catch (error) {
      // No delivery created yet
      setDelivery(null);
    }
  };

  // ============================================
  // ✅ ASSIGN DRIVER - UPDATED
  // ============================================
  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      setError("Please select a driver");
      return;
    }

    setAssigning(true);
    setError("");

    try {
      // ✅ FIXED: Use the deliveries endpoint to assign driver
      const deliveryData = {
        order_id: id,
        driver_id: selectedDriver,
        pickup_address: order?.store?.address || order?.delivery_address || "",
        delivery_address: order?.delivery_address || "",
        delivery_fee: order?.delivery_fee || 0,
        estimated_time: 30,
        customer_notes: order?.customer_notes || "",
      };

      // Create delivery and assign driver in one call
      const response = await api.post("/deliveries", deliveryData);
      setDelivery(response.data.delivery);
      setAssignSuccess(true);

      // Update order status
      setStatus("assigned");

      // ✅ NOTIFICATION: Driver is notified by backend automatically
      // No need to manually create notification from frontend

      setTimeout(() => {
        setAssignSuccess(false);
        fetchDeliveryStatus();
      }, 3000);
    } catch (error: any) {
      console.error("Failed to assign driver:", error);
      setError(error.response?.data?.error || "Failed to assign driver");
    } finally {
      setAssigning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      pending: {
        label: "Pending",
        icon: Clock,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
      processing: {
        label: "Processing",
        icon: RefreshCw,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      assigned: {
        label: "Assigned",
        icon: Truck,
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
      shipped: {
        label: "Shipped",
        icon: Navigation,
        color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      },
      delivered: {
        label: "Delivered",
        icon: CheckCircle,
        color: "bg-green-100 text-green-700 border-green-200",
      },
      cancelled: {
        label: "Cancelled",
        icon: XCircle,
        color: "bg-red-100 text-red-700 border-red-200",
      },
    };
    return configs[status] || configs.pending;
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  if (error) {
    return (
      <VendorLayout>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={fetchOrderDetails}
            className="mt-4 bg-red-100 text-red-700 px-6 py-2 rounded-xl hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </VendorLayout>
    );
  }

  if (!order) {
    return (
      <VendorLayout>
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Order not found
          </h3>
          <button
            onClick={() => router.push("/vendor/orders")}
            className="mt-4 text-agrivibe-green font-medium hover:underline"
          >
            Back to Orders
          </button>
        </div>
      </VendorLayout>
    );
  }

  const statusBadge = getStatusBadge(status);
  const StatusIcon = statusBadge.icon;
  const isAssigned =
    status === "assigned" || status === "shipped" || status === "delivered";
  const isPending = status === "pending";

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/vendor/orders")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.order_number || order.id?.slice(0, 8)}
              </h1>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${statusBadge.color}`}
            >
              <StatusIcon className="w-4 h-4" />
              {statusBadge.label}
            </span>
            <button
              onClick={fetchOrderDetails}
              className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ====== SUCCESS ====== */}
        <AnimatePresence>
          {assignSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-700">
                  Driver assigned successfully!
                </p>
                <p className="text-xs text-green-600">
                  The driver has been notified.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ERROR ====== */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== MAIN CONTENT ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ====== LEFT COLUMN ====== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-agrivibe-green" />
                Order Items
              </h2>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No items found
                  </p>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-agrivibe-green" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="font-medium text-gray-900">
                    {order.customer?.name || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-medium text-gray-900">
                    {order.customer?.email || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900">
                    {order.customer?.phone || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Order Total</p>
                  <p className="font-medium text-agrivibe-green">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-agrivibe-green" />
                Delivery Address
              </h2>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-700">
                  {order.delivery_address || "Address not set"}
                </p>
                {order.delivery_notes && (
                  <p className="text-sm text-gray-400 mt-2">
                    📝 {order.delivery_notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ====== RIGHT COLUMN ====== */}
          <div className="space-y-6">
            {/* Assign Driver */}
            {isPending && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-agrivibe-green" />
                  Assign Driver
                </h2>
                <div className="space-y-3">
                  <div className="relative">
                    <select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="w-full appearance-none px-4 py-3 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
                    >
                      <option value="">Select a driver</option>
                      {drivers.map((driver: any) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name || driver.user?.first_name}{" "}
                          {driver.user?.last_name || ""} -{" "}
                          {driver.vehicle_type || "Vehicle"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={handleAssignDriver}
                    disabled={assigning || !selectedDriver}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {assigning ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Assign Driver
                      </>
                    )}
                  </button>
                  {drivers.length === 0 && (
                    <p className="text-sm text-yellow-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      No available drivers. Register drivers first.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Status */}
            {isAssigned && delivery && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Navigation className="w-5 h-5 text-agrivibe-green" />
                  Delivery Status
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(delivery.status).color}`}
                    >
                      {delivery.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Driver</span>
                    <span className="font-medium text-gray-900">
                      {delivery.driver?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Fee</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(delivery.delivery_fee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Pickup</span>
                    <span className="font-medium text-gray-900">
                      {delivery.pickup_time
                        ? formatDate(delivery.pickup_time)
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Delivery</span>
                    <span className="font-medium text-gray-900">
                      {delivery.delivery_time
                        ? formatDate(delivery.delivery_time)
                        : "Pending"}
                    </span>
                  </div>
                  {delivery.delivery_code && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-700 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Delivery Code: <strong>{delivery.delivery_code}</strong>
                      </p>
                      <p className="text-xs text-blue-500 mt-1">
                        Customer gives this code to the driver
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Escrow Status */}
            {order.escrow_status && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-agrivibe-green" />
                  Escrow Status
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Amount Held</span>
                    <span className="font-bold text-agrivibe-green">
                      {formatCurrency(order.escrow_amount || order.total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        order.escrow_status === "released"
                          ? "bg-green-100 text-green-700"
                          : order.escrow_status === "held"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.escrow_status === "released" && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {order.escrow_status === "held" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {order.escrow_status || "Pending"}
                    </span>
                  </div>
                  {order.escrow_released_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Released</span>
                      <span className="text-sm text-gray-700">
                        {formatDate(order.escrow_released_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}

// src/pages/driver/deliveries/[id].tsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Phone,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Copy,
  Eye,
  Share2,
  Truck,
  Box,
  Shield,
  Sparkles,
  Award,
  Send,
  MessageCircle,
  Mail,
  AlertCircle,
} from "lucide-react";
import DriverLayout from "../../../components/DriverLayout";
import api from "../../../services/api";

export default function DeliveryDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [delivery, setDelivery] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDeliveryDetails();
    }
  }, [id]);

  // ============================================
  // ✅ FETCH DELIVERY DETAILS - REAL API
  // ============================================
  const fetchDeliveryDetails = async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get(`/deliveries/${id}`);
      const data = response.data.delivery || response.data;

      // ✅ Format delivery data
      setDelivery({
        id: data.id,
        orderId:
          data.order?.order_number || data.order_id?.slice(0, 8) || "N/A",
        customer: data.customer?.name || data.customer_name || "Customer",
        phone: data.customer?.phone || data.phone || "N/A",
        address: data.delivery_address || "Address not set",
        items: data.order?.items?.map(
          (item: any) =>
            `${item.product?.name || "Product"} x ${item.quantity}`,
        ) || ["No items"],
        fee: data.delivery_fee || 0,
        status: data.status || "assigned",
        createdAt: data.created_at || new Date().toISOString(),
        deliveryCode: data.delivery_code || "Not set",
        notes: data.driver_notes || data.customer_notes || "",
        vendor: data.vendor?.store_name || "Vendor",
        estimatedTime: data.estimated_time
          ? `${data.estimated_time} min`
          : "N/A",
        pickupTime: data.pickup_time,
        deliveryTime: data.delivery_time,
      });
    } catch (error: any) {
      console.error("Failed to fetch delivery:", error);
      setError(
        error.response?.data?.error || "Failed to load delivery details",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // ✅ UPDATE STATUS - REAL API
  // ============================================
  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await api.put(`/deliveries/${id}/status`, { status: newStatus });

      // ✅ Update local state
      setDelivery((prev: any) => ({ ...prev, status: newStatus }));
      setMessage(`✅ Status updated to: ${newStatus}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      console.error("Failed to update status:", error);
      setMessage(
        `❌ ${error.response?.data?.error || "Failed to update status"}`,
      );
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ VERIFY DELIVERY CODE - REAL API
  // ============================================
  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setMessage("⚠️ Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.post("/deliveries/verify-code", {
        order_id: delivery.orderId,
        code: code,
      });

      if (response.data.message) {
        setMessage("✅ Delivery confirmed! Code verified successfully.");
        setDelivery((prev: any) => ({ ...prev, status: "delivered" }));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error: any) {
      console.error("Failed to verify code:", error);
      setMessage(
        `❌ ${error.response?.data?.error || "Invalid code. Please try again."}`,
      );
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (delivery?.deliveryCode && delivery.deliveryCode !== "Not set") {
      navigator.clipboard.writeText(delivery.deliveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      assigned: "bg-yellow-100 text-yellow-700 border-yellow-200",
      picked_up: "bg-blue-100 text-blue-700 border-blue-200",
      in_transit: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      assigned: Clock,
      picked_up: Package,
      in_transit: Navigation,
      delivered: CheckCircle,
      failed: XCircle,
      cancelled: XCircle,
    };
    return icons[status?.toLowerCase()] || Clock;
  };

  const getStatusProgress = (status: string) => {
    const progress: Record<string, number> = {
      assigned: 25,
      picked_up: 50,
      in_transit: 75,
      delivered: 100,
      failed: 0,
      cancelled: 0,
    };
    return progress[status?.toLowerCase()] || 0;
  };

  if (isLoading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading delivery details...</p>
          </div>
        </div>
      </DriverLayout>
    );
  }

  if (error) {
    return (
      <DriverLayout>
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Error loading delivery
          </h3>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-agrivibe-green font-medium hover:underline"
          >
            Go Back
          </button>
        </div>
      </DriverLayout>
    );
  }

  if (!delivery) {
    return (
      <DriverLayout>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-800">
            Delivery not found
          </h3>
          <button
            onClick={() => router.back()}
            className="mt-4 text-agrivibe-green font-medium hover:underline"
          >
            Go Back
          </button>
        </div>
      </DriverLayout>
    );
  }

  const StatusIcon = getStatusIcon(delivery.status);
  const progress = getStatusProgress(delivery.status);
  const isDelivered = delivery.status === "delivered";
  const isFailed =
    delivery.status === "failed" || delivery.status === "cancelled";

  return (
    <DriverLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-agrivibe-green transition-colors group mb-2"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Deliveries
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Delivery Details
            </h1>
            <p className="text-gray-500 mt-1">Order #{delivery.orderId}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(delivery.status)}`}
            >
              <StatusIcon className="w-4 h-4" />
              {delivery.status.charAt(0).toUpperCase() +
                delivery.status.slice(1).replace("_", " ")}
            </span>
          </div>
        </div>

        {/* ====== PROGRESS BAR ====== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Assigned</span>
            <span>Picked Up</span>
            <span>In Transit</span>
            <span>Delivered</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${isDelivered ? "bg-green-500" : isFailed ? "bg-red-500" : "bg-agrivibe-green"}`}
            />
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">
            {progress}% Complete
          </div>
        </div>

        {/* ====== MESSAGE ====== */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-2xl flex items-start gap-3 ${
                message.includes("✅")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : message.includes("⚠️")
                    ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                    : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== TWO COLUMN LAYOUT ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ====== LEFT COLUMN - DELIVERY INFO ====== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-agrivibe-green" />
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">Delivery ID</span>
                  <span className="text-gray-900 font-medium">
                    {delivery.id?.slice(0, 8) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">Order ID</span>
                  <span className="text-gray-900 font-medium">
                    {delivery.orderId}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">Vendor</span>
                  <span className="text-gray-900 font-medium">
                    {delivery.vendor}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">Date</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(delivery.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">Estimated Time</span>
                  <span className="text-gray-900 font-medium">
                    {delivery.estimatedTime}
                  </span>
                </div>
                {delivery.pickupTime && (
                  <div className="flex justify-between items-center py-2 border-t border-gray-50">
                    <span className="text-gray-500 text-sm">Picked Up</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(delivery.pickupTime).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {delivery.deliveryTime && (
                  <div className="flex justify-between items-center py-2 border-t border-gray-50">
                    <span className="text-gray-500 text-sm">Delivered</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(delivery.deliveryTime).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-agrivibe-green" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-agrivibe-green" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {delivery.customer}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {delivery.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-agrivibe-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="text-gray-900 font-medium">
                      {delivery.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Package className="w-5 h-5 text-agrivibe-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <ul className="text-gray-900 font-medium space-y-1">
                      {delivery.items.map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notes */}
            {delivery.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-700">
                      Delivery Notes
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                      {delivery.notes}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ====== RIGHT COLUMN - ACTIONS ====== */}
          <div className="space-y-6">
            {/* Delivery Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-agrivibe-green" />
                <h3 className="text-lg font-bold text-gray-900">
                  Delivery Code
                </h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Ask the customer for the 6-digit code
              </p>

              {isDelivered ? (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-700">
                    Delivery Confirmed
                  </p>
                  <p className="text-xs text-green-600">
                    Code verified successfully
                  </p>
                </div>
              ) : isFailed ? (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-red-700">
                    Delivery Failed
                  </p>
                  <p className="text-xs text-red-600">
                    This delivery cannot be completed
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {delivery.deliveryCode &&
                    delivery.deliveryCode !== "Not set" && (
                      <div className="p-3 bg-gray-50 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">
                          Customer Code
                        </p>
                        <p className="text-2xl font-bold text-agrivibe-green tracking-widest">
                          {delivery.deliveryCode}
                        </p>
                      </div>
                    )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ""))
                      }
                      disabled={isDelivered || isFailed}
                      className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all text-center text-2xl tracking-widest disabled:opacity-50"
                    />
                    <button
                      onClick={handleVerifyCode}
                      disabled={loading || isDelivered || isFailed}
                      className="bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </button>
                  </div>
                  {delivery.deliveryCode &&
                    delivery.deliveryCode !== "Not set" && (
                      <button
                        onClick={handleCopyCode}
                        className="text-sm text-agrivibe-green hover:text-emerald-600 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy code to clipboard"}
                      </button>
                    )}
                </div>
              )}
            </motion.div>

            {/* Status Update */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-agrivibe-green" />
                Update Status
              </h3>
              <div className="space-y-2">
                {["picked_up", "in_transit", "delivered"].map((s) => {
                  const isActive = delivery.status === s;
                  const isDisabled = isDelivered || isFailed;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      disabled={isDisabled}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-agrivibe-green text-white shadow-lg shadow-agrivibe-green/30"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {s === "picked_up" && "📦 Picked Up"}
                      {s === "in_transit" && "🚚 In Transit"}
                      {s === "delivered" && "✅ Delivered"}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(delivery.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <Navigation className="w-5 h-5" />
                Navigate to Delivery Location
              </a>
            </motion.div>

            {/* Contact Customer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3"
            >
              <a
                href={`tel:${delivery.phone}`}
                className="flex items-center justify-center gap-2 bg-green-50 text-green-600 p-3 rounded-xl font-medium hover:bg-green-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
              <a
                href={`https://wa.me/${delivery.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-50 text-green-600 p-3 rounded-xl font-medium hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </motion.div>

            {/* Delivery Fee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-agrivibe-green/10 to-emerald-500/10 rounded-2xl border border-agrivibe-green/20 p-4 text-center"
            >
              <p className="text-sm text-gray-500">Delivery Fee</p>
              <p className="text-2xl font-bold text-agrivibe-green">
                KES {delivery.fee}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}

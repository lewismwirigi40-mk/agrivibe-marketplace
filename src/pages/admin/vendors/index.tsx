// src/pages/admin/vendors/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Search,
  Filter,
  ChevronDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  RefreshCw,
  MoreVertical,
  Building,
  Star,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Award,
  Shield,
  Crown,
  Sparkles,
  Download,
  Printer,
  FileText,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy,
  Share2,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";
import api from "../../../services/api";

export default function AdminVendors() {
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/admin/vendors");
      const vendorsData = response.data.vendors || response.data || [];
      setVendors(vendorsData);

      // Calculate stats
      const active = vendorsData.filter(
        (v: any) => v.is_approved && v.status === "approved",
      ).length;
      const pending = vendorsData.filter(
        (v: any) => !v.is_approved || v.status === "pending",
      ).length;
      const rejected = vendorsData.filter(
        (v: any) => v.status === "rejected",
      ).length;

      // Calculate totals from vendor data
      let totalRevenue = 0;
      let totalProducts = 0;
      let totalOrders = 0;

      vendorsData.forEach((v: any) => {
        totalRevenue += v.total_revenue || 0;
        totalProducts += v.total_products || 0;
        totalOrders += v.total_orders || 0;
      });

      setStats({
        total: vendorsData.length,
        active,
        pending,
        rejected,
        totalRevenue,
        totalProducts,
        totalOrders,
      });
    } catch (error: any) {
      console.error("Failed to fetch vendors:", error);
      setError(error.response?.data?.error || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId: string) => {
    try {
      setProcessing(true);
      await api.put(`/admin/vendors/${vendorId}/approve`);

      setSuccessMessage("Vendor approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Update vendor in list
      setVendors(
        vendors.map((v) =>
          v.id === vendorId
            ? { ...v, is_approved: true, status: "approved" }
            : v,
        ),
      );
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to approve vendor");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (vendorId: string) => {
    try {
      setProcessing(true);
      await api.put(`/admin/vendors/${vendorId}/reject`);

      setSuccessMessage("Vendor rejected");
      setTimeout(() => setSuccessMessage(""), 3000);

      setVendors(
        vendors.map((v) =>
          v.id === vendorId ? { ...v, status: "rejected" } : v,
        ),
      );
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to reject vendor");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const handleSuspend = async (vendorId: string) => {
    try {
      setProcessing(true);
      await api.put(`/admin/vendors/${vendorId}/suspend`);

      setSuccessMessage("Vendor suspended");
      setTimeout(() => setSuccessMessage(""), 3000);

      setVendors(
        vendors.map((v) =>
          v.id === vendorId ? { ...v, is_active: false } : v,
        ),
      );
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to suspend vendor");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const handleActivate = async (vendorId: string) => {
    try {
      setProcessing(true);
      await api.put(`/admin/vendors/${vendorId}/activate`);

      setSuccessMessage("Vendor activated");
      setTimeout(() => setSuccessMessage(""), 3000);

      setVendors(
        vendors.map((v) => (v.id === vendorId ? { ...v, is_active: true } : v)),
      );
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to activate vendor");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
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

  const getStatusBadge = (vendor: any) => {
    const status =
      vendor.status || (vendor.is_approved ? "approved" : "pending");

    const configs: Record<string, any> = {
      pending: {
        label: "Pending",
        icon: Clock,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
      approved: {
        label: "Active",
        icon: CheckCircle,
        color: "bg-green-100 text-green-700 border-green-200",
      },
      rejected: {
        label: "Rejected",
        icon: XCircle,
        color: "bg-red-100 text-red-700 border-red-200",
      },
      suspended: {
        label: "Suspended",
        icon: AlertCircle,
        color: "bg-gray-100 text-gray-700 border-gray-200",
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

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.User?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.User?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.User?.email?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.business_email?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" &&
        (vendor.status === "pending" || !vendor.is_approved)) ||
      (filterStatus === "approved" && vendor.status === "approved") ||
      (filterStatus === "rejected" && vendor.status === "rejected") ||
      (filterStatus === "suspended" && vendor.is_active === false);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading vendors...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vendors Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage all vendors on the platform
              <span className="ml-2 text-xs text-gray-400">
                ({stats.total} total)
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchVendors}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* ====== SUCCESS/ERROR MESSAGES ====== */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-green-500/10"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-green-700">
                {successMessage}
              </p>
            </motion.div>
          )}
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

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Vendors",
              value: stats.total,
              icon: Store,
              color: "from-blue-500 to-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Active",
              value: stats.active,
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
              bg: "bg-green-50",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "from-yellow-500 to-orange-500",
              bg: "bg-yellow-50",
            },
            {
              label: "Revenue",
              value: formatCurrency(stats.totalRevenue),
              icon: DollarSign,
              color: "from-purple-500 to-purple-600",
              bg: "bg-purple-50",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 p-5`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== FILTERS ====== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors by name, email, business..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
            <div className="relative sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Active</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== VENDORS TABLE ====== */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-8xl mb-6">🏪</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No vendors found
            </h3>
            <p className="text-gray-500 text-lg">
              {search || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "No vendors registered yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Business
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Owner
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Products
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Orders
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Revenue
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor, index) => (
                    <motion.tr
                      key={vendor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {vendor.business_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {vendor.category || "General"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {vendor.User?.first_name} {vendor.User?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {vendor.User?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {vendor.total_products || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {vendor.total_orders || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {formatCurrency(vendor.total_revenue || 0)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(vendor)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setShowDetailModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====== VENDOR DETAIL MODAL ====== */}
        <AnimatePresence>
          {showDetailModal && selectedVendor && (
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
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-agrivibe-green to-emerald-500 px-6 py-5 sticky top-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white truncate max-w-xs">
                          {selectedVendor.business_name}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {selectedVendor.User?.email}
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
                  {/* Vendor Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Products",
                        value: selectedVendor.total_products || 0,
                        icon: Package,
                        color: "bg-blue-50 text-blue-600",
                      },
                      {
                        label: "Orders",
                        value: selectedVendor.total_orders || 0,
                        icon: ShoppingBag,
                        color: "bg-green-50 text-green-600",
                      },
                      {
                        label: "Revenue",
                        value: formatCurrency(
                          selectedVendor.total_revenue || 0,
                        ),
                        icon: DollarSign,
                        color: "bg-purple-50 text-purple-600",
                      },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={i}
                          className={`${stat.color} rounded-xl p-3 text-center`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-1" />
                          <p className="text-lg font-bold">{stat.value}</p>
                          <p className="text-xs opacity-70">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Business Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      Business Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-400">Business Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.business_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Category</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.category || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.business_email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.business_phone || "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.business_address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Owner Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-400">Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.User?.first_name}{" "}
                          {selectedVendor.User?.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.User?.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.User?.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Joined</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(selectedVendor.User?.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {selectedVendor.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedVendor.id)}
                          disabled={processing}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Vendor
                        </button>
                        <button
                          onClick={() => handleReject(selectedVendor.id)}
                          disabled={processing}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {selectedVendor.status === "approved" &&
                      selectedVendor.is_active && (
                        <button
                          onClick={() => handleSuspend(selectedVendor.id)}
                          disabled={processing}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-300 disabled:opacity-50"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Suspend
                        </button>
                      )}
                    {selectedVendor.status === "approved" &&
                      !selectedVendor.is_active && (
                        <button
                          onClick={() => handleActivate(selectedVendor.id)}
                          disabled={processing}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Activate
                        </button>
                      )}
                    <button
                      onClick={() =>
                        router.push(`/admin/vendors/${selectedVendor.id}`)
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

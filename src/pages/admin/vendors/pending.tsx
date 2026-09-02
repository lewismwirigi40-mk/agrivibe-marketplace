// src/pages/admin/vendors/pending.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  Sparkles,
  Users,
  Store,
  Calendar,
  TrendingUp,
  Award,
  Shield,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Briefcase,
  Globe,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Info,
  FileText,
  Printer,
  Download,
  Share2,
  MoreVertical,
  Copy,
  Check,
  Zap,
  Crown,
  Star,
  Heart,
} from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";
import api from "../../../services/api";

export default function AdminPendingVendors() {
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/vendors/pending");
      setVendors(response.data.vendors || []);
    } catch (error: any) {
      console.error("Failed to fetch pending vendors:", error);
      setError(error.response?.data?.error || "Failed to load pending vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId: string) => {
    try {
      setProcessing(true);
      await api.put(`/vendors/${vendorId}/approve`);

      setSuccessMessage("Vendor approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Remove from list
      setVendors(vendors.filter((v) => v.id !== vendorId));
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
      await api.put(`/vendors/${vendorId}/reject`);

      setSuccessMessage("Vendor rejected");
      setTimeout(() => setSuccessMessage(""), 3000);

      setVendors(vendors.filter((v) => v.id !== vendorId));
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to reject vendor");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.business_email?.toLowerCase().includes(search.toLowerCase()) ||
      vendor.business_phone?.includes(search);
    const matchesFilter =
      filterStatus === "all" || vendor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading pending vendors...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Pending Vendors
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                <Clock className="w-3 h-3" />
                {vendors.length} Pending
              </span>
            </div>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Review and approve vendor registration requests
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-400">
                Last updated: {formatDate(new Date().toISOString())}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchPendingVendors}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
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
                <Check className="w-5 h-5 text-white" />
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
              label: "Total Pending",
              value: vendors.length,
              icon: Clock,
              color: "from-yellow-500 to-orange-500",
              bgColor: "bg-yellow-50",
            },
            {
              label: "New Today",
              value: vendors.filter((v) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return new Date(v.created_at) >= today;
              }).length,
              icon: User,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              label: "This Week",
              value: vendors.filter((v) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(v.created_at) >= weekAgo;
              }).length,
              icon: Calendar,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-50",
            },
            {
              label: "Avg Response",
              value: "2.5 hrs",
              icon: TrendingUp,
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-50",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5"
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
                placeholder="Search vendors by name, email, or phone..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== VENDORS LIST ====== */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-8xl mb-6">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              All caught up!
            </h3>
            <p className="text-gray-500 text-lg">
              {search || filterStatus !== "all"
                ? "No vendors match your search criteria"
                : "No pending vendor registrations to review"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Business Name & Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {vendor.business_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(vendor.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>
                        {vendor.User?.first_name} {vendor.User?.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">
                        {vendor.business_email || vendor.User?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>
                        {vendor.business_phone || vendor.User?.phone || "N/A"}
                      </span>
                    </div>
                    {vendor.business_address && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm line-clamp-2">
                          {vendor.business_address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setShowDetailModal(true);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      disabled={processing}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(vendor.id)}
                      disabled={processing}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-5 sticky top-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {selectedVendor.business_name}
                        </h2>
                        <p className="text-white/80 text-sm">
                          Pending Review •{" "}
                          {formatDate(selectedVendor.created_at)}
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
                  {/* Business Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      Business Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                      <div>
                        <p className="text-xs text-gray-400">Business Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.business_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Business Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.business_email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Business Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.business_phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">
                          Business Website
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedVendor.business_website ? (
                            <a
                              href={selectedVendor.business_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-agrivibe-green hover:underline flex items-center gap-1"
                            >
                              {selectedVendor.business_website}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  {selectedVendor.business_address && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        Address
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-700">
                          {selectedVendor.business_address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedVendor.business_description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Description
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-700">
                          {selectedVendor.business_description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Owner Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Owner Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
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
                        <p className="text-xs text-gray-400">Registered</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(selectedVendor.User?.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        handleApprove(selectedVendor.id);
                      }}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50"
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Approve Vendor
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedVendor.id);
                      }}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdminLayout>
  );
}

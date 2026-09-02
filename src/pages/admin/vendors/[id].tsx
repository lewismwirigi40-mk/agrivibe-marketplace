// src/pages/admin/vendors/[id].tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  Package,
  ShoppingBag,
  RefreshCw,
  Edit,
  Trash2,
  AlertCircle,
  Building,
  Users,
  Star,
  Clock,
  Award,
} from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";
import api from "../../../services/api";

export default function VendorDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get(`/admin/vendors/${id}`);
      setVendor(response.data.vendor || response.data);
    } catch (error: any) {
      console.error("Failed to fetch vendor:", error);
      setError(error.response?.data?.error || "Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    try {
      setProcessing(true);
      await api.put(`/admin/vendors/${id}/activate`);
      setSuccess("Vendor activated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchVendorDetails();
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to activate vendor");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setProcessing(true);
      await api.put(`/admin/vendors/${id}/deactivate`);
      setSuccess("Vendor deactivated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchVendorDetails();
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to deactivate vendor");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async () => {
    try {
      setProcessing(true);
      await api.put(`/admin/vendors/${id}/approve`);
      setSuccess("Vendor approved successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchVendorDetails();
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to approve vendor");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
    }
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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading vendor details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={fetchVendorDetails}
            className="mt-4 bg-red-100 text-red-700 px-6 py-2 rounded-xl hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!vendor) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">Vendor not found</p>
        </div>
      </AdminLayout>
    );
  }

  const isActive = vendor.is_active !== false;
  const isApproved = vendor.is_approved === true;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/vendors")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {vendor.business_name || vendor.store_name}
              </h1>
              <p className="text-gray-500 text-sm">
                {vendor.business_email || vendor.email}
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {!isApproved && (
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            )}
            {isActive ? (
              <button
                onClick={handleDeactivate}
                disabled={processing}
                className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleActivate}
                disabled={processing}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Activate
              </button>
            )}
            <button
              onClick={fetchVendorDetails}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isApproved
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
            }`}
          >
            {isApproved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            {isApproved ? "Approved" : "Pending Approval"}
          </span>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isActive
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {isActive ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {isActive ? "Active" : "Inactive"}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
            <Shield className="w-4 h-4" />
            {vendor.role || "Vendor"}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vendor Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-400" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Business Name
                  </label>
                  <p className="font-medium text-gray-900">
                    {vendor.business_name || vendor.store_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Email
                  </label>
                  <p className="font-medium text-gray-900">
                    {vendor.business_email || vendor.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Phone
                  </label>
                  <p className="font-medium text-gray-900">
                    {vendor.business_phone || vendor.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Address
                  </label>
                  <p className="font-medium text-gray-900">
                    {vendor.business_address || vendor.address || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Description
                  </label>
                  <p className="text-gray-700">
                    {vendor.business_description ||
                      vendor.description ||
                      "No description provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Joined
                  </label>
                  <p className="font-medium text-gray-900">
                    {formatDate(vendor.created_at)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Last Updated
                  </label>
                  <p className="font-medium text-gray-900">
                    {formatDate(vendor.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Owner Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Name
                  </label>
                  <p className="font-medium text-gray-900">
                    {vendor.User?.first_name || vendor.first_name || "N/A"}{" "}
                    {vendor.User?.last_name || vendor.last_name || ""}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Email
                  </label>
                  <p className="font-medium text-gray-900">
                    {vendor.User?.email || vendor.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Phone
                  </label>
                  <p className="font-medium text-gray-900">
                    {vendor.User?.phone || vendor.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Role
                  </label>
                  <p className="font-medium text-gray-900">
                    {vendor.User?.role || vendor.role || "vendor"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-400" />
                Statistics
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Products</span>
                  <span className="font-bold text-gray-900">
                    {vendor.product_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-bold text-gray-900">
                    {vendor.order_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-agrivibe-green">
                    KES {vendor.total_revenue?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-bold text-yellow-500">
                    {vendor.rating || "⭐ 0.0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Quick Actions
              </h2>
              <div className="space-y-2">
                {!isApproved && (
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Vendor
                  </button>
                )}
                {isActive ? (
                  <button
                    onClick={handleDeactivate}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={handleActivate}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Activate
                  </button>
                )}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                  <Edit className="w-4 h-4" />
                  Edit Vendor
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium">
                  <Trash2 className="w-4 h-4" />
                  Delete Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

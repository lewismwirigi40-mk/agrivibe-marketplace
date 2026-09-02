// src/pages/admin/products.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  ChevronDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Trash2,
  Image,
  FileText,
  Loader2,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/admin/products");
      const productsData = response.data.products || response.data || [];

      // ✅ Normalize data
      const normalizedData = productsData.map((p: any) => ({
        ...p,
        is_active:
          p.is_active === true || p.is_active === 1 || p.is_active === "true"
            ? true
            : false,
        // ✅ Ensure id exists
        id: p.id || p._id || `temp-${Math.random()}`,
        // ✅ Ensure store has name
        store: p.store || { store_name: "N/A" },
      }));

      setProducts(normalizedData);

      const active = normalizedData.filter(
        (p: any) => p.is_active === true,
      ).length;
      const inactive = normalizedData.filter(
        (p: any) => p.is_active === false,
      ).length;
      const pending = normalizedData.filter(
        (p: any) => p.is_active === false,
      ).length;

      setStats({
        total: normalizedData.length,
        active,
        inactive,
        pending,
      });
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      setError(error.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    try {
      setProcessing(true);
      setProcessingId(productId);
      await api.put(`/admin/products/${productId}/approve`);

      setSuccessMessage("✅ Product approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, is_active: true } : p,
        ),
      );
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to approve product");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
      setProcessingId(null);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      setProcessing(true);
      setProcessingId(productId);
      await api.put(`/admin/products/${productId}/reject`);

      setSuccessMessage("❌ Product rejected");
      setTimeout(() => setSuccessMessage(""), 3000);

      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, is_active: false } : p,
        ),
      );
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to reject product");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
      setProcessingId(null);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setProcessing(true);
      setProcessingId(productId);
      await api.delete(`/admin/products/${productId}`);

      setSuccessMessage("🗑️ Product deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);

      setProducts(products.filter((p) => p.id !== productId));
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to delete product");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
      setProcessingId(null);
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
    });
  };

  const getStatusBadge = (product: any) => {
    const isActive = product.is_active === true;

    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.store?.store_name?.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && product.is_active === true) ||
      (filterStatus === "pending" && product.is_active === false);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">
              Manage all products on the platform
              <span className="ml-2 text-xs text-gray-400">
                ({stats.total} total)
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
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
              label: "Total Products",
              value: stats.total,
              icon: Package,
              color: "from-blue-500 to-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Approved",
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
              label: "Inactive",
              value: stats.inactive,
              icon: XCircle,
              color: "from-red-500 to-red-600",
              bg: "bg-red-50",
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
                placeholder="Search products by name, vendor, or description..."
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
                <option value="active">Approved</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== PRODUCTS TABLE ====== */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No products found
            </h3>
            <p className="text-gray-500 text-lg">
              {search || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "No products on the platform yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Product
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Vendor
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Price
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Stock
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Added
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => {
                    const isProcessing = processingId === product.id;

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900 truncate max-w-32">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.store?.store_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.stock_quantity || 0} units
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(product)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(product.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          {/* ✅ FORCE VISIBLE: Always show all buttons */}
                          <div className="flex items-center gap-1 min-w-[140px]">
                            {/* View Button */}
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDetailModal(true);
                              }}
                              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Approve Button - ALWAYS VISIBLE */}
                            <button
                              onClick={() => handleApprove(product.id)}
                              disabled={isProcessing || processing}
                              className={`p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors ${
                                isProcessing || processing
                                  ? "opacity-50 cursor-not-allowed"
                                  : "text-green-600 hover:text-green-700"
                              }`}
                              title="Approve Product"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>

                            {/* Reject Button - ALWAYS VISIBLE */}
                            <button
                              onClick={() => handleReject(product.id)}
                              disabled={isProcessing || processing}
                              className={`p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ${
                                isProcessing || processing
                                  ? "opacity-50 cursor-not-allowed"
                                  : "text-red-600 hover:text-red-700"
                              }`}
                              title="Reject Product"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </button>

                            {/* Delete Button - ALWAYS VISIBLE */}
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={isProcessing || processing}
                              className={`p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ${
                                isProcessing || processing
                                  ? "opacity-50 cursor-not-allowed"
                                  : "text-gray-600 hover:text-red-600"
                              }`}
                              title="Delete Product"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====== PRODUCT DETAIL MODAL ====== */}
        <AnimatePresence>
          {showDetailModal && selectedProduct && (
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
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white truncate max-w-xs">
                          {selectedProduct.name}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {selectedProduct.store?.store_name || "No vendor"}
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
                  {/* Product Images */}
                  {selectedProduct.images &&
                    selectedProduct.images.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Image className="w-4 h-4 text-gray-400" />
                          Product Images
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProduct.images
                            .slice(0, 3)
                            .map((img: string, i: number) => (
                              <div
                                key={i}
                                className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
                              >
                                <img
                                  src={img}
                                  alt={`Product ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Product Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(selectedProduct.price)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-xs text-gray-400">Stock</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedProduct.stock_quantity || 0} units
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-xs text-gray-400">Category</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedProduct.category?.name || "Uncategorized"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="text-xs text-gray-400">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedProduct)}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Description
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedProduct.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => handleApprove(selectedProduct.id)}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Product
                    </button>
                    <button
                      onClick={() => handleReject(selectedProduct.id)}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(selectedProduct.id)}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Product
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

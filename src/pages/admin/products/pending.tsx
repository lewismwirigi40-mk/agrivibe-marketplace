// src/pages/admin/products/pending.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Image,
  User,
  Store,
  Calendar,
  DollarSign,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Sparkles,
  Zap,
  Crown,
  Award,
  Shield,
  Building,
  Mail,
  Phone,
  MapPin,
  Tag,
  Box,
  ShoppingBag,
  TrendingUp,
  Users,
  Star,
  FileText,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy,
  Share2,
  Download,
  Printer,
} from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";
import api from "../../../services/api";

export default function AdminPendingProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/admin/products/pending");
      const productsData = response.data.products || response.data || [];
      setProducts(productsData);

      // Calculate stats
      const pending = productsData.filter(
        (p: any) => p.status === "pending" || p.is_approved === false,
      ).length;
      const approved = productsData.filter(
        (p: any) => p.status === "approved" || p.is_approved === true,
      ).length;
      const rejected = productsData.filter(
        (p: any) => p.status === "rejected",
      ).length;

      setStats({
        total: productsData.length,
        pending,
        approved,
        rejected,
      });
    } catch (error: any) {
      console.error("Failed to fetch pending products:", error);
      setError(
        error.response?.data?.error || "Failed to load pending products",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    try {
      setProcessing(true);
      await api.put(`/admin/products/${productId}/approve`);

      setSuccessMessage("Product approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Remove from list
      setProducts(products.filter((p) => p.id !== productId));
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to approve product");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      setProcessing(true);
      await api.put(`/admin/products/${productId}/reject`);

      setSuccessMessage("Product rejected");
      setTimeout(() => setSuccessMessage(""), 3000);

      setProducts(products.filter((p) => p.id !== productId));
      setShowDetailModal(false);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to reject product");
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

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      vegetables: "🥬",
      fruits: "🍎",
      meat: "🥩",
      dairy: "🥛",
      bakery: "🥖",
      poultry: "🐔",
      fish: "🐟",
      cereals: "🌾",
      organic: "🌱",
      herbs: "🌿",
      beverages: "🧃",
      processed: "🥫",
    };
    return emojis[category] || "📦";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase()) ||
      product.vendor?.business_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      product.vendor?.User?.first_name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading pending products...</p>
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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Pending Products
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                <Clock className="w-3 h-3" />
                {stats.pending} Pending
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              Review and approve vendor product listings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchPendingProducts}
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
            },
            {
              label: "Pending Review",
              value: stats.pending,
              icon: Clock,
              color: "from-yellow-500 to-orange-500",
            },
            {
              label: "Approved",
              value: stats.approved,
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              icon: XCircle,
              color: "from-red-500 to-red-600",
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
                placeholder="Search products by name, category, vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>
            <div className="relative sm:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="vegetables">🥬 Vegetables</option>
                <option value="fruits">🍎 Fruits</option>
                <option value="meat">🥩 Meat</option>
                <option value="dairy">🥛 Dairy</option>
                <option value="bakery">🥖 Bakery</option>
                <option value="poultry">🐔 Poultry</option>
                <option value="fish">🐟 Fish</option>
                <option value="cereals">🌾 Cereals</option>
                <option value="organic">🌱 Organic</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== PRODUCTS GRID ====== */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-8xl mb-6">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              All caught up!
            </h3>
            <p className="text-gray-500 text-lg">
              {search || filterCategory !== "all"
                ? "No products match your search criteria"
                : "No pending products to review"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-white text-sm font-medium">
                      {getCategoryEmoji(product.category)} {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(product.price)} / {product.unit}
                  </p>

                  {/* Vendor Info */}
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Store className="w-4 h-4" />
                    <span>
                      {product.vendor?.business_name || "Unknown Vendor"}
                    </span>
                  </div>

                  {/* Stock & Date */}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>Stock: {product.stock_quantity || 0} units</span>
                    <span>{formatDate(product.created_at)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDetailModal(true);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(product.id)}
                      disabled={processing}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
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
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-5 sticky top-0">
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
                          {getCategoryEmoji(selectedProduct.category)}{" "}
                          {selectedProduct.category}
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
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Image className="w-4 h-4 text-gray-400" />
                          Product Images
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProduct.images
                            .slice(0, 3)
                            .map((img: string, i: number) => (
                              <div
                                key={i}
                                className="aspect-square bg-gray-100 rounded-xl overflow-hidden"
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
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(selectedProduct.price)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Stock</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedProduct.stock_quantity || 0}{" "}
                        {selectedProduct.unit}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Category</p>
                      <p className="text-lg font-bold text-gray-900">
                        {getCategoryEmoji(selectedProduct.category)}{" "}
                        {selectedProduct.category}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400">Submitted</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatDate(selectedProduct.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Description
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-700">
                          {selectedProduct.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Vendor Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-400" />
                      Vendor Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-400">Business Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedProduct.vendor?.business_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Owner</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedProduct.vendor?.User?.first_name}{" "}
                          {selectedProduct.vendor?.User?.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedProduct.vendor?.User?.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedProduct.vendor?.User?.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleApprove(selectedProduct.id)}
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
                          Approve Product
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(selectedProduct.id)}
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
      </div>
    </AdminLayout>
  );
}

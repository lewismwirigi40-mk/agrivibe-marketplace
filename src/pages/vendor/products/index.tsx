// src/pages/vendor/products/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Search,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Grid,
  List,
  Image,
  DollarSign,
  Box,
} from "lucide-react";
import VendorLayout from "../../../components/VendorLayout";
import api from "../../../services/api";

export default function VendorProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    outOfStock: 0,
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

      const response = await api.get("/vendor/products");
      const productsData = response.data.products || response.data || [];
      setProducts(productsData);

      // ✅ Calculate stats based on is_active
      const pending = productsData.filter(
        (p: any) => p.is_active === false,
      ).length;
      const approved = productsData.filter(
        (p: any) => p.is_active === true,
      ).length;
      const rejected = productsData.filter(
        (p: any) => p.is_active === false,
      ).length;
      const outOfStock = productsData.filter(
        (p: any) => p.stock_quantity === 0 || p.stock_quantity < 1,
      ).length;

      setStats({
        total: productsData.length,
        pending,
        approved,
        rejected,
        outOfStock,
      });
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      setError(error.response?.data?.error || "Failed to load products");
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
    });
  };

  // ✅ Get status badge based on is_active
  const getStatusBadge = (product: any) => {
    const isActive = product.is_active;

    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
  };

  const getStockBadge = (product: any) => {
    const stock = product.stock_quantity || 0;

    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30">
          <XCircle className="w-3 h-3" />
          Out of Stock
        </span>
      );
    } else if (stock < 10) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30">
          <AlertCircle className="w-3 h-3" />
          Low Stock ({stock})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30">
          <CheckCircle className="w-3 h-3" />
          In Stock ({stock})
        </span>
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && product.is_active === false) ||
      (filterStatus === "approved" && product.is_active === true);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading products...
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
              My Products
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your store products
              <span className="ml-2 text-xs text-gray-400">
                ({stats.total} total)
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => router.push("/vendor/products/add")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: Package,
              color: "from-blue-500 to-blue-600",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "from-yellow-500 to-orange-500",
              bg: "bg-yellow-50 dark:bg-yellow-500/10",
            },
            {
              label: "Approved",
              value: stats.approved,
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
              bg: "bg-green-50 dark:bg-green-500/10",
            },
            {
              label: "Out of Stock",
              value: stats.outOfStock,
              icon: AlertCircle,
              color: "from-red-500 to-red-600",
              bg: "bg-red-50 dark:bg-red-500/10",
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
                placeholder="Search products by name, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-agrivibe-green text-white" : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-agrivibe-green text-white" : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ====== PRODUCTS GRID ====== */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-white/10">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {search || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Start adding products to your store"}
            </p>
            <button
              onClick={() => router.push("/vendor/products/add")}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Product
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(product)}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    {getStockBadge(product)}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category || "Uncategorized"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-agrivibe-green">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {product.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        router.push(`/vendor/products/${product.id}`)
                      }
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-medium"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/vendor/products/${product.id}/edit`)
                      }
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors text-xs font-medium"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Product
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Category
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Price
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-400 px-6 py-4">
                      Stock
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
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white truncate max-w-32">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {product.category || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {product.stock_quantity || 0}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(product)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(product.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(`/vendor/products/${product.id}`)
                            }
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/vendor/products/${product.id}/edit`)
                            }
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </VendorLayout>
  );
}

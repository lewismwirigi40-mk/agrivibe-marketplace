// src/pages/dashboard/wishlist.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Trash2,
  Star,
  Eye,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Package,
  Store,
  Clock,
  ArrowRight,
  X,
  TrendingUp,
  Award,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string;
  cover_image?: string;
  rating?: number;
  stock_quantity?: number;
  is_featured?: boolean;
  store?: {
    store_name?: string;
    name?: string;
  };
  original_price?: number;
  compare_price?: number;
}

export default function Wishlist() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ============================================
  // ✅ FETCH WISHLIST - WITH PROPER ERROR HANDLING
  // ============================================
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }

      // ✅ Try wishlist endpoint first
      const response = await api.get("/wishlist");
      const items = response.data.items || response.data.wishlist || [];

      // ✅ Format items to handle different field names
      const formattedItems = items.map((item: any) => ({
        id: item.id || item.product_id,
        name: item.name || item.product?.name || "Product",
        price: item.price || item.product?.price || 0,
        images: item.images || item.product?.images || [],
        image:
          item.image ||
          item.product?.image ||
          (item.images && item.images[0]) ||
          null,
        cover_image: item.cover_image || item.product?.cover_image || null,
        rating: item.rating || item.product?.rating || 4.5,
        stock_quantity:
          item.stock_quantity || item.product?.stock_quantity || 10,
        is_featured: item.is_featured || item.product?.is_featured || false,
        store: item.store || item.product?.store || { store_name: "Vendor" },
        original_price:
          item.original_price ||
          item.compare_price ||
          item.product?.compare_price ||
          null,
        compare_price:
          item.compare_price || item.product?.compare_price || null,
      }));

      setWishlistItems(formattedItems);
      setError("");
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", error);

      // ✅ If 404, show empty state instead of error
      if (error.response?.status === 404) {
        setWishlistItems([]);
        setError("");
        return;
      }

      setError(error.response?.data?.error || "Failed to load wishlist");

      // ✅ Fallback: Show empty state instead of breaking
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ REMOVE FROM WISHLIST
  // ============================================
  const removeFromWishlist = async (id: string) => {
    setRemovingId(id);
    try {
      await api.delete(`/wishlist/${id}`);

      // Remove from local state
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      showSuccessMessage("Product removed from wishlist");
    } catch (error: any) {
      console.error("Failed to remove from wishlist:", error);

      // ✅ If 404, just remove locally
      if (error.response?.status === 404) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
        showSuccessMessage("Product removed from wishlist");
        return;
      }

      showSuccessMessage("Failed to remove from wishlist", false);
    } finally {
      setRemovingId(null);
    }
  };

  // ============================================
  // ✅ ADD TO CART
  // ============================================
  const addToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingToCart(productId);

    try {
      await api.post("/cart/add", { product_id: productId, quantity: 1 });
      showSuccessMessage("✅ Added to cart successfully!");
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      showSuccessMessage("Failed to add to cart. Please try again.", false);
    } finally {
      setAddingToCart(null);
    }
  };

  // ============================================
  // ✅ HELPER FUNCTIONS
  // ============================================
  const showSuccessMessage = (message: string, isSuccess: boolean = true) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getProductImage = (item: WishlistItem) => {
    if (item.image) return item.image;
    if (item.cover_image) return item.cover_image;
    if (item.images && item.images.length > 0) return item.images[0];
    return "https://images.unsplash.com/photo-1488459716781-31db5d0e8b2d?w=400&h=300&fit=crop";
  };

  const getStoreName = (item: WishlistItem) => {
    if (item.store?.store_name) return item.store.store_name;
    if (item.store?.name) return item.store.name;
    return "Vendor";
  };

  const getRating = (item: WishlistItem) => {
    return item.rating || 4.5;
  };

  const getOriginalPrice = (item: WishlistItem) => {
    return item.original_price || item.compare_price || null;
  };

  const getStockStatus = (item: WishlistItem) => {
    return item.stock_quantity !== undefined ? item.stock_quantity > 0 : true;
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  // ============================================
  // ✅ RENDER STARS
  // ============================================
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
          />
        ))}
        {halfStar && (
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />
        ))}
        <span className="text-xs text-gray-500 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // ============================================
  // ✅ LOADING STATE
  // ============================================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your wishlist...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ============================================
  // ✅ RENDER
  // ============================================
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "product" : "products"} saved for
              later
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium">
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              {wishlistItems.length} Items
            </span>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-2xl flex items-center gap-3 ${
                successMessage.includes("Added") ||
                successMessage.includes("removed")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== ERROR ====== */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">{error}</p>
              <button
                onClick={fetchWishlist}
                className="text-sm text-red-600 hover:text-red-800 font-medium mt-1"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ====== WISHLIST ITEMS ====== */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-8xl mb-6">❤️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Your Wishlist is Empty
            </h3>
            <p className="text-gray-500 text-lg mb-8">
              Start adding products you love
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-agrivibe-green/30 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item: any, index: number) => {
                const isOutOfStock = !getStockStatus(item);
                const imageUrl = getProductImage(item);
                const storeName = getStoreName(item);
                const rating = getRating(item);
                const originalPrice = getOriginalPrice(item);
                const isAdding = addingToCart === item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div
                      className="relative h-56 overflow-hidden cursor-pointer"
                      onClick={() => router.push(`/product/${item.id}`)}
                    >
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1488459716781-31db5d0e8b2d?w=400&h=300&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {item.is_featured && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            ⭐ Featured
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item.id);
                        }}
                        disabled={removingId === item.id}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:scale-110 disabled:opacity-50"
                      >
                        {removingId === item.id ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 hover:text-red-600" />
                        )}
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div
                        className="cursor-pointer"
                        onClick={() => router.push(`/product/${item.id}`)}
                      >
                        <div className="mb-1">{renderStars(rating)}</div>
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-agrivibe-green transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Store className="w-3.5 h-3.5" />
                          {storeName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-2xl font-bold text-agrivibe-green">
                            {formatCurrency(item.price)}
                          </span>
                          {originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              {formatCurrency(originalPrice)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => addToCart(item.id, e)}
                          disabled={isOutOfStock || isAdding}
                          className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                            !isOutOfStock
                              ? "bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white hover:shadow-xl hover:shadow-agrivibe-green/30 hover:scale-105"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isAdding ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </button>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => router.push(`/product/${item.id}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ====== WISHLIST COUNT ====== */}
        {wishlistItems.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
          </div>
        )}

        {/* ====== RECOMMENDED SECTION ====== */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 bg-gradient-to-r from-agrivibe-green/5 to-emerald-500/5 rounded-2xl border border-agrivibe-green/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-gray-900">
                Recommended for You
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Based on your wishlist items, you might also like these products.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 mt-3 text-agrivibe-green font-medium hover:text-emerald-600 transition-colors"
            >
              Explore Recommendations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

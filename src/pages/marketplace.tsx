// src/pages/marketplace.tsx
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ShoppingBag,
  Star,
  MapPin,
  Clock,
  Truck,
  Shield,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  Heart,
  Share2,
  Sparkles,
  Leaf,
  Award,
  Store,
  Navigation,
  Crosshair,
  TrendingUp,
  Package,
} from "lucide-react";
import api from "../services/api";
import AIChat from "../components/AIChat";

// ✅ Helper function for product images
const getProductImage = (product: any) => {
  if (product.images && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  const category = product.category?.name?.toLowerCase() || "";
  if (
    category.includes("fruit") ||
    category.includes("mango") ||
    category.includes("banana")
  ) {
    return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop";
  }
  if (
    category.includes("vegetable") ||
    category.includes("tomato") ||
    category.includes("onion")
  ) {
    return "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop";
  }
  if (
    category.includes("meat") ||
    category.includes("chicken") ||
    category.includes("beef")
  ) {
    return "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop";
  }
  if (
    category.includes("dairy") ||
    category.includes("milk") ||
    category.includes("egg")
  ) {
    return "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop";
  }
  return "https://images.unsplash.com/photo-1488459716781-31db5d0e8b2d?w=400&h=300&fit=crop";
};

export default function Marketplace() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [isLocationDetected, setIsLocationDetected] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const campuses: Record<string, { lat: number; lng: number }> = {
    DeKUT: { lat: -0.4201, lng: 36.9479 },
    JKUAT: { lat: -1.0167, lng: 37.1833 },
    KU: { lat: -1.1833, lng: 36.9167 },
    UON: { lat: -1.2833, lng: 36.8167 },
    MMUST: { lat: 0.2869, lng: 34.7522 },
    TUK: { lat: -1.2921, lng: 36.8219 },
    "Kenyatta University": { lat: -1.1833, lng: 36.9167 },
    "Moi University": { lat: 0.2869, lng: 35.2769 },
    "Daystar University": { lat: -1.3019, lng: 36.763 },
    "Strathmore University": { lat: -1.3037, lng: 36.7816 },
    USIU: { lat: -1.2481, lng: 36.8035 },
  };

  // Fetch products
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Check for location from URL
  useEffect(() => {
    const { showLocation } = router.query;
    const savedLocation = localStorage.getItem("userLocation");

    if (showLocation === "true" && !savedLocation) {
      setShowLocationPicker(true);
    } else if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setUserLocation(location);
        setIsLocationDetected(true);
        // Fetch nearby products if location exists
        fetchNearbyProducts(location);
      } catch (e) {
        console.error("Failed to parse location:", e);
      }
    }
  }, [router.query]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      const realProducts = (response.data.products || []).filter(
        (p: any) =>
          !p.id?.toString().startsWith("featured-") &&
          p.id !== "featured-1" &&
          p.id !== "featured-2",
      );
      setProducts(realProducts);
      setFilteredProducts(realProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // ✅ FIXED: Fetch nearby products with correct data structure
  const fetchNearbyProducts = async (location: any) => {
    try {
      const response = await api.get("/products/nearby", {
        params: {
          lat: location.latitude,
          lng: location.longitude,
          radius: 15,
        },
      });

      // ✅ FIXED: Access response.data.products and filter by distance
      if (
        response.data &&
        response.data.products &&
        response.data.products.length > 0
      ) {
        // ✅ Filter out products beyond the radius (double-check)
        const nearbyProducts = response.data.products.filter(
          (p: any) => p.distance_km !== undefined && p.distance_km <= 15,
        );

        // ✅ Remove featured dummy products
        const realProducts = nearbyProducts.filter(
          (p: any) => !p.id?.toString().startsWith("featured-"),
        );

        if (realProducts.length > 0) {
          setProducts(realProducts);
          setFilteredProducts(realProducts);
        } else {
          // ✅ NO nearby products - show empty state, NOT all products
          setProducts([]);
          setFilteredProducts([]);
          // Show a message to the user
          const toast = document.createElement("div");
          toast.className =
            "fixed bottom-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-up";
          toast.textContent =
            "📍 No products found within 15km of your location";
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transition = "opacity 0.5s";
            setTimeout(() => toast.remove(), 500);
          }, 3000);
        }
      } else {
        // ✅ No products returned
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch nearby products:", error);
      // ✅ On error, show empty state, NOT all products
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()) ||
          p.store?.store_name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (p: any) =>
          p.category?.name === selectedCategory ||
          p.category === selectedCategory,
      );
    }

    result = result.filter(
      (p: any) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime(),
        );
        break;
    }

    setFilteredProducts(result);
  }, [search, products, selectedCategory, sortBy, priceRange]);

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post("/cart/add", { product_id: productId, quantity: 1 });

      // ✅ Refresh product list to update stock
      await fetchProducts();

      // ✅ Update local state immediately (faster)
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId
            ? { ...p, stock_quantity: Math.max(0, p.stock_quantity - 1) }
            : p,
        ),
      );

      // ✅ Show toast with "Go to Cart" button
      showCartToast("✅ Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // ✅ Add this helper function
  const showCartToast = (message: string) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-up border border-gray-200 dark:border-gray-700 max-w-md w-full";
    toast.innerHTML = `
    <div class="flex items-center justify-between gap-4">
      <span class="text-green-500 font-medium">${message}</span>
      <div class="flex gap-2">
        <button
          onclick="window.location.href='/cart'"
          class="bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
        >
          Go to Cart
        </button>
        <button
          onclick="this.closest('.fixed').remove()"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  `;
    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.5s";
        setTimeout(() => toast.remove(), 500);
      }
    }, 5000);
  };

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortBy("newest");
    setPriceRange([0, 10000]);
  };

  const handleLocationSet = (location: any) => {
    setUserLocation(location);
    setIsLocationDetected(true);
    setShowLocationPicker(false);
    localStorage.setItem("userLocation", JSON.stringify(location));
    router.replace("/marketplace", undefined, { shallow: true });
    fetchNearbyProducts(location);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-light">
        <div className="container-premium pt-28 pb-16">
          <div className="flex justify-between items-center mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-12 w-64 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-light">
      <AIChat />

      {/* ====== LOCATION PICKER MODAL ====== */}
      <AnimatePresence>
        {showLocationPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  📍 Find Fresh Produce Near You
                </h2>
                <p className="text-gray-500 mt-2">
                  We'll show you products from vendors within 15km of your
                  campus
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={async () => {
                    try {
                      const position = await new Promise<GeolocationPosition>(
                        (resolve, reject) => {
                          navigator.geolocation.getCurrentPosition(
                            resolve,
                            reject,
                          );
                        },
                      );
                      const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      };
                      handleLocationSet(location);
                    } catch (error) {
                      console.error("Location error:", error);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300"
                >
                  <Crosshair className="w-5 h-5" />
                  Detect My Location
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">
                      Or select your campus
                    </span>
                  </div>
                </div>

                <select
                  onChange={(e) => {
                    const campus = e.target.value;
                    if (campus && campuses[campus]) {
                      handleLocationSet({
                        latitude: campuses[campus].lat,
                        longitude: campuses[campus].lng,
                        campus: campus,
                      });
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                >
                  <option value="">Select your campus</option>
                  {Object.keys(campuses).map((campus) => (
                    <option key={campus} value={campus}>
                      {campus}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setShowLocationPicker(false);
                    router.push("/marketplace");
                  }}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Skip for now (see all products)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== HEADER ====== */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container-premium py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Marketplace
                </h1>
                <p className="text-xs text-gray-500">
                  {filteredProducts.length} products
                  {isLocationDetected && userLocation && (
                    <span className="ml-2 text-agrivibe-green">
                      • 📍 {userLocation.campus || "Nearby"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for fresh produce, vendors, categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-agrivibe-green/10 text-agrivibe-green border border-agrivibe-green/20 rounded-xl hover:bg-agrivibe-green/20 transition-colors"
                >
                  <Navigation className="w-5 h-5" />
                  <span className="hidden sm:inline">Location</span>
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
                <button
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {viewMode === "grid" ? (
                    <List className="w-5 h-5" />
                  ) : (
                    <Grid className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-premium py-8">
        {/* ====== FILTERS PANEL ====== */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-agrivibe-green hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green outline-none"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id || cat.name} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green outline-none"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: KES {priceRange[0]} - KES {priceRange[1]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-agrivibe-green"
                    />
                  </div>

                  <div className="flex items-end justify-end">
                    <div className="text-sm text-gray-500">
                      <span className="font-bold text-gray-900">
                        {filteredProducts.length}
                      </span>{" "}
                      products found
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* ====== ALL PRODUCTS ====== */}
        {filteredProducts.length === 0 && !isLocationDetected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              No products found
            </h3>
            <p className="text-gray-500 text-lg mb-8">
              {search
                ? `No results for "${search}"`
                : "No products available yet"}
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="btn-premium">
                Clear Search
              </button>
            )}
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                🛍️ {isLocationDetected ? "Nearby Products" : "All Products"}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredProducts.length} products
                {isLocationDetected && (
                  <span className="ml-2 text-agrivibe-green text-xs">
                    📍 within 15km
                  </span>
                )}
              </span>
            </div>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className={`group cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                      : "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "grid" ? "h-56" : "h-48 w-48 flex-shrink-0"
                    }`}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1488459716781-31db5d0e8b2d?w=400&h=300&fit=crop";
                      }}
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.is_featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          🔥 Featured
                        </span>
                      )}
                      {product.is_organic && (
                        <span className="bg-agrivibe-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          <Leaf className="w-3 h-3 inline mr-1" />
                          Organic
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            wishlist.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                      >
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {product.stock_quantity > 0 ? (
                      <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {product.stock_quantity} in stock
                      </div>
                    ) : (
                      <div className="absolute bottom-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex-1 p-4 ${viewMode === "grid" ? "" : "flex flex-col justify-center"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.rating || 0})
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Store className="w-4 h-4" />
                      {product.store?.store_name || "Vendor"}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-2xl font-bold text-agrivibe-green">
                          KES {product.price}
                        </span>
                        {product.original_price && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            KES {product.original_price}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={product.stock_quantity === 0}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                          product.stock_quantity > 0
                            ? "bg-gradient-to-r from-agrivibe-green to-agrivibe-green-light text-white hover:shadow-lg hover:shadow-agrivibe-green/30 hover:scale-105"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {product.stock_quantity > 0
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {product.delivery_time || "Same day"}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {product.location || "Nairobi"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-agrivibe-green" />
                        Verified
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ✅ "SHOW ALL PRODUCTS" BUTTON - ONLY SHOWS WHEN LOCATION IS DETECTED AND PRODUCTS ARE SHOWING */}
            {isLocationDetected && filteredProducts.length > 0 && (
              <div className="text-center py-6 mt-4 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-3">
                  Showing {filteredProducts.length} products within 15km of your
                  location
                </p>
                <button
                  onClick={() => {
                    setIsLocationDetected(false);
                    setUserLocation(null);
                    localStorage.removeItem("userLocation");
                    fetchProducts();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  🌍 Show All Products
                </button>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-700">
                  {filteredProducts.length}
                </span>{" "}
                products
              </div>
            )}
          </>
        ) : (
          // ✅ This renders when location is detected but NO products found
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Products Nearby
            </h3>
            <p className="text-gray-500 text-lg mb-4">
              We couldn't find any products within 15km of your location.
            </p>
            <button
              onClick={() => {
                setIsLocationDetected(false);
                setUserLocation(null);
                localStorage.removeItem("userLocation");
                fetchProducts();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300"
            >
              🌍 Show All Products
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => searchInputRef.current?.focus()}
        className="lg:hidden fixed bottom-6 right-6 bg-agrivibe-green text-white p-4 rounded-full shadow-2xl shadow-agrivibe-green/30 hover:scale-110 transition-all duration-300 z-40"
      >
        <Search className="w-6 h-6" />
      </button>
    </div>
  );
}

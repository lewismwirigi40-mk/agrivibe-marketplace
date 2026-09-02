// src/pages/cart.tsx
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  Shield,
  Sparkles,
  Package,
  X,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Smartphone,
  Gift,
  Zap,
} from "lucide-react";
import api from "../services/api";

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get("/cart");
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(true);
    try {
      await api.put(`/cart/${id}`, { quantity });
      await fetchCart();
    } catch (error) {
      alert("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!confirm("Remove this item from cart?")) return;
    setRemovingId(id);
    try {
      await api.delete(`/cart/${id}`);
      await fetchCart();
    } catch (error) {
      alert("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const clearCart = async () => {
    if (!confirm("Clear your entire cart?")) return;
    try {
      await api.delete("/cart");
      await fetchCart();
    } catch (error) {
      alert("Failed to clear cart");
    }
  };

  // ✅ NO delivery fee - only subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal; // Total = Subtotal (no delivery fee on platform)

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-br from-agrivibe-green/15 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-tr from-agrivibe-gold/10 to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Phone Frame Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 25 }}
        className="relative w-full max-w-[480px] max-h-[90vh]"
      >
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] p-4 shadow-2xl shadow-black/50 border border-white/10 h-full">
          <div className="relative bg-gradient-to-b from-gray-900/95 to-black/95 rounded-[2.5rem] overflow-hidden border border-white/5 h-full flex flex-col">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/40">
                <span>9:41</span>
                <span className="text-xs">📶</span>
                <span className="text-xs">🔋</span>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.push("/marketplace")}
              className="absolute top-14 left-4 z-20 p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white/80"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar px-6 pt-16 pb-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-agrivibe-green/30 flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Shopping Cart
                  </h1>
                  <p className="text-xs text-gray-400">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"} in your cart
                  </p>
                </div>
              </div>

              {/* Cart Content */}
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-7xl mb-4">🛒</div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Start shopping to add items to your cart
                  </p>
                  <button
                    onClick={() => router.push("/marketplace")}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Browse Products
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.Product?.images?.[0] ? (
                                <img
                                  src={item.Product.images[0]}
                                  alt={item.Product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-gray-500" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-white truncate">
                                {item.Product?.name || "Product"}
                              </h3>
                              <p className="text-xs text-gray-400 truncate">
                                {item.Product?.store?.store_name || "Vendor"}
                              </p>
                              <p className="text-sm font-bold text-agrivibe-green">
                                KES {item.price}
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={updating || item.quantity <= 1}
                                className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-50"
                              >
                                <Minus className="w-3 h-3 text-gray-400" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={updating}
                                className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                              >
                                <Plus className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={removingId === item.id}
                              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                            >
                              {removingId === item.id ? (
                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => router.push("/marketplace")}
                    className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 mt-3"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Continue Shopping
                  </button>

                  {/* ====== ORDER SUMMARY ====== */}
                  <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag className="w-4 h-4 text-agrivibe-green" />
                      <h2 className="text-sm font-bold text-white">
                        Order Summary
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="font-medium text-white">
                          KES {subtotal}
                        </span>
                      </div>

                      {/* ✅ PROMO: Free delivery incentive (NO actual delivery fee charged) */}
                      {subtotal < 1000 && subtotal > 0 && (
                        <div className="flex items-center gap-2 text-yellow-400 text-xs bg-yellow-500/10 p-2 rounded-lg">
                          <Gift className="w-3 h-3 flex-shrink-0" />
                          <span>
                            Add KES {1000 - subtotal} more for free delivery
                            promo
                          </span>
                        </div>
                      )}

                      {subtotal >= 1000 && (
                        <div className="flex items-center gap-2 text-green-400 text-xs bg-green-500/10 p-2 rounded-lg">
                          <Zap className="w-3 h-3 flex-shrink-0" />
                          <span>🎉 You qualify for free delivery promo!</span>
                        </div>
                      )}

                      {/* ✅ Delivery fee note - not charged on platform */}
                      <div className="flex items-center gap-2 text-blue-400 text-xs bg-blue-500/10 p-2 rounded-lg">
                        <Truck className="w-3 h-3 flex-shrink-0" />
                        <span>
                          Delivery fee will be arranged between you and the
                          vendor
                        </span>
                      </div>

                      <div className="border-t border-white/10 pt-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-white">Total</span>
                          <span className="text-xl font-bold text-agrivibe-green">
                            KES {total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => router.push("/checkout")}
                      disabled={cartItems.length === 0}
                      className="w-full mt-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-3 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-orange-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Trust Badges */}
                    <div className="flex justify-center gap-4 text-[10px] text-gray-500 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-agrivibe-green" />
                        <span>Secure Checkout</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3 h-3 text-agrivibe-green" />
                        <span>Vendor Delivers</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-agrivibe-green" />
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-10" />
          </div>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-4">
          © 2026 AgriVibe KE Farm Solutions. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
